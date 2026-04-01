import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function WorkspaceDashboard({
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

  // Fetch the workspace to ensure it exists and get its name
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name')
    .eq('id', workspaceId)
    .single()

  if (!workspace) {
    return <div className="p-10 font-mono text-red-500">Workspace not found</div>
  }

  // Fetch stats concurrently
  const [contactsRes, campaignsRes] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('workspace_id', workspaceId)
  ])

  const contactsCount = contactsRes.count || 0
  const campaignsCount = campaignsRes.count || 0

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{workspace.name} Dashboard</h1>
        <p className="text-gray-500 mt-1">Here is a quick overview of your audience and outreach.</p>
      </div>

      {/* Top Stat Blocks */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="tracking-tight text-sm font-semibold text-gray-500 uppercase">Total Contacts</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">{contactsCount}</p>
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <h3 className="tracking-tight text-sm font-semibold text-gray-500 uppercase">Campaigns Sent</h3>
              <p className="text-4xl font-bold mt-2 text-gray-900">{campaignsCount}</p>
          </div>
          
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors sm:hidden lg:block">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="tracking-tight text-sm font-semibold text-gray-500 uppercase">Account Status</h3>
              <p className="text-4xl font-bold mt-2 text-green-600 flex items-center">
                 <span className="h-5 w-5 bg-green-500 rounded-full mr-3 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></span> Active
              </p>
          </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-96 items-center justify-center p-8 text-center bg-gradient-to-br from-white to-gray-50">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to SendSphere Flow</h2>
        <p className="text-gray-500 max-w-md">
           Your workspace is ready. Use the navigation on the left to manage your contacts, design beautiful email campaigns, and start growing your business.
        </p>
      </div>
    </div>
  )
}
