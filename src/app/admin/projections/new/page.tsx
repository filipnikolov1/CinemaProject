import ProjectionForm from "@/components/admin/ProjectionForm"
import styles from "../../admin.module.scss"

export default function NewProjectionPage() {
  return (
    <div className={styles.formPage}>
      <div className={styles.pageHeader}>
        <h1>Add Projection</h1>
        <p>Schedule a new movie screening</p>
      </div>
      <div className={styles.formCard}>
        <ProjectionForm />
      </div>
    </div>
  )
}