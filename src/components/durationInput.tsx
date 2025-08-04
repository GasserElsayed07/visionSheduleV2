

export default function DurationInput() {
    return (
        <input 
            name="taskDuration"
            autoComplete="off"
            type="number"
            min={1}
            max={12}
            step={1}
            placeholder="1 hour"
            className="bg-white text-black w-[150px] rounded-[8px] h-8 p-2 text-center m-1 "
        />
    )
}