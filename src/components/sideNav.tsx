import Link from "next/link"

export default function SideNav() {

    return(
        <div className="flex flex-col items-center justify-center h-full p-4 gap-2 bg-[#e2cbf9]/20 rounded-xl min-w-40 ">
            <Link href="/vision/" >vision</Link>
            <Link href="/story/" >story</Link>
            <Link href="/tasks/" >tasks</Link>
            <Link href="/schedule/">schedule</Link>
            <Link href="/schedule2/">schedule2</Link>
        </div>
    )
}