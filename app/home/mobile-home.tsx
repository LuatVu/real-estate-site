"use client";
import styles from './index.module.css';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import MbFooter from "../ui/mobile/footer/mb.footer";
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import Link from "next/link";
import FilterPopup from '../ui/common/popup-filter/filter-popup';
import SearchingSector from '../ui/mobile/searching-sector/searching.sector';
import ExtraInfo from '../ui/mobile/extra-info/mb.extra.info';
import DownloadApp from '../ui/mobile/download-app/mb.download';
import { useSession } from 'next-auth/react';

export default function MobileHome() {    
    const [homePageVisible, setHomePageVisible] = useState(true);
    const [filterPopup, setFilterPopup] = useState(false);
    const [searchRequest, setSearchRequest] = useState({
        minPrice: undefined, maxPrice: undefined,
        minAcreage: undefined, maxAcreage: undefined, typeCode: undefined, provinceCode: undefined,
        districtCode: undefined, wardCode: undefined, tab: "BUY", districts: undefined, propertyTypes: undefined,
        city: undefined, priceRange: undefined, acreageRange: undefined, query: ""
    });
    const [filterNum, setFilterNum] = useState(0);
    const {data: session} = useSession();

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

    return (
        <div className='h-full'>
            {filterPopup && (<FilterPopup onClose={closeFilterPopup} setFilterParam={setFilterParam} filterParam={searchRequest} />)}
            {homePageVisible && (
                <div className={styles.homePage}>
                    <NavBarMobile displayNav={false} session={session}/>
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
                            <div className={styles.headingTitle1}>Bất động sản dành cho bạn</div>
                        </div>
                        <div className={styles.postParent}>
                            <Link href={"/a-post-detail"} className={styles.post}>
                                <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/1.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Bán nhà 2 tầng ...</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>10 tỷ 130m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"/a-post-detail"} className={styles.post}>
                                <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/2.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Bán nhà 2 tầng ...</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>10 tỷ 130m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"/a-post-detail"} className={styles.post}>
                                <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/11.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Bán nhà 2 tầng ...</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>10 tỷ 130m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"/a-post-detail"} className={styles.post}>
                                <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/13.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Bán nhà 2 tầng ...</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>10 tỷ 130m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"/a-post-detail"} className={styles.post}>
                                <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/25.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Bán nhà 2 tầng ...</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>10 tỷ 130m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"/a-post-detail"} className={styles.post}>
                                <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/27.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Bán nhà 2 tầng ...</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>10 tỷ 130m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
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
                            <Link href={"du-an"} className={styles.post6}>
                                <Image className={styles.projectPost} width={174} height={178} alt="" src="/temp/duan_1.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Vin Global gate</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>150 triệu/m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"du-an"} className={styles.post6}>
                                <Image className={styles.projectPost} width={174} height={178} alt="" src="/temp/duan_2.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Politant tropical</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>200 triệu/m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"du-an"} className={styles.post6}>
                                <Image className={styles.projectPost} width={174} height={178} alt="" src="/temp/duan_3.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Politant tropical</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>200 triệu/m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"du-an"} className={styles.post6}>
                                <Image className={styles.projectPost} width={174} height={178} alt="" src="/temp/duan_4.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Politant tropical</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>200 triệu/m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"du-an"} className={styles.post6}>
                                <Image className={styles.projectPost} width={174} height={178} alt="" src="/temp/duan_5.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Politant tropical</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>200 triệu/m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                            <Link href={"du-an"} className={styles.post6}>
                                <Image className={styles.projectPost} width={174} height={178} alt="" src="/temp/duan_6.jpg" />
                                <div className={styles.bnNh2TngWrapper}>
                                    <div className={styles.filter}>Politant tropical</div>
                                </div>
                                <div className={styles.t130m2Wrapper}>
                                    <div className={styles.filter}>200 triệu/m2</div>
                                </div>
                                <div className={styles.vectorParent}>
                                    <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                    <div className={styles.filter}>Ba Đình, Hà Nội</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <ExtraInfo />
                    <DownloadApp />
                    <MbFooter />
                </div>
            )}
        </div>
    );
}

