import styles from "./loading.module.scss"

export default function AdminLoadingSpinner() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  )
}