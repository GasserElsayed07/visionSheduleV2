'use client'
import { MultiSelect } from "./multiSelect"
import { useState } from "react"

export default function ReoccurringField(){

    const [days, setDays] = useState<string[]>([]) 

    const daysOptions = [
        { value: "sunday", label: "Sunday" },
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" },
        { value: "saturday", label: "Saturday" }
    ];

    console.log(days)

    return (
        <div className="">
            <input hidden value={days} name="secondDay"/>
            <MultiSelect options={daysOptions} onValueChange={setDays} />
        </div>
    )
}