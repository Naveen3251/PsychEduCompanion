"use client"
import qs from "query-string";

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"

import { ChangeEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@/app/hooks/use-debounce"

export const SearchInput=()=>{
    //for making search input functional
    const router=useRouter();

    const searchParams=useSearchParams();
    //taking category id from url    
    const categoryId=searchParams.get("categoryId");
    //characters name
    const name=searchParams.get("name"); 

    //controlling name
    const [value,setValue]=useState(name||"");
    //only keystroke stops for 5sec it will push to url
    const debouncedValue=useDebounce<string>(value,500);

    const onChange:ChangeEventHandler<HTMLInputElement>=(e)=>{
        setValue(e.target.value);
    }

    // searching effect
    useEffect(()=>{
        const query={
            name:debouncedValue,
            categoryId:categoryId
        };
        //querystring
        const url=qs.stringifyUrl({
            url:window.location.href,
            query,
        },{skipEmptyString:true,skipNull:true});

        //push it
        router.push(url)
    },[debouncedValue,router,categoryId])


    return(
        <div className="relative">
            <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground"/>
            <Input
                onChange={onChange}
                value={value}
                placeholder="Search..."
                className="pl-10 bg-primary/10"
            />
        </div>
    )
}