'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Posts page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Có lỗi xảy ra
          </h1>
          <p className="text-gray-600 mb-8">
            Xin lỗi, đã có lỗi xảy ra khi tải danh sách bất động sản. 
            Vui lòng thử lại hoặc quay về trang chủ.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Chi tiết lỗi (chỉ hiển thị trong môi trường phát triển)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-800 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Thử lại
          </button>
          
          <Link
            href="/posts"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Tải lại trang
          </Link>
          
          <Link
            href="/"
            className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Về trang chủ
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Nếu lỗi vẫn tiếp tục, vui lòng liên hệ hỗ trợ
          </p>
          <div className="text-sm text-gray-400">
            Mã lỗi: {error.digest || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}