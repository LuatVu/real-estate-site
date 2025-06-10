import Image from "next/image";
import styles from "./popup.module.css";
import Form from "next/form";

export default function PropertyTypePopup({onClose }: any) {
    const submit = () =>{

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
                <div className={styles.frameParent}>
                    <div className={styles.buildingapartmentParent}>
                        <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src="/icons/BuildingApartment.svg" />
                        <div className={styles.ttCNh}>Tất cả nhà bán</div>
                    </div>                  
                    <input type="checkbox" name="all_property" value="all_property" className={styles.frameItem} />
                    <div className={styles.lineDiv} />
                </div>
                <div className={styles.frameGroup}>
                    <div className={styles.buildingParent}>
                        <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src="/icons/Building.svg" />
                        <div className={styles.cnHChung}>Căn hộ chung cư</div>
                    </div>
                    <input type="checkbox" name="CC" value="CC" className={styles.frameInner} />
                    <div className={styles.lineDiv} />
                </div>
                <div className={styles.frameContainer}>
                    <div className={styles.buildingParent}>
                        <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src="/icons/HouseLine.svg" />
                        <div className={styles.nhRingBit}>Nhà riêng, biệt thự, nhà phố, shophouse</div>
                    </div>
                    <input type="checkbox" name="shophouse" value="shophouse" className={styles.frameInner} />
                    <div className={styles.lineDiv} />
                </div>
                <div className={styles.frameParent1}>
                    <div className={styles.buildingParent}>
                        <Image className={styles.vectorIcon} width={16} height={12} alt="" src="/icons/BaseSquare.svg" />
                        <div className={styles.nhRingBit}>Đất nền</div>
                    </div>
                    <input type="checkbox" name="basesquare" value="basesquare" className={styles.frameInner} />
                    <div className={styles.lineDiv} />
                </div>
                <div className={styles.frameParent2}>
                    <div className={styles.buildingParent}>
                        <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src="/icons/Condotel.svg" />
                        <div className={styles.nhRingBit}>Condotel</div>
                    </div>
                    <input type="checkbox" name="condotel" value="condotel" className={styles.frameInner} />
                    <div className={styles.lineDiv} />
                </div>
                <div className={styles.frameParent3}>
                    <div className={styles.buildingParent}>
                        <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src="/icons/Warehouse.svg" />
                        <div className={styles.nhRingBit}>Kho, nhà xưởng</div>
                    </div>
                    <input type="checkbox" name="warehouse" value="warehouse" className={styles.frameInner} />
                    <div className={styles.lineDiv} />
                </div>
                <div className={styles.frameParent4}>
                    <div className={styles.buildingParent}>
                        <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src="/icons/OtherProperty.svg" />
                        <div className={styles.nhRingBit}>Bất động sản khác</div>
                    </div>
                    <input type="checkbox" name="others" value="others" className={styles.frameInner} />
                    <div className={styles.lineDiv} />
                </div>
            </div>
            <div className={styles.footerPopup}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>
        </Form>);
}