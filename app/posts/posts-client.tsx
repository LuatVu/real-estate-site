"use client";
import styles from './index.module.css';
import useScreenSize from '../lib/useScreenSize';
import { useState, useCallback, useEffect, useRef } from 'react';
import FilterPopup from '../ui/common/popup-filter/filter-popup';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import Image from 'next/image';
import Link from 'next/link';
import MbFooter from '../ui/mobile/footer/mb.footer';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchingSector from '../ui/mobile/searching-sector/searching.sector';
import ExtraInfo from '../ui/mobile/extra-info/mb.extra.info';
import DownloadApp from '../ui/mobile/download-app/mb.download';
import { Suspense } from 'react';
import Pagination from '../ui/mobile/pagination/pagination';
import { calculatePagination } from '../utils/pagination';
import { usePagination } from '../hook/usePagination';
import { PaginationData } from '../types/pagination';
import { extractSearchRequest } from '../utils/transform.param';
import { formatPrice } from '../utils/price-formatter';

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

interface PostsClientProps {
  initialData: {
    posts: Post[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    searchRequest: SearchRequest;
  };
  session?: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PostsClient({ initialData, session, searchParams }: PostsClientProps) {
  const screenSize = useScreenSize();
  
  return (
    <div className="h-full">
      {screenSize === 'sm' ? (
        <PostsOnMobile 
          session={session} 
          initialData={initialData}
          searchParams={searchParams}
        />
      ) : (
        <PostOnDesktop 
          session={session} 
          initialData={initialData}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}

function PostsOnMobile({ 
  session, 
  initialData, 
  searchParams 
}: { 
  session?: PostsClientProps['session']; 
  initialData: PostsClientProps['initialData'];
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [posts, setPosts] = useState(initialData.posts);
  const [filterPopup, setFilterPopup] = useState(false);
  const [homePageVisible, setHomePageVisible] = useState(true);
  const [searchRequest, setSearchRequest] = useState(initialData.searchRequest);
  const [filterNum, setFilterNum] = useState(0);    
  const [pagination, setPagination] = useState<PaginationData>();
  const { currentPage } = usePagination();
  const [loading, setLoading] = useState(false);


  
  // Track previous URL params to detect changes
  const prevUrlParamsRef = useRef<string>('');
  const isInitialMount = useRef(true);

  // Initialize pagination on mount
  useEffect(() => {
    const pagi = calculatePagination(initialData.totalElements, 10, initialData.currentPage);
    setPagination(pagi);
  }, [initialData]);

  // Initialize URL tracking after first render
  useEffect(() => {
    // Set initial URL params on mount
    if (isInitialMount.current) {
      prevUrlParamsRef.current = urlSearchParams.toString();
      isInitialMount.current = false;
    }
  }, [urlSearchParams]);

  // Fetch when URL search params change (skip initial mount)
  useEffect(() => {
    const currentParams = urlSearchParams.toString();
            
    // Only fetch if not initial mount and params have changed
    if (!isInitialMount.current && currentParams !== prevUrlParamsRef.current) {      
      
      // Fetch posts with updated parameters
      (async () => {
        try {
          setLoading(true);
          const body = extractSearchRequest(urlSearchParams);            
          const page = parseInt(urlSearchParams.get("page") || "1", 10);                
          
          const response = await fetch(`/api/posts?page=${page}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const searchResults = await response.json();                    
          
          setPosts(searchResults.content || []);            
          const pagi = calculatePagination(searchResults.totalElements, 10, page);
          setPagination(pagi);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      })();
    }
    
    // Update previous params
    prevUrlParamsRef.current = currentParams;
  }, [urlSearchParams]);

  const setFilterParam = (data: Partial<SearchRequest>) => {
    const updatedSearchRequest: SearchRequest = {
      ...searchRequest, 
      minPrice: data.minPrice, 
      maxPrice: data.maxPrice,
      minAcreage: data.minAcreage, 
      maxAcreage: data.maxAcreage,
      typeCode: data.typeCode, 
      provinceCode: data.provinceCode,
      districtCode: data.districtCode, 
      wardCode: data.wardCode, 
      tab: data.tab || searchRequest.tab,
      districts: data.districts, 
      propertyTypes: data.propertyTypes, 
      city: data.city,
      priceRange: data.priceRange, 
      acreageRange: data.acreageRange,
      query: searchRequest.query
    };
    setSearchRequest(updatedSearchRequest);
    const numFilter = countParamNum(updatedSearchRequest);
    setFilterNum(numFilter);

    // Update URL with new search parameters
    const newParams = new URLSearchParams();
    Object.entries(updatedSearchRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          newParams.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          newParams.set(key, String(value));
        }
      }
    });
    
    router.push(`/posts?${newParams.toString()}`);
  }

  const countParamNum = (searchRequest: SearchRequest) => {
    let count: number = 0;
    const relevantKeys: (keyof SearchRequest)[] = ['acreageRange', 'districts', 'priceRange', 'propertyTypes', 'tab'];
    
    relevantKeys.forEach(key => {
      const value = searchRequest[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          count += 1;
        }
      } else if (value !== undefined && value !== null && value !== '') {
        count += 1;
      }
    });
    
    return count;
  }

  const isReleventKey = (key: string) => {
    let result: boolean = false;
    switch (key) {
      case "acreageRange": ;
      case "districts": ;
      case "priceRange": ;
      case "propertyTypes": ;
      case "tab": result = true; break;
      default: result = false;
    }
    return result;
  }    

  const closeFilterPopup = useCallback(() => {
    setFilterPopup(false);
    setHomePageVisible(true);
  }, []);

  const openFilterPopup = useCallback(() => {
    setFilterPopup(true);
    setHomePageVisible(false);
  }, []);

  return (
    <div className='h-full'>
      {filterPopup && (
        <FilterPopup 
          onClose={closeFilterPopup} 
          setFilterParam={setFilterParam} 
          filterParam={searchRequest} 
        />
      )}
      {homePageVisible && (
        <div className={styles.homePage}>
          <NavBarMobile displayNav={false} session={session} />
          <SearchingSector 
            searchRequest={searchRequest} 
            openFilterPopup={openFilterPopup} 
            filterNum={filterNum} 
          />
          <div className={styles.firstMainContent}>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <div className={styles.postParent}>
              {posts.map((element: Post, index: number) => {
                const allImages = element?.images || [];
                const primaryImage = allImages.find((img: any) => img.isPrimary) || allImages[0];
                const otherImages = allImages.filter((img: any) => img !== primaryImage);
                const displayImages = [primaryImage, ...otherImages].filter(Boolean).slice(0, 4);
                const hasMoreImages = allImages.length > 4;
                
                return (
                  <Link 
                    href={`/post/${element.postId}`} 
                    className={styles.post} 
                    key={element.postId || index}
                    prefetch={index < 3} // Prefetch first 3 posts for better performance
                  >
                    <div className={`${styles.imageGrid} ${styles[`grid${displayImages.length}Images`]}`}>
                      {displayImages.map((image: { fileUrl: string; isPrimary?: boolean }, imgIndex: number) => (
                        <div key={imgIndex} className={styles.imageContainer}>
                          <Image 
                            className={styles.postImage} 
                            width={174} 
                            height={178} 
                            alt={`${element.title} - Hình ${imgIndex + 1}`}
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${image?.fileUrl}`} 
                            loading={index < 3 ? "eager" : "lazy"}
                            quality={index < 3 ? 85 : 75}
                            sizes="(max-width: 768px) 174px, 200px"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX6LR2ycJT2v8AhX//2Q=="
                          />
                          {imgIndex === displayImages.length - 1 && hasMoreImages && (
                            <div className={styles.imageCountOverlay}>
                              <Image 
                                className={styles.imageIcon} 
                                width={16} 
                                height={16} 
                                alt="Image count" 
                                src="/icons/imageIcon.svg" 
                              />
                              <span className={styles.imageCount}>{allImages.length}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className={styles.bnNh2TngWrapper}>
                      <h3 className={styles.filter}>{element.title}</h3>
                    </div>
                    <div className={styles.t130m2Wrapper}>
                      <div className={styles.filter}>
                        {formatPrice(element.price)} - {element.acreage} m²
                      </div>
                    </div>
                    <div className={styles.vectorParent}>
                      <Image 
                        className={styles.vectorIcon} 
                        width={11} 
                        height={13} 
                        alt="Location" 
                        src="/icons/location.svg" 
                      />
                      <div className={styles.filter}>{element.address}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {posts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy bất động sản phù hợp</p>
                <p className="text-gray-400 text-sm mt-2">Thử thay đổi bộ lọc để xem thêm kết quả</p>
              </div>
            )}
          </div>
          
          <Suspense fallback={<div>Loading pagination...</div>}>
            <Pagination 
              currentPage={pagination?.currentPage || 0} 
              totalPages={pagination?.totalPages || 0} 
              className='mt-8'
            />
          </Suspense>
          <ExtraInfo />
          <DownloadApp />
          <MbFooter />
        </div>
      )}
    </div>
  );
}

function PostOnDesktop({ 
  session, 
  initialData,
  searchParams 
}: { 
  session?: PostsClientProps['session']; 
  initialData: PostsClientProps['initialData'];
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bất động sản (Desktop)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {initialData.posts.map((post: Post, index: number) => (
          <Link 
            key={post.postId || index}
            href={`/post/${post.postId}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {post.images && post.images.length > 0 && (
              <div className="relative h-48">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${post.images[0]?.fileUrl}`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-green-600 font-bold mb-1">
                {formatPrice(post.price)} - {post.acreage} m²
              </p>
              <p className="text-gray-600 text-sm line-clamp-1">{post.address}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {initialData.posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy bất động sản phù hợp</p>
        </div>
      )}
    </div>
  );
}