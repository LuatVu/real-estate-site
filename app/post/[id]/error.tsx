'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Property page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600">
            We encountered an error while loading this property. This could be due to:
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• The property may have been removed</li>
            <li>• Network connectivity issues</li>
            <li>• Temporary server problems</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <Link
            href="/posts"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse All Properties
          </Link>
          
          <Link
            href="/"
            className="block w-full text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs bg-red-50 p-3 rounded border overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}