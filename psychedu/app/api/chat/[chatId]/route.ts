//ai
import dotenv from "dotenv";
import { StreamingTextResponse,LangChainStream } from "ai";
//langchain 
import {CallbackManager} from "langchain/callbacks";
import {Replicate} from "langchain/llms/replicate";

//clrk
import {auth,currentUser} from "@clerk/nextjs";


import { NextResponse } from "next/server";
//memory manager and ratelimit from lib we defined
import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
//DB
import prismadb from "@/lib/prismadb";
dotenv.config({path:'.env'})

export async function POST(
    request:Request,
    {params}:{params:{chatId:string}}
) {
    try{
        const { prompt }=await request.json();
        const user=await currentUser();

        //checking authentication
        if(!user || !user.firstName || !user.id){
            return new NextResponse("Unauthorized",{status:401});
        }

        //identifier for rate limit(unique for every single user)
        const identifier=request.url + "-" + user.id;

        //succes status
        const {success}=await rateLimit(identifier);

        if(!success){
            return new NextResponse("Rate Limit exceeded",{status:429})
        }

        //update our companion messages with this prompt
        const companion=await prismadb.companion.update({
            where:{
                id:params.chatId,
            },
            data:{
                messages:{
                    create:{
                        content:prompt,
                        role:"user", //user is sending the prompt
                        userId:user.id
                    }
                }
            }

        });

        //if there us no companion
        if(!companion){
            return new NextResponse("Companion not found",{status:404})
        }

        //constants needed for memory manager
        const name=companion.id;
        const companion_file_name=name+".txt";

        //companion key
        const companionKey={
            companionName:name!,
            userId:user.id,
            modelName:'llama2-13b'
        };

        //instance of memory-manager
        const memoryManager=await MemoryManager.getInstance();

        //read directoris using the companion key lets see any memory for this companion key already exists
        const records=await memoryManager.readLatestHistory(companionKey);

        //if no records the seed the chat history with that eg conversation given while creating the form
        if(records.length===0){
            await memoryManager.seedChatHistory(companion.seed,"\n\n",companionKey)
        }

        //for thenvector database to store hsitory
        await memoryManager.writeToHistory("User: "+prompt+"\n",companionKey);

        //fetch the recent chat history
        const recentChatHistory=await memoryManager.readLatestHistory(companionKey);

        //taking similar docs 
        const similarDocs=await memoryManager.vectorSearch(
            recentChatHistory,
            companion_file_name,
        )

        //relevant history
        let relevantHistory="";
        if(!!similarDocs && similarDocs.length!=0){
            relevantHistory=similarDocs.map((doc)=>doc.pageContent).join('\n');
        }

        //get handlers
        const {handlers}=LangChainStream();
        
        //create model
        const model=new Replicate({
            model:"a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input:{
                max_length:2048,
            },
            apiKey:process.env.REPLICATE_API_TOKEN,
            callbackManager:CallbackManager.fromHandlers(handlers)
        });

        model.verbose=true;

        //some more instruction to Ai model
        //first prompt : to avoid (eg:Einstein: I am ... ) like this
        const resp=String(
            await model
            .call(
                `
                ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 
        
                ${companion.instructions}
        
                Below are relevant details about ${companion.name}'s past and the conversation you are in.
                ${relevantHistory}
        
        
                ${recentChatHistory}\n${companion.name}:`
            )
            .catch(console.error)
        )

        //some cleaning
        //replacing comma
        const cleaned=resp.replaceAll(",","");
        //splits to chunks
        const chunks=cleaned.split("\n")
        const response=chunks[0]

        //wrting to the db
        await memoryManager.writeToHistory(""+response.trim(),companionKey);

        //conv to readable string
        var Readable=require("stream").Readable;

        let s=new Readable();

        s.push(response);
        s.push(null);

        //wether ai gave response then only we have to process
        if(response!==undefined && response.length>1){
            memoryManager.writeToHistory(""+response.trim(),companionKey);

            //update in prisma
            await prismadb.companion.update({
                where:{
                    id:params.chatId,
                },
                data:{
                    messages:{
                        create:{
                            content:response.trim(),
                            role:"system",
                            userId:user.id
                        }
                    }
                }
            })
        };
    return new StreamingTextResponse(s);

    }catch(error){
        console.log("[CHAT_POST]",error)
        return new NextResponse("Internal Error",{status:500})
    }
    
}


