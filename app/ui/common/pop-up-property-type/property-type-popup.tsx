import Image from "next/image";
import styles from "./popup.module.css";
import Form from "next/form";

export default function PropertyTypePopup({ onClose }: any) {

    const properTypes = [{ name: "Tất cả nhà bán", value: "ALL", checked: false, image: "/icons/BuildingApartment.svg" }, { name: "Căn hộ chung cư", value: "CHCC", checked: false, image:"/icons/Building.svg" },
         { name: "Nhà riêng, biệt thự, nhà phố", value: "NHA_RIENG", checked: false, image: "/icons/HouseLine.svg" },
    { name: "Đất nền", value: "DAT_NEN", checked: false, image: "/icons/BaseSquare.svg" }, { name: "Condotel", value: "CONDOTEL", checked: false, image: "/icons/Condotel.svg" },
    { name: "Kho, nhà xưởng", value: "KHO_NHA_XUONG", checked: false, image: "/icons/Warehouse.svg" }, { name: "Bất động sản khác", value: "BDS_KHAC", checked: false, image: "/icons/OtherProperty.svg" }        
    ];

    const submit = () => {

    }
    return (
        <Form action={submit} className={styles.container}>
            <div className={styles.headerPopup}>
                <div className={styles.loiBtNgSnParent}>
                    <div className={styles.loiBtNg}>Loại bất động sản</div>
                    <button onClick={onClose}>
                        <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg" />
                    </button>
                </div>
            </div>
            <div className={styles.bodyPopup}>
                {properTypes.map((element: any) => (
                    <div className={styles.frameParent} key={element.value}>
                        <div className={styles.buildingapartmentParent}>
                            <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src={element.image} />
                            <p>{element.name}</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name={element.value} value={element.value} className={styles.checkbox} />
                        </div>                                                
                    </div>
                ))}

            </div>
            <div className={styles.footerPopup}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>
        </Form>);
}