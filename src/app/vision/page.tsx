import Form from "next/form"

export default function VisionPage(){
    

    async function handleVision(formData : FormData){
        'use server'
        const vision = formData.get("vision")
        const res = fetch("http://localhost:3000/api/ai",{
            method : "POST",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify({vision: vision})
        }
        )
    }

    return(
        <section className="flex flex-col justify-center items-center w-full">
            <Form action={handleVision}>
                <label className="mr-1" htmlFor="">Enter your Vision</label>
                <input
                    className="white pl-1 border-2 border-white rounded-[8px] p-1 focus:outline-none focus:ring-0 focus:border-white"
                    name="vision"
                />
            </Form>
        </section>
    )
}