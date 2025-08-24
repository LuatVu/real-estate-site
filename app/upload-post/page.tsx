"use client"
import Form from 'next/form';
import styles from './index.module.css';
import useScreenSize from '../lib/useScreenSize';
import { useSession } from 'next-auth/react';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';

export default function UploadPost() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();

    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? (<MobileUploadPost session={session} />) : (<DesktopUploadPost session={session} />)}
        </div>
    );
}

function MobileUploadPost({ session }: { session?: any }) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={`${styles.formContainer} flex-1`}>
                <div className={styles.headerUploadPost}>
                    <div>
                        <p className="heading-h8">Tạo tin đăng</p>
                    </div>
                    <div><p>Bước 1. Thông tin BĐS</p></div>
                    <div className={styles.tab}>
                        <div className={styles.tabItem}></div>
                        <div className={styles.tabItem}></div>
                        <div className={styles.tabItem}></div>
                    </div>
                </div>

            </div>
            <div className={styles.footer}>

            </div>
        </div>
    );
}

function DesktopUploadPost({ session }: { session?: any }) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className={styles.header}>
                <div className={styles.profileTitle}>
                    <p className="heading-h8">Thông tin cá nhân</p>
                </div>
                <div><p>Bước 1. Thông tin BĐS</p></div>
                <div className={styles.tab}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <div className={styles.footer}>

            </div>
        </div>
    );
}