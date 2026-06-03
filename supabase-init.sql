-- 创建试衣记录表
CREATE TABLE tryon_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  person_image_url TEXT NOT NULL,
  clothing_image_url TEXT NOT NULL,
  result_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_tryon_records_user_id ON tryon_records(user_id);

-- 创建存储桶用于图片存储
INSERT INTO storage.buckets (id, name) VALUES ('tryon-images', 'tryon-images');

-- 设置存储桶权限
CREATE POLICY "Allow authenticated users to upload images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
USING (bucket_id = 'tryon-images');

CREATE POLICY "Allow authenticated users to read images" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'tryon-images');
