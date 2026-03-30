'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addContact(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const workspaceId = formData.get('workspaceId') as string

  if (!email || !workspaceId) {
    return { error: 'Missing required fields' }
  }

  const { error } = await supabase
    .from('contacts')
    .insert([{ 
      workspace_id: workspaceId, 
      email, 
      first_name: firstName || null, 
      last_name: lastName || null 
    }])

  if (error) {
    console.error('Error inserting contact:', error)
  }

  revalidatePath('/')
}

export async function deleteContact(formData: FormData) {
  const supabase = await createClient()
  const contactId = formData.get('contactId') as string

  if (contactId) {
    await supabase.from('contacts').delete().eq('id', contactId)
  }
  
  revalidatePath('/')
}
