"use client"
//rect
import { ElementRef, useEffect, useRef, useState } from "react";
//client
import { Companion } from "@prisma/client";
import { ChatMessage,ChatMessageProps } from "@/components/chat-message";


interface ChatMessagesProps{
    messages:ChatMessageProps[];
    isLoading:boolean;
    companion:Companion
}
export const ChatMessages = ({
    messages=[],
    isLoading,
    companion
}:ChatMessagesProps) => {
    //automatic scroll to the new message at the down user dont need to do that
    const scrollRef=useRef<ElementRef<"div">>(null);

    //autoscroll effect when messages length changes
    useEffect(()=>{
        scrollRef?.current?.scrollIntoView({behavior:"smooth"})
    },[messages.length])

    //to set initialloading effect
    const [Loading,setLoading]=useState(messages.length===0?true:false);

    //event
    useEffect(()=>{
        const timeOut=setTimeout(()=>{
            setLoading(false);

        },1000);
        //clear thta time out
        return ()=>{
            clearTimeout(timeOut);
        }
    },[])

    return ( 
        <div className="flex-1 overflow-y-auto pr-4">
            {/*bot message*/}
            <ChatMessage
                isLoading={Loading}
                src={companion.src}
                role="system"
                content={`Hello, I am ${companion.name},${companion.description}`}
            />
            {/*render msg from ai and user message*/}
            {messages.map((message)=>(
                <ChatMessage
                    key={message.content}
                    role={message.role}
                    content={message.content}
                    src={message.src}
                />
            ))}

            {isLoading &&(
                <ChatMessage
                    role="system"
                    src={companion.src}
                    isLoading
                />
            )}
            <div ref={scrollRef}/>
        </div>
     );
}
 
