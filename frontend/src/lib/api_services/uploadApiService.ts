import axios from 'axios'
import { getToken } from '@/lib/storage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export interface UploadResponse {
  url: string
  filename: string
}

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void,
  folder?: string
): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const token = getToken()
  const url = folder ? `${API_URL}/api/upload?folder=${folder}` : `${API_URL}/api/upload`

  const response = await axios.post<UploadResponse>(url, formData, {
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
