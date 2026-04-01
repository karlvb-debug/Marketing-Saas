'use server'

import { createClient } from '@/utils/supabase/server'
export async function uploadAsset(workspaceId: string, formData: FormData): Promise<string> {
  const file = formData.get('file') as File | null
  
  if (!file) {
    throw new Error('No file provided')
  }

  const supabase = await createClient()

  const ext = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = `${workspaceId}/logos/${fileName}`

  // Ensure we can access ArrayBuffer from the file
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { data, error } = await supabase.storage
    .from('assets')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    console.error("Storage upload error:", error)
    throw new Error('Failed to upload file')
  }

  const { data: publicUrlData } = supabase.storage
    .from('assets')
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
