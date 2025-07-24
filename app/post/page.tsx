"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import MbFooter from "../ui/mobile/footer/mb.footer";
import DownloadApp from "../ui/mobile/download-app/mb.download";
import ExtraInfo from "../ui/mobile/extra-info/mb.extra.info";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

    return (
        <div className="h-full">
            <div className={styles.rootContainer}>
                <NavBarMobile displayNav={true} />
                <div className={styles.postContainer}>
                    <div className="slide-container">
                        <Swiper loop={true} navigation pagination={{type: 'bullets', clickable: true}} modules={[Navigation, Pagination]} onSwiper={swiper => console.log(swiper)} className='h-100 w-full rounded-lg'>
                            {post?.images?.map((img: any, index: any) =>(
                                <SwiperSlide key={index}>
                                    <div className='flex h-full w-full items-center justify-center'>
                                        <Image src={"http://localhost:8080/api/public/images/" + img.fileName} width={800} height={500} alt="" className='block h-full w-full object-cover' loading={index < 1? "eager": "lazy"}/>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
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