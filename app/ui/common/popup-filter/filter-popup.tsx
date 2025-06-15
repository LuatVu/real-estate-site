"use client";
import styles from "./filter-popup.module.css";
import Image from "next/image";
import { useState, useCallback } from 'react';
import AddressFilterPopup from "../popup-filter-address/address-popup";
import DistrictPopup from "../popup-district/district-popup";
import PropertyTypePopup from "../pop-up-property-type/property-type-popup";
import PricePopup from "../popup-price/price-popup";
import AcreagePopup from "../acreage-popup/acreage-popup";

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
    const [properTypePopup, setProperTypePopup] = useState(false);
    const [pricePopup, setPricePopup] = useState(false);
    const [acreagePopup, setAcreagePopup] = useState(false);

    const [districts, setDistricts] = useState([]);
    const [city, setCity] = useState();
    const [propertyTypes, setPropertyType] = useState([]);

    const districtList = [{ name: "Hoàn Kiếm", value: "001", checked: false }, { name: "Cửa Nam", value: "002", checked: false }, { name: "Ba Đình", value: "003", checked: false },
    { name: "Ngọc Hà", value: "004", checked: false }, { name: "Giảng Võ", value: "005", checked: false }, { name: "Hà Bà Trưng", value: "006", checked: false },
    { name: "Vĩnh Tuy", value: "007", checked: false }, { name: "Bạch Mai", value: "008", checked: false }, { name: "Đống Đa", value: "009", checked: false },
    { name: "Kim Liên", value: "010", checked: false }
    ];

    const cities = [{ name: "Hà Nội", code: "01", image: "/city/HaNoi.jpg" }, { name: "Hồ Chí Minh", code: "02", image: "/city/HoChiMinh.jpg" }, { name: "An Giang", code: "03", image: "/city/AnGiang.jpg" }, { name: "Bắc Ninh", code: "04", image: "/city/BacNinh.jpg" }, { name: "Cà Mau", code: "05", image: "/city/CaMau.jpg" },
    { name: "Cần Thơ", code: "06", image: "/city/CanTho.jpg" }, { name: "Cao Bằng", code: "07", image: "/city/CaoBang.jpg" }, { name: "Đà Nẵng", code: "08", image: "/city/DaNang.jpg" }, { name: "Đắc Lắc", code: "09", image: "/city/DakLak.jpg" }, { name: "Điện Biên", code: "10", image: "/city/DienBien.jpg" }, { name: "Đồng Nai", code: "11", image: "/city/DongNai.jpg" },
    { name: "Đồng Tháp", code: "12", image: "/city/DongThap.jpg" }, { name: "Giai Lai", code: "13", image: "/city/GiaLai.jpg" }, { name: "Hà Tĩnh", code: "14", image: "/city/HaTinh.jpg" }, { name: "Hải Phòng", code: "15", image: "/city/HaiPhong.jpg" }, { name: "Huế", code: "16", image: "/city/Hue.jpg" }, { name: "Hưng Yên", code: "17", image: "/city/HungYen.jpg" },
    { name: "Khánh Hòa", code: "18", image: "/city/KhanhHoa.jpg" }, { name: "Lai Châu", code: "19", image: "/city/LaiChau.jpg" }, { name: "Lâm Đồng", code: "20", image: "/city/LamDong.jpg" }, { name: "Lạng Sơn", code: "21", image: "/city/LangSon.jpg" }, { name: "Lào Cai", code: "22", image: "/city/LaoCai.jpg" }, { name: "Nghệ An", code: "23", image: "/city/NgheAn.jpg" },
    { name: "Ninh Bình", code: "24", image: "/city/NinhBinh.jpg" }, { name: "Phú Thọ", code: "25", image: "/city/PhuTho.jpg" }, { name: "Quảng Ngãi", code: "26", image: "/city/QuangNgai.jpg" }, { name: "Quảng Ninh", code: "27", image: "/city/QuangNinh.jpg" }, { name: "Quảng Trị", code: "28", image: "/city/QuangTri.jpg" }, { name: "Sơn La", code: "29", image: "/city/SonLa.jpg" },
    { name: "Tây Ninh", code: "30", image: "/city/TayNinh.jpg" }, { name: "Thái Nguyên", code: "31", image: "/city/ThaiNguyen.jpg" }, { name: "Thanh Hóa", code: "32", image: "/city/ThanhHoa.jpg" }, { name: "Tuyên Quang", code: "33", image: "/city/TuyenQuang.jpg" }, { name: "Vĩnh Long", code: "34", image: "/city/VinhLong.jpg" }
    ];

    const selectedDistrict = useCallback((values: any) => { setDistricts(values) }, []);
    const removeDistrict = (item: any) => { setDistricts(districts.filter((ele: any) => ele.value !== item.value)) };

    const selectProperType = useCallback((values: any) => { setPropertyType(values) }, []);
    const removeProperType = (item: any) => { setPropertyType(propertyTypes.filter((ele: any) => ele.value !== item.value)) };
    const setRangeMethod = (item: any) => { console.log("Price Range: " + item[0] + " - " + item[1])};
    const setAcreageRangeMethod = (item: any) => {console.log("Price Range: " + item[0] + " - " + item[1])};

    function applyFilter() {       
        const updateRequest = {...searchRequest, city: city, districts: districts, propertyTypes: propertyTypes};
        setSearchRequest(updateRequest); 
        setFilterParam(updateRequest);
        onClose();
    }

    function selectTab(value: string) {
        setSearchRequest({ ...searchRequest, tab: value });
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
            {districtPopup && (<DistrictPopup onClose={closeDistrict} city={city} districtList={districtList} selectDistrict={selectedDistrict} />)}
            {properTypePopup && (<PropertyTypePopup onClose={closeProperType} selectProperType={selectProperType} />)}
            {pricePopup && (<PricePopup onClose={closePricePopup} setRangeMethod={setRangeMethod}/>)}
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
                                    {districts.map((element: any) => (
                                        <div className={styles.criteria} key={element.value}>
                                            <p className={styles.criTitle}>{element.name}</p>
                                            <button onClick={() => removeDistrict(element)}>
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
                                    <p>Tất cả</p>
                                    <Image className={styles.caretRightIcon} width={11} height={11} alt="" src="/icons/CaretRight.svg" />
                                </button>
                            </div>
                            <div className={styles.acreageBlock}>
                                <div className={styles.itemTitle}>
                                    <p>Diện tích</p>
                                </div>
                                <button className={styles.itemBody} onClick={openAcreagePopup}>
                                    <Image width={11} height={11} alt="" src="/icons/CurrencyCircleDollar.svg" />
                                    <p>Tất cả</p>
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