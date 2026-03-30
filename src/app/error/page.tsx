export default function ErrorPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center rounded-xl border bg-white p-8 shadow-sm max-w-sm w-full">
         <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
         <p className="text-gray-600">Sorry, something went wrong logging you in. Please check your credentials or try again.</p>
         <a href="/login" className="mt-6 inline-block w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
          Return to login
         </a>
      </div>
    </div>
  )
}
