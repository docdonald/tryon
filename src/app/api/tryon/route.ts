import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'
import { tryOnService } from '@/services/tryon'

export async function POST(request: Request) {
  console.log('[API] /api/tryon 接收到POST请求')

  try {
    const { person_image, clothing_image } = await request.json()
    console.log('[API] 解析请求参数成功')

    if (!person_image || !clothing_image) {
      console.error('[API] 错误: 参数缺失')
      return NextResponse.json(
        { success: false, message: '请上传人物照片和服装照片' },
        { status: 400 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    console.log('[API] 用户认证检查完成:', user ? `用户ID: ${user.id}` : '未登录用户')

    console.log('[API] 调用TryOn Service...')
    const serviceResult = await tryOnService(person_image, clothing_image)

    if (!serviceResult.success) {
      console.error('[API] TryOn Service失败:', serviceResult.errorMessage)
      return NextResponse.json(
        { success: false, message: serviceResult.errorMessage },
        { status: 500 }
      )
    }

    if (user && serviceResult.resultUrl) {
      console.log('[API] 保存记录到数据库...')
      await saveRecord(user.id, person_image, clothing_image, serviceResult.resultUrl)
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

async function saveRecord(userId: string, personImage: string, clothingImage: string, resultUrl: string) {
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
