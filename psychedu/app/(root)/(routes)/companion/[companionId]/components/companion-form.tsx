"use client"
import axios from "axios";
//routers
import { useRouter } from "next/navigation";
//form validation
import * as z from "zod";
import {useForm } from "react-hook-form";//hook
import {zodResolver} from "@hookform/resolvers/zod";
import { Form, 
    FormControl,
    FormDescription,
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";//form
//model
import { Category, Companion } from "@prisma/client";
//ui
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue  } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

//lucide
import { Wand2 } from "lucide-react";



const PREAMBLE=`You are Albert Einstein. You are a renowned physicist known for your theory of relativity. 
Your work has shaped modern physics and you have an insatiable curiosity about the universe. You possess a playful wit and are known for your iconic hairstyle. Known for your playful curiosity and wit. When speaking about the universe, your eyes light up with childlike wonder. 
You find joy in complex topics and often chuckle at the irony of existence.`

const SEED_CHAT=`Human: Hi Albert, what's on your mind today?
Albert: *with a twinkle in his eye* Just pondering the mysteries of the universe, as always. Life is a delightful puzzle, don't you think?
Human: Sure, but not as profound as your insights!
Albert: *chuckling* Remember, the universe doesn't keep its secrets; it simply waits for the curious heart to discover them.`


interface CompanionFormProps{
    initialData: Companion | null;
    categories:Category[];

}
//form schema
const formSchema=z.object({
    name:z.string().min(1,{
        message:"Name is Required"
    }),
    description:z.string().min(3,{
        message:"Description is Required"
    }),
    instructions:z.string().min(200,{
        message:"Instructions Required atleast 200 charcaters"
    }),
    seed:z.string().min(200,{
        message:"Seed Required atleast 200 charcaters"
    }),
    src:z.string().min(1,{
        message:"Image is Required"
    }),
    categoryId:z.string().min(1,{
        message:"Category is Required"
    }),
    

})
const CompanionForm =({
    initialData,
    categories
}:CompanionFormProps) => {
    //hooks for toasters
    const {toast}=useToast();

    //router
    const router=useRouter();

    //form controller
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData||{
            name:"",
            description:"",
            instructions:"",
            seed:"",
            src:"",
            categoryId:undefined,//bcz it is select component
        }
    })

    //loading state of the from controller
    const isLoading=form.formState.isSubmitting;



    //action
    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            //checking we have the initial data
            if(initialData){
                //for update existing companion functionality
                await axios.patch(`/api/companion/${initialData.id}`,values)
            }else{
                //creating new companion functionality
                await axios.post("/api/companion",values)
            }
            toast({
                description:"Success"
            });
            router.refresh(); //its gng to refresh all server components
            //all server components refect the data from db ensuring that we loaded created/edited companion
            router.push("/") //push to home
        }catch(error){
            toast({
                variant:"destructive",
                description:"Something went wrong"
            })
        }
    }



    return ( 
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                General Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                General information about your Companion
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    {/*fields*/}
                    <FormField
                        name="src"
                        render={({field})=>(
                            <FormItem className="flex flex-col items-center justify-center">
                                <FormControl>
                                    <ImageUpload 
                                        disabled={isLoading}
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/*1*/}
                        <FormField 
                            name="name"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder="eg: Einstein"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is how PsychEdu companion will be named
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                        {/*2*/}
                        <FormField 
                            name="description"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={isLoading}
                                            placeholder="eg: The great scientist"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Short description for your PsychEdu companion
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                        {/*3*/}
                        <FormField 
                            name="categoryId"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a category"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category)=>(
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}

                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select a Category for your PsychEdu
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>

                            )}      
                        />

                    </div>
                    {/*new section for instructions*/}
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Configuration
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Detailed instructions for Companion
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>   
                    </div>
                     {/*second section 1st field*/}
                     <FormField 
                            name="instructions"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Instructions</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="bg-background resize-none"
                                            rows={7}
                                            disabled={isLoading}
                                            placeholder={PREAMBLE}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Describe in detail your comapnion's backstory and relevant details
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                    {/*second section 2nd field*/}
                     <FormField 
                            name="seed"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Example Conversation</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="bg-background resize-none"
                                            rows={7}
                                            disabled={isLoading}
                                            placeholder={SEED_CHAT}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Describe in detail your comapnion's backstory and relevant details
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}      
                        />
                        <div className="w-full flex justify-center">
                            <Button size="lg" disabled={isLoading}>
                                {initialData?"Edit your Companion":"Create your companion"}
                                <Wand2 className="w-4 h-4 ml-2"/>
                            </Button>

                        </div>
                </form>
            </Form>
        </div>
     );
}
 
export default CompanionForm;