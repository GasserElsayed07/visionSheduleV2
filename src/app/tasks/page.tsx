import Form from "next/form"
import { getTasks } from "@/lib/test"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Calendar24 } from "@/components/datePicker"
import { format } from "date-fns"


function calculateEndDate(start: FormDataEntryValue | null, time, duration: number): string | null {
    if (!start) return null;
    const startDate = new Date(start as string);
    if (isNaN(startDate.getTime())) return null;
    const startHour = Number(time);
    const totalHour = startHour + Number(duration);
    console.log(totalHour)
    startDate.setHours(totalHour)
    return format(new Date(startDate), "yyyy-MM-dd HH:mm");
}
export default async function TasksPage() {
    async function addTask(formD: FormData){
        'use server'
        const startDate = formD.get("taskDate") + " " + formD.get("taskTime")?.toString().slice(0,5)
        const endDate = calculateEndDate(formD.get("taskDate"), formD.get("taskTime")?.toString().slice(0,2), 2)
        fetch("http://localhost:3000/api/tasks", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            type: "task", 
            task: formD.get("task"),
            duration: 2,
            start: startDate,
            end: endDate
            })
        })
        console.log(startDate)
        console.log(endDate)
        // console.log(formD.get("taskTime")?.toString().slice(0,5)) 
        // const newDate =  formD.get("taskDate")?.toString().split("T")[0] + " " + formD.get("taskTime")?.toString().slice(0,5)
        // console.log(newDate)
    }

    
    const tasks = await getTasks()
    const tasksCards = tasks.map((task, id) => 
        <Card key={id} className="min-w-40">
            <CardHeader>
                <CardTitle>{task.task}</CardTitle>
            </CardHeader>
            <CardContent>{task.task}</CardContent>
        </Card>
    )

    return (
        <section className="flex flex-col justify-center items-center w-full">
            <Form action={addTask}>
                <label>new task: </label>
                <input
                    className="white pl-1 border-2 border-white rounded-[8px] p-1 focus:outline-none focus:ring-0 focus:border-white"
                    name="task"
                />
                <Calendar24/>
            </Form>
            {/* <div className="flex flex-wrap justify-center gap-1">
                {tasksCards}    
            </div> */}
        </section>
    )
}