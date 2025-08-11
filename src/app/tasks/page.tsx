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
import DurationInput from "@/components/durationInput"
import ReoccurringField from "@/components/reoccurringField"



function calculateEndDate(start: FormDataEntryValue | null, time : string | undefined, duration: number): string | null {
    if (!start) return null;
    const startDate = new Date(start as string);
    if (isNaN(startDate.getTime())) return null;
    const startHour = Number(time?.split(":")[0]);
    const minutes = Number(time?.split(":")[1])
    const totalHour = startHour + Number(duration);
    console.log(totalHour)
    startDate.setHours(totalHour)
    startDate.setMinutes(minutes)
    return format(new Date(startDate), "yyyy-MM-dd HH:mm");
}



export default async function TasksPage() {
    async function addTask(formD: FormData){
        'use server'
        const taskDate = formD.get("taskDate");
        const taskTime = formD.get("taskTime");

        if (!taskDate || !taskTime) {
            // In server actions, you can't use alert. Consider throwing an error or handling it differently.
            console.error("Enter a valid date and time");
            console.log(formD.get("reoccurringDays"), typeof(formD.get("reoccurringDays")))
            console.log(formD.get("reoccurring"), typeof(formD.get("reoccurring")))
            return;
        } else {
            const startDate = `${taskDate} ${taskTime?.toString().slice(0, 5)}`;
            const duration = formD.get("taskDuration") ? Number(formD.get("taskDuration")?.toString()) : 2
            const endDate = calculateEndDate(taskDate, taskTime?.toString().slice(0, 6), duration);

            async function addOneTimeTask(){
                await fetch("http://localhost:3000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "task",
                    task: formD.get("task"),
                    duration: formD.get("taskDuration") ? Number(formD.get("taskDuration")?.toString()) : 2,
                    start: startDate,
                    end: endDate
                })
                });
                console.log(formD.get("taskDate"));
                console.log(endDate);
            }

            async function reoccurringTask(){
                await fetch("http://localhost:3000/api/reoccurringTasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: "reoccuring task",
                    task: formD.get("task"),
                    duration: formD.get("taskDuration") ? Number(formD.get("taskDuration")?.toString()) : 2,
                    start: startDate,
                    end: endDate,
                    days: formD.get("reoccurringDays")
                })
                });
                console.log(formD.get("taskDate"));
                console.log(endDate);
            }

            if(formD.get("reoccurring") === "false"){
                addOneTimeTask()
            }
            else if(formD.get("reoccurring") === "true"){
                reoccurringTask()
            }

        }
        console.log(formD.get("taskDuration"))
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
                <div className="flex flex-col items-center ">    
                    <Calendar24/>
                    <DurationInput />
                    <ReoccurringField/>
                </div>
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Add Task</button>
            </Form>
        </section>
    )
}