import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { addContact, deleteContact } from './actions/contacts'
import { sendCampaign } from './actions/campaigns'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the primary workspace where this user is an admin/owner
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(name)')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!membership) {
    return (
      <div className="flex min-h-screen items-center justify-center p-10 bg-gray-50">
        <h1 className="text-xl text-gray-600 font-medium tracking-tight">Your workspace is being generated... Please refresh.</h1>
      </div>
    )
  }

  const workspaceId = membership.workspace_id
  const workspaceName = (membership.workspaces as any)?.name || 'My Workspace'

  // Fetch lists concurrently
  const [contactsRes, campaignsRes] = await Promise.all([
    supabase.from('contacts').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false }),
    supabase.from('campaigns').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false })
  ])

  const contacts = contactsRes.data || []
  const campaigns = campaignsRes.data || []

  // Sign out server action
  const signout = async () => {
    'use server'
    const supabaseClient = await createClient()
    await supabaseClient.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex font-bold text-xl tracking-tight text-gray-900">
              {workspaceName} <span className="text-xs ml-2 px-2 py-1 bg-black text-white rounded-full">SaaS MVP</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hidden sm:block">
                {user.email}
              </span>
              <form action={signout}>
                <button className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Stat Blocks */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="rounded-xl border bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="tracking-tight text-sm font-medium text-gray-500">Total Contacts</h3>
                <p className="text-3xl font-bold mt-2 text-gray-900">{contacts.length}</p>
            </div>
            <div className="rounded-xl border bg-white shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="tracking-tight text-sm font-medium text-gray-500">Total Emails Sent</h3>
                <p className="text-3xl font-bold mt-2 text-gray-900">{campaigns.length}</p>
            </div>
            <div className="rounded-xl border bg-white shadow-sm p-6 hover:shadow-md transition-shadow sm:hidden lg:block">
                <h3 className="tracking-tight text-sm font-medium text-gray-500">Account Status</h3>
                <p className="text-3xl font-bold mt-2 text-green-600 flex items-center">
                   <span className="h-4 w-4 bg-green-500 rounded-full mr-2"></span> Active
                </p>
            </div>
        </div>

        {/* Work Area Grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Contacts Viewer (Left Column) */}
          <div className="rounded-xl border bg-white shadow-sm flex flex-col h-[550px] lg:col-span-2 overflow-hidden">
            <div className="p-6 border-b bg-gray-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900">Audience List</h2>
              <p className="text-xs text-gray-500 mt-1">Manage all subscribers for this brand.</p>
            </div>
            
            <div className="p-4 border-b bg-white">
               <form action={addContact} className="flex space-x-2">
                 <input type="hidden" name="workspaceId" value={workspaceId} />
                 <input 
                   name="email" 
                   type="email" 
                   required 
                   placeholder="new_user@example.com" 
                   className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black" 
                 />
                 <button className="rounded-md bg-gray-100 border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-200 transition-colors">
                   Add
                 </button>
               </form>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/50">
               {contacts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-12 h-full text-center">
                    <p className="text-gray-500 text-sm pb-2">Your list is currently empty.</p>
                    <p className="text-gray-400 text-xs">Add an email above to get started.</p>
                 </div>
               ) : (
                 <ul className="divide-y divide-gray-100">
                   {contacts.map((c) => (
                     <li key={c.id} className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                       <span className="text-sm font-medium text-gray-700">{c.email}</span>
                       <form action={deleteContact}>
                         <input type="hidden" name="contactId" value={c.id} />
                         <button className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-md transition-colors">
                           Remove
                         </button>
                       </form>
                     </li>
                   ))}
                 </ul>
               )}
            </div>
          </div>

          {/* Email Composer (Right Column) */}
          <div className="rounded-xl border bg-white shadow-sm flex flex-col h-[550px] lg:col-span-3">
             <div className="p-6 border-b bg-white rounded-t-xl">
               <h2 className="text-lg font-bold text-gray-900">Compose New Campaign</h2>
               <p className="text-xs text-gray-500 mt-1">Blast a new message to all contacts via Resend API.</p>
             </div>
             
             <form action={sendCampaign} className="flex flex-col flex-1 p-6 space-y-5 bg-gray-50/30">
               <input type="hidden" name="workspaceId" value={workspaceId} />
               
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Line</label>
                 <input 
                   name="subject" 
                   required 
                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm" 
                   placeholder="Super Huge Sale This Friday!" 
                 />
               </div>
               
               <div className="flex-1 flex flex-col min-h-0">
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Email Body</label>
                 <textarea 
                   name="content" 
                   required 
                   className="w-full flex-1 rounded-md border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 shadow-sm resize-none h-full font-mono text-gray-800" 
                   placeholder="Write your email content here. HTML is supported."></textarea>
               </div>
               
               <button 
                 disabled={contacts.length === 0}
                 className="w-full rounded-md bg-black px-4 py-3.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wider"
               >
                 {contacts.length === 0 ? "Add contacts to send" : `Blast to ${contacts.length} Contact${contacts.length > 1 ? 's' : ''}`}
               </button>
             </form>
          </div>
          
        </div>
      </main>
    </div>
  )
}
