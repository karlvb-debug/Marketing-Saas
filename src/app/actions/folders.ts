'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFolder(workspaceId: string, name: string, featureType: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('folders').insert([{ 
    workspace_id: workspaceId, 
    name, 
    feature_type: featureType 
  }])
  if (error) console.error("Create folder error:", error)
  revalidatePath('/', 'layout')
}

export async function moveItem(table: string, itemId: string, folderId: string | null) {
  const supabase = await createClient()
  const { error } = await supabase.from(table).update({ folder_id: folderId }).eq('id', itemId)
  if (error) console.error(`Move item error (${table}):`, error)
  revalidatePath('/', 'layout')
}

// For creating placeholders for builder/templates quickly
export async function createDraft(workspaceId: string, table: string, folderId: string | null = null, name: string = 'Untitled') {
  const supabase = await createClient()
  const payload: any = { workspace_id: workspaceId, folder_id: folderId, name: name }
  
  if (table === 'campaigns') {
    payload.type = 'email'
    payload.content = ''
  }
  
  const { error } = await supabase.from(table).insert([payload])
  if (error) console.error(`Create draft error (${table}):`, error)
  revalidatePath('/', 'layout')
}

export async function deleteFolder(folderId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('folders').delete().eq('id', folderId)
  if (error) console.error(`Delete folder error:`, error)
  revalidatePath('/', 'layout')
}

export async function deleteItem(table: string, itemId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from(table).delete().eq('id', itemId)
  if (error) console.error(`Delete item error (${table}):`, error)
  revalidatePath('/', 'layout')
}
