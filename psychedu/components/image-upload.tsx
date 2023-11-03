"use client"
import { useEffect, useState } from "react";

//cloudinary
import {CldUploadButton} from "next-cloudinary";
import Image from 'next/image'

interface ImageUploadProps{
    value:string;
    onChange:(src:string)=>void;
    disabled?:boolean
}

export const ImageUpload=({
    value,
    onChange,
    disabled
}:ImageUploadProps)=>{
    //to handle hydration error
    //by enabling setstate and watching setstate is true
    const [isMounted,setIsMounted]=useState(false);

    //its only goin to run oly finish SSR yet to client side
    useEffect(()=>{
        setIsMounted(true);
    },[]);

    //if we are mounted
    if(!isMounted){
        return null //in SSR it return null
    }

    return(
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <CldUploadButton
                onUpload={(result:any)=>onChange(result.info.secure_url)}
                options={{
                    maxFiles:1
                }}
                uploadPreset="qk9ce9sv"
            >
                <div className="
                p-4 
                border-4 
                border-dashed 
                border-primary 
                rounded-lg 
                hover:opacity-75 
                transition 
                flex 
                flex-col 
                space-y-2 
                items-center 
                justify-center"
                >
                    <div className="relative h-40 w-40">
                        <Image
                            fill
                            alt="Upload"
                            src={value || "/placeholder.svg"}
                            className="rounded-lg object-cover"
                        />
                    </div>
                </div>

            </CldUploadButton>

        </div>
    )

}