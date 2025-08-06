"use client";
import useScreenSize from "../lib/useScreenSize";
import DownloadApp from "../ui/mobile/download-app/mb.download";
import MbFooter from "../ui/mobile/footer/mb.footer";
import NavBarMobile from "../ui/mobile/navigation/nav-bar-mobile";
import { useSession } from 'next-auth/react';
import styles from './index.module.css';
import { useState, useCallback } from 'react';
import Form from 'next/form';

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
    
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        fileInput?.click();
    };

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
                    <div className={styles.imageBlk}>
                        <div className={styles.uploadImageContainer} onClick={handleUploadClick}>
                            {uploadedImage ? (
                                <img 
                                    src={uploadedImage} 
                                    alt="Profile" 
                                    className={styles.uploadedImage}
                                />
                            ) : (
                                <div 
                                    className={styles.uploadImagePlaceholder}
                                    style={{
                                        backgroundImage: 'url(/icons/CameraIcon.svg)',
                                        backgroundSize: '20px 20px',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <span className={styles.uploadText}>Tải ảnh lên</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    <Form action="/api" className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Họ tên</label>
                            <input className={styles.inputText} type="text" id="name" name="name" defaultValue={session?.user?.username} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Địa chỉ</label>
                            <input className={styles.inputText} type="email" id="email" name="email" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="idCard">Căn cước công dân</label>
                            <input className={styles.inputText} type="text" id="idCard" name="idCard" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="taxId">Mã số thuế cá nhân</label>
                            <input className={styles.inputText} type="text" id="taxId" name="taxId" />
                        </div>
                        <button type="submit" className={styles.submitBtn}>Lưu thay đổi</button>
                    </Form>
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