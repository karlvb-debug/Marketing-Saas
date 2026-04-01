export default function SMSPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh]">
      <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">SMS Campaigns</h1>
      <p className="text-gray-500 text-center max-w-md text-lg">Coming soon. We are currently integrating with Twilio to bring you robust SMS messaging.</p>
      
      <div className="mt-8">
         <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 shadow-sm">
           In Development
         </span>
      </div>
    </div>
  )
}
