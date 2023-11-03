import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
//client component
import { ChatClient } from "./components/client";

interface ChatIdPageProps{
    //we use searchParams if url has x=y and params if url only has x(dynamic)
    params:{
        chatId:string; //same as in [chatId]
    }
}

const ChatIdPage =async ({
    params
}:ChatIdPageProps) => {
    //extract userid
    const {userId}=auth();

    //if no user id redirect to signin
    if(!userId){
        return redirectToSignIn();
    }

    //now fetch companion
    const companion=await prismadb.companion.findUnique({
        where:{
            id:params.chatId
        },
        include:{
            messages:{
                orderBy:{
                    createdAt:"asc",
                },
                where:{
                    userId //fetch oly the messages b/w that user and char
                }
            },
            _count:{
                select:{
                    messages:true
                }
            }
        }
    });
    //no companion
    if(!companion){
        return redirect('/')
    }
    return ( 
        <ChatClient companion={companion}/>
     );
}
 
export default ChatIdPage;