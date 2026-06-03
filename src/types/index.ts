export interface TryOnRecord {
  id: string
  user_id: string | null
  person_image_url: string
  clothing_image_url: string
  result_url: string
  created_at: string
}

export interface UserSession {
  user: {
    id: string
    email: string
  } | null
}

export interface TryOnRequest {
  person_image: string
  clothing_image: string
}

export interface TryOnResponse {
  success: boolean
  result_url?: string
  message?: string
}

export interface ArkApiRequest {
  model: string
  prompt: string
  image: string[]
  sequential_image_generation: 'enabled' | 'disabled'
  response_format: 'url' | 'base64'
  size: string
  stream: boolean
  watermark: boolean
}

export interface ArkApiResponseData {
  url: string
  size: string
}

export interface ArkApiUsage {
  generated_images: number
  output_tokens: number
  total_tokens: number
}

export interface ArkApiResponse {
  model: string
  created: number
  data: ArkApiResponseData[]
  usage: ArkApiUsage
}

export interface ArkApiError {
  error: {
    code: string
    message: string
  }
}
