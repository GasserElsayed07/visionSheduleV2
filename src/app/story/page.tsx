import Form from 'next/form'

export default function StoryPage() {

    async function storySubmit( fd: FormData){
        'use server'
        console.log(fd.get("story"))
    }

    return (
        <section className="flex flex-col justify-center items-center w-full">
            <Form action={storySubmit} className='flex flex-col gap-3'>
                <label className='text-center'>Tell us who you are</label>
                <textarea className='border-2 border-white rounded-[16px]  w-100 h-100 p-4' 
                    name='story' 
                    autoComplete='off'/>
                <button className="bg-blue-700 rounded-[4px] p-1" >Submit</button>
            </Form>
        </section>
    )
}