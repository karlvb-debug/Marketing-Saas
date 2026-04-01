export default function InboxPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh]">
      <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Unified Inbox</h1>
      <p className="text-gray-500 text-center max-w-md text-lg">Coming soon. You will be able to manage all incoming customer replies from Email and SMS campaigns here.</p>
      
      <div className="mt-8">
         <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 shadow-sm">
           In Development
         </span>
      </div>
    </div>
  )
}
