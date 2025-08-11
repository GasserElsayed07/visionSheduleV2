'use client'
import { MultiSelect } from "./multiSelect"
import { useState } from "react"
import { Checkbox } from "./ui/checkbox"

export default function ReoccurringField(){

    const [days, setDays] = useState<string[]>([]) 
    const [checked, setChecked] = useState<boolean>(false)
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
            <label htmlFor="">reoccuring?</label>
            <Checkbox 
                id="reoccuring"
                checked={checked}
                onCheckedChange={(checked) => setChecked(checked === true)}
            />
            <input hidden  value={checked} name="reoccurring" />
            { 
            checked && 
            <div>
                <input hidden value={days} name="reoccurringDays"/>
                <MultiSelect options={daysOptions} onValueChange={setDays} />
            </div>}
        </div>
    )
}