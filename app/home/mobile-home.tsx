"use client";
import styles from './index.module.css';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import useScreenSize from '../lib/useScreenSize';
import MbFooter from "../ui/mobile/footer/mb.footer";
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import Link from "next/link";
import PortalPopup from '../ui/common/portal-popup/portal-popup';
import PropertyTypePopup from '../ui/common/pop-up-property-type/property-type-popup';
import AddressFilterPopup from '../ui/common/popup-filter-address/address-popup';
import DistrictPopup from '../ui/common/popup-district/district-popup';
import FilterPopup from '../ui/common/popup-filter/filter-popup';
import Form from 'next/form';

export default function MobileHome() {
    const [homePageVisible, setHomePageVisible] = useState(true);
    const [isPropertyTypePopupOpen, setPropertyTypePopup] = useState(false);
    const [addressPopup, setAddressPopup] = useState(false);
    const [districtPopup, setDistrictPopup] = useState(false);
    const [filterPopup, setFilterPopup] = useState(false);
    const [searchRequest, setSearchRequest] = useState({minPrice: undefined, maxPrice: undefined, 
        minAcreage: undefined, maxAcreage: undefined, typeCode: undefined, provinceCode: undefined,
        districtCode: undefined, wardCode: undefined, tab: "BUY"});    

    const openPopUpFilterPropertyType = useCallback(() => {
        setPropertyTypePopup(true);
    }, []);

    const closePopUpFilterPropertyType = useCallback(() => {
        setPropertyTypePopup(false);
        setHomePageVisible(true);
    }, []);

    const onButtonAddressClick = useCallback(() => {
        setAddressPopup(true);
        setHomePageVisible(false);
    }, []);

    const closePopupAddressClick = useCallback(
        () => {
            setAddressPopup(false);
            setHomePageVisible(true);
        }, []
    );

    const selectCity = useCallback(
        (city: any) => {
            setAddressPopup(false);
            setDistrictPopup(true);
        }, []
    );

    const openFilterPopup = useCallback(() => {
        setFilterPopup(true);
        setHomePageVisible(false);
    }, []);

    const closeFilterPopup = useCallback(() => {
        setFilterPopup(false);
        setHomePageVisible(true);       
    }, []);

    const closeDistrict = useCallback(() => { setAddressPopup(true); setDistrictPopup(false); }, []);

    function search(formData: FormData) {
        console.log(formData.get('searchKeyword'));
        console.log(searchRequest);
    }

    const handleSearchRequest = (data: any) => {
        setSearchRequest({
            ...searchRequest, minPrice: data.minPrice, maxPrice: data.maxPrice,
            minAcreage: data.minAcreage, maxAcreage: data.maxAcreage,
            typeCode: data.typeCode, provinceCode: data.provinceCode,
            districtCode: data.districtCode, wardCode: data.wardCode, tab: data.tab
        })        
    }

    return (
        <div className='h-full'>
            {addressPopup && (<AddressFilterPopup onClose={closePopupAddressClick} selectCity={selectCity} />)}
            {districtPopup && (<DistrictPopup onClose={closeDistrict} />)}
            {filterPopup && (<FilterPopup onClose={closeFilterPopup} setFilterParam={handleSearchRequest} filterParam={searchRequest} />)}
            {homePageVisible && (
                <div className={styles.homePage}>
                    <NavBarMobile displayNav={false} />
                    <Form action={search} className={styles.searchingsession}>
                        <div className={styles.searchFieldsParent}>
                            <div className={styles.searchFields}>
                                <div className={styles.frameParent}>
                                    <div className={styles.placeHolderWrapper}>
                                        <input name="searchKeyword" className={styles.inputText} placeholder="Nhập thông tin bất kỳ ..." />
                                    </div>
                                    <button type="submit" className={styles.button8}>
                                        <Image className={styles.searchIcon} width={24} height={24} alt="" src="/icons/search.svg" />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.filterGroup}>
                                <button className={styles.button9} onClick={openFilterPopup}>
                                    <Image className={styles.funnelIcon} width={24} height={24} alt="" src="/icons/Funnel.svg" />
                                    <div className={styles.filter}>Filter</div>
                                    <div className={styles.wrapper}>
                                        <div className={styles.div}>9</div>
                                    </div>
                                </button>
                                <button className={styles.button10} onClick={onButtonAddressClick}>
                                    <div className={styles.filter}>Toàn quốc</div>
                                    <Image className={styles.funnelIcon} width={24} height={24} alt="" src="/icons/CaretDown.svg" />
                                </button>

                                <button className={styles.button12} onClick={openPopUpFilterPropertyType}>
                                    <div className={styles.filter}>Tất cả bds</div>
                                    <Image className={styles.funnelIcon} width={24} height={24} alt="" src="/icons/CaretDown.svg" />
                                </button>
                            </div>
                        </div>
                    </Form>
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
                    <div className={styles.homePageInner}>
                        <div className={styles.instanceParent}>
                            <Link href="to-be/continue" className={styles.nativateTextParent}>
                                <div className={styles.filter}>Chủ đề nổi bật</div>
                                <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                            </Link>
                            <Link href="to-be/continue" className={styles.nativateTextGroup}>
                                <div className={styles.filter}>Bất động sản bán</div>
                                <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                            </Link>
                            <Link href="to-be/continue" className={styles.nativateTextContainer}>
                                <div className={styles.filter}>Bất động sản cho thuê</div>
                                <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                            </Link>
                            <Link href="to-be/continue" className={styles.nativateTextParent1}>
                                <div className={styles.filter}>Dự án nổi bật</div>
                                <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                            </Link>
                            <Link href="to-be/continue" className={styles.nativateTextParent2}>
                                <div className={styles.filter}>Chủ đầu tư nổi bật</div>
                                <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                            </Link>
                        </div>
                    </div>
                    <div className={styles.downloadApp}>
                        <div className={styles.tiNgDngWrapper}>
                            <div className={styles.filter}>{`Tải ứng dụng `}</div>
                        </div>
                        <div className={styles.appleStoreParent}>
                            <Image className={styles.appleStoreIcon} width={108} height={32} alt="" src="/icons/apple_store.svg" />
                            <Image className={styles.googlePlay2} width={108} height={32} alt="" src="/icons/google_play.svg" />
                        </div>
                    </div>
                    <MbFooter />
                    {isPropertyTypePopupOpen && (
                        <PortalPopup overlayColor="rgba(113, 113, 113, 0.3)" placement="Centered" onOutsideClick={closePopUpFilterPropertyType}>
                            <PropertyTypePopup onClose={closePopUpFilterPropertyType} />
                        </PortalPopup>
                    )}
                </div>
            )}
        </div>
    );
}

