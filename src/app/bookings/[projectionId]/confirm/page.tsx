import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import Ticket from "@/components/Ticket"
import Link from "next/link"

interface ConfirmPageProps{
  searchParams:Promise<{bookingId?:string;allIds?:string}>
}

export default async function ConfirmPage({searchParams}:ConfirmPageProps){
  const {bookingId,allIds}=await searchParams
  if(!bookingId) notFound()
  
  const bookingIds= allIds ? allIds.split(",").map(Number) : [Number(bookingId)]


  const bookings=await prisma.booking.findMany({
    where:{id:{in:bookingIds}},
    include:{
      projection:{
        include:{
          movie:true,
          hall:true,
        },
      },
    },
  })

  if(bookings.length===0) notFound()


  return (
    <div style={{width:"100vw",height:"100vh",background:"#333",display: "flex",flexDirection:"column",alignItems:"center",padding:"20px",justifyContent:"center"}} >

      <div style={{width: "60px", height: "60px", background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>✓</div>

      <h1 style={{ fontSize: "25px", fontWeight: "bold", margin: 0,color:"white",fontFamily:"monospace"}}>Резервацијата е успешна!</h1>
      <p style={{ color: "white", margin: "5px",fontFamily:"monospace" }}>Чувајте го кодот за влез во салата.</p>

      {bookings.map((booking)=>(
      <Ticket
        key={booking.id}
        movieTitle={booking.projection.movie.title}
        hallName={booking.projection.hall.name}
        startTime={booking.projection.startTime.toISOString()}
        seatNumber={booking.seatNumber}
        price={booking.projection.price}
        ticketCode={booking.ticketCode}
      />
      ))
      }

      <div style={{ display: "flex", gap: "15px" ,padding:"10px"}}>
        <Link href="/my-bookings" style={{ padding: "10px 15px", background: "#f5c518", color: "#000", fontWeight: "bold", borderRadius: "8px", fontSize: "14px" }}>
          Моите резервации
        </Link>
        <Link href="/movies" style={{ padding: "10px 15px", background: "#1a1a1a", color: "#aaa", borderRadius: "8px", fontSize: "14px" }}>
          Назад кон филмови
        </Link>
      </div>
    </div>
  )
}