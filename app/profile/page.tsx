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
    const [formData, setFormData] = useState({
        name: session?.user?.username || '',
        address: '',
        idCard: '',
        taxId: ''
    });
    const [nameError, setNameError] = useState<string>('');

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

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Validate name field
        if (field === 'name') {
            if (value.trim() === '') {
                setNameError('Họ tên không được để trống');
            } else {
                setNameError('');
            }
        }
    };

    const handleSubmit = () => {
        
        // TODO: Add actual API call here
        console.log(formData.name);
        console.log(formData.address);
        console.log(formData.idCard);
        console.log(formData.taxId);
    };

    const isFormValid = formData.name.trim() !== '';

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
                    <Form action={handleSubmit} className={styles.formContainer}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Họ tên</label>
                            <input 
                                className={`${styles.inputText} ${nameError ? styles.inputError : ''}`}
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                            {nameError && <span className={styles.errorMessage}>{nameError}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="address">Địa chỉ</label>
                            <input 
                                className={styles.inputText} 
                                type="text" 
                                id="address" 
                                name="address" 
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="idCard">Căn cước công dân</label>
                            <input 
                                className={styles.inputText} 
                                type="text" 
                                id="idCard" 
                                name="idCard" 
                                value={formData.idCard}
                                onChange={(e) => handleInputChange('idCard', e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="taxId">Mã số thuế cá nhân</label>
                            <input 
                                className={styles.inputText} 
                                type="text" 
                                id="taxId" 
                                name="taxId" 
                                value={formData.taxId}
                                onChange={(e) => handleInputChange('taxId', e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={`${styles.submitBtn} ${!isFormValid ? styles.submitBtnDisabled : ''}`}
                            disabled={!isFormValid}
                        >
                            Lưu thay đổi
                        </button>
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