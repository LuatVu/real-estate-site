"use client";
import styles from "./filter-popup.module.css";
import Image from "next/image";
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { transformSearchRequest } from '../../../utils/transform.param';
import AddressFilterPopup from "../popup-filter-address/address-popup";
import WardPopup from "../popup-district/ward-popup";
import PropertyTypePopup from "../pop-up-property-type/property-type-popup";
import PricePopup from "../popup-price/price-popup";
import AcreagePopup from "../acreage-popup/acreage-popup";

export default function FilterPopup({ onClose, setFilterParam, filterParam }: any) {
    const router = useRouter();
    const [searchRequest, setSearchRequest] = useState(filterParam);
    const [tabBtnState, setTabBtnState] = useState({
        btnBuy: filterParam.transactionType == "SELL" ? styles.btnBuy + " " + styles.primaryBtn : styles.btnBuy,
        btnRent: filterParam.transactionType == "RENT" ? styles.btnRent + " " + styles.primaryBtn : styles.btnRent,
        btnProj: filterParam.transactionType == "PROJECT" ? styles.btnProj + " " + styles.primaryBtn : styles.btnProj
    });
    const [addressPopup, setAddressPopup] = useState(false);
    const [wardPopup, setWardPopup] = useState(false);
    const [filterPopup, setFilterPopup] = useState(true);
    const [properTypePopup, setProperTypePopup] = useState(false);
    const [pricePopup, setPricePopup] = useState(false);
    const [acreagePopup, setAcreagePopup] = useState(false);

    const [selectedWards, setSelectedWards] = useState([]);
    const [city, setCity] = useState<any>();
    const [propertyTypes, setPropertyType] = useState([]);
    const [minPrice, setMinPrice] = useState<number | undefined>(filterParam.minPrice);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(filterParam.maxPrice);
    const [minAcreage, setMinAcreage] = useState<number | undefined>(filterParam.minAcreage);
    const [maxAcreage, setMaxAcreage] = useState<number | undefined>(filterParam.maxAcreage);
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
            
            // If there are existing ward codes in filterParam, update selectedWards with proper names
            if (filterParam.wardCodes && filterParam.wardCodes.length > 0) {
                const selectedWardsWithNames = data.filter((ward: any) => 
                    filterParam.wardCodes.includes(ward.code)
                );
                setSelectedWards(selectedWardsWithNames);
            }
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

    // Initialize state with existing filter values
    useEffect(() => {
        // Initialize selected wards if they exist in filterParam
        if (filterParam.wardCodes && filterParam.wardCodes.length > 0) {
            // We'll need to get the ward names from the API or store them differently
            // For now, create objects with code and placeholder names
            const wardObjects = filterParam.wardCodes.map((code: string) => ({
                code: code,
                name: `Ward ${code}` // This should be replaced with actual ward names
            }));
            setSelectedWards(wardObjects);
        }

        // Initialize property types if they exist in filterParam
        if (filterParam.typeCodes && filterParam.typeCodes.length > 0) {
            // Create property type objects with codes and names matching property-type-popup.tsx
            const typeMapping: { [key: string]: string } = {
                'ALL': 'Tất cả nhà bán',
                'CHCC': 'Căn hộ chung cư',
                'NHA_RIENG': 'Nhà riêng, biệt thự, nhà phố',
                'DAT_NEN': 'Đất nền',
                'CONDOTEL': 'Condotel',
                'KHO_NHA_XUONG': 'Kho, nhà xưởng',
                'BDS_KHAC': 'Bất động sản khác'
            };
            
            const typeObjects = filterParam.typeCodes.map((code: string) => ({
                value: code,
                name: typeMapping[code] || code // Use mapping or fallback to code
            }));
            setPropertyType(typeObjects);
        }

        // Initialize city if it exists in filterParam
        if (filterParam.cityCode) {
            // We'll set this when cities are loaded
            // For now, create a placeholder city object
            setCity({
                code: filterParam.cityCode,
                name: `City ${filterParam.cityCode}` // This should be replaced with actual city name
            });
        }
    }, [filterParam]);

    // Update city object when cities data is loaded
    useEffect(() => {
        if (cities && filterParam.cityCode && Array.isArray(cities)) {
            const foundCity = cities.find((c: any) => c.code === filterParam.cityCode);
            if (foundCity) {
                setCity(foundCity);
            }
        }
    }, [cities, filterParam.cityCode]);

    // Update all states when filterParam changes (for when component is reused)
    useEffect(() => {
        setMinPrice(filterParam.minPrice);
        setMaxPrice(filterParam.maxPrice);
        setMinAcreage(filterParam.minAcreage);
        setMaxAcreage(filterParam.maxAcreage);
        setSearchRequest(filterParam);
        
        // Update tab button state
        setTabBtnState({
            btnBuy: filterParam.transactionType == "SELL" ? styles.btnBuy + " " + styles.primaryBtn : styles.btnBuy,
            btnRent: filterParam.transactionType == "RENT" ? styles.btnRent + " " + styles.primaryBtn : styles.btnRent,
            btnProj: filterParam.transactionType == "PROJECT" ? styles.btnProj + " " + styles.primaryBtn : styles.btnProj
        });
    }, [filterParam]);

    // const setSelectedWardsFC = useCallback((values: any) => { setSelectedWards(values) }, []);
    const removeSelectedWard = (item: any) => { setSelectedWards(selectedWards.filter((ele: any) => ele.code !== item.code)) };

    const selectProperType = useCallback((values: any) => { 
        console.log('selectProperType called with:', values);
        setPropertyType(values) 
    }, []);
    const removeProperType = (item: any) => { setPropertyType(propertyTypes.filter((ele: any) => ele.value !== item.value)) };
    const setPriceRangeMethod = (item: any) => { setMinPrice(item[0]); setMaxPrice(item[1]);};
    const setAcreageRangeMethod = (item: any) => { setMinAcreage(item[0]); setMaxAcreage(item[1]);};

    function applyFilter() {
        // Handle empty arrays properly - pass undefined instead of empty array
        const mappedTypeCodes = propertyTypes && propertyTypes.length > 0 ? propertyTypes.map((ele: any) => ele.value) : undefined;
        const mappedWardCodes = selectedWards && selectedWards.length > 0 ? selectedWards.map((e: any) => e.code) : undefined;
        
        const updateRequest = {...searchRequest, 
            cityCode: city?.code, 
            wardCodes: mappedWardCodes, 
            typeCodes: mappedTypeCodes, 
            minPrice: minPrice, 
            maxPrice: maxPrice, 
            minAcreage: minAcreage, 
            maxAcreage: maxAcreage,
            transactionType: searchRequest.transactionType };
        
        setSearchRequest(updateRequest); 
        setFilterParam(updateRequest);
        
        // Transform search request and navigate to posts page with filters - similar to search() method
        const postSearchRequest = transformSearchRequest(updateRequest);
        const newUrl = `/posts?${postSearchRequest}&page=1`;
        router.push(newUrl);
        onClose();
    }

    function resetFilters() {
        // Reset all filter states to default values
        setSelectedWards([]);
        setCity(undefined);
        setPropertyType([]);
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setMinAcreage(undefined);
        setMaxAcreage(undefined);
        
        // Reset search request to default
        const defaultRequest = {
            minPrice: undefined, 
            maxPrice: undefined,
            minAcreage: undefined, 
            maxAcreage: undefined, 
            typeCodes: undefined, 
            cityCode: undefined,
            wardCodes: undefined, 
            transactionType: "SELL", 
            query: ""
        };
        setSearchRequest(defaultRequest);
        
        // Reset tab button state
        setTabBtnState({
            btnBuy: styles.btnBuy + " " + styles.primaryBtn,
            btnRent: styles.btnRent,
            btnProj: styles.btnProj
        });
    }

    function selectTab(value: string) {
        setSearchRequest({ ...searchRequest, transactionType: value });
        switch (value) {
            case "SELL": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy + " " + styles.primaryBtn, btnRent: styles.btnRent, btnProj: styles.btnProj }); break;
            case "RENT": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy, btnRent: styles.btnRent + " " + styles.primaryBtn, btnProj: styles.btnProj }); break;
            case "PROJECT": setTabBtnState({ ...tabBtnState, btnBuy: styles.btnBuy, btnRent: styles.btnRent, btnProj: styles.btnProj + " " + styles.primaryBtn }); break;
        }
    }

    const closePopupAddressClick = useCallback(() => { setAddressPopup(false); setFilterPopup(true); }, []);
    const selectCity = useCallback((city: any) => { setAddressPopup(false); setWardPopup(true); setCity(city) }, []);
    const closeWard = useCallback(() => { setFilterPopup(true); setAddressPopup(false); setWardPopup(false); }, []);
    const backToAddress = useCallback(() => { setWardPopup(false); setAddressPopup(true); }, []);
    const onBtnAddressClick = useCallback(() => { 
        // If city is already selected, go directly to WardPopup
        if (city && city.code) {
            setFilterPopup(false);
            setWardPopup(true);
        } else {
            // If no city selected, go to AddressFilterPopup first
            setAddressPopup(true); 
            setFilterPopup(false);
        }
    }, [city]);
    const closeProperType = useCallback(() => { setFilterPopup(true); setProperTypePopup(false); }, []);
    const onBtnProTypeClick = useCallback(() => { setProperTypePopup(true); setFilterPopup(false); }, []);
    
    const openPricePopup = useCallback(() => {setFilterPopup(false);setPricePopup(true)},[]);
    const closePricePopup = useCallback(() => {setFilterPopup(true); setPricePopup(false)}, []);

    const openAcreagePopup = useCallback(() => {setFilterPopup(false);setAcreagePopup(true)},[]);
    const closeAcreagePopup = useCallback(() => {setFilterPopup(true); setAcreagePopup(false)}, []);

    return (
        <div className='h-full'>
            {addressPopup && (<AddressFilterPopup onClose={closePopupAddressClick} cities={cities} selectCity={selectCity} />)}
            {wardPopup && (<WardPopup onClose={closeWard} city={city} wardList={wards} selectWard={setSelectedWards} selectedWards={selectedWards} back2Address={backToAddress} />)}
            {properTypePopup && (<PropertyTypePopup onClose={closeProperType} selectProperType={selectProperType} selectedPropertyTypes={propertyTypes} />)}
            {pricePopup && (<PricePopup onClose={closePricePopup} setRangeMethod={setPriceRangeMethod} currentMinPrice={minPrice} currentMaxPrice={maxPrice} />)}
            {acreagePopup && (<AcreagePopup onClose={closeAcreagePopup} setRangeMethod={setAcreageRangeMethod} currentMinAcreage={minAcreage} currentMaxAcreage={maxAcreage} />)}
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
                                <button name="btnBuy" className={tabBtnState.btnBuy} onClick={() => selectTab("SELL")}>Mua bán</button>
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
                                        <button className={styles.addBtn} onClick={() => {
                                            console.log('Current propertyTypes before opening popup:', propertyTypes);
                                            onBtnProTypeClick();
                                        }}>
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
                                <button className={styles.btnReset} onClick={resetFilters}>Đặt lại</button>
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