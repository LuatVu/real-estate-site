import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Property Not Found',
  description: 'The requested property could not be found.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Property Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the property you're looking for. It may have been sold, removed, or the link might be incorrect.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-3">What can you do?</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check the URL for any typos</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Browse our latest properties</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use our search feature to find similar properties</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/posts"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse All Properties
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}