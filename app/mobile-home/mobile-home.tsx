"use client";
import styles from './index.module.css';
import Image from 'next/image';
import { useState, useCallback, use, useEffect } from 'react';
import MbFooter from "../ui/mobile/footer/mb.footer";
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import Link from "next/link";
import FilterPopup from '../ui/common/popup-filter/filter-popup';
import SearchingSector from '../ui/mobile/searching-sector/searching.sector';
// import ExtraInfo from '../ui/mobile/extra-info/mb.extra.info';
// import DownloadApp from '../ui/mobile/download-app/mb.download';
import { useSession } from 'next-auth/react';
import { countParamNum } from '../utils/search-utils';
import { formatPrice } from '../utils/price-formatter';

export default function MobileHome() {
    const [homePageVisible, setHomePageVisible] = useState(true);
    const [filterPopup, setFilterPopup] = useState(false);
    const [searchRequest, setSearchRequest] = useState({
        minPrice: undefined, maxPrice: undefined,
        minAcreage: undefined, maxAcreage: undefined,
        typeCodes: undefined, cityCode: undefined,
        wardCodes: undefined, transactionType: "SELL",
        query: ""
    });
    const [filterNum, setFilterNum] = useState(1);
    const { data: session } = useSession();
    const [realEstateData, setRealEstateData] = useState([]);
    const [projectData, setProjectData] = useState([]);

    const openFilterPopup = useCallback(() => {
        setFilterPopup(true);
        setHomePageVisible(false);
    }, []);

    const closeFilterPopup = useCallback(() => {
        setFilterPopup(false);
        setHomePageVisible(true);
    }, []);

    const setFilterParam = (data: any) => {
        const updatedSearchRequest = {
            ...searchRequest, minPrice: data.minPrice, maxPrice: data.maxPrice,
            minAcreage: data.minAcreage, maxAcreage: data.maxAcreage,
            typeCodes: data.typeCodes, cityCode: data.cityCode,
            wardCodes: data.wardCodes, transactionType: data.transactionType,
            query: searchRequest.query
        };
        setSearchRequest(updatedSearchRequest);
        const numFilter = countParamNum(updatedSearchRequest);
        setFilterNum(numFilter);
    }

    const fetchRealEstate = async () => {
        try {
            const response = await fetch(`/api/public/search/posts?page=1&size=12`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transactionType: "SELL"
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRealEstateData(data.content);
        } catch (error) {
            console.error("Error fetching real estate data:", error);
        }
    }

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/public/search/landing-page?page=1&size=10`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: ""
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProjectData(data.content);
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    }

    useEffect(() => {
        fetchRealEstate();
        fetchProject();
    }, []);

    return (
        <div className='h-full'>
            {filterPopup && (<FilterPopup onClose={closeFilterPopup} setFilterParam={setFilterParam} filterParam={searchRequest} />)}
            {homePageVisible && (
                <div className={styles.homePage}>
                    <NavBarMobile displayNav={false} session={session} />
                    
                    {/* Hero Section with Search */}
                    <div className={styles.heroSection}>
                        <div className={styles.heroBackground}>
                            <Image 
                                className={styles.heroImage} 
                                width={393} 
                                height={300} 
                                alt="Real Estate Hero" 
                                src="/img/wallpaper.jpg"
                                style={{ objectFit: 'cover' }}
                            />
                            <div className={styles.heroOverlay}>
                                <div className={styles.heroContent}>
                                    <h1 className={styles.heroTitle}>
                                        Khám phá bất động sản tốt nhất
                                    </h1>
                                    <p className={styles.heroSubtitle}>
                                        Tìm ngôi nhà mơ ước của bạn
                                    </p>
                                    <SearchingSector 
                                        searchRequest={searchRequest} 
                                        openFilterPopup={openFilterPopup} 
                                        filterNum={filterNum} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.optionFilter}>
                        <div className={styles.buttonParent}>
                            <Link href="/landing-page?query=&transactionType=PROJECT&page=1" className={styles.button2}>
                                <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/BuildingOffice.svg" />
                                <div className={styles.filter}>Dự án</div>
                            </Link>
                            <Link href="/posts?query=&transactionType=SELL&page=1" className={styles.button4}>
                                <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/HouseLine.svg" />
                                <div className={styles.filter}>Mua bán</div>
                            </Link>
                            <Link href="/posts?query=&transactionType=RENT&page=1" className={styles.button6}>
                                <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/SealPercent.svg" />
                                <div className={styles.filter}>Cho thuê</div>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.firstMainContent}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Bất động sản nổi bật</h2>
                            <Link href="/posts?query=&transactionType=SELL&page=1" className={styles.viewAllLink}>
                                Xem tất cả
                                <Image width={14} height={14} alt="Arrow" src="/icons/ArrowRight.svg" />
                            </Link>
                        </div>
                        <div className={styles.propertyGrid}>
                            {realEstateData.map((item: any, index: number) => {
                                return (
                                    <Link href={`/post/${item.postId}`} className={styles.propertyCard} key={index}>
                                        <div className={styles.propertyImageWrapper}>
                                            <Image 
                                                className={styles.propertyImage} 
                                                width={174} 
                                                height={140} 
                                                alt={item.title} 
                                                src={`${item.images?.filter((img: any) => img.isPrimary)[0]?.fileUrl}`}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className={styles.propertyContent}>
                                            <h3 className={styles.propertyTitle}>{item.title}</h3>
                                            <div className={styles.propertyPrice}>
                                                {formatPrice(item.price)} - {item.acreage} m²
                                            </div>
                                            <div className={styles.propertyLocation}>
                                                <Image width={12} height={12} alt="Location" src="/icons/location.svg" />
                                                <span>{item.address}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }
                            )}
                        </div>
                    </div>
                    <div className={styles.secondMainContent}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Dự án bất động sản nổi bật</h2>
                            <Link href="/landing-page?query=&transactionType=PROJECT&page=1" className={styles.viewAllLink}>
                                Xem tất cả
                                <Image width={14} height={14} alt="Arrow" src="/icons/ArrowRight.svg" />
                            </Link>
                        </div>
                        <div className={styles.projectGrid}>
                            {projectData.map((item: any, index: number) => {
                                return (
                                    <Link href={`/landing-page/${item.postId}`} className={styles.projectCard} key={index}>
                                        <div className={styles.projectImageWrapper}>
                                            <Image 
                                                className={styles.projectImage} 
                                                width={174} 
                                                height={140} 
                                                alt={item.title} 
                                                src={`${item.sections?.filter((section: any) => section?.content.imageUrl != null)[0]?.content.imageUrl}`}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className={styles.projectContent}>
                                            <h3 className={styles.projectTitle}>{item.title}</h3>
                                            {/* <div className={styles.projectPrice}>{formatPrice(item.price)}</div> */}
                                            <div className={styles.projectLocation}>
                                                <Image width={12} height={12} alt="Location" src="/icons/location.svg" />
                                                <span>{item.address}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    {/* <ExtraInfo /> */}
                    {/* <DownloadApp /> */}
                    <MbFooter />
                </div>
            )}
        </div>
    );
}

