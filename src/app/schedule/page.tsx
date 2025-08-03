import clientPromise from "@/lib/mongoDB"
import ScheduleClient from "@/components/schedule"
import { format } from "date-fns"

type Task = {
    _id: string
    start: string
    end: string
    title: string | null
    task : string | null
}

export default async function SchedulePage() {
  const db = (await clientPromise).db("visionSchedule")
  const users = db.collection("users")
  const me = await users.findOne({ name: "gaso" })

  const tasks = (me?.tasks || []).map((task:Task) => ({
  ...task,
  _id: task._id?.toString() || undefined,
  start: task.start
    ? format(new Date(task.start), "yyyy-MM-dd HH:mm")
    : undefined,
  end: task.end
    ? format(new Date(task.end), "yyyy-MM-dd HH:mm")
    : undefined
}))

  return <ScheduleClient tasks={tasks} />
}

