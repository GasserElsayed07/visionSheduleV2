'use client'

import { createCalendar, createViewWeek, viewList } from "@schedule-x/calendar";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";
import { format } from "date-fns"


import { useEffect, useState } from "react";

export default function SchedulePage() {

    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        console.log("use effect ran")
        fetch("http://localhost:3000/api/tasks", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                console.log("Response status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("Fetched data:", data);
                setTasks(data);
            })
            .catch(err => {
                console.error("Fetch error:", err);
            });
    }, []);

    tasks
        .forEach(t => {
            console.log("Raw task:", t.start, t.end);
            console.log("As date objects:", new Date(t.start), new Date(t.end));
        });
    const formattedTasks = Array.isArray(tasks)
        ? tasks
            .filter(t => t.start && t.end) // remove empty or invalid tasks
            .map((t, idx) => ({
                id: t.id || idx + 100, // Use task's id if available, else generate a unique one

                start: format(new Date(t.start), "yyyy-MM-dd HH:mm"),
                end: format(new Date(t.end), "yyyy-MM-dd HH:mm")
            }))
        : [];

    console.log("formatted tasks is", formattedTasks)

    const events = [
        ...formattedTasks,
        {
            id: 5,
            start: "2025-08-07 00:00",
            end: "2025-08-07 02:00"
        }
    ];

    const calendar = useNextCalendarApp({
        views: [createViewWeek()],
        events,
        selectedDate: formattedTasks.length
            ? formattedTasks[0].start.split(" ")[0] // e.g. "2025-08-06"
            : undefined
    });

    return (
        <section className="flex flex-col w-full p-40 overflow-y-auto ">
            <ScheduleXCalendar calendarApp={calendar} />
            <pre>{JSON.stringify(events, null, 2)}</pre> {/* Debug output */}
        </section>
    );
}

