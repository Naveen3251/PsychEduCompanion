import prismadb from "@/lib/prismadb";

import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    //companionId spell should be same as [companionId]
    {params}:{params:{companionId:string}}
    ){
    try{
        //data body
        const body=await req.json();

        //fetch current user
        const user=await currentUser();

        //extracting all the things we need from body
        const {src, name, description, instructions, seed, categoryId}=body

        //having that id
        if(!params.companionId){
            return new NextResponse("Companion ID is required",{status:400});
        }

        //check wether logged in
        if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized",{status:401});
        }
         //check any the of body field missing
         if(!src || !name || !description || !instructions || !seed || !categoryId){
            return new NextResponse("Missing Required field",{status:400});
         }

         //TODO:check for subscription

         const companion=await prismadb.companion.update({
            where:{
                id:params.companionId,
                userId:user.id,
            },
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
        console.log("[COMPANION_PATCH]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(
    request:Request,
    {params}:{params:{companionId:string}}) {
    try{
        //get user id from clerk
        const {userId}=auth();

        //if not logged in
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }
        //otherwise:delete the companion
        const companion=await prismadb.companion.delete({
            where:{
                userId, //the oly u can delete ur companion
                id:params.companionId
            }
        })
        return NextResponse.json(companion);

    }catch(error){
        console.log("[COMPANION_DELETE]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}