import styles from "./filter-address.module.css";
import Image from "next/image";

export default function AddressFilterPopup({ onClose }: any) {
    return (
        <div className={styles.popUpFilterAddress}>
            <div className={styles.headerPopupAddress}>
                <div className={styles.khuVcParent}>
                    <div className={styles.khuVc}>Khu vực</div>
                    <button onClick={onClose}>
                        <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg"  />
                    </button>
                </div>
            </div>
            <div className={styles.bodyPopup}>
                <div className={styles.frameParent}>
                    <div className={styles.hNiWrapper}>
                        <b className={styles.hNi}>Hà Nội</b>
                    </div>
                    <div className={styles.hChMinhWrapper}>
                        <b className={styles.hChMinh}>Hồ Chí Minh</b>
                    </div>
                    <div className={styles.anGiangWrapper}>
                        <b className={styles.anGiang}>An Giang</b>
                    </div>
                    <div className={styles.bcNinhWrapper}>
                        <b className={styles.anGiang}>Bắc Ninh</b>
                    </div>
                    <div className={styles.cMauWrapper}>
                        <b className={styles.cMau}>Cà Mau</b>
                    </div>
                    <div className={styles.cnThWrapper}>
                        <b className={styles.cnTh}>Cần Thơ</b>
                    </div>
                    <div className={styles.caoBngWrapper}>
                        <b className={styles.caoBng}>Cao Bằng</b>
                    </div>
                    <div className={styles.nngWrapper}>
                        <b className={styles.nng}>Đà Nẵng</b>
                    </div>
                    <div className={styles.cLcWrapper}>
                        <b className={styles.cLc}>Đắc Lắc</b>
                    </div>
                    <div className={styles.inBinWrapper}>
                        <b className={styles.caoBng}>Điện Biên</b>
                    </div>
                    <div className={styles.ngNaiWrapper}>
                        <b className={styles.ngNai}>Đồng Nai</b>
                    </div>
                    <div className={styles.ngThpWrapper}>
                        <b className={styles.ngThp}>Đồng Tháp</b>
                    </div>
                    <div className={styles.giaiLaiWrapper}>
                        <b className={styles.giaiLai}>Giai Lai</b>
                    </div>
                    <div className={styles.hTnhWrapper}>
                        <b className={styles.cLc}>Hà Tĩnh</b>
                    </div>
                    <div className={styles.hiPhngWrapper}>
                        <b className={styles.hiPhng}>Hải Phòng</b>
                    </div>
                    <div className={styles.huWrapper}>
                        <b className={styles.hu}>Huế</b>
                    </div>
                    <div className={styles.hngYnWrapper}>
                        <b className={styles.hngYn}>Hưng Yên</b>
                    </div>
                    <div className={styles.khnhHaWrapper}>
                        <b className={styles.ngThp}>Khánh Hòa</b>
                    </div>
                    <div className={styles.laiChuWrapper}>
                        <b className={styles.laiChu}>Lai Châu</b>
                    </div>
                    <div className={styles.lmNgWrapper}>
                        <b className={styles.lmNg}>Lâm Đồng</b>
                    </div>
                    <div className={styles.lngSnWrapper}>
                        <b className={styles.caoBng}>Lạng Sơn</b>
                    </div>
                    <div className={styles.loCaiWrapper}>
                        <b className={styles.giaiLai}>Lào Cai</b>
                    </div>
                    <div className={styles.nghAnWrapper}>
                        <b className={styles.nng}>Nghệ An</b>
                    </div>
                    <div className={styles.ninhBnhWrapper}>
                        <b className={styles.hngYn}>Ninh Bình</b>
                    </div>
                    <div className={styles.phThWrapper}>
                        <b className={styles.cnTh}>Phú Thọ</b>
                    </div>
                    <div className={styles.qungNgiWrapper}>
                        <b className={styles.qungNgi}>Quảng Ngãi</b>
                    </div>
                    <div className={styles.qungNinhWrapper}>
                        <b className={styles.qungNgi}>Quảng Ninh</b>
                    </div>
                    <div className={styles.qungTrWrapper}>
                        <b className={styles.hngYn}>Quảng Trị</b>
                    </div>
                    <div className={styles.snLaWrapper}>
                        <b className={styles.snLa}>Sơn La</b>
                    </div>
                    <div className={styles.tyNinhWrapper}>
                        <b className={styles.laiChu}>Tây Ninh</b>
                    </div>
                    <div className={styles.thiNguynWrapper}>
                        <b className={styles.thiNguyn}>Thái Nguyên</b>
                    </div>
                    <div className={styles.thanhHaWrapper}>
                        <b className={styles.ngThp}>Thanh Hóa</b>
                    </div>
                    <div className={styles.tuynQuangWrapper}>
                        <b className={styles.tuynQuang}>Tuyên Quang</b>
                    </div>
                    <div className={styles.vnhLongWrapper}>
                        <b className={styles.lmNg}>Vĩnh Long</b>
                    </div>
                </div>
            </div>
            <div className={styles.iphone162} />
        </div>
    );
}