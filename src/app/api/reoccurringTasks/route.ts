import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json()
    const db = (await clientPromise).db("visionSchedule")
    const users = await db.collection("users")
    const me = await users.findOne({name: "gaso"})

    await users.updateOne({_id: me?._id}, {
        $push:{
            reoccurringTasks: body
        }
    })
}

export async function GET() {
  const db = (await clientPromise).db("visionSchedule")
  const users = await db.collection("users")
  const me = await users.findOne({ name: "gaso" })

  if (!me) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(me.reoccurringTasks || [])
}