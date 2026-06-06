import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase/server'
import { tryOnService } from '@/services/tryon'

export async function POST(request: Request) {
  console.log('[API] /api/tryon 接收到POST请求')

  try {
    const supabase = createSupabaseClient()
    const { person_image, clothing_image, user_id } = await request.json()
    console.log('[API] 解析请求参数成功')

    if (!person_image || !clothing_image) {
      console.error('[API] 错误: 参数缺失')
      return NextResponse.json(
        { success: false, message: '请上传人物照片和服装照片' },
        { status: 400 }
      )
    }

    console.log('[API] 用户认证检查完成:', user_id ? `用户ID: ${user_id}` : '未登录用户')

    console.log('[API] 调用TryOn Service...')
    const serviceResult = await tryOnService(person_image, clothing_image)

    if (!serviceResult.success) {
      console.error('[API] TryOn Service失败:', serviceResult.errorMessage)
      return NextResponse.json(
        { success: false, message: serviceResult.errorMessage },
        { status: 500 }
      )
    }

    if (user_id && serviceResult.resultUrl) {
      console.log('[API] 保存记录到数据库...')
      await saveRecord(supabase, user_id, person_image, clothing_image, serviceResult.resultUrl)
    }

    console.log('[API] 请求处理成功')
    return NextResponse.json(
      { success: true, result_url: serviceResult.resultUrl },
      { status: 200 }
    )

  } catch (error) {
    console.error('[API] 未捕获的错误:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}

async function saveRecord(supabase: ReturnType<typeof createSupabaseClient>, userId: number, personImage: string, clothingImage: string, resultUrl: string) {
  try {
    const { error } = await supabase.from('tryon_records').insert({
      user_id: userId,
      person_image_url: personImage,
      clothing_image_url: clothingImage,
      result_url: resultUrl,
    })

    if (error) {
      console.error('[API] 保存记录失败:', error)
    } else {
      console.log('[API] 记录保存成功')
    }
  } catch (error) {
    console.error('[API] 保存记录异常:', error)
  }
}