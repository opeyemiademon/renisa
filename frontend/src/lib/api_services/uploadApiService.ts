import axios from 'axios'
import { getToken } from '@/lib/storage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export interface UploadResponse {
  url: string
  filename: string
}

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const token = getToken()

  const response = await axios.post<UploadResponse>(`${API_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
  })

  return response.data
}
