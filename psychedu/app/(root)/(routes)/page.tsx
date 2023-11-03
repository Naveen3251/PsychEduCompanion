import { Categories } from "@/components/categories";
import { Companions } from "@/components/companions";
import { SearchInput } from "@/components/search-input";

//db
import prismadb from "@/lib/prismadb";

//category id and name in url
interface RootPageProps{
    //searchParams is naming convention in next13 server components
    //every server components has searchParams in next13
    searchParams:{
        categoryId:string;
        name:string;
    }
}


const RootPage = async({
    searchParams
}:RootPageProps) => {

    //loading all data needed for our companion
    const data=await prismadb.companion.findMany({
        where:{
            categoryId:searchParams.categoryId,
            name:{
                search:searchParams.name
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        //counting num of messages done so far with that companion
        include:{
            _count:{
                select:{
                    messages:true
                }
            }
        }
    });

    const categories=await prismadb.category.findMany();

    return ( 
        <div className="h-full p-4 space-y-2">
            <SearchInput/>
            <Categories data={categories} />
            {/*list of companions */}
            <Companions data={data}/>
        </div>
    );
}
 
export default RootPage;