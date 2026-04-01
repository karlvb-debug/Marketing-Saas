import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { addContact, deleteContact } from '@/app/actions/contacts'

export default async function ContactsPage({
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

  const { data: contactsData } = await supabase
    .from('contacts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  const contacts = contactsData || []

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Audience List</h1>
        <p className="text-gray-500 mt-1">Manage and grow your subscribers. Add new emails and clean your lists.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col min-h-[600px] overflow-hidden">
        {/* Header / Add Form */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Active Subscribers ({contacts.length})</h2>
          </div>
          
          <form action={addContact} className="flex space-x-2 w-full md:w-auto">
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="new_user@example.com" 
              className="w-full md:w-64 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all" 
            />
            <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 whitespace-nowrap">
              Add Contact
            </button>
          </form>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-auto bg-white relative">
           {contacts.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-16 h-full text-center absolute inset-0">
                <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No contacts yet</h3>
                <p className="text-gray-500 text-sm max-w-sm">Grow your audience by adding an email address using the form above.</p>
             </div>
           ) : (
             <ul className="divide-y divide-gray-100">
               {contacts.map((c) => (
                 <li key={c.id} className="p-5 flex justify-between items-center bg-white hover:bg-gray-50/80 transition-colors group">
                   <div className="flex items-center space-x-4">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center font-bold text-indigo-600 shadow-sm border border-indigo-100/50 uppercase">
                       {c.email[0]}
                     </div>
                     <div>
                       <span className="text-sm font-semibold text-gray-900 block">{c.email}</span>
                       <span className="text-xs text-gray-500 mt-0.5 block">Added {new Date(c.created_at).toLocaleDateString()}</span>
                     </div>
                   </div>
                   <form action={deleteContact}>
                     <input type="hidden" name="contactId" value={c.id} />
                     <button className="text-xs font-semibold text-red-600 hover:text-white hover:bg-red-500 border border-transparent hover:border-red-600 px-3 py-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                       Remove
                     </button>
                   </form>
                 </li>
               ))}
             </ul>
           )}
        </div>
      </div>
    </div>
  )
}
