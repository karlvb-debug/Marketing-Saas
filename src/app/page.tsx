import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function IndexPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the primary workspace where this user is a member
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(name)')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!membership) {
    return (
      <div className="flex min-h-screen items-center justify-center p-10 bg-black text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <h1 className="text-xl font-medium tracking-tight">Initializing your workspace...</h1>
          <p className="text-sm text-gray-400">Please wait while we set things up.</p>
        </div>
      </div>
    )
  }

  // Redirect to their workspace dashboard
  redirect(`/workspaces/${membership.workspace_id}`)
}
