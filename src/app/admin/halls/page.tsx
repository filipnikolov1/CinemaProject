import { prisma } from "@/lib/db"
import Link from "next/link"
import { Suspense } from "react"
import ToastFromParams from "@/components/admin/ToastFromParams"
import styles from "../admin.module.scss"

export default async function HallsPage() {
  const halls = await prisma.hall.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { projections: true } } },
  })

  return (
    <div>
      <div className={styles.pageHeaderRow}>
        <div>
          <h1>Halls</h1>
          <p>{halls.length} halls configured</p>
        </div>
        <Link href="/admin/halls/new" className={styles.addButtonLarge}>+ Add Hall</Link>
      </div>

      <div className={styles.tableCard}>
        {halls.length === 0 ? (
          <div className={styles.emptyState}>
            No halls yet. <Link href="/admin/halls/new">Add the first one</Link>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {["Name", "Total Seats", "Projections", "Actions"].map(h => (
                  <th key={h} className={styles.tableTh}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {halls.map(hall => (
                <tr key={hall.id}>
                  <td className={`${styles.tableTd} ${styles.primary}`}>{hall.name}</td>
                  <td className={styles.tableTd}>{hall.totalSeats} seats</td>
                  <td className={styles.tableTd}>{hall._count.projections}</td>
                  <td className={styles.tableTd}>
                    <Link href={`/admin/halls/${hall.id}`} className={styles.editLink}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Suspense>
        <ToastFromParams
          messages={{
            created: "Hall created!",
            updated: "Hall updated!",
          }}
        />
      </Suspense>
    </div>
  )
}