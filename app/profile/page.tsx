"use client";
import useScreenSize from "../lib/useScreenSize";
import DownloadApp from "../ui/mobile/download-app/mb.download";
import MbFooter from "../ui/mobile/footer/mb.footer";
import NavBarMobile from "../ui/mobile/navigation/nav-bar-mobile";
import { useSession } from 'next-auth/react';
import styles from './index.module.css';
import { useState, useCallback } from 'react';

export default function Profile() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="h-full">
            {screenSize === 'sm' ? (<MobileProfile session={session}/>) : (<DesktopProfile session={session}/>)}
        </div>
    );
}

function MobileProfile({session}: {session?: any}) {
    const [tabBtnState, setTabBtnState] = useState({
        btnUpdateProfile: styles.tabButton + " "+ styles.primaryBtn,
        btnChangePassword: styles.tabButton + " "+ styles.secondaryBtn
    });

    function selectTab(tab: string) {
        if (tab === 'Profile') {
            setTabBtnState({
                btnUpdateProfile: styles.tabButton + " "+ styles.primaryBtn,
                btnChangePassword: styles.tabButton + " "+ styles.secondaryBtn
            });
        } else {
            setTabBtnState({
                btnUpdateProfile: styles.tabButton + " "+ styles.secondaryBtn,
                btnChangePassword: styles.tabButton + " "+ styles.primaryBtn
            });
        }
    }

    return (
        <div className="h-full">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <div className={styles.profileTitle}>
                        <h1 className="heading-h8">Thông tin cá nhân</h1>
                    </div>
                    <div className={styles.tab}>
                        <button name="btnUpdateProfile" className={tabBtnState.btnUpdateProfile} onClick={() => selectTab('Profile')}>Chỉnh sửa thông tin</button>
                        <button name="btnChangePassword" className={tabBtnState.btnChangePassword} onClick={() => selectTab('Account')}>Cài đặt tài khoản</button>
                    </div>
                </div>
                <div className={styles.profileBody}>

                </div>
            </div>
            <DownloadApp />
            <MbFooter />
        </div>
    );
}

function DesktopProfile({session}: {session?: any}) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Desktop Profile</h1>
            <p className="mt-4">This is the desktop profile page.</p>
        </div>
    );
}