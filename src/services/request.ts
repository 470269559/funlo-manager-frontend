import axios, { type AxiosRequestConfig } from 'axios'
import { TOKEN_KEY } from '../constants/auth'

type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function getErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return '请求失败'
  }

  const response = error.response?.data as Partial<ApiResponse<unknown>> | undefined
  const message = response?.message
  if (Array.isArray(message)) {
    return message.join('，')
  }
  return message || error.message || '请求失败'
}

export async function request<T>(config: AxiosRequestConfig) {
  try {
    const response = await http.request<ApiResponse<T>>(config)
    const result = response.data

    if (result.code !== 0) {
      throw new Error(result.message || '请求失败')
    }

    return result.data
  } catch (error) {
    if (error instanceof Error && !axios.isAxiosError(error)) {
      throw error
    }
    throw new Error(getErrorMessage(error), { cause: error })
  }
}
