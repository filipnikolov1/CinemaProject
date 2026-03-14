"use client"
import { useEffect, useState } from "react"
import styles from "./Toast.module.scss"

interface Props {
  message: string
  type?: "success" | "error"
  onDone: () => void
}

export default function Toast({ message, type = "success", onDone }: Props) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true)
      setTimeout(onDone, 200)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${styles.toast} ${type === "error" ? styles.error : ""} ${hiding ? styles.hiding : ""}`}>
      <span className={styles.icon}>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  )
}