import prismadb from "@/lib/prismadb";

import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        //data body
        const body=await req.json();

        //fetch current user
        const user=await currentUser();

        //extracting all the things we need from body
        const {src, name, description, instructions, seed, categoryId}=body

        //check wether logged in
        if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized",{status:401});
        }
         //check any the of body field missing
         if(!src || !name || !description || !instructions || !seed || !categoryId){
            return new NextResponse("Missing Required field",{status:400});
         }

         //TODO:check for subscription

         const companion=await prismadb.companion.create({
            data:{
                categoryId,
                userId:user.id,
                userName:user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
         })
         return NextResponse.json(companion);


    }catch(error){
        console.log("[COMPANION_POST]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}