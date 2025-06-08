"use client";
import styles from "./filter-popup.module.css";
import Image from "next/image";
import Form from "next/form";
import { useState, useCallback } from 'react';
import AddressFilterPopup from "../popup-filter-address/address-popup";
import DistrictPopup from "../popup-district/district-popup";


export default function FilterPopup({ onClose, setFilterParam, filterParam }: any) {
    const [searchRequest, setSearchRequest] = useState(filterParam);
    const [tabBtnState, setTabBtnState] = useState({
        btnBuy: filterParam.tab == "BUY" ? styles.btnBuy + " " + styles.primaryBtn : styles.btnBuy,
        btnRent: filterParam.tab == "RENT" ? styles.btnRent + " " + styles.primaryBtn : styles.btnRent,
        btnProj: filterParam.tab == "PROJECT" ? styles.btnProj + " " + styles.primaryBtn : styles.btnProj
    });
    const [addressPopup, setAddressPopup] = useState(false);
    const [districtPopup, setDistrictPopup] = useState(false);
    const [filterPopup, setFilterPopup] = useState(true);

    function applyFilter(formData: FormData) {
        setFilterParam(searchRequest);
    }

    function selectTab(value: string) {
        setSearchRequest({ ...searchRequest, tab: value });
        switch (value) {
            case "BUY": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy + " " + styles.primaryBtn, btnRent: styles.btnRent, btnProj: styles.btnProj }); break;
            case "RENT": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy, btnRent: styles.btnRent + " " + styles.primaryBtn, btnProj: styles.btnProj }); break;
            case "PROJECT": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy, btnRent: styles.btnRent, btnProj: styles.btnProj + " " + styles.primaryBtn }); break;
        }
    }

    const closePopupAddressClick = useCallback(() => {setAddressPopup(false);setFilterPopup(true);}, []);
    const selectCity = useCallback((city: any) => {setAddressPopup(false);setDistrictPopup(true);}, []);
    const closeDistrict = useCallback(() => { setAddressPopup(true); setDistrictPopup(false); }, []);
    const onBtnAddressClick = useCallback(() => {setAddressPopup(true); setFilterPopup(false);},[]);

    return (
        <div className='h-full'>
            {addressPopup && (<AddressFilterPopup onClose={closePopupAddressClick} selectCity={selectCity} />)}
            {districtPopup && (<DistrictPopup onClose={closeDistrict} />)}
            {filterPopup && (
                <div>
                    <Form action={applyFilter} className={styles.filterContainer}>
                        <div className={styles.headerFilter}>
                            <div className={styles.khuVcParent}>
                                <div className={styles.khuVc}>Bộ lọc</div>
                                <button onClick={onClose}>
                                    <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg" />
                                </button>
                            </div>
                        </div>
                        <div className={styles.filterBody}>
                            <div className={styles.btnTab}>
                                <button name="btnBuy" className={tabBtnState.btnBuy} onClick={() => selectTab("BUY")}>Mua bán</button>
                                <button name="btnRent" className={tabBtnState.btnRent} onClick={() => selectTab("RENT")}>Cho thuê</button>
                                <button name="btnProject" className={tabBtnState.btnProj} onClick={() => selectTab("PROJECT")}>Dự án</button>
                            </div>
                            <div className={styles.areaBlock}>
                                <div className={styles.itemTitle}>
                                    <p>Khu vực</p>
                                </div>
                                <div className={styles.criteriaBlk}>
                                    <div className={styles.criteria}>
                                        <p className={styles.criTitle}>Đường Cầu Diễn, Bắc Từ Liêm</p>
                                        <button>
                                            <Image className={styles.xIcon} width={16} height={16} alt="" src="/icons/X.svg" />
                                        </button>
                                    </div>
                                    <div className={styles.criteria}>
                                        <p className={styles.criTitle}>Đường Cầu Diễn, Bắc Từ Liêm Đường Cầu Diễn, Bắc Từ Liêm Đường Cầu Diễn, Bắc Từ Liêm Đường Cầu Diễn, Bắc Từ Liêm Đường Cầu Diễn, Bắc Từ Liêm Đường Cầu Diễn, Bắc Từ Liêm</p>
                                        <button>
                                            <Image className={styles.xIcon} width={16} height={16} alt="" src="/icons/X.svg" />
                                        </button>
                                    </div>
                                    <div>
                                        <button className={styles.addBtn} onClick={onBtnAddressClick}>
                                            <Image className={styles.xIcon} width={12} height={12} alt="" src="/icons/Plus.svg"/>
                                            <p className={styles.addTitle}>Thêm</p>
                                        </button>                                        
                                    </div>
                                </div>
                            </div>
                            <div className={styles.proTypeBlock}>
                                <div className={styles.itemTitle}>
                                    <p>Loại bất động sản</p>
                                </div>
                                <div className={styles.criteriaBlk}>
                                    <div className={styles.criteria}>
                                        <p className={styles.criTitle}>Nhà mặt phố</p>
                                        <button>
                                            <Image className={styles.xIcon} width={16} height={16} alt="" src="/icons/X.svg" />
                                        </button>
                                    </div>
                                    <div className={styles.criteria}>
                                        <p className={styles.criTitle}>Condotel</p>
                                        <button>
                                            <Image className={styles.xIcon} width={16} height={16} alt="" src="/icons/X.svg" />
                                        </button>
                                    </div>                                    
                                    <div>
                                        <button className={styles.addBtn}>
                                            <Image className={styles.xIcon} width={12} height={12} alt="" src="/icons/Plus.svg" />
                                            <p className={styles.addTitle}>Thêm</p>
                                        </button>                                        
                                    </div>
                                </div>
                            </div>
                            <div className={styles.priceBlock}>
                                <div className={styles.itemTitle}>
                                    <p>Mức giá</p>
                                </div>
                                <div className={styles.itemBody}>
                                    <Image width={11} height={11} alt="" src="/icons/CurrencyCircleDollar.svg" />
                                    <p>Tất cả</p>
                                    <Image className={styles.caretRightIcon} width={11} height={11} alt="" src="/icons/CaretRight.svg" />
                                </div>
                            </div>
                            <div className={styles.acreageBlock}>
                                <div className={styles.itemTitle}>
                                    <p>Diện tích</p>
                                </div>
                                <div className={styles.itemBody}>
                                    <Image width={11} height={11} alt="" src="/icons/CurrencyCircleDollar.svg" />
                                    <p>Tất cả</p>
                                    <Image className={styles.caretRightIcon} width={11} height={11} alt="" src="/icons/CaretRight.svg" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <div className={styles.resetBlock}>
                                <button className={styles.btnReset}>Đặt lại</button>
                            </div>
                            <div className={styles.applyBlock}>
                                <button type="submit" className={styles.btnApply} onClick={onClose}>Áp dụng</button>
                            </div>
                        </div>
                    </Form>
                </div>
            )}

        </div>
    );
}