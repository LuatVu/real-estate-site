"use client";
import Image from 'next/image';
import Link from 'next/link';
import useScreenSize from '../lib/useScreenSize';
import { useState, useCallback, useEffect, useRef } from 'react';
import { PaginationData } from '../types/pagination';
import FilterPopup from '../ui/common/popup-filter/filter-popup';
import { countParamNum } from '../utils/search-utils';
import styles from './result-search-landing-page.module.css';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import NavBarDesktop from '../ui/desktop/navigation/nav-bar-desktop';
import MbFooter from '../ui/mobile/footer/mb.footer';
import DesktopFooter from '../ui/desktop/footer/desktop-footer';
import SearchingSector from '../ui/mobile/searching-sector/searching.sector';
import { Suspense } from 'react';
import Pagination from '../ui/mobile/pagination/pagination';
import { calculatePagination } from '../utils/pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import { extractSearchRequest } from '../utils/transform.param';
import SearchingSectorDesktop from '../ui/desktop/searching-sector/searching-sector-desktop';

interface LandingPage {
    id: string;
    title: string;
    address: string;
    sections?: Array<{
        id: string;
        type: string;
        order: string;
        content: {
            text?: string;
            imageUrl?: string;
            imageAlt?: string;
        }
    }>;
}

interface SearchRequest {
    query: string;
    transactionType?: string;
}

