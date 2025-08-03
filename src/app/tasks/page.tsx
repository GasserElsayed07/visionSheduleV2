import Form from "next/form"
import { getTasks } from "@/lib/test"

interface TasksPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TasksPage({ searchParams }: TasksPageProps) {

    const search = await searchParams;
    const name = await search.task;
    async function addTask(formD: FormData){
        'use server'
        fetch("http://localhost:3000/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({type: "task", task: formD.get("task")})
        })
        
    }

    
    const tasks = await getTasks()
    const tasksElements = tasks.map((task, i) =>
        <p key={i} className="text-emerald-400">{task.task}</p>
    )

    return (
        <section className="flex flex-col justify-center items-center w-full">
            <Form action={addTask}>
                <label>new task: </label>
                <input className="white" name="task"></input>
            </Form>
                {tasksElements}
        </section>
    )
}