"use client"

import { useEffect } from "react"

export interface AlertProps {
  id: number
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
}

export default function Alert({ id, type, title, message }: AlertProps) {
  useEffect(() => {
    if (!title || !message) return

    let cancelled = false;
    
    (async () => {
      const [{ default: Swal }, { default: withReactContent }] =
        await Promise.all([
          import("sweetalert2"),
          import("sweetalert2-react-content"),
        ])

      if (cancelled) return

      const MySwal = withReactContent(Swal)

      MySwal.fire({
        icon: type,
        title,
        text: message,
      })
    })()

    return () => {
      cancelled = true
    }
  }, [id, type, title, message])

  return null
}
