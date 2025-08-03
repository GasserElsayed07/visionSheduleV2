'use client'

import { createCalendar, createViewWeek, viewList } from "@schedule-x/calendar";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";

export default function SchedulePage() {

    const calendar = useNextCalendarApp({
            views: [createViewWeek()],
            events: [
                {
                    id: '1',
                    title: "finish visionSchedule",
                    start: '2025-08-03 10:30',
                    end: '2025-08-03 11:20'
                }
            ]
        }
    )

    return(
        <section className="flex flex-col w-full p-40 overflow-y-auto ">
            <ScheduleXCalendar calendarApp={calendar} />
        </section>
    )
}