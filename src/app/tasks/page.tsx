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


function calculateEndDate(start: FormDataEntryValue | null, duration: number): string | null {
    if (!start) return null;
    const startDate = new Date(start as string);
    if (isNaN(startDate.getTime())) return null;
    startDate.setHours(startDate.getHours() + duration);
    return startDate.toISOString();
}
export default async function TasksPage() {

    async function addTask(formD: FormData){
         'use server'
        // fetch("http://localhost:3000/api/tasks", {
        //     method: "POST",
        //     headers: {
        //     "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //     type: "task", 
        //     task: formD.get("task"),
        //     duration: 2,
        //     start: formD.get("taskDate"),
        //     end: calculateEndDate(formD.get("taskDate"), 2)
        //     })
        // })
        console.log(formD.get("taskDate"))
        console.log(calculateEndDate(formD.get("taskDate"), 2))
        console.log(formD.get("taskTime")?.toString().slice(0,5))   
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
            <div className="flex flex-wrap justify-center gap-1">
                {tasksCards}    
            </div>
        </section>
    )
}