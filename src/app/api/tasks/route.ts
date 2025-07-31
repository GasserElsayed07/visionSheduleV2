import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json()
    const newTask = await body.body
    const db = (await clientPromise).db("visionSchedule")
    const collection = await db.collection("tasks")
    const result = await collection.insertOne(body)

    return NextResponse.json({insertedId: result.insertedId})
}