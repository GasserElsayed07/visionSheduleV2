'use client'

import { useEffect, useMemo, useState } from "react"
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

type ReTask = {
  _id: string
  // stored pattern, e.g. "sunday,monday" (string)
  days: string
  // stored times — can be "HH:mm" or "YYYY-MM-DD HH:mm"
  start: string
  end: string
  task?: string | null
  title?: string | null
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}` }

function toYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// normalize possible time formats -> "HH:mm"
function extractTimePart(value: string) {
  // value could be "YYYY-MM-DD HH:mm" or "HH:mm"
  const parts = value.trim().split(" ")
  return parts.length > 1 ? parts[1] : parts[0]
}

// map common day names/abbreviations to JS weekday (0 = Sunday)
function dayNameToJSNumber(name: string): number | null {
  const n = name.trim().toLowerCase()
  switch (n) {
    case "sun":
    case "sunday": return 0
    case "mon":
    case "monday": return 1
    case "tue":
    case "tues":
    case "tuesday": return 2
    case "wed":
    case "wednesday": return 3
    case "thu":
    case "thurs":
    case "thursday": return 4
    case "fri":
    case "friday": return 5
    case "sat":
    case "saturday": return 6
    default: return null
  }
}

function generateRecurringEventsInRange(viewStart: Date, viewEnd: Date, recurringTasks: ReTask[]) {
  const results: { id: string; title: string; start: string; end: string }[] = []

  if (!recurringTasks?.length) return results

  // for each recurring rule
  for (const rule of recurringTasks) {
    // parse days -> numbers array
    const daysNums = rule.days
      .split(",")
      .map(s => dayNameToJSNumber(s))
      .filter((n): n is number => typeof n === "number")

    if (!daysNums.length) continue

    // iterate from viewStart to viewEnd (inclusive)
    const cur = new Date(viewStart)
    cur.setHours(0, 0, 0, 0)

    const endBoundary = new Date(viewEnd)
    endBoundary.setHours(23, 59, 59, 999)

    while (cur <= endBoundary) {
      const weekday = cur.getDay() // 0..6 (Sun..Sat)
      if (daysNums.includes(weekday)) {
        // build start/end strings with date + time
        const dateStr = toYYYYMMDD(cur)
        const timeStart = extractTimePart(rule.start) // "HH:mm"
        const timeEnd = extractTimePart(rule.end)

        // final strings in your Schedule-X format: "YYYY-MM-DD HH:mm"
        const start = `${dateStr} ${timeStart}`
        const end = `${dateStr} ${timeEnd}`

        // ensure unique id per occurrence
        const id = `${rule._id}-${dateStr}-${timeStart.replace(":", "")}`

        results.push({
          id,
          title: rule.title ?? rule.task ?? "Untitled",
          start,
          end,
        })
      }

      cur.setDate(cur.getDate() + 1)
    }
  }

  return results
}

export default function ScheduleClient({ tasks }: { tasks: Task[] }) {
  const [recurringRules, setRecurringRules] = useState<ReTask[]>([])
  const [currentRange, setCurrentRange] = useState<{ start: string; end: string } | null>(null)

  // static events from DB (already in "YYYY-MM-DD HH:mm" format)
  const staticEvents = useMemo(() => {
    return tasks
      .filter(t => !!t.start && !!t.end)
      .map((t, idx) => ({
        id: t._id?.toString() || `s-${idx + 1}`,
        title: t.task ?? t.title ?? "Untitled",
        start: t.start,
        end: t.end,
      }))
  }, [tasks])

  // fetch recurring rules on mount
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch("/api/reoccurringTasks")
        if (!res.ok) throw new Error(`Failed to fetch recurring rules: ${res.status}`)
        const json = await res.json()
        if (mounted) setRecurringRules(json || [])
      } catch (err) {
        console.error("Could not load recurring rules", err)
        if (mounted) setRecurringRules([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // generate recurring events for the *current* view range
  const generatedRecurringEvents = useMemo(() => {
    if (!currentRange || !recurringRules.length) return []
    const start = new Date(currentRange.start) // expecting "YYYY-MM-DD" or ISO date
    const end = new Date(currentRange.end)
    // normalize: if those strings include time, they still parse as Date
    return generateRecurringEventsInRange(start, end, recurringRules)
  }, [currentRange, recurringRules])

  // final events array (static + generated)
  const events = useMemo(() => {
    return [...staticEvents, ...generatedRecurringEvents]
  }, [staticEvents, generatedRecurringEvents])

  // create calendar app (created synchronously)
  const calendar = useNextCalendarApp({
    views: [createViewWeek()],
    // pass initial events — we'll call calendar.events.set later to keep it synced
    events,
    firstDayOfWeek: 6,
    callbacks: {
      // Schedule-X provides onRangeUpdate (you used this previously)
      onRangeUpdate: (range) => {
        // range.start / range.end might be Date or string; normalize to YYYY-MM-DD
        const s = typeof range.start === "string" ? range.start : toYYYYMMDD(new Date(range.start))
        const e = typeof range.end === "string" ? range.end : toYYYYMMDD(new Date(range.end))
        setCurrentRange({ start: s, end: e })
      }
    }
  })

  // whenever `events` or `calendar` change, push them into the calendar safely
  useEffect(() => {
    if (!calendar) return
    try {
      // use the event-set API to replace calendar events atomically
      // (this prevents duplicates when recomputing)
      if (calendar.events && typeof calendar.events.set === "function") {
        calendar.events.set(events)
      } else if (typeof calendar.addEvents === "function") {
        // fallback: clear then add (if no set available)
        // (Note: some schedule-x versions might expose other APIs)
        // try to clear previous recurring by id-prefix if necessary
        calendar.addEvents(events)
      } else {
        console.warn("Calendar API doesn't support .events.set or .addEvents. Check Schedule-X version.")
      }
    } catch (err) {
      console.error("Failed to sync events to Schedule-X calendar:", err)
    }
  }, [calendar, events])

  // initial-range helper: if calendar loads but onRangeUpdate didn't fire, compute a reasonable week range
  useEffect(() => {
    if (currentRange) return // already set by calendar's callback
    if (!calendar) return

    // compute week range centered on today using firstDayOfWeek = 6 (Saturday)
    const today = new Date()
    const firstDayOfWeek = 6 // saturday as you had configured
    const day = today.getDay()
    const diff = day >= firstDayOfWeek ? day - firstDayOfWeek : 7 - (firstDayOfWeek - day)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - diff)
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    setCurrentRange({
      start: toYYYYMMDD(startOfWeek),
      end: toYYYYMMDD(endOfWeek),
    })
  }, [calendar, currentRange])

  return (
    <section className="flex flex-col w-full p-10 overflow-y-auto">
      {currentRange && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-black">
          <p>Current view range:</p>
          <p>Start: {currentRange.start}</p>
          <p>End: {currentRange.end}</p>
        </div>
      )}

      <ScheduleXCalendar calendarApp={calendar} />
    </section>
  )
}
