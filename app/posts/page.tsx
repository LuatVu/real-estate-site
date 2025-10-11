"use client";
import styles from './index.module.css';
import useScreenSize from '../lib/useScreenSize';
import { useState, useCallback, useEffect } from 'react';
import FilterPopup from '../ui/common/popup-filter/filter-popup';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import Image from 'next/image';
import Link from 'next/link';
import MbFooter from '../ui/mobile/footer/mb.footer';
import { useSearchParams } from 'next/navigation';
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
import { useSession } from 'next-auth/react';

export default function Posts() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="h-full">
            {screenSize === 'sm' ? (<PostsOnMobile session={session} />) : (<PostOnDesktop session={session} />)}
        </div>
    );
}

function PostsOnMobile({session}: {session?: any}) {
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [filterPopup, setFilterPopup] = useState(false);
    const [homePageVisible, setHomePageVisible] = useState(true);
    const [searchRequest, setSearchRequest] = useState({
        minPrice: undefined, maxPrice: undefined,
        minAcreage: undefined, maxAcreage: undefined, typeCode: undefined, provinceCode: undefined,
        districtCode: undefined, wardCode: undefined, tab: "BUY", districts: undefined, propertyTypes: undefined,
        city: undefined, priceRange: undefined, acreageRange: undefined, query: ""
    });
    const [filterNum, setFilterNum] = useState(0);    
    const [pagination, setPagination] = useState<PaginationData>();
    const {currentPage} = usePagination();
    

    const fetchPosts = async () => {
        try {
            const body = extractSearchRequest(searchParams);            
            const page = searchParams.get("page") || 1;
            const response = await fetch(`/api/posts?page=${page}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const searchResults = await response.json();
            setPosts(searchResults.content);            
            const pagi = calculatePagination(searchResults.totalElements, 10, currentPage);
            setPagination(pagi);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchPosts();
    }, [searchParams])

    const setFilterParam = (data: any) => {
        const updatedSearchRequest = {
            ...searchRequest, minPrice: data.minPrice, maxPrice: data.maxPrice,
            minAcreage: data.minAcreage, maxAcreage: data.maxAcreage,
            typeCode: data.typeCode, provinceCode: data.provinceCode,
            districtCode: data.districtCode, wardCode: data.wardCode, tab: data.tab,
            districts: data.districts, propertyTypes: data.propertyTypes, city: data.city,
            priceRange: data.priceRange, acreageRange: data.acreageRange
        };
        setSearchRequest(updatedSearchRequest);
        const numFilter = countParamNum(updatedSearchRequest);
        setFilterNum(numFilter);
    }

    const countParamNum = (searchRequest: any) => {
        let count: number = 0;
        for (let key in searchRequest) {
            if (searchRequest.hasOwnProperty(key) && isReleventKey(key)) {
                if (searchRequest[key] instanceof Array) {
                    if (searchRequest[key].length > 0) {
                        count = count + 1;
                    }
                } else if (searchRequest[key] != undefined) {
                    count = count + 1;
                }
            }
        }
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
            {filterPopup && (<FilterPopup onClose={closeFilterPopup} setFilterParam={setFilterParam} filterParam={searchRequest} />)}
            {homePageVisible && (
                <div className={styles.homePage}>
                    <NavBarMobile displayNav={false} session={session} />
                    <SearchingSector searchRequest={searchRequest} openFilterPopup={openFilterPopup} filterNum={filterNum} />
                    <div className={styles.firstMainContent}>
                        <div className={styles.postParent}>
                            {posts.map((element: any, index: any) => {
                                const allImages = element?.images || [];
                                const primaryImage = allImages.find((img: any) => img.isPrimary) || allImages[0];
                                const otherImages = allImages.filter((img: any) => img !== primaryImage);
                                const displayImages = [primaryImage, ...otherImages].filter(Boolean).slice(0, 4);
                                const hasMoreImages = allImages.length > 4;
                                
                                return (
                                    <Link href={`/post/${element.postId}`} className={styles.post} key={index}>
                                        <div className={`${styles.imageGrid} ${styles[`grid${displayImages.length}Images`]}`}>
                                            {displayImages.map((image: any, imgIndex: number) => (
                                                <div key={imgIndex} className={styles.imageContainer}>
                                                    <Image 
                                                        className={styles.postImage} 
                                                        width={174} 
                                                        height={178} 
                                                        alt="" 
                                                        src={`http://localhost:8080/api/public/image/${image?.fileUrl}`} 
                                                        loading={index < 3 ? "eager" : "lazy"}
                                                    />
                                                    {imgIndex === displayImages.length - 1 && hasMoreImages && (
                                                        <div className={styles.imageCountOverlay}>
                                                            <Image className={styles.imageIcon} width={16} height={16} alt="" src="/icons/imageIcon.svg" />
                                                            <span className={styles.imageCount}>{allImages.length}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.bnNh2TngWrapper}>
                                            <div className={styles.filter}>{element.title}</div>
                                        </div>
                                        <div className={styles.t130m2Wrapper}>
                                            <div className={styles.filter}>{formatPrice(element.price)} - {element.acreage} m²</div>
                                        </div>
                                        <div className={styles.vectorParent}>
                                            <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                            <div className={styles.filter}>{element.address}</div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <Suspense fallback={<div>Loading pagination...</div>}>
                            <Pagination currentPage={ pagination?.currentPage || 0} totalPages={pagination?.totalPages || 0} className='mt-8'/>
                    </Suspense>
                    <ExtraInfo />
                    <DownloadApp />
                    <MbFooter />
                </div>
            )}
        </div>
    );
}

function PostOnDesktop({session}: {session?: any}) {
    return (<div>Desktop Page</div>);
}