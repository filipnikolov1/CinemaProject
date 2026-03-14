import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import HallForm from "@/components/admin/HallForm"
import DeleteHallButton from "@/components/admin/DeleteHallButton"
import styles from "../../admin.module.scss"

export default async function EditHallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // ← await params

  const hall = await prisma.hall.findUnique({
    where: { id: Number(id) },
  })

  if (!hall) notFound()

  return (
    <div className={styles.formPage}>
      <div className={styles.pageHeaderRow}>
        <div>
          <h1>Edit Hall</h1>
          <p>{hall.name} · {hall.totalSeats} seats</p>
        </div>
        <DeleteHallButton id={hall.id} />
      </div>
      <div className={styles.formCard}>
        <HallForm hall={hall} />
      </div>
    </div>
  )
}