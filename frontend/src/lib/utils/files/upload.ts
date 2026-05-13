import { httpClient } from '@/lib/http/http.client'
import { notifyError } from '../client/errors.utils'

interface UploadResponse {
  fileId: string
  fileUrl: string
}

export async function uploadFile(file: File, signal?: AbortSignal): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  console.log(formData.get('file'), file)
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
