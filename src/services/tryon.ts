import type { ArkApiRequest, ArkApiResponse, ArkApiError } from '@/types'

const ARK_API_KEY = process.env.ARK_API_KEY
const ARK_API_ENDPOINT = process.env.ARK_API_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/images/generations'

export interface TryOnServiceResult {
  success: boolean
  resultUrl?: string
  errorMessage?: string
}

export async function tryOnService(personImageUrl: string, clothingImageUrl: string): Promise<TryOnServiceResult> {
  console.log('[TryOn Service] 接收到试衣请求')
  console.log('[TryOn Service] 人物图片:', personImageUrl.substring(0, 50) + '...')
  console.log('[TryOn Service] 服装图片:', clothingImageUrl.substring(0, 50) + '...')

  if (!ARK_API_KEY) {
    console.error('[TryOn Service] 错误: ARK_API_KEY 未配置')
    return {
      success: false,
      errorMessage: 'API密钥未配置，请联系管理员'
    }
  }

  const requestBody: ArkApiRequest = {
    model: 'doubao-seedream-5-0-260128',
    prompt: '将图1的服装换为图2的服装',
    image: [personImageUrl, clothingImageUrl],
    sequential_image_generation: 'disabled',
    response_format: 'url',
    size: '2K',
    stream: false,
    watermark: true
  }

  console.log('[TryOn Service] 准备调用ARK API...')

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 120000)

    const response = await fetch(ARK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARK_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    console.log('[TryOn Service] API响应状态:', response.status)

    if (!response.ok) {
      if (response.status === 401) {
        console.error('[TryOn Service] 错误: 401 - 认证失败')
        return {
          success: false,
          errorMessage: 'API认证失败，请检查API密钥'
        }
      }

      if (response.status === 429) {
        console.error('[TryOn Service] 错误: 429 - 请求超限')
        return {
          success: false,
          errorMessage: '当前请求过多，请稍后重试'
        }
      }

      try {
        const errorData = await response.json() as ArkApiError
        console.error('[TryOn Service] API错误响应:', errorData)
        return {
          success: false,
          errorMessage: errorData.error?.message || `请求失败，状态码: ${response.status}`
        }
      } catch {
        return {
          success: false,
          errorMessage: `请求失败，状态码: ${response.status}`
        }
      }
    }

    const data = await response.json() as ArkApiResponse
    console.log('[TryOn Service] API响应成功')
    console.log('[TryOn Service] 生成图片URL:', data.data[0]?.url)

    if (data.data && data.data.length > 0 && data.data[0].url) {
      return {
        success: true,
        resultUrl: data.data[0].url
      }
    } else {
      console.error('[TryOn Service] 错误: API响应中没有图片URL')
      return {
        success: false,
        errorMessage: 'API响应中没有图片URL'
      }
    }

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[TryOn Service] 错误: 请求超时')
      return {
        success: false,
        errorMessage: '请求超时，请稍后重试'
      }
    }

    console.error('[TryOn Service] 错误:', error)
    return {
      success: false,
      errorMessage: '网络错误，请稍后重试'
    }
  }
}
