import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json()
    const newTask = await body.body
    
    const db = (await clientPromise).db("visionSchedule")
    const collection = await db.collection("tasks")
    const users = await db.collection("users")
    const me = await users.findOne({name: "gaso"})


    const result = await collection.insertOne(body)
    await users.updateOne({_id: me?._id}, {
        $push:{
            tasks: body
        }
    })
    return NextResponse.json({insertedId: result.insertedId})
}

export async function GET() {
    const db = (await clientPromise).db("visionSchedule");
    const users = await db.collection("users");
    const me = await users.findOne({ name: "gaso" });

    if (!me) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(me.tasks);
}