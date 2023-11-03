"use client"
import axios from "axios";
//router
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
//db
import { Companion, Message } from "@prisma/client"

//lucide
import { ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash } from "lucide-react"

//components
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import { BotAvatar } from "@/components/bot-avatar";
import { useToast } from "@/components/ui/use-toast";






interface ChatHeaderProps{
    companion:Companion&{
        messages:Message[]
        _count:{
            messages:number
        }
    }
}
export const ChatHeader = ({companion}:ChatHeaderProps) => {
    //router
    const router=useRouter();
    //to get currentuser
    const {user}=useUser();
    //toaster
    const {toast}=useToast();

    //deleting event
    const onDelete=async()=>{
        try{
            await axios.delete(`/api/companion/${companion.id}`)
            toast({
                description:"Success."
            })
            router.refresh() //refresh server comp with newest data
            router.push('/')
        }catch(errror){
            toast(
                {
                    description:"Something went Wrong",
                    variant:"destructive"
                }
            )
        }
    }

    return ( 
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center">
                <Button size="icon" variant="ghost">
                    <ChevronLeft onClick={()=>router.back()} className="h-8 w-8"/>
                </Button>
                <BotAvatar src={companion.src}/>
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold">
                            {companion.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare className="w-3 h-3 mr-1"/>
                        </div>
                    </div>
                </div>
            </div>

            {user?.id===companion.userId && (
                <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical/>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>

                        <DropdownMenuItem onClick={()=>router.push(`/companion/${companion.id}`)}>
                            <Edit className="w-4 h-4 mr-2"/>
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={onDelete}>
                            <Trash className="w-4 h-4 mr-2"/>
                            Delete
                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>
            )}
        </div>
    );
}