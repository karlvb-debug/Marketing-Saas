export default function SchedulerPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh]">
      <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Campaign Scheduler</h1>
      <p className="text-gray-500 text-center max-w-md text-lg">Coming soon. You will be able to schedule, delay, and automate your outbound campaigns here.</p>
      
      <div className="mt-8">
         <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 shadow-sm">
           In Development
         </span>
      </div>
    </div>
  )
}
