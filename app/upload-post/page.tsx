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
    const [propertyType, setPropertyType] = useState('house');
    const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
    const [legalType, setLegalType] = useState('red_book');
    const [isLegalTypeOpen, setIsLegalTypeOpen] = useState(false);
    const [furnitureType, setFurnitureType] = useState('');
    const [isFurnitureTypeOpen, setIsFurnitureTypeOpen] = useState(false);
    const [directionType, setDirectionType] = useState('');
    const [isDirectionTypeOpen, setIsDirectionTypeOpen] = useState(false);

    const handleTransactionTypeChange = (type: string) => {
        setTransactionType(type);
        setIsTransactionTypeOpen(false);
    };

    const handlePropertyTypeChange = (type: string) => {
        setPropertyType(type);
        setIsPropertyTypeOpen(false);
    };

    const handleLegalTypeChange = (type: string) => {
        setLegalType(type);
        setIsLegalTypeOpen(false);
    };

    const handleFurnitureTypeChange = (type: string) => {
        setFurnitureType(type);
        setIsFurnitureTypeOpen(false);
    };

    const handleDirectionTypeChange = (type: string) => {
        setDirectionType(type);
        setIsDirectionTypeOpen(false);
    };
    const [tabItemState, setTabBtnState] = useState({
        firstTab: styles.activeTabItem,
        secondTab: styles.inactiveTabItem,
        thirdTab: styles.inactiveTabItem,
    });

    // Property type options constant
    const PROPERTY_TYPES = [
        { value: 'house', label: 'Nhà riêng', icon: 'HouseLine.svg' },
        { value: 'apartment', label: 'Chung cư', icon: 'BuildingApartment.svg' },
        { value: 'office', label: 'Văn phòng', icon: 'BuildingOffice.svg' },
        { value: 'warehouse', label: 'Kho xưởng', icon: 'Warehouse.svg' },
        { value: 'condotel', label: 'Condotel', icon: 'Condotel.svg' },
        { value: 'other', label: 'Khác', icon: 'OtherProperty.svg' }
    ];

    // Legal options constant
    const LEGAL_TYPES = [
        { value: 'red_book', label: 'Sổ đỏ' },
        { value: 'contract', label: 'Hợp đồng mua bán' },
        { value: 'no_book', label: 'Không sổ' }
    ];

    // Furniture options constant
    const FURNITURE_TYPES = [
        { value: 'full', label: 'Đầy đủ' },
        { value: 'basic', label: 'Cơ bản' },
        { value: 'none', label: 'Không nội thất' }
    ];

    // Direction options constant
    const DIRECTION_TYPES = [
        { value: 'east', label: 'Đông' },
        { value: 'west', label: 'Tây' },
        { value: 'south', label: 'Nam' },
        { value: 'north', label: 'Bắc' },
        { value: 'northeast', label: 'Đông Bắc' },
        { value: 'southeast', label: 'Đông Nam' },
        { value: 'northwest', label: 'Tây Bắc' },
        { value: 'southwest', label: 'Tây Nam' }
    ];

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
                                <div className={styles.transactionTypeHeader} onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}>
                                    <label className="body-2-medium">
                                        Loại bất động sản: <span className={styles.selectedType}>{PROPERTY_TYPES.find(type => type.value === propertyType)?.label}</span> <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <Image 
                                        src="/icons/CaretDown.svg" 
                                        alt="Expand" 
                                        width={16} 
                                        height={16} 
                                        className={`${styles.caretIcon} ${isPropertyTypeOpen ? styles.caretOpen : ''}`} 
                                    />
                                </div>
                                {isPropertyTypeOpen && (
                                    <div className={styles.transactionOptions}>
                                        {PROPERTY_TYPES.map((type) => (
                                            <div 
                                                key={type.value}
                                                className={`${styles.transactionOption} ${propertyType === type.value ? styles.selectedOption : ''}`} 
                                                onClick={() => handlePropertyTypeChange(type.value)}
                                            >
                                                <div className={styles.optionIconContainer}>
                                                    <Image src={`/icons/${type.icon}`} alt={type.label} width={24} height={24} />
                                                </div>
                                                <div className={styles.optionContent}>
                                                    <div className={styles.optionRadio}>
                                                        <input 
                                                            type="radio" 
                                                            id={type.value} 
                                                            name="propertyType" 
                                                            value={type.value} 
                                                            checked={propertyType === type.value} 
                                                            onChange={() => {}} 
                                                        />
                                                        <div className={styles.radioIndicator}></div>
                                                    </div>
                                                    <label htmlFor={type.value}>{type.label}</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                <div className={styles.transactionTypeHeader} onClick={() => setIsLegalTypeOpen(!isLegalTypeOpen)}>
                                    <label className="body-2-medium">
                                        Pháp lý: <span className={styles.selectedType}>{LEGAL_TYPES.find(type => type.value === legalType)?.label}</span> <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <Image 
                                        src="/icons/CaretDown.svg" 
                                        alt="Expand" 
                                        width={16} 
                                        height={16} 
                                        className={`${styles.caretIcon} ${isLegalTypeOpen ? styles.caretOpen : ''}`} 
                                    />
                                </div>
                                {isLegalTypeOpen && (
                                    <div className={styles.transactionOptions}>
                                        {LEGAL_TYPES.map((type) => (
                                            <div 
                                                key={type.value}
                                                className={`${styles.transactionOption} ${legalType === type.value ? styles.selectedOption : ''}`} 
                                                onClick={() => handleLegalTypeChange(type.value)}
                                            >
                                                <div className={styles.optionContent}>
                                                    <div className={styles.optionRadio}>
                                                        <input 
                                                            type="radio" 
                                                            id={type.value} 
                                                            name="legal" 
                                                            value={type.value} 
                                                            checked={legalType === type.value} 
                                                            onChange={() => {}} 
                                                        />
                                                        <div className={styles.radioIndicator}></div>
                                                    </div>
                                                    <label htmlFor={type.value}>{type.label}</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>   
                            <div className={styles.inputItem}>
                                <div className={styles.transactionTypeHeader} onClick={() => setIsFurnitureTypeOpen(!isFurnitureTypeOpen)}>
                                    <label className="body-2-medium">
                                        Nội thất: <span className={styles.selectedType} style={!furnitureType ? { color: '#9ca3af', opacity: 0.7 } : {}}>{furnitureType ? FURNITURE_TYPES.find(type => type.value === furnitureType)?.label : 'Chọn nội thất'}</span>
                                    </label>
                                    <Image 
                                        src="/icons/CaretDown.svg" 
                                        alt="Expand" 
                                        width={16} 
                                        height={16} 
                                        className={`${styles.caretIcon} ${isFurnitureTypeOpen ? styles.caretOpen : ''}`} 
                                    />
                                </div>
                                {isFurnitureTypeOpen && (
                                    <div className={styles.transactionOptions}>
                                        {FURNITURE_TYPES.map((type) => (
                                            <div 
                                                key={type.value}
                                                className={`${styles.transactionOption} ${furnitureType === type.value ? styles.selectedOption : ''}`} 
                                                onClick={() => handleFurnitureTypeChange(type.value)}
                                            >
                                                <div className={styles.optionContent}>
                                                    <div className={styles.optionRadio}>
                                                        <input 
                                                            type="radio" 
                                                            id={type.value} 
                                                            name="furniture" 
                                                            value={type.value} 
                                                            checked={furnitureType === type.value} 
                                                            onChange={() => {}} 
                                                        />
                                                        <div className={styles.radioIndicator}></div>
                                                    </div>
                                                    <label htmlFor={type.value}>{type.label}</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="bedrooms">Số phòng ngủ</label>
                                <input className={styles.inputField} type="number" id="bedrooms" name="bedrooms" placeholder="Nhập số phòng ngủ"/>      
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="bathrooms">Số phòng tắm</label>
                                <input className={styles.inputField} type="number" id="bathrooms" name="bathrooms" placeholder="Nhập số phòng tắm" />      
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="floors">Số tầng</label>
                                <input className={styles.inputField} type="number" id="floors" name="floors" placeholder="Nhập số tầng" />      
                            </div>
                            <div className={styles.inputItem}>
                                <div className={styles.transactionTypeHeader} onClick={() => setIsDirectionTypeOpen(!isDirectionTypeOpen)}>
                                    <label className="body-2-medium">
                                        Hướng Nhà: <span className={styles.selectedType} style={!directionType ? { color: '#9ca3af', opacity: 0.7 } : {}}>{directionType ? DIRECTION_TYPES.find(type => type.value === directionType)?.label : 'Chọn hướng nhà'}</span>
                                    </label>
                                    <Image 
                                        src="/icons/CaretDown.svg" 
                                        alt="Expand" 
                                        width={16} 
                                        height={16} 
                                        className={`${styles.caretIcon} ${isDirectionTypeOpen ? styles.caretOpen : ''}`} 
                                    />
                                </div>
                                {isDirectionTypeOpen && (
                                    <div className={styles.transactionOptions}>
                                        {DIRECTION_TYPES.map((type) => (
                                            <div 
                                                key={type.value}
                                                className={`${styles.transactionOption} ${directionType === type.value ? styles.selectedOption : ''}`} 
                                                onClick={() => handleDirectionTypeChange(type.value)}
                                            >
                                                <div className={styles.optionContent}>
                                                    <div className={styles.optionRadio}>
                                                        <input 
                                                            type="radio" 
                                                            id={type.value} 
                                                            name="direction" 
                                                            value={type.value} 
                                                            checked={directionType === type.value} 
                                                            onChange={() => {}} 
                                                        />
                                                        <div className={styles.radioIndicator}></div>
                                                    </div>
                                                    <label htmlFor={type.value}>{type.label}</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.inputItem}>
                                <label className="body-2-medium" htmlFor="frontage">Mặt tiền (m)</label>
                                <input className={styles.inputField} type="number" id="frontage" name="frontage" placeholder="Nhập mặt tiền"/>      
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