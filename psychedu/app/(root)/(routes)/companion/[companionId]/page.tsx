//routr
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import CompanionForm from "./components/companion-form";


interface CompanionIdPage{
    params:{
        companionId:string; //mateches [companionId]
    }
}
const CompanionIdPage = async({
    params
}:CompanionIdPage) => {
    //to ensure the editing by the same user
    const {userId}=auth();

    //if no user id -->to sigin
    if(!userId){
        return redirectToSignIn();
    }

    //TODO:check subscription

    //fetching the companion using comapnion id in url    
    const companion=await prismadb.companion.findUnique({
        where:{
            id:params.companionId,
            userId
        }
    })

    //fetch categories
    const categories=await prismadb.category.findMany();

    return ( 
       <CompanionForm
            initialData={companion}
            categories={categories}
       />
     );
}
 
export default CompanionIdPage;