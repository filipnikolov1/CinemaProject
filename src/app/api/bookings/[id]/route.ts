import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"
import { getCurrentUser } from "@/lib/getCurrentUser";  

// GET /api/bookings/[id] -> da se vrati eden konkreten booking
export async function GET(_:Request,{params}:{params: Promise<{id:string}>}){
    const user=await getCurrentUser()
    if(!user){
        return NextResponse.json({error:"Unathorized"},{status:401})
    }
    try{
        const {id}=await params
        const booking=await prisma.booking.findUnique({
            where:{id:Number(id)},
            include:{
                projection:{
                    include:{
                        movie:true,
                        hall:true,
                    },
                },
            },
        })
        if(!booking){
            return NextResponse.json({error:"Booking not found"},{status:404})
        }

        //proveruvame dali booking pripagja na najaveniot korisnik
        if(booking.userId!==user.id){
            return NextResponse.json({error:"You do not have access to this booking."},{status:403})
        }
        return NextResponse.json(booking)

    } catch (error){
        return NextResponse.json({error:"Loading failed."},{status:500})
    }
}
// DELETE /api/bookings/[id] -> pr /bookings/7 , sakame da go zememe samo param 7 shto e id
//tie parametri vo ts mozhe da vrakjaat promise, pa gi chekame so await
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){
    const user=await getCurrentUser()

    if(!user){
         return NextResponse.json({error:"Unauthorized"},{status:401})
    }    

    try{
        const {id}=await params
        const booking=await prisma.booking.findUnique({
            where:{id:Number(id)},
            include:{
                projection:true,
            }
        })

        if(!booking){
             return NextResponse.json({error:"Booking not found"},{status:404})
        }

         if(booking.userId!==user.id){
            return NextResponse.json({error:"You do not have access to this booking."},{status:403})
        }

        //proveruvame dali se raboti za pominati proekcii, ako proekcijata vekje zavrshila ne mozhe da ja otkazheme
        if(new Date(booking.projection.startTime)<new Date()){
            return NextResponse.json({error:"Cannot cancel past projection."},{status:400})
        }
        await prisma.booking.delete({where:{id:Number(id)}})
        return NextResponse.json({message:"Reservation is canceled."},{status:200})
    } catch (error){
        return NextResponse.json({error:"Failed to cancel reservation."},{status:500})
    }
}