import Image from "next/image";
import { getManga } from "@/lib/test";

export default async function Home() {
  const mangos = await getManga()
  const mangosElements = mangos.map((manga, i) => 
    <p key={i} >{manga.zeft}{manga.name}</p>
  )
  return (
    <section>
      <h1 className="text-red">HI!</h1>
      <h2>{mangosElements}</h2>
    </section>
  )
}
