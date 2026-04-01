'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  if (!name || name.trim() === '') {
     throw new Error("Workspace name is required")
  }

  // Insert workspace
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert([{ name: name.trim() }])
    .select('id')
    .single()

  if (wsError || !workspace) {
    console.error("Error creating workspace:", wsError)
    throw new Error("Could not create workspace")
  }

  // Insert member role
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert([{ workspace_id: workspace.id, user_id: user.id, role: 'owner' }])

  if (memberError) {
    console.error("Error creating workspace member:", memberError)
    throw new Error("Could not set workspace owner")
  }

  // Redirect to new workspace
  redirect(`/workspaces/${workspace.id}`)
}
