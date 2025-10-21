"use client";
import styles from "./filter-popup.module.css";
import Image from "next/image";
import { useState, useCallback, useEffect } from 'react';
import AddressFilterPopup from "../popup-filter-address/address-popup";
import WardPopup from "../popup-district/ward-popup";
import PropertyTypePopup from "../pop-up-property-type/property-type-popup";
import PricePopup from "../popup-price/price-popup";
import AcreagePopup from "../acreage-popup/acreage-popup";

export default function FilterPopup({ onClose, setFilterParam, filterParam }: any) {
    const [searchRequest, setSearchRequest] = useState(filterParam);
    const [tabBtnState, setTabBtnState] = useState({
        btnBuy: filterParam.transactionType == "BUY" ? styles.btnBuy + " " + styles.primaryBtn : styles.btnBuy,
        btnRent: filterParam.transactionType == "RENT" ? styles.btnRent + " " + styles.primaryBtn : styles.btnRent,
        btnProj: filterParam.transactionType == "PROJECT" ? styles.btnProj + " " + styles.primaryBtn : styles.btnProj
    });
    const [addressPopup, setAddressPopup] = useState(false);
    const [districtPopup, setDistrictPopup] = useState(false);
    const [filterPopup, setFilterPopup] = useState(true);
    const [properTypePopup, setProperTypePopup] = useState(false);
    const [pricePopup, setPricePopup] = useState(false);
    const [acreagePopup, setAcreagePopup] = useState(false);

    const [selectedWards, setSelectedWards] = useState([]);
    const [city, setCity] = useState<any>();
    const [propertyTypes, setPropertyType] = useState([]);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [minAcreage, setMinAcreage] = useState<number | undefined>(undefined);
    const [maxAcreage, setMaxAcreage] = useState<number | undefined>(undefined);
    const [cities, setCities] = useState("");
    const [wards, setWards] = useState([]);

    const fetchCities = async () => {
        // Fetch city data from API if needed
        try{
            const response = await fetch('/api/province', { method: 'GET' });
            const data = await response.json();
            setCities(data);
        }catch(error){
            console.error("Error fetching cities:", error);
        }
    }

    const fetchWards = async (cityCode: string) => {
        // Fetch wards data based on selected city from API if needed
        try{
            const response = await fetch(`/api/province?cityCode=${cityCode}`, { method: 'GET' });
            const data = await response.json();
            setWards(data.map((ward: any) => ({ ...ward, checked: false })));
        }catch(error){
            console.error("Error fetching wards:", error);
        }
    }

    useEffect( () => {
        fetchCities();
    }, []);

    useEffect( () => {
        if(city){
            fetchWards(city?.code);
        }
    }, [city]);

    // const setSelectedWardsFC = useCallback((values: any) => { setSelectedWards(values) }, []);
    const removeSelectedWard = (item: any) => { setSelectedWards(selectedWards.filter((ele: any) => ele.code !== item.code)) };

    const selectProperType = useCallback((values: any) => { setPropertyType(values) }, []);
    const removeProperType = (item: any) => { setPropertyType(propertyTypes.filter((ele: any) => ele.value !== item.value)) };
    const setPriceRangeMethod = (item: any) => { setMinPrice(item[0]); setMaxPrice(item[1]);};
    const setAcreageRangeMethod = (item: any) => { setMinAcreage(item[0]); setMaxAcreage(item[1]);};

    function applyFilter() {       
        const updateRequest = {...searchRequest, cityCode: city?.code, wardCodes: selectedWards?.map((e: any) => e.code), 
            typeCodes: propertyTypes?.map((ele: any) => ele.value), 
            minPrice: minPrice, maxPrice: maxPrice, minAcreage: minAcreage, maxAcreage: maxAcreage,
            transactionType: searchRequest.transactionType };
        setSearchRequest(updateRequest); 
        setFilterParam(updateRequest);
        onClose();
    }

    function selectTab(value: string) {
        setSearchRequest({ ...searchRequest, transactionType: value });
        switch (value) {
            case "BUY": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy + " " + styles.primaryBtn, btnRent: styles.btnRent, btnProj: styles.btnProj }); break;
            case "RENT": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy, btnRent: styles.btnRent + " " + styles.primaryBtn, btnProj: styles.btnProj }); break;
            case "PROJECT": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy, btnRent: styles.btnRent, btnProj: styles.btnProj + " " + styles.primaryBtn }); break;
        }
    }

    const closePopupAddressClick = useCallback(() => { setAddressPopup(false); setFilterPopup(true); }, []);
    const selectCity = useCallback((city: any) => { setAddressPopup(false); setDistrictPopup(true); setCity(city) }, []);
    const closeDistrict = useCallback(() => { setFilterPopup(true); setAddressPopup(false); setDistrictPopup(false); }, []);
    const onBtnAddressClick = useCallback(() => { setAddressPopup(true); setFilterPopup(false); }, []);
    const closeProperType = useCallback(() => { setFilterPopup(true); setProperTypePopup(false); }, []);
    const onBtnProTypeClick = useCallback(() => { setProperTypePopup(true); setFilterPopup(false); }, []);
    
    const openPricePopup = useCallback(() => {setFilterPopup(false);setPricePopup(true)},[]);
    const closePricePopup = useCallback(() => {setFilterPopup(true); setPricePopup(false)}, []);

    const openAcreagePopup = useCallback(() => {setFilterPopup(false);setAcreagePopup(true)},[]);
    const closeAcreagePopup = useCallback(() => {setFilterPopup(true); setAcreagePopup(false)}, []);

    return (
        <div className='h-full'>
            {addressPopup && (<AddressFilterPopup onClose={closePopupAddressClick} cities={cities} selectCity={selectCity} />)}
            {districtPopup && (<WardPopup onClose={closeDistrict} city={city} wardList={wards} selectWard={setSelectedWards} />)}
            {properTypePopup && (<PropertyTypePopup onClose={closeProperType} selectProperType={selectProperType} />)}
            {pricePopup && (<PricePopup onClose={closePricePopup} setRangeMethod={setPriceRangeMethod}/>)}
            {acreagePopup && (<AcreagePopup onClose={closeAcreagePopup} setRangeMethod={setAcreageRangeMethod}/>)}
            {filterPopup && (
                <div>
                    <div className={styles.filterContainer}>
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
                                    {selectedWards.map((element: any) => (
                                        <div className={styles.criteria} key={element.code}>
                                            <p className={styles.criTitle}>{element.name}</p>
                                            <button onClick={() => removeSelectedWard(element)}>
                                                <Image className={styles.xIcon} width={16} height={16} alt="" src="/icons/X.svg" />
                                            </button>
                                        </div>
                                    ))}
                                    <div>
                                        <button className={styles.addBtn} onClick={onBtnAddressClick}>
                                            <Image className={styles.xIcon} width={12} height={12} alt="" src="/icons/Plus.svg" />
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
                                    {propertyTypes.map((element: any) => (
                                        <div className={styles.criteria} key={element.value}>
                                            <p className={styles.criTitle}>{element.name}</p>
                                            <button onClick={() =>removeProperType(element)}>
                                                <Image className={styles.xIcon} width={16} height={16} alt="" src="/icons/X.svg" />
                                            </button>
                                        </div>
                                    ))}                                   
                                    <div>
                                        <button className={styles.addBtn} onClick={onBtnProTypeClick}>
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
                                <button className={styles.itemBody} onClick={openPricePopup}>
                                    <Image width={11} height={11} alt="" src="/icons/CurrencyCircleDollar.svg" />
                                    {!(minPrice && maxPrice)?(<p>Tất cả</p>):(<p>{minPrice/1000000000} - {maxPrice/1000000000} tỷ</p>) }
                                    <Image className={styles.caretRightIcon} width={11} height={11} alt="" src="/icons/CaretRight.svg" />
                                </button>
                            </div>
                            <div className={styles.acreageBlock}>
                                <div className={styles.itemTitle}>
                                    <p>Diện tích</p>
                                </div>
                                <button className={styles.itemBody} onClick={openAcreagePopup}>
                                    <Image width={11} height={11} alt="" src="/icons/CurrencyCircleDollar.svg" />
                                    {!(minAcreage && maxAcreage)?(<p>Tất cả</p>):(<p>{minAcreage} - {maxAcreage} m2</p>) }
                                    <Image className={styles.caretRightIcon} width={11} height={11} alt="" src="/icons/CaretRight.svg" />
                                </button>
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <div className={styles.resetBlock}>
                                <button className={styles.btnReset}>Đặt lại</button>
                            </div>
                            <div className={styles.applyBlock}>
                                <button className={styles.btnApply} onClick={applyFilter}>Áp dụng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}