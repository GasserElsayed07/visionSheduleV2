'use client'

import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react"
import { createViewWeek } from "@schedule-x/calendar"
import "@schedule-x/theme-default/dist/index.css"

type Task = {
    _id: string
    start: string
    end: string
    title: string | null
    task: string | null
}

export default function ScheduleClient({ tasks }:{tasks: Task[]}) {
  const events = tasks
    .filter(t => t.start && t.end)
    .map((t, idx) => ({
      id: t._id?.toString() || idx + 1,
      title: t.task || "Untitled",
      start: t.start, // already in Schedule-X format
      end: t.end
    }))

  const calendar = useNextCalendarApp({
    views: [createViewWeek()],
    events
  })

  return (
    <section className="flex flex-col w-full p-40 overflow-y-auto">
      <ScheduleXCalendar calendarApp={calendar} />
    </section>
  )
}
