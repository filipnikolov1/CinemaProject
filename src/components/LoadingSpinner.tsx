import styles from "./LoadingSpinner.module.scss"

export default function LoadingSpinner() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  )
}