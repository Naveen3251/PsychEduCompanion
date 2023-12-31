"use client"
import { Menu, Sparkles } from "lucide-react";
import Link from "next/link";
//clerk user btn
import { UserButton } from "@clerk/nextjs";
//for fonts
import { Poppins } from "next/font/google";

//shdcn
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";

import { cn } from "@/lib/utils";





const font=Poppins({
    weight:"600",
    subsets:["latin"]

});

const NavBar = () => {
    return ( 
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">

            <div className="flex items-center">

                <MobileSidebar/>
                {/*title*/}
                <Link href="/">
                    <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary",
                    font.className
                    )}>
                        PsychEdu
                    </h1>
                </Link>
               
            </div>
            
            {/*clerk shadcn and user btn*/}
            <div className="flex tems-center gap-x-3">
                <Button variant="premium" size="sm">
                    Upgrade
                    <Sparkles className="h-4 w-4 fill-white text-white ml-2"/>
                </Button>
                <ModeToggle/>
                <UserButton afterSignOutUrl="/"/>
            </div>

        </div>
     );
}
 
export default NavBar;