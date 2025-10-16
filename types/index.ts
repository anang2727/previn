import type React from "react"
export interface UploadedFile {
  id: number
  name: string
  size: string
  link: string
  uploadDate: string
  expiryDate: string
  content: string
}

export type ChangeEvent = React.ChangeEvent<HTMLInputElement>
