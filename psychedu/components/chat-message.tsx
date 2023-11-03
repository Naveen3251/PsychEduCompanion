"use client"
//spinner
import {BeatLoader} from "react-spinners";
//icon
import { Copy } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { BotAvatar } from "@/components/bot-avatar";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";





export interface ChatMessageProps{
    role:"system" | "user";
    content?:string;
    isLoading?:boolean;
    src?:string;

}
export const ChatMessage = ({
    role,
    content,
    isLoading,
    src
}:ChatMessageProps) => {
    //toast
    const {toast}=useToast();
    //to get then curr theme of application
    const {theme}=useTheme();

    //copy fync
    const onCopy=()=>{
        //if there is no content in msg field
        if(!content){
            return;
        }
        navigator.clipboard.writeText(content);
        toast({
            description:"Message copied to clipboard"
        })
    }

    return ( 
        <div className={cn(
            "group flex items-start gap-x-3 py-4 w-full",
            role==="user" && "justify-end"
        )}>
            {role!=="user" && src && <BotAvatar src={src}/>}
            <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
                {isLoading? 
                <BeatLoader 
                    color={theme==="light"?"black":"white"}
                    size={5}
                />
                :content
                }
            </div>
            {role==="user"&&<UserAvatar/>}
            {/*copy btn*/}
            {role!=="user"&&!isLoading&&(
                <Button
                    onClick={onCopy}
                    /*in parent i gave as group and we specifying here abt hover*/
                    className="opacity-0 group-hover:opacity-100 transition"
                    size="icon"
                    variant="ghost"
                >
                    <Copy className="w-4 h-4"/>
                    
                </Button>
            )}
        </div>
     );
}