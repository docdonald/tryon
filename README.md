# 虚拟试衣 Web 应用

基于 Next.js + Supabase 构建的 AI 虚拟试衣应用。

## 功能特性

- 📷 支持照片上传和摄像头拍照
- 👗 上传服装照片进行虚拟试穿
- 🤖 AI 合成试穿效果
- 💾 登录用户可保存历史记录
- 🎯 未登录用户可试用 5 次

## 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **UI**: Tailwind CSS 4 + shadcn/ui
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth

## 快速开始

### 前置要求

- Node.js >= 20.x
- Supabase 账户

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.local` 文件并配置你的 Supabase 凭据：

```bash
cp .env.local.example .env.local
```

更新 `.env.local` 中的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 数据库初始化

在 Supabase 控制台中执行以下 SQL 脚本创建表：

```sql
CREATE TABLE tryon_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  person_image_url TEXT NOT NULL,
  clothing_image_url TEXT NOT NULL,
  result_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tryon_records_user_id ON tryon_records(user_id);
```

### 开发

```bash
npm run dev
```

访问 http://localhost:5000

### 构建

```bash
npm run build
```

## API 预留接口

当前试衣接口 `/api/tryon` 使用模拟数据，接入第三方 AI 试衣 API 时只需修改 `src/app/api/tryon/route.ts` 中的 `processTryOn` 函数。

推荐的第三方 API：
- 阿里云百炼 AI 试衣 API
- 玩美移动虚拟试衣 API
- FASHN API

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   └── tryon/route.ts
│   ├── history/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── AuthForm.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── PhotoUploader.tsx
│   └── ResultDisplay.tsx
├── lib/
│   └── supabase/
│       ├── client.ts
│       ├── middleware.ts
│       └── server.ts
├── types/
│   └── index.ts
└── index.css
```
