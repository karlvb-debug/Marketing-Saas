import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { EmailSectionClient } from './client'

export const dynamic = 'force-dynamic'

export default async function EmailPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>
}) {
  const { workspaceId } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch folders and items
  const [foldersRes, campaignsRes, templatesRes] = await Promise.all([
    supabase.from('folders').select('*').eq('workspace_id', workspaceId),
    supabase.from('campaigns').select('*').eq('workspace_id', workspaceId).eq('type', 'email'),
    supabase.from('email_templates').select('*').eq('workspace_id', workspaceId)
  ])

  console.log("SERVER FETCHED TEMPLATES:", JSON.stringify(templatesRes.data, null, 2))

  return (
    <div className="flex h-full w-full bg-[#f9fafa]">
      <EmailSectionClient 
        workspaceId={workspaceId}
        initialFolders={foldersRes.data || []}
        initialCampaigns={campaignsRes.data || []}
        initialTemplates={templatesRes.data || []}
      />
    </div>
  )
}
