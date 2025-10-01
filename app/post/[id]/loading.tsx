import styles from './index.module.css'

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className={styles.rootContainer}>
        {/* Header Loading Skeleton */}
        <div className="h-16 bg-gray-200 animate-pulse mb-4"></div>
        
        {/* Image Gallery Loading Skeleton */}
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
        
        {/* Content Loading Skeleton */}
        <div className="px-4 space-y-6">
          {/* Title and Address */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
          
          {/* Property Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
          
          {/* Description */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Loading */}
      <div className="h-20 bg-gray-200 animate-pulse mt-auto"></div>
    </div>
  )
}