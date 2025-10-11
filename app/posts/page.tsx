import { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '../api/auth/[...nextauth]/options';
import PostsClient from './posts-client';
import { ErrorBoundary } from './error-boundary';
import { PerformanceMonitor } from './performance-monitor';
import { notFound } from 'next/navigation';

// Types
interface Post {
  postId: string;
  title: string;
  description?: string;
  address: string;
  price: number;
  acreage: number;
  images?: Array<{ fileUrl: string; isPrimary?: boolean }>;
}

interface PostsData {
  posts: Post[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  searchRequest: SearchRequest;
}

interface SearchRequest {
  minPrice?: number;
  maxPrice?: number;
  minAcreage?: number;
  maxAcreage?: number;
  typeCode?: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  tab: string;
  districts?: string[];
  propertyTypes?: string[];
  city?: string;
  priceRange?: string;
  acreageRange?: string;
  query: string;
}

// SEO Metadata for the posts page
export async function generateMetadata({ searchParams }: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}): Promise<Metadata> {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const city = params.city as string;
  const propertyType = params.propertyType as string;
  const tab = params.tab as string;
  
  // Build dynamic title based on search parameters
  let title = 'Bất động sản';
  let description = 'Tìm kiếm và khám phá hàng ngàn tin đăng bất động sản chất lượng';
  
  if (tab === 'RENT') {
    title = 'Cho thuê bất động sản';
    description = 'Tìm kiếm bất động sản cho thuê chất lượng';
  } else if (tab === 'BUY') {
    title = 'Mua bán bất động sản';
    description = 'Tìm kiếm bất động sản mua bán uy tín';
  }
  
  if (city) {
    title += ` tại ${city}`;
    description += ` tại ${city}`;
  }
  
  if (propertyType) {
    title += ` - ${propertyType}`;
    description += ` - ${propertyType}`;
  }
  
  if (page > 1) {
    title += ` - Trang ${page}`;
    description += ` - Trang ${page}`;
  }
  
  title += ' | Nhà đẹp quá';
  
  const canonicalUrl = new URL('/posts', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  if (Object.keys(params).length > 0) {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, String(value));
    });
    canonicalUrl.search = urlParams.toString();
  }
  
  return {
    title,
    description,
    keywords: [
      'bất động sản',
      'nhà đất',
      'căn hộ',
      'mua bán nhà',
      'cho thuê nhà',
      city,
      propertyType,
      'real estate Vietnam'
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
      url: canonicalUrl.toString(),
      siteName: 'Nhà đẹp quá - Bất động sản',
      images: [
        {
          url: '/temp/og-posts.jpg',
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/temp/og-posts.jpg'],
    },
    alternates: {
      canonical: canonicalUrl.toString(),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Server-side data fetching with improved error handling and validation
async function fetchPostsData(searchParams: { [key: string]: string | string[] | undefined }): Promise<PostsData> {
  try {
    const page = searchParams.page ? Number(searchParams.page) : 1;
    
    // Validate page number
    if (page < 1 || page > 1000) {
      notFound();
    }
    
    // Build search request from URL parameters with validation
    const searchRequest: SearchRequest = {
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      minAcreage: searchParams.minAcreage ? Number(searchParams.minAcreage) : undefined,
      maxAcreage: searchParams.maxAcreage ? Number(searchParams.maxAcreage) : undefined,
      typeCode: searchParams.typeCode as string,
      provinceCode: searchParams.provinceCode as string,
      districtCode: searchParams.districtCode as string,
      wardCode: searchParams.wardCode as string,
      tab: (searchParams.tab as string) || "BUY",
      districts: searchParams.districts ? String(searchParams.districts).split(',') : undefined,
      propertyTypes: searchParams.propertyTypes ? String(searchParams.propertyTypes).split(',') : undefined,
      city: searchParams.city as string,
      priceRange: searchParams.priceRange as string,
      acreageRange: searchParams.acreageRange as string,
      query: (searchParams.query as string) || ""
    };

    // Validate tab parameter
    if (searchRequest.tab && !['BUY', 'RENT'].includes(searchRequest.tab)) {
      searchRequest.tab = 'BUY';
    }

    const baseUrl = process.env.SPRING_API || 'http://localhost:8080';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${baseUrl}/api/public/search-post?page=${page - 1}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchRequest),
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      return {
        posts: Array.isArray(data.content) ? data.content : [],
        totalElements: typeof data.totalElements === 'number' ? data.totalElements : 0,
        totalPages: typeof data.totalPages === 'number' ? data.totalPages : 0,
        currentPage: page,
        searchRequest
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return empty data structure as fallback
    const fallbackSearchRequest: SearchRequest = {
      minPrice: undefined, 
      maxPrice: undefined,
      minAcreage: undefined, 
      maxAcreage: undefined, 
      typeCode: undefined, 
      provinceCode: undefined,
      districtCode: undefined, 
      wardCode: undefined, 
      tab: "BUY", 
      districts: undefined, 
      propertyTypes: undefined,
      city: undefined, 
      priceRange: undefined, 
      acreageRange: undefined, 
      query: ""
    };

    return {
      posts: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
      searchRequest: fallbackSearchRequest
    };
  }
}

// Main server component
export default async function Posts({ searchParams }: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const postsData = await fetchPostsData(params);

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Bất động sản - Nhà đẹp quá",
    "description": "Tìm kiếm và khám phá hàng ngàn tin đăng bất động sản chất lượng",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/posts`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": postsData.totalElements,
      "itemListElement": postsData.posts.slice(0, 10).map((post: Post, index: number) => ({
        "@type": "RealEstateListing",
        "position": index + 1,
        "name": post.title,
        "description": post.description || post.title,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/post/${post.postId}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": post.address
        },
        "offers": {
          "@type": "Offer",
          "price": post.price,
          "priceCurrency": "VND"
        },
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": post.acreage,
          "unitCode": "MTK"
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": process.env.NEXT_PUBLIC_BASE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Bất động sản",
          "item": `${process.env.NEXT_PUBLIC_BASE_URL}/posts`
        }
      ]
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Preconnect to external domains for better performance */}
      <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'} />
      <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'} />
      
      {/* Main content with Error Boundary and Suspense */}
      <ErrorBoundary>
        <Suspense fallback={<PostsLoadingSkeleton />}>
          <PostsClient 
            initialData={postsData}
            session={session ?? {}}
            searchParams={params}
          />
        </Suspense>
      </ErrorBoundary>
      
      {/* Performance monitoring (only in production) */}
      <PerformanceMonitor />
    </>
  );
}

// Loading skeleton component for better UX
function PostsLoadingSkeleton() {
  return (
    <div className="h-full min-h-screen bg-white">
      {/* Navigation skeleton */}
      <div className="h-16 bg-gray-100 border-b">
        <div className="animate-pulse flex items-center justify-between px-4 h-full">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Search section skeleton */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg mb-3"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Posts grid skeleton */}
      <div className="p-4">
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="animate-pulse">
                {/* Image grid skeleton */}
                <div className="grid grid-cols-2 gap-1 h-40">
                  <div className="bg-gray-200"></div>
                  <div className="grid gap-1">
                    <div className="bg-gray-200 h-1/2"></div>
                    <div className="bg-gray-200 h-1/2"></div>
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="p-3 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination skeleton */}
        <div className="flex justify-center mt-8">
          <div className="animate-pulse flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer sections skeleton */}
      <div className="mt-8 space-y-8">
        <div className="p-4 bg-gray-50">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="animate-pulse text-center space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="flex justify-center space-x-4">
              <div className="h-12 w-32 bg-gray-200 rounded"></div>
              <div className="h-12 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

