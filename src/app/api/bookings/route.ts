import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"
import { getCurrentUser} from "@/lib/getCurrentUser"

export async function GET(){
    const user=await getCurrentUser()
    if(!user){
        return NextResponse.json({error:"Unauthorize"},{status:401})
    }
    const bookings=await prisma.booking.findMany({
        where:{userId:user.id},
        include:{
            projection:{
                include:{
                    movie:true,
                    hall:true,
                },
            },
        },
        orderBy:{createdAt:"desc"}
    })
    return NextResponse.json(bookings)
}
export async function POST(req:Request){
    const user=await getCurrentUser()
    if(!user){
        return NextResponse.json({error:"Unauthorize"},{status:401})
    }
    try{
        const {projectionId,seatNumber}= await req.json()

        if(!projectionId || !seatNumber){
            return NextResponse.json({error:"projectionId and seatNumber are required."},{status:400})
        }

        const projection=await prisma.projection.findUnique({
            where:{id:Number(projectionId)},
            include:{hall:true} 
            //za da vidime kolku sedishta ima ni treba i hall,
            // ako ne go zememe hall so include, ke imame samo hallId
            // i so hallId nema da gi imame ostanatite potrebni informacii
        })

        if(!projection){
            return NextResponse.json({error:"Projection does not exists."},{status:404})
        }

        if(seatNumber<1 || seatNumber>projection.hall.totalSeats){
            return NextResponse.json({error:"Invalid seat number."},{status:400})
        }
        //proveruvame dali sedishteto e zafateno
        const existingBooking=await prisma.booking.findFirst({
            where:{
                projectionId:Number(projectionId),
                seatNumber:Number(seatNumber),
            },
        })

        if(existingBooking){
            return NextResponse.json({error:"This seat is already booked."},{status:409})
        }

        const booking=await prisma.booking.create({
            data:{
                projectionId:Number(projectionId),
                userId:user.id,
                seatNumber:Number(seatNumber),
            },
            include:{
                //mora da gi vklucime i celiot projection objekt,so movie i hall
                //za da gi imame site potrebni informacii
                //za da moze na frontend da gi pratime i filmot i salata
                //povrzani relacii(podatoci) Booking->Projection->Movie Hall
                projection:{
                    include:{
                        movie:true,
                        hall:true,
                    },
                },
            },
        })
        return NextResponse.json(booking,{status:201})
    } catch {
        return NextResponse.json({error:"Failed to create booking."},{status:500})
    }
}