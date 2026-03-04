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
            const response = await fetch(`/api/public/search/posts?page=1&size=6`, {
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
            const response = await fetch(`/api/public/search/posts?page=1&size=10`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transactionType: "PROJECT"
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
                    <SearchingSector searchRequest={searchRequest} openFilterPopup={openFilterPopup} filterNum={filterNum} />

                    <div >
                        <Image className={styles.imagesIcon} width={393} height={141} alt="" src="/icons/Header_Image.png" />
                    </div>

                    <div className={styles.optionFilter}>
                        <div className={styles.buttonParent}>
                            <Link href="/Du-An" className={styles.button2}>
                                <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/BuildingOffice.svg" />
                                <div className={styles.filter}>Dự án</div>
                            </Link>
                            <Link href="/Mua-Ban" className={styles.button4}>
                                <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/HouseLine.svg" />
                                <div className={styles.filter}>Mua bán</div>
                            </Link>
                            <Link href="/Cho-Thue" className={styles.button6}>
                                <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/SealPercent.svg" />
                                <div className={styles.filter}>Cho thuê</div>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.firstMainContent}>
                        <div className={styles.headingTitle}>
                            <div className={styles.headingTitle1}>Bất động sản nổi bật</div>
                        </div>
                        <div className={styles.postParent}>
                            {realEstateData.map((item: any, index: number) => {
                                return (
                                    <Link href={`/post/${item.postId}`} className={styles.post} key={index}>
                                        <Image className={styles.postChild} width={174} height={178} alt="" src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${item.images?.filter((img: any) => img.isPrimary)[0]?.fileUrl}`} />
                                        <div className={styles.bnNh2TngWrapper}>
                                            <div className={styles.filter}>{item.title}</div>
                                        </div>
                                        <div className={styles.t130m2Wrapper}>
                                            <div className={styles.filter}>{formatPrice(item.price)} - {item.acreage} m²</div>
                                        </div>
                                        <div className={styles.vectorParent}>
                                            <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                            <div className={styles.filter}>{item.address}</div>
                                        </div>
                                    </Link>
                                )
                            }
                            )}
                        </div>
                    </div>
                    <div className={styles.secondMainContent}>
                        <div className={styles.headingTitleParent}>
                            <div className={styles.headingTitle2}>
                                <div className={styles.headingTitle1}>Dự án bất động sản nổi bật</div>
                            </div>
                            <Link href={"xem-them-du-an"} className={styles.xemThmParent}>
                                <div className={styles.xemThm}>Xem thêm</div>
                                <Image className={styles.arrowrightIcon} width={10} height={10} alt="" src="/icons/ArrowRight.svg" />
                            </Link>
                        </div>
                        <div className={styles.postGroup}>
                            {projectData.map((item: any, index: number) => {
                                return (
                                    <Link href={`/post/${item.postId}`} className={styles.post6} key={index}>
                                        <Image className={styles.projectPost} width={174} height={178} alt="" src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${item.images?.filter((img: any) => img.isPrimary)[0]?.fileUrl}`} />
                                        <div className={styles.bnNh2TngWrapper}>
                                            <div className={styles.filter}>{item.title}</div>
                                        </div>
                                        <div className={styles.t130m2Wrapper}>
                                            <div className={styles.filter}>{formatPrice(item.price)}</div>
                                        </div>
                                        <div className={styles.vectorParent}>
                                            <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                            <div className={styles.filter}>{item.address}</div>
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

