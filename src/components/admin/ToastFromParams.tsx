"use client"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Toast from "./Toast"

interface Props {
  messages: Record<string, string>
}

export default function ToastFromParams({ messages }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const success = searchParams.get("success")
    if (success && messages[success]) {
      setToast(messages[success])
      // Clean the URL without triggering a reload
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams])

  if (!toast) return null

  return (
    <Toast
      message={toast}
      type="success"
      onDone={() => setToast(null)}
    />
  )
}