import styles from "./filter-address.module.css";
import Image from "next/image";

export default function AddressFilterPopup({ onClose, cities, selectCity }: any) {
    return (
        <div className={styles.popUpFilterAddress}>
            <div className={styles.headerPopupAddress}>
                <div className={styles.khuVcParent}>
                    <div className={styles.khuVc}>Khu vực</div>
                    <button onClick={onClose}>
                        <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg" />
                    </button>
                </div>
            </div>
            <div className={styles.bodyPopup}>
                <div className={styles.frameParent}>
                    {cities.map((element: any) => (
                        <div className={styles.container} onClick={() => selectCity(element)} key={element.code}>
                            <Image src={element.image} className={styles.img_bg} alt={element.name} width={157} height={85} />
                            <b className={styles.hNi}>{element.name}</b>
                        </div>
                    ))}                    
                </div>
            </div>
            <div className={styles.footer} />
        </div>
    );
}