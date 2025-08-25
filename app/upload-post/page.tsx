"use client"
import Form from 'next/form';
import styles from './index.module.css';
import useScreenSize from '../lib/useScreenSize';
import { useSession } from 'next-auth/react';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import { useState } from 'react';
import Image from 'next/image';

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
    const [transactionType, setTransactionType] = useState('sell');
    const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);

    const handleTransactionTypeChange = (type: string) => {
        setTransactionType(type);
        setIsTransactionTypeOpen(false);
    };
    const [tabItemState, setTabBtnState] = useState({
        firstTab: styles.activeTabItem,
        secondTab: styles.inactiveTabItem,
        thirdTab: styles.inactiveTabItem,
    });

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.headerUploadPost}>
                    <div>
                        <p className="heading-h8">Tạo tin đăng</p>
                    </div>
                    <div><p>Bước 1. Thông tin BĐS</p></div>
                    <div className={styles.tab}>
                        <div className={tabItemState.firstTab}></div>
                        <div className={tabItemState.secondTab}></div>
                        <div className={tabItemState.thirdTab}></div>
                    </div>
                </div>
            <div className={`${styles.formContainer} flex-1`}>
                
                <Form id="uploadPostForm" action={"/oke-nhe"} className={`${styles.mainContent} flex flex-col flex-1`}>
                    <div className="flex-1">                        
                        <div className={styles.inputGroup}>
                            <div className={styles.fullWidthItem}>
                                <div className={styles.transactionTypeHeader} onClick={() => setIsTransactionTypeOpen(!isTransactionTypeOpen)}>
                                    <label className="body-2-medium">
                                        Loại giao dịch: <span className={styles.selectedType}>{transactionType === 'sell' ? 'Bán Nhà' : 'Cho Thuê'}</span> <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <Image 
                                        src="/icons/CaretDown.svg" 
                                        alt="Expand" 
                                        width={16} 
                                        height={16} 
                                        className={`${styles.caretIcon} ${isTransactionTypeOpen ? styles.caretOpen : ''}`} 
                                    />
                                </div>
                            </div>
                            {isTransactionTypeOpen && (
                                <div className={`${styles.transactionOptions} ${styles.fullWidthItem}`}>
                                    <div 
                                        className={`${styles.transactionOption} ${transactionType === 'sell' ? styles.selectedOption : ''}`} 
                                        onClick={() => handleTransactionTypeChange('sell')}
                                    >
                                        <div className={styles.optionIconContainer}>
                                            <Image src="/icons/SellHouse.svg" alt="Sell" width={24} height={24} />
                                        </div>
                                        <div className={styles.optionContent}>
                                            <div className={styles.optionRadio}>
                                                <input 
                                                    type="radio" 
                                                    id="sell" 
                                                    name="transactionType" 
                                                    value="sell" 
                                                    checked={transactionType === 'sell'} 
                                                    onChange={() => {}} 
                                                />
                                                <div className={styles.radioIndicator}></div>
                                            </div>
                                            <label htmlFor="sell">Bán Nhà</label>
                                        </div>
                                    </div>
                                    <div 
                                        className={`${styles.transactionOption} ${transactionType === 'rent' ? styles.selectedOption : ''}`} 
                                        onClick={() => handleTransactionTypeChange('rent')}
                                    >
                                        <div className={styles.optionIconContainer}>
                                            <Image src="/icons/RentHouse.svg" alt="Rent" width={24} height={24} />
                                        </div>
                                        <div className={styles.optionContent}>
                                            <div className={styles.optionRadio}>
                                                <input 
                                                    type="radio" 
                                                    id="rent" 
                                                    name="transactionType" 
                                                    value="rent" 
                                                    checked={transactionType === 'rent'} 
                                                    onChange={() => {}} 
                                                />
                                                <div className={styles.radioIndicator}></div>
                                            </div>
                                            <label htmlFor="rent">Cho Thuê</label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="title">Tiêu đề <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="text" id="title" name="title" placeholder="Nhập tiêu đề (tối đa 70 ký tự)" maxLength={70} required />
                            </div>
                            <div className={`${styles.inputItem} ${styles.fullWidthItem}`}>
                                <label className="body-2-medium" htmlFor="description">Mô tả <span style={{ color: 'red' }}>*</span></label>
                                <textarea className={styles.textAreaField} id="description" name="description" placeholder="Nhập mô tả chi tiết về bất động sản của bạn..." maxLength={1000} required></textarea>
                            </div>                            
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={`${styles.inputItem} ${styles.fullWidthItem}`}>
                                <label className="body-2-medium" htmlFor="address">Địa chỉ <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="text" id="address" name="address" placeholder="Nhập địa chỉ bất động sản của bạn" required />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="propertyType">Loại bất động sản <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="text" id="propertyType" name="propertyType" placeholder="Loại bất động sản" required />      
                            </div>   
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="area">Diện tích (m²) <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="number" id="area" name="area" placeholder="Nhập diện tích sử dụng (m²)" required />
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="price">Giá <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="number" id="price" name="price" placeholder="Nhập giá bán hoặc giá thuê" required />      
                            </div>                                                  
                        </div>
                        <div className={styles.inputGroup}>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="legal">Pháp lý <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="text" id="legal" name="legal" placeholder="Pháp lý" required />      
                            </div>   
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="furniture">Nội thất <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="text" id="furniture" name="furniture" placeholder="Nội thất" required />
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="bedrooms">Số phòng ngủ <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="number" id="bedrooms" name="bedrooms" placeholder="Nhập số phòng ngủ" required />      
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="bathrooms">Số phòng tắm <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="number" id="bathrooms" name="bathrooms" placeholder="Nhập số phòng tắm" required />      
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="floors">Số tầng <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="number" id="floors" name="floors" placeholder="Nhập số tầng" required />      
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="direction">Hướng Nhà <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="text" id="direction" name="direction" placeholder="Hướng Nhà" required />
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="frontage">Mặt tiền (m) <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="number" id="frontage" name="frontage" placeholder="Nhập mặt tiền" required />      
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="contactName">Tên liên hệ <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="text" id="contactName" name="contactName" placeholder="Tên liên hệ" required />      
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="phone">Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                                <input className={styles.inputField} type="number" id="phone" name="phone" placeholder="Nhập số điện thoại" required />
                            </div>                                 
                        </div>
                    </div>
                </Form>
                <div className={styles.footer}>
                    <button type="submit" form="uploadPostForm" className={styles.submitButton}>Tiếp tục</button>
                </div>
            </div>
        </div>
    );
}

function DesktopUploadPost({ session }: { session?: any }) {
    const [transactionType, setTransactionType] = useState('sell');
    const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);

    const handleTransactionTypeChange = (type: string) => {
        setTransactionType(type);
        setIsTransactionTypeOpen(false);
    };
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
            
            <div className={`${styles.formContainer} flex-1`}>
                <Form id="desktopUploadForm" action={"/oke-nhe"} className={`${styles.mainContent} flex flex-col flex-1`}>
                    <div className="flex-1">
                        {/* Form content will go here - for now just a placeholder */}
                        <div className={styles.inputGroup}>
                            <p>Desktop version is under construction...</p>
                        </div>
                    </div>
                </Form>
                
                <div className={styles.footer}>
                    <button type="submit" form="desktopUploadForm" className={styles.submitButton}>Tiếp tục</button>
                </div>
            </div>
        </div>
    );
}