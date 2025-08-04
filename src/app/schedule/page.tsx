import clientPromise from "@/lib/mongoDB"
import ScheduleClient from "@/components/schedule"
import { format } from "date-fns"

type Task = {
    _id: string
    start: string
    end: string
    title: string | null
    task : string | null
    duration: number
}

function calculateEndDate(start: FormDataEntryValue | null, duration: number): string | null {
    if (!start) return null;
    const startDate = new Date(start as string);
    if (isNaN(startDate.getTime())) return null;
    startDate.setHours(startDate.getHours() + duration);
    return startDate.toISOString();
}

export default async function SchedulePage() {
  const db = (await clientPromise).db("visionSchedule")
  const users = db.collection("users")
  const me = await users.findOne({ name: "gaso" })
  const endDate = calculateEndDate(me?.tasks[11].start, me?.tasks[11].duration)
  console.log(me?.tasks[11].start, endDate, me?.tasks[11].task)

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

