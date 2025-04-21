"use client";
import styles from './index.module.css';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import useScreenSize from '../lib/useScreenSize';
import MbFooter from "../ui/mobile/footer/mb.footer";
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import Button from '../ui/common/button/button';
import btnStyle from "../ui/common/button/btn.module.css";
import Link from "next/link";

export default function MobileHome() {



    const openPopUpFilterPropertyType = useCallback(() => {

    }, []);

    const onButtonContainerClick = useCallback(() => {
        // Add your code here
    }, []);

    return (
        
        <div className={styles.homePage }>
            <NavBarMobile displayNav={false}/>
            <div className={styles.searchingsession}>
                <div className={styles.searchFieldsParent}>
                    <div className={styles.searchFields}>
                        <div className={styles.frameParent}>
                            <div className={styles.placeHolderWrapper}>
                                <input className={styles.inputText} placeholder="Nhập thông tin bất kỳ ..."/>
                            </div>
                            <button className={styles.button8}>
                                <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/search.svg" />
                            </button>
                        </div>
                    </div>
                    <div className={styles.filterGroup}>
                        <button className={styles.button9} onClick={onButtonContainerClick}>
                            <Image className={styles.funnelIcon} width={24} height={24} alt="" src="/icons/Funnel.svg" />
                            <div className={styles.filter}>Filter</div>
                            <div className={styles.wrapper}>
                                <div className={styles.div}>0</div>
                            </div>
                        </button>                        
                        <button className={styles.button10}>
                            <div className={styles.filter}>Toàn quốc</div>
                            <Image className={styles.funnelIcon} width={24} height={24} alt="" src="/icons/CaretDown.svg" />
                        </button>

                        <button className={styles.button12} onClick={openPopUpFilterPropertyType}>
                            <div className={styles.filter}>Tất cả bds</div>
                            <Image className={styles.funnelIcon} width={24} height={24} alt="" src="/icons/CaretDown.svg" />
                        </button>
                    </div>
                </div>
            </div>
            <div >
                <Image className={styles.imagesIcon} width={393} height={141} alt="" src="/icons/Header_Image.png" />
            </div>

            <div className={styles.optionFilter}>
                <div className={styles.buttonParent}>
                    <button className={styles.button2}>
                        <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/BuildingOffice.svg" />
                        <div className={styles.filter}>Dự án</div>
                    </button>
                    <button className={styles.button4}>
                        <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/HouseLine.svg" />
                        <div className={styles.filter}>Mua bán</div>
                    </button>
                    <button className={styles.button6}>
                        <Image className={styles.buildingofficeIcon} width={24} height={24} alt="" src="/icons/SealPercent.svg" />
                        <div className={styles.filter}>Cho thuê</div>
                    </button>
                </div>
            </div>
            <div className={styles.firstMainContent}>
                <div className={styles.headingTitle}>
                    <div className={styles.headingTitle1}>Bất động sản dành cho bạn</div>
                </div>
                <div className={styles.postParent}>
                    <Link href={"/a-post-detail"} className={styles.post}>
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
                        <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/Frame_7.jpg" />
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
        </div>
    );
}

