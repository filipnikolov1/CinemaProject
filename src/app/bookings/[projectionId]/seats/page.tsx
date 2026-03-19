"use client"
import { useState,useEffect } from "react";
import { useRouter,useParams } from "next/navigation";
import SeatPicker from "@/components/SeatPicker";

interface ProjectionInfo{
  id:number
  startTime:string
  price:number
  movie:{title:string;posterUrl:string | null; duration:number;genre:string | null}
  hall:{name:string;totalSeats:number}
}

export default function SeatSelectionPage(){
  const {projectionId} = useParams<{projectionId:string}>()

  const router=useRouter()

  const [projection,setProjection]=useState<ProjectionInfo | null>(null)
  const [takenSeats,setTakenSeats]=useState<number[]>([])
  const [selectedSeats,setSelectedSeats]=useState<number[]>([])
  const [loading,setLoading]=useState(true)
  const [booking,setBooking]=useState(false)
  const [error,setError]=useState<string | null>(null)

useEffect(()=>{
   async function load(){
      try{
        const [projRes,seatsRes]=await Promise.all([
          fetch(`/api/projections/${projectionId}`),
          fetch(`/api/seats/${projectionId}`),
        ])

        if(!projRes.ok) throw new Error("Projection not found.")
        setProjection(await projRes.json())
        setTakenSeats((await seatsRes.json()).takenSeats)
      } catch (e:any){
         setError(e.message)
      } finally {
        setLoading(false)
      }
   }
   load()
  },[projectionId])
function handleToggleSeat(seat:number){
  setSelectedSeats((prev)=>
    prev.includes(seat) ? prev.filter((s)=>s!==seat) : [...prev,seat]
  )
}
async function handleConfirm(){
  if(selectedSeats.length===0) return
  setBooking(true)
  setError(null)
  try{
    const bookingIds:number[]=[]

    for(const seatNumber of selectedSeats){
      const res = await fetch("/api/bookings",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({projectionId:Number(projectionId),seatNumber}),
      })
      if(!res.ok) {
        const data=await res.json()
        setError(data.error)
        setBooking(false)
        return
      }
      const data=await res.json()
      bookingIds.push(data.id)
    }
    router.push(`/bookings/${projectionId}/confirm?bookingId=${bookingIds[0]}&allIds=${bookingIds.join(",")}`)

  } catch {
    setError("Network failed.")
  } finally {
    setBooking(false)
  }
}
  if (loading) return <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Вчитување...</div>

  const date = projection ? new Date(projection.startTime) : null
  const formattedDate = date?.toLocaleDateString("mk-MK", { weekday: "long", day: "2-digit", month: "short" })
  const formattedTime = date?.toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" })
 return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#fff", fontFamily: "Arial, sans-serif" }}>

      <nav style={{ borderBottom: "1px solid #222", padding: "20px" }}>
        <span style={{ color: "#f5c518", fontWeight: "900", fontSize: "20px",letterSpacing:"2px"}}>CINEBOOK</span>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto",padding:"25px"}}>

        <div style={{ display: "flex", gap: "15px", marginBottom: "25px", background: "#1a1a1a", padding: "15px", borderRadius: "10px" }}>
          {projection?.movie.posterUrl && (
            <img src={projection.movie.posterUrl} alt={projection.movie.title} style={{ width: "70px", height: "100px", objectFit: "cover", borderRadius: "6px" }} />
          )}
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 10px 0" }}>{projection?.movie.title}</h1>
            <p style={{ color: "#888", fontSize: "14px", margin: "12px 0" }}>📅 {formattedDate} · 🕐 {formattedTime}</p>
            <p style={{ color: "#888", fontSize: "14px", margin: "12px 0" }}>🏛️ {projection?.hall.name} · ⏱️ {projection?.movie.duration} min</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>

          <div style={{ flex: 1, background: "#1a1a1a", borderRadius: "10px" }}>
            <SeatPicker
              totalSeats={projection?.hall.totalSeats || 0}
              takenSeats={takenSeats}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />
          </div>

          <div style={{ width: "240px", background: "#1a1a1a", borderRadius: "10px", padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <h2 style={{ color: "#f5c518", fontWeight: "bold", margin: 0, fontSize: "0.95rem" }}>РЕЗЕРВАЦИЈА</h2>

            <div style={{ fontSize: "14px", color: "#888" }}>
              <p style={{ margin: "0 0 4px 0" }}>Избрани места: <strong style={{ color: "#fff" }}>{selectedSeats.length}</strong></p>
              <p style={{ margin: 0 }}>Цена по место: <strong style={{ color: "#fff" }}>{projection?.price} ден</strong></p>
            </div>

            <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold" }}>Вкупно</span>
              <span style={{ color: "#f5c518", fontWeight: "bold", fontSize: "18px" }}>{(projection?.price || 0) * selectedSeats.length} ден</span>
            </div>

            {error && <p style={{ color: "#f87171", fontSize: "12px", margin: 0 }}>{error}</p>}

            <button
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0 || booking}
              style={{
                padding: "10px",
                background: selectedSeats.length === 0 ? "#2a2a2a" : "#f5c518",
                color: selectedSeats.length === 0 ? "#555" : "#000",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
              }}
            >
              {booking ? "Резервирање..." : "Потврди"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}