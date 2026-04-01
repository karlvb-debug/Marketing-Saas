import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ workspaceId: string }>
}) {
  const { workspaceId } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all workspaces the current user has access to
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(name)')
    .eq('user_id', user.id)

  if (!memberships || memberships.length === 0) {
    // Highly unusual state: user has no workspaces
    return <div className="p-10 text-xl font-mono text-red-500">Error: No workspaces found.</div>
  }

  const workspaces = memberships
    .map(m => ({
      id: m.workspace_id,
      name: (m.workspaces as any)?.name || 'Unknown Workspace'
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // Validate that the user actually has access to the *currently requested* workspaceId
  const currentMembership = memberships.find(m => m.workspace_id === workspaceId)
  if (!currentMembership) {
    // Redirect to the first one they do have access to
    redirect(`/workspaces/${workspaces[0].id}`)
  }

  return (
    <div className="flex h-screen bg-[#fafafc] overflow-hidden text-gray-900 font-sans">
      <Sidebar 
        workspaces={workspaces} 
        currentWorkspaceId={workspaceId} 
        userEmail={user.email || ""}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
