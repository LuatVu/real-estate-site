"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import MbFooter from "../ui/mobile/footer/mb.footer";
import DownloadApp from "../ui/mobile/download-app/mb.download";
import ExtraInfo from "../ui/mobile/extra-info/mb.extra.info";

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

                </div>
                <ExtraInfo/>
                <DownloadApp/>
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