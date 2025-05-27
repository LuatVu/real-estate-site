"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import MbFooter from "../ui/mobile/footer/mb.footer";
import DownloadApp from "../ui/mobile/download-app/mb.download";
import ExtraInfo from "../ui/mobile/extra-info/mb.extra.info";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";


export default function Posts() {
    const screenSize = useScreenSize();

    return (
        <div>
            {screenSize === 'sm' ? (<MobilePosts />) : (<DesktopPosts />)}
        </div>
    );

}

function MobilePosts() {
    const images = [
        // {
        //     url: "/temp/Frame_7.jpg",
        //     caption: "Image for test"
        // },
        {
            url: "/temp/1.jpg",
            caption: "Image for test"
        },
        {
            url: "/temp/2.jpg",
            caption: "Image for test"
        },
        {
            url: "/temp/11.jpg",
            caption: "Image for test"
        },
        {
            url: "/temp/13.jpg",
            caption: "Image for test"
        },
        {
            url: "/temp/25.jpg",
            caption: "Image for test"
        },
        {
            url: "/temp/27.jpg",
            caption: "Image for test"
        }
    ];

    return (
        <div className="h-full">
            <div className={styles.rootContainer}>
                <NavBarMobile displayNav={true} />
                <div className={styles.postContainer}>
                    <div className="slide-container">
                        <Carousel infiniteLoop dynamicHeight={true}>
                            {images.map((img, index) => (
                                <img alt="" src={img.url} />
                            ))}
                        </Carousel>
                    </div>
                    <div className={styles.headingBlock}>
                        <h1 className="heading-h9">Nhà mới đẹp ở ngay, HTX vào nhà Nguyễn Văn Nghị P7 Gò Vấp, 3PN 7.7 tỷ</h1>
                        <p className={styles.subHeading + " body-sm"}>Đường nguyễn văn nghi, phường 7, quận Gò Vấp, Hồ Chí Minh</p>
                    </div>
                    <div className={styles.briefProperty}>
                        <div>
                            <p className={styles.subHeading + " body-sm"}>Mức giá</p>
                            <p className="body-sm">4.56 tỷ</p>
                        </div>
                        <div>
                            <p className={styles.subHeading + " body-sm"}>Diện tích</p>
                            <p className="body-sm">57m2</p>
                        </div>
                        <div>
                            <p className={styles.subHeading + " body-sm"}>Phòng ngủ</p>
                            <p className="body-sm">4 PN</p>
                        </div>
                    </div>
                    <div className={styles.descrip}>
                        <div className="heading-h9">
                            <p>Thông tin mô tả</p>
                        </div>
                        <div className="body-sm">
                            <p>Giảm gấp 400 triệu  nhà Nguyễn Văn Nghi 4 tầng - 57m2 bán để đi định cư Mỹ cùng gia đình.</p>
                            <p>Vị trí: Đường Nguyễn Văn Nghi, phường 7, Quận Gò Vấp.</p>
                            <p>Diện tích: 56m2</p>
                            <p>Gồm 4 phòng ngủ và 4 nhà vệ sinh, gara oto, phòng bếp, ban công.</p>
                            <p>Đang có hợp đồng cho thuê 19 triệu/ thang.
                                Sổ hồng riêng chính chủ, bao công chứng, thẩm định vay được 70%.
                                Cam kết: Thông tin chính xác khách quan - trung thực.</p>
                        </div>
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