import HallForm from "@/components/admin/HallForm"
import styles from "../../admin.module.scss"

export default function NewHallPage() {
  return (
    <div className={styles.formPage}>
      <div className={styles.pageHeader}>
        <h1>Add Hall</h1>
        <p>Create a new screening hall</p>
      </div>
      <div className={styles.formCard}>
        <HallForm />
      </div>
    </div>
  )
}