interface LandingPageProps {
    initialData: {
        landingPages: LandingPage[];
        totalElements: number;
        totalPages: number;
        currentPage: number;
        searchRequest: SearchRequest;
    };
    session: {
        user?: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    } | null;
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function ResultSearchLandingPageClient({ initialData, session, searchParams }: LandingPageProps) {
    const screenSize = useScreenSize();
    return (
        <div className='h-full'>
            {(screenSize === 'sm' || screenSize === 'md') ? (
                <ResultSearchOnMobile
                    session={session}
                    initialData={initialData}
                    searchParams={searchParams}
                />
            ) : (
                <ResultSearchOnDesktop
                    session={session}
                    initialData={initialData}
                    searchParams={searchParams}
                />
            )}
        </div>
    );
}

function ResultSearchOnMobile({ session,
    initialData,
    searchParams }: LandingPageProps) {
    const router = useRouter();
    const urlSearchParams = useSearchParams();
    const [landingPages, setLandingPages] = useState<LandingPage[]>(initialData.landingPages);
    const [filterPopup, setFilterPopup] = useState(false);
    const [homePageVisible, setHomePageVisible] = useState(true);
    const [searchRequest, setSearchRequest] = useState(initialData.searchRequest);
    const [filterNum, setFilterNum] = useState(1);
    const [pagination, setPagination] = useState<PaginationData>();
    const [loading, setLoading] = useState(false);

    // Track previous URL params to detect changes
    const prevUrlParamsRef = useRef<string>('');
    const isInitialMount = useRef(true);

    // Initialize pagination on mount
    useEffect(() => {
        const pagi = calculatePagination(initialData.totalElements, 10, initialData.currentPage);
        setPagination(pagi);
    }, [initialData]);

    // Calculate filterNum on first render based on initial search request
    useEffect(() => {
        const initialFilterNum = countParamNum(initialData.searchRequest);
        setFilterNum(initialFilterNum);
    }, [initialData.searchRequest]);

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

            // Fetch landing pages with updated parameters
            (async () => {
                try {
                    setLoading(true);
                    const body = extractSearchRequest(urlSearchParams);
                    const page = parseInt(urlSearchParams.get("page") || "1", 10);

                    const response = await fetch(`/api/public/search/landing-page?page=${page}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    const searchResults = await response.json();

                    setLandingPages(searchResults.content || []);
                    const pagi = calculatePagination(searchResults.totalElements, 10, page);
                    setPagination(pagi);
                } catch (error) {
                    console.error('Error fetching landing pages:', error);
                } finally {
                    setLoading(false);
                }
            })();
        }

        // Update previous params
        prevUrlParamsRef.current = currentParams;
    }, [urlSearchParams]);

    const closeFilterPopup = useCallback(() => {
        setFilterPopup(false);
        setHomePageVisible(true);
    }, []);

    const setFilterParam = (data: Partial<SearchRequest>) => {
        const updatedSearchRequest = {
            ...searchRequest,
            query: searchRequest.query,
            transactionType: data.transactionType
        };
        setSearchRequest(updatedSearchRequest);
        const numFilters = countParamNum(updatedSearchRequest);
        setFilterNum(numFilters);

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
    }

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
                            {landingPages.map((element: LandingPage, index: number) => {
                                const allImages = element.sections?.filter(section => section.content.imageUrl != null).map(section => section.content.imageUrl) || [];
                                const primaryImage = allImages.length > 0 ? allImages[0] : null;
                                const otherImages = allImages.length > 1 ? allImages.slice(1) : [];
                                const displayImages = allImages.slice(0, 4);
                                const hasMoreImages = allImages.length > 4;

                                return (
                                    <Link href={`/landing-page/${element.id}`} key={index} className={styles.post} prefetch={index < 3}>
                                        <div className={`${styles.imageGrid} ${styles[`grid${displayImages.length}Images`]}`}>
                                            {displayImages.map((imageUrl, imgIndex: number) => (
                                                <div key={imgIndex} className={styles.imageContainer}>
                                                    <Image
                                                        className={styles.postImage}
                                                        width={174}
                                                        height={178}
                                                        alt={`${element.title} - Hình ${imgIndex + 1}`}
                                                        src={`${imageUrl}`}
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
                        {landingPages.length === 0 && !loading && (
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
                    <MbFooter />
                </div>
            )}
        </div>
    );
}

function ResultSearchOnDesktop({ session,
    initialData,
    searchParams }: LandingPageProps) {
    const router = useRouter();
    const urlSearchParams = useSearchParams();
    const [landingPages, setLandingPages] = useState<LandingPage[]>(initialData.landingPages);
    const [filterPopup, setFilterPopup] = useState(false);
    const [homePageVisible, setHomePageVisible] = useState(true);
    const [searchRequest, setSearchRequest] = useState(initialData.searchRequest);
    const [filterNum, setFilterNum] = useState(1);
    const [pagination, setPagination] = useState<PaginationData>();
    const [loading, setLoading] = useState(false);

    // Track previous URL params to detect changes
    const prevUrlParamsRef = useRef<string>('');
    const isInitialMount = useRef(true);

    // Initialize pagination on mount
    useEffect(() => {
        const pagi = calculatePagination(initialData.totalElements, 10, initialData.currentPage);
        setPagination(pagi);
    }, [initialData]);

    // Calculate filterNum on first render based on initial search request
    useEffect(() => {
        const initialFilterNum = countParamNum(initialData.searchRequest);
        setFilterNum(initialFilterNum);
    }, [initialData.searchRequest]);

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

            // Fetch landing pages with updated parameters
            (async () => {
                try {
                    setLoading(true);
                    const body = extractSearchRequest(urlSearchParams);
                    const page = parseInt(urlSearchParams.get("page") || "1", 10);

                    const response = await fetch(`/api/public/search/landing-page?page=${page}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    const searchResults = await response.json();

                    setLandingPages(searchResults.content || []);
                    const pagi = calculatePagination(searchResults.totalElements, 10, page);
                    setPagination(pagi);
                } catch (error) {
                    console.error('Error fetching landing pages:', error);
                } finally {
                    setLoading(false);
                }
            })();
        }

        // Update previous params
        prevUrlParamsRef.current = currentParams;
    }, [urlSearchParams]);

    const closeFilterPopup = useCallback(() => {
        setFilterPopup(false);
        setHomePageVisible(true);
    }, []);

    const setFilterParam = (data: Partial<SearchRequest>) => {
        const updatedSearchRequest = {
            ...searchRequest,
            query: searchRequest.query,
            transactionType: data.transactionType
        };
        setSearchRequest(updatedSearchRequest);
        const numFilters = countParamNum(updatedSearchRequest);
        setFilterNum(numFilters);

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
    }

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
                    isMobile={false}
                />
            )}
            <div className="min-h-screen flex flex-col">
                <NavBarDesktop session={session} />
                {/* Search Section */}
                <div className="bg-gray-50 ">
                    <div className="container mx-auto px-4 py-6">
                        <SearchingSectorDesktop
                            searchRequest={searchRequest}
                            openFilterPopup={openFilterPopup}
                            filterNum={filterNum}
                        />
                    </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Kết quả tìm kiếm ({pagination?.totalItems || initialData.totalElements || 0} bất động sản)
                        </h1>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {landingPages.map((element: LandingPage, index: number) => {
                            const allImages = element.sections?.filter(section => section.content.imageUrl != null).map(section => section.content.imageUrl) || [];
                            const primaryImage = allImages.length > 0 ? allImages[0] : null;

                            return (
                                <Link
                                    key={index}
                                    href={`/landing-page/${element.id}`}
                                    className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                    prefetch={index < 8}>
                                    <div className="relative h-48 overflow-hidden">
                                        {primaryImage && (
                                            <Image
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                width={320}
                                                height={192}
                                                alt={`${element.title}`}
                                                src={`${primaryImage}`}
                                                loading={index < 8 ? "eager" : "lazy"}
                                                quality={85}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                        )}
                                        {allImages.length > 1 && (
                                            <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                <Image
                                                    className="w-3 h-3"
                                                    width={12}
                                                    height={12}
                                                    alt="Image count"
                                                    src="/icons/imageIcon.svg"
                                                />
                                                <span>{allImages.length}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {element.title}
                                        </h3>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Image
                                                className="w-4 h-4 mr-1"
                                                width={16}
                                                height={16}
                                                alt="Location"
                                                src="/icons/location.svg"
                                            />
                                            <span className="line-clamp-1">{element.address}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {landingPages.length === 0 && !loading && (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Không tìm thấy bất động sản phù hợp
                                </h3>
                                <p className="text-gray-500">
                                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm kết quả
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <Suspense fallback={<div>Loading pagination...</div>}>
                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    currentPage={pagination?.currentPage || 0}
                                    totalPages={pagination?.totalPages || 0}
                                />
                            </div>
                        </Suspense>
                    )}
                </div>

                <DesktopFooter />
            </div>
        </div>
    );
}