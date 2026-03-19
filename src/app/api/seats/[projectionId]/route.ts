import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

//GET api/seats/[projectionId] ->vrakja zafateni mesta za odredena proekcija

export async function GET(_:Request,{params}:{params:Promise<{projectionId:string}>}){
    try{

        const { projectionId } = await params
        
        const projection=await prisma.projection.findUnique({
            where:{id:Number(projectionId)},
            include:{
                hall:true, //za da gi dobieme drugite potrebni informacii(broj na sedishta)
            },
        })

        if(!projection){
            return NextResponse.json({error:"Projection not found."},{status:404})
        }

        const bookingsForProjection=await prisma.booking.findMany({
            where:{projectionId: Number(projectionId)},
            select:{seatNumber:true},
        })
        const takenSeats=bookingsForProjection.map((b)=>b.seatNumber)
        return NextResponse.json({
            totalSeats:projection.hall.totalSeats,
            takenSeats,
        })

    } catch (error){
        return NextResponse.json({error:"Failed to load."},{status:500})
    }
}