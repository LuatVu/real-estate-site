import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Không tìm thấy trang | Nhà đẹp quá',
  description: 'Trang bạn đang tìm kiếm không tồn tại. Quay lại trang chủ để khám phá các bất động sản mới nhất.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Không tìm thấy trang
          </h2>
          <p className="text-gray-600 mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. 
            Hãy kiểm tra lại URL hoặc quay về trang chủ.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/posts"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Xem tất cả bất động sản
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Về trang chủ
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Hoặc bạn có thể tìm kiếm bất động sản theo:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              href="/posts?city=HaNoi"
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              Hà Nội
            </Link>
            <Link
              href="/posts?city=HoChiMinh"
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              TP.HCM
            </Link>
            <Link
              href="/posts?city=DaNang"
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              Đà Nẵng
            </Link>
            <Link
              href="/posts?tab=RENT"
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
            >
              Cho thuê
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}