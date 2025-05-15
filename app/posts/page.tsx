"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import MbFooter from "../ui/mobile/footer/mb.footer";
import DownloadApp from "../ui/mobile/download-app/mb.download";
import ExtraInfo from "../ui/mobile/extra-info/mb.extra.info";
import Link from "next/link";

export default function Posts() {
    const screenSize = useScreenSize();
    return (
        <div>
            {screenSize === 'sm' ? (<MobilePosts />) : (<DesktopPosts />)}
        </div>
    );

}

function MobilePosts() {
    return (
        <div className="h-full">
            <div className={styles.rootContainer}>         
                <NavBarMobile displayNav={true} />
                <div className={styles.postContainer}>
                    <div className={styles.imageBlk}>
                        <Link href={"/123423232-232"} className={styles.post}>
                            <Image className={styles.postChild} width={197} height={100} alt="" src="/temp/Frame_7.jpg" />                                
                        </Link>
                        <Link href={"/123423232-232"} className={styles.post}>
                            <Image className={styles.postChild} width={197} height={100} alt="" src="/temp/Frame_7.jpg" />                                
                        </Link>
                        <Link href={"/123423232-232"} className={styles.post}>
                            <Image className={styles.postChild} width={197} height={100} alt="" src="/temp/Frame_7.jpg" />                                
                        </Link>
                        <Link href={"/123423232-232"} className={styles.post}>
                            <Image className={styles.postChild} width={197} height={100} alt="" src="/temp/Frame_7.jpg" />                                
                        </Link>                                           
                    </div>

                    <div>
                        <h1>Nhà mới đẹp ở ngay, HTX vào nhà Nguyễn Văn Nghị P7 Gò Vấp, 3PN 7.7 tỷ</h1>
                        <p>Thông tin mô tả</p>
                        <p>Giảm gấp 400 triệu nhà Nguyễn Văn Nghị 4 tầng - 57m2 bán để đi định cư Mỹ cùng gia đình</p>
                    </div>
                    <div>
                        <h1>Nhà mới đẹp ở ngay, HTX vào nhà Nguyễn Văn Nghị P7 Gò Vấp, 3PN 7.7 tỷ</h1>
                        <p>Thông tin mô tả</p>
                        <p>Giảm gấp 400 triệu nhà Nguyễn Văn Nghị 4 tầng - 57m2 bán để đi định cư Mỹ cùng gia đình</p>
                    </div>
                    <div>
                        <h1>Nhà mới đẹp ở ngay, HTX vào nhà Nguyễn Văn Nghị P7 Gò Vấp, 3PN 7.7 tỷ</h1>
                        <p>Thông tin mô tả</p>
                        <p>Giảm gấp 400 triệu nhà Nguyễn Văn Nghị 4 tầng - 57m2 bán để đi định cư Mỹ cùng gia đình</p>
                    </div>
                    <div>
                        <h1>Nhà mới đẹp ở ngay, HTX vào nhà Nguyễn Văn Nghị P7 Gò Vấp, 3PN 7.7 tỷ</h1>
                        <p>Thông tin mô tả</p>
                        <p>Giảm gấp 400 triệu nhà Nguyễn Văn Nghị 4 tầng - 57m2 bán để đi định cư Mỹ cùng gia đình</p>
                    </div>
                    <div>
                        <h1>Nhà mới đẹp ở ngay, HTX vào nhà Nguyễn Văn Nghị P7 Gò Vấp, 3PN 7.7 tỷ</h1>
                        <p>Thông tin mô tả</p>
                        <p>Giảm gấp 400 triệu nhà Nguyễn Văn Nghị 4 tầng - 57m2 bán để đi định cư Mỹ cùng gia đình</p>
                    </div>
                    <div>
                        <h1>Nhà mới đẹp ở ngay, HTX vào nhà Nguyễn Văn Nghị P7 Gò Vấp, 3PN 7.7 tỷ</h1>
                        <p>Thông tin mô tả</p>
                        <p>Giảm gấp 400 triệu nhà Nguyễn Văn Nghị 4 tầng - 57m2 bán để đi định cư Mỹ cùng gia đình</p>
                    </div>
                </div>
                <ExtraInfo />
                <DownloadApp />
                <MbFooter />

            </div>
        </div>
    );
}

function DesktopPosts() {
    return (
        <div></div>
    );
}