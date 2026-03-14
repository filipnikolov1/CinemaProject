import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import ProjectionForm from "@/components/admin/ProjectionForm"
import DeleteProjectionButton from "@/components/admin/DeleteProjectionButton"
import styles from "../../admin.module.scss"

export default async function EditProjectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // ← await params

  const projection = await prisma.projection.findUnique({
    where: { id: Number(id) },
    include: { movie: true, hall: true },
  })

  if (!projection) notFound()

  return (
    <div className={styles.formPage}>
      <div className={styles.pageHeaderRow}>
        <div>
          <h1>Edit Projection</h1>
          <p>{projection.movie.title}</p>
        </div>
        <DeleteProjectionButton id={projection.id} />
      </div>
      <div className={styles.formCard}>
        <ProjectionForm projection={{
          id: projection.id,
          movieId: projection.movieId,
          hallId: projection.hallId,
          startTime: projection.startTime.toISOString(),
          price: projection.price,
          movie: {
            id: projection.movie.id,
            title: projection.movie.title,
            posterUrl: projection.movie.posterUrl,
            releaseDate: projection.movie.releaseDate
              ? projection.movie.releaseDate.toISOString()
              : null,
            duration: projection.movie.duration,
          }
        }} />
      </div>
    </div>
  )
}