'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import  timeGridPlugin  from '@fullcalendar/timegrid'
export default function FullCalenderPage(){
    return (
        <section className='w-full flex justify-center items-center p-34 h-full'>
            <div className='w-full h-full'>                
                <FullCalendar
                    plugins={[timeGridPlugin,]}
                    initialView='timeGridWeek'
                    height={'100%'}
                    
                />
            </div>
        </section>
    )
}