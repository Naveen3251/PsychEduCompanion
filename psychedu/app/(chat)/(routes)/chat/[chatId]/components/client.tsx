"use client"
//router
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation"
import {useCompletion} from "ai/react"
//models
import { Companion,Message } from "@prisma/client"
//components
import { ChatHeader } from "@/components/chat-header"
import { ChatForm } from "@/components/chat-form";
import { ChatMessages } from "@/components/chat-messages";
//single message
import { ChatMessageProps } from "@/components/chat-message";



interface ChatClientProps{
    companion:Companion & {
        messages:Message[]
        _count:{
            messages:number
        }
    }
}
export const ChatClient = ({
    companion
}:ChatClientProps) => {
    //for nav
    const router=useRouter()
    //managing the messages
    const [messages,setMessages]=useState<ChatMessageProps[]>(companion.messages)

    //AI
    const {
        completion,
        input,
        stop,
        isLoading,
        handleInputChange,
        handleSubmit,
        setInput
      } = useCompletion({
        api:  `/api/chat/${companion.id}`,
        onFinish(prompt,completion){
            //message came from ai
            const systemMessage:ChatMessageProps={
                role:'system',
                content:completion,
            };
            //add them to curr msg arr
            setMessages((current)=>[...current,systemMessage]);
            //clear
            setInput("")
            //update server component
            router.refresh();

        }
      });

    //event handling
    const onSubmit=(e:FormEvent<HTMLFormElement>)=>{
        //when we submit from form
        const userMessage:ChatMessageProps={
            role:"user",
            content:input
        }
        setMessages((current)=>[...current,userMessage])
        handleSubmit(e)
    }
    return ( 
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader companion={companion}/>
            <ChatMessages
                messages={messages}
                companion={companion}
                isLoading={isLoading}
                
            />
            <ChatForm 
                isLoading={isLoading}
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}
            />
        </div>
     );
}
 


