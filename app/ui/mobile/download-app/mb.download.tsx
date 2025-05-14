import Image from "next/image";
import styles from "./index.module.css";

export default function DownloadApp() {
    return (
        <div className={styles.downloadApp}>
            <div className={styles.tiNgDngWrapper}>
                <div className={styles.filter}>{`Tải ứng dụng `}</div>
            </div>
            <div className={styles.appleStoreParent}>
                <Image className={styles.appleStoreIcon} width={108} height={32} alt="" src="/icons/apple_store.svg" />
                <Image className={styles.googlePlay2} width={108} height={32} alt="" src="/icons/google_play.svg" />
            </div>
        </div>
    );
}