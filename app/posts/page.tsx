"use client";
import styles from './index.module.css';
import useScreenSize from '../lib/useScreenSize';
import { useState, useCallback, useEffect } from 'react';
import FilterPopup from '../ui/common/popup-filter/filter-popup';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import Image from 'next/image';
import Link from 'next/link';
import MbFooter from '../ui/mobile/footer/mb.footer';
import { useSearchParams } from 'next/navigation';
import SearchingSector from '../ui/mobile/searching-sector/searching.sector';
import ExtraInfo from '../ui/mobile/extra-info/mb.extra.info';
import DownloadApp from '../ui/mobile/download-app/mb.download';

export default function Posts() {
    const screenSize = useScreenSize();

    return (
        <div className="h-full">
            {screenSize === 'sm' ? (<PostsOnMobile />) : (<PostOnDesktop />)}
        </div>
    );
}

function PostsOnMobile() {
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [filterPopup, setFilterPopup] = useState(false);
    const [homePageVisible, setHomePageVisible] = useState(true);
    const [searchRequest, setSearchRequest] = useState({
        minPrice: undefined, maxPrice: undefined,
        minAcreage: undefined, maxAcreage: undefined, typeCode: undefined, provinceCode: undefined,
        districtCode: undefined, wardCode: undefined, tab: "BUY", districts: undefined, propertyTypes: undefined,
        city: undefined, priceRange: undefined, acreageRange: undefined, query: ""
    });
    const [filterNum, setFilterNum] = useState(0);

    const fetchPosts = async () => {
        try {
            const body = { query: searchParams.get("query") };

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const searchResults = await response.json();
            setPosts(searchResults.content);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchPosts();
    }, [searchParams])

    const setFilterParam = (data: any) => {
        const updatedSearchRequest = {
            ...searchRequest, minPrice: data.minPrice, maxPrice: data.maxPrice,
            minAcreage: data.minAcreage, maxAcreage: data.maxAcreage,
            typeCode: data.typeCode, provinceCode: data.provinceCode,
            districtCode: data.districtCode, wardCode: data.wardCode, tab: data.tab,
            districts: data.districts, propertyTypes: data.propertyTypes, city: data.city,
            priceRange: data.priceRange, acreageRange: data.acreageRange
        };
        setSearchRequest(updatedSearchRequest);
        const numFilter = countParamNum(updatedSearchRequest);
        setFilterNum(numFilter);
    }

    const countParamNum = (searchRequest: any) => {
        let count: number = 0;
        for (let key in searchRequest) {
            if (searchRequest.hasOwnProperty(key) && isReleventKey(key)) {
                if (searchRequest[key] instanceof Array) {
                    if (searchRequest[key].length > 0) {
                        count = count + 1;
                    }
                } else if (searchRequest[key] != undefined) {
                    count = count + 1;
                }
            }
        }
        return count;
    }

    const isReleventKey = (key: string) => {
        let result: boolean = false;
        switch (key) {
            case "acreageRange": ;
            case "districts": ;
            case "priceRange": ;
            case "propertyTypes": ;
            case "tab": result = true; break;
            default: result = false;
        }
        return result;
    }

    async function search(formData: FormData) {
        const query: any = formData.get('searchKeyword');
        searchRequest.query = query ? query : "";
        const postSearchRequest = transformSearchRequest(searchRequest);
        console.log(postSearchRequest);

        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postSearchRequest)
        });
        const searchResults = await response.json();
        console.log(searchResults);

    }

    function transformSearchRequest(sr: any) {
        const postSearchRequest = {
            query: sr.query,
            minPrice: sr.priceRange ? sr.priceRange[0] : undefined,
            maxPrice: sr.priceRange ? sr.priceRange[1] : undefined,
            minAcreage: sr.acreageRange ? sr.acreageRange[0] : undefined,
            maxAcreage: sr.acreageRange ? sr.acreageRange[1] : undefined,
            cityCode: sr.city?.code,
            typeCodes: sr.propertyTypes?.map((e: any) => e.value),
            wardCodes: sr.districts?.map((e: any) => e.value)
        };
        return postSearchRequest;
    }

    const closeFilterPopup = useCallback(() => {
        setFilterPopup(false);
        setHomePageVisible(true);
    }, []);

    const openFilterPopup = useCallback(() => {
        setFilterPopup(true);
        setHomePageVisible(false);
    }, []);

    return (
        <div className='h-full'>
            {filterPopup && (<FilterPopup onClose={closeFilterPopup} setFilterParam={setFilterParam} filterParam={searchRequest} />)}
            {homePageVisible && (
                <div className={styles.homePage}>
                    <NavBarMobile displayNav={false} />
                    <SearchingSector search={search} openFilterPopup={openFilterPopup} filterNum={filterNum} />
                    <div className={styles.firstMainContent}>
                        <div className={styles.postParent}>
                            {posts.map((element: any) => (
                                <Link href={"/post?postId=" + element.postId} className={styles.post} key={element.postId}>
                                    <Image className={styles.postChild} width={174} height={178} alt="" src="/temp/13.jpg" />
                                    <div className={styles.bnNh2TngWrapper}>
                                        <div className={styles.filter}>{element.title}</div>
                                    </div>
                                    <div className={styles.t130m2Wrapper}>
                                        <div className={styles.filter}>{element.price} vnd - {element.acreage} m2</div>
                                    </div>
                                    <div className={styles.vectorParent}>
                                        <Image className={styles.vectorIcon} width={11} height={13} alt="" src="/icons/location.svg" />
                                        <div className={styles.filter}>{element.address}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <ExtraInfo />
                    <DownloadApp />
                    <MbFooter />
                </div>
            )}
        </div>
    );
}

function PostOnDesktop() {
    return (<div>Desktop Page</div>);
}