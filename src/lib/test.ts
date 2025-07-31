import clientPromise from "./mongoDB";

export async function getManga(){
    const client = await clientPromise
    const db = client.db("visionSchedule")
    const collection = db.collection("manga")
    
    const mangos = collection.find().toArray()
    return mangos
}

export async function getTasks() {
    const client = await clientPromise
    const collection = await client.db("visionSchedule").collection("tasks")
    const tasks = collection.find().toArray()

    return tasks
}