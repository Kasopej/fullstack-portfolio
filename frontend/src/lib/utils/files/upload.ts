import { httpClient } from '@/lib/http/http.client'
import { notifyError } from '../client/errors.utils'

interface UploadResponse {
  fileId: string
  fileUrl: string
}

export async function uploadFile(file: File, signal?: AbortSignal): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await httpClient.request<UploadResponse>('/file/upload', {
      method: 'POST',
      data: formData,
      signal,
    })
    return response.data
  }
  catch (error) {
    notifyError(error)
    throw error
  }
}

export async function deleteFiles(fileIds: string[], signal?: AbortSignal) {
  try {
    const response = await httpClient.request('/file/delete', {
      method: 'POST',
      data: { fileIds },
    })
    return response.data
  }
  catch (error) {
    notifyError(error)
    throw error
  }
}

export function dataUriToBlob(dataUri: string): Blob {
  const [header, base64] = dataUri.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png'

  const binary = atob(base64)
  const array = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }

  return new Blob([array], { type: mime })
}
