import { PrismaClient } from "@prisma/client";

//decalring globally
declare global{
    var prisma: PrismaClient | undefined;
}

//for preventing next13 hot reloading from causing any problems with initializing this prisma client
const prismadb=globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV!=="production") globalThis.prisma=prismadb;

export default prismadb;