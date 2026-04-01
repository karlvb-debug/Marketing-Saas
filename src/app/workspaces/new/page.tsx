import { createWorkspace } from '@/app/actions/workspaces'
import Link from 'next/link'

export default function NewWorkspacePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafc] p-6 text-gray-900 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center bg-gray-50/50 border-b border-gray-100">
           <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Workspace</h1>
           <p className="text-gray-500 text-sm mt-2">Start a new project or brand within your account.</p>
        </div>
        
        <form action={createWorkspace} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Workspace Name</label>
            <input 
              name="name" 
              required 
              autoFocus
              className="w-full flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-gray-900 shadow-sm"
              placeholder="e.g. Acme Corp Marketing" 
            />
          </div>
          
          <div className="pt-2 flex flex-col space-y-3">
             <button type="submit" className="w-full flex justify-center items-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/20">
               Create Workspace
             </button>
             <Link href="/" className="w-full text-center py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
               Cancel
             </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
