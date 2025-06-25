"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import MbFooter from "../ui/mobile/footer/mb.footer";
import DownloadApp from "../ui/mobile/download-app/mb.download";
import ExtraInfo from "../ui/mobile/extra-info/mb.extra.info";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Posts() {
    const screenSize = useScreenSize();

    return (
        <div>
            {screenSize === 'sm' ? (<MobilePosts />) : (<DesktopPosts />)}
        </div>
    );

}

function MobilePosts() {
    const searchParams = useSearchParams();
    const [post, setPost] = useState<any>(undefined);
    

    const fetchPost = async() =>{
        try{
            const postId = searchParams.get("postId");            
            const response = await fetch(`api/posts?postId=${postId}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const searchResult = await response.json();
            setPost(searchResult.response);
        }catch (error){

        }
    }

    useEffect(()=>{
        fetchPost();
    }, [searchParams]);

    const images = [        
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
                        <h1 className="heading-h9">{post?.title}</h1>
                        <p className={styles.subHeading + " body-sm"}>{post?.address}</p>
                    </div>
                    <div className={styles.briefProperty}>
                        <div>
                            <p className={styles.subHeading + " body-sm"}>Mức giá</p>
                            <p className="body-sm">{post?.price}</p>
                        </div>
                        <div>
                            <p className={styles.subHeading + " body-sm"}>Diện tích</p>
                            <p className="body-sm">{post?.acreage}</p>
                        </div>
                        <div>
                            <p className={styles.subHeading + " body-sm"}>Phòng ngủ</p>
                            <p className="body-sm">{post?.bedrooms}</p>
                        </div>
                    </div>
                    <div className={styles.descrip}>
                        <div className="heading-h9">
                            <p>Thông tin mô tả</p>
                        </div>
                        <div className="body-sm">
                            {post?.description}
                        </div>
                    </div>
                    <div className={styles.descrip}>
                        <div className="heading-h9">
                            <p>Đặc điểm bất động sản</p>
                        </div>
                        <div className={styles.featureProperty}>
                            <div className={styles.featureItem}>
                                <div className={styles.featureTitle}>
                                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt=""></Image>
                                    <p>Mức giá</p>
                                </div>
                                <div className={styles.featureValue}><p>{post?.price}</p></div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureTitle}>
                                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt=""></Image>
                                    <p>Diện tích</p>
                                </div>
                                <div className={styles.featureValue}><p>{post?.acreage}</p></div>
                            </div> 
                            <div className={styles.featureItem}>
                                <div className={styles.featureTitle}>
                                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt=""></Image>
                                    <p>Số phòng ngủ</p>
                                </div>
                                <div className={styles.featureValue}><p>{post?.bedrooms}</p></div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureTitle}>
                                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt=""></Image>
                                    <p>Số phòng tắm, vệ sinh</p>
                                </div>
                                <div className={styles.featureValue}><p>{post?.bathrooms}</p></div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureTitle}>
                                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt=""></Image>
                                    <p>Số tầng</p>
                                </div>
                                <div className={styles.featureValue}><p>{post?.floors}</p></div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureTitle}>
                                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt=""></Image>
                                    <p>Pháp lý</p>
                                </div>
                                <div className={styles.featureValue}><p>{post?.legal}</p></div>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureTitle}>
                                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt=""></Image>
                                    <p>Nội thất</p>
                                </div>
                                <div className={styles.featureValue}><p>{post?.furniture}</p></div>
                            </div>
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