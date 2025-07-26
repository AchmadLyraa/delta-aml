"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("BPK Page Error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            There was an error loading the BPK module. This might be a temporary issue.
          </p>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Try Again
            </button>

            <a
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              ← Back to PPATK Module
            </a>
          </div>

          {error.digest && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500">Error ID: {error.digest}</div>
          )}
        </div>
      </div>
    </div>
  )
}
