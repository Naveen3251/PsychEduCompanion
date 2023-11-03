import {Redis} from "@upstash/redis"; //db
import {OpenAIEmbeddings} from "langchain/embeddings/openai"; 
import {PineconeClient}from "@pinecone-database/pinecone";
import {PineconeStore} from "langchain/vectorstores/pinecone";
import dotenv from "dotenv";
dotenv.config({path:'.env'})

export type CompanionKey={
    companionName:string;
    modelName:string;
    userId:string;
}

export class MemoryManager{
    private static instance:MemoryManager;
    private history:Redis;
    private vectorDBClient:PineconeClient;

    
    public constructor() {
        this.history=Redis.fromEnv();
        this.vectorDBClient=new PineconeClient();     
    }

    //pinecone initialization
    public async init(){
        if(this.vectorDBClient instanceof PineconeClient){
            await this.vectorDBClient.init({
                apiKey: process.env.PINECONE_API_KEY!,
                environment:process.env.PINECONE_ENVIRONMENT!
            })
        }
    }

    //vector search
    public async vectorSearch(
        recentChatHistory:string,
        companionFileName:string
    ){
        //get pinecone client
        const pineconeClient=<PineconeClient>this.vectorDBClient;

        //get index
        const pineconeIndex=pineconeClient.Index(
            process.env.PINECONE_INDEX! || ""
        );

        //get vector store
        const vectorStore=await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({openAIApiKey:process.env.OPENAI_API_KEY}),
            {pineconeIndex}
        );

        //find similar docs
        const similarDocs=await vectorStore
        .similaritySearch(recentChatHistory,3,{fileName:companionFileName})
        .catch((err)=>{
            console.log("Failed to get vector search result",err)
        })

        return similarDocs;

    }

    //to get the instaces
    public static async getInstance():Promise<MemoryManager>{
        //if mem is not available
        if(!MemoryManager.instance){
            MemoryManager.instance=new MemoryManager();
            await MemoryManager.instance.init(); //calling init func created above at pinecone initialization
        }
        return MemoryManager.instance;
    }

    //to generate redis companion key
    private generateRedisCompanionKey(companionKey:CompanionKey):string {
        return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`
    }

    //writing the chat history : so, our model adapt to new info
    public async writeToHistory(text:string,companionKey:CompanionKey) {
        //if we dont have any one
        if(!companionKey || typeof companionKey.userId=="undefined"){
            console.log("Companion key set incorrectly");
            return "";
        }
        //generate the key
        const key=this.generateRedisCompanionKey(companionKey);

        //store our chat history under the specific usr-key, comp-key, model-key
        const result=await this.history.zadd(key,{
            score:Date.now(),
            member:text,
        });
        return result;
    }

    //to read from history
    public async readLatestHistory(companionKey:CompanionKey):Promise<string>{
        //if we dont have any one
        if(!companionKey || typeof companionKey.userId=="undefined"){
            console.log("Companion key set incorrectly");
            return "";
        }

        //else generate key
        const key=this.generateRedisCompanionKey(companionKey);
        let result=await this.history.zrange(key,0,Date.now(),{
            byScore:true,
        });

        //modify the fetched result
        result=result.slice(-30).reverse();

        const recentChats=result.reverse().join("\n");
        return recentChats;
    }

    //seed chat his
    public async seedChatHistory(
        seedContent:String,
        delimiter:string="\n",
        companionKey:CompanionKey
    ){
        const key=this.generateRedisCompanionKey(companionKey);

        //if already created history for the companion 
        if(await this.history.exists(key)){
            console.log("User aready has chat history");
            return;
        }
        //if hsotory is not there
        const content=seedContent.split(delimiter);

        let counter=0;
        for(const line of content){
            await this.history.zadd(key,{score:counter,member:line});
            counter+=1;
        }
    }

}


