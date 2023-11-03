const { PrismaClient }=require("@prisma/client");

const db=new PrismaClient();

async function main(){
    try{
        await db.category.createMany({
            data: [
                { name: "EduMentors" },
                { name: "PsyWisdom" },
                { name: "LearnTherapists" },
                { name: "MindGuides" },
                { name: "ThoughtLeaders" },
                { name: "EduHealers" },
                { name: "InspireSages" }
            ]
        })


    }catch(error){
        console.error("Error seeding default categories",error);
    }finally{
        await db.$disconnect();
    }
}
main();