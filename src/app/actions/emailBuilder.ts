'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveEmailTemplate(
  table: 'campaigns' | 'email_templates',
  id: string,
  payload: {
    sender_name: string
    reply_to: string
    structural_json: any[]
    content: string
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from(table)
    .update({
      sender_name: payload.sender_name,
      reply_to: payload.reply_to,
      structural_json: payload.structural_json,
      content: payload.content
    })
    .eq('id', id)

  if (error) {
    console.error("Save template error:", error)
    throw new Error('Failed to save template')
  }

  revalidatePath('/', 'layout')
}
