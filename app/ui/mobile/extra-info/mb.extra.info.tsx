import Link from "next/link";
import styles from "./index.module.css";
import Image from "next/image";

export default function ExtraInfo() {
    return (
        <div className={styles.panner}>
            <div className={styles.subPanner}>
                <Link href="to-be/continue" className={styles.nativateText}>
                    <div className={styles.filter}>Chủ đề nổi bật</div>
                    <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                </Link>
            </div>
            <div className={styles.subPanner}>
                <Link href="to-be/continue" className={styles.nativateText}>
                    <div className={styles.filter}>Bất động sản bán</div>
                    <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                </Link>
            </div>
            <div className={styles.subPanner}>
                <Link href="to-be/continue" className={styles.nativateText}>
                    <div className={styles.filter}>Bất động sản cho thuê</div>
                    <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                </Link>
            </div>
            <div className={styles.subPanner}>
                <Link href="to-be/continue" className={styles.nativateText}>
                    <div className={styles.filter}>Dự án nổi bật</div>
                    <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                </Link>
            </div>
            <div className={styles.subPanner}>
                <Link href="to-be/continue" className={styles.nativateText}>
                    <div className={styles.filter}>Chủ đầu tư nổi bật</div>
                    <Image className={styles.searchIcon} width={12} height={12} alt="" src="/icons/CaretRight.svg" />
                </Link>
            </div>
        </div>
    );
}