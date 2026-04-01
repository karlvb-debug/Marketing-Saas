'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveThemeConfig(
  id: string,
  payload: {
    theme_json: any
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('email_templates')
    .update({
      theme_json: payload.theme_json
    })
    .eq('id', id)

  if (error) {
    console.error("Save theme error:", error)
    throw new Error('Failed to save theme')
  }

  revalidatePath('/', 'layout')
}

export async function updateCampaignTemplate(
  campaignId: string,
  templateId: string | null
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('campaigns')
    .update({ template_id: templateId })
    .eq('id', campaignId)

  if (error) {
    throw new Error('Failed to attach template')
  }
  revalidatePath('/', 'layout')
}
