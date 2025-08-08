import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const {body} = await req.json()
    const db = (await clientPromise).db("visionSchedule")
    const users = await db.collection("users")
    const me = await users.findOne({name: "gaso"})

    const reoccurringTasks = await me?.get("reoccurringTasks") 
    await users.updateOne({_id: me?._id}, {
        $push:{
            reoccurringTasks: body
        }
    })
}