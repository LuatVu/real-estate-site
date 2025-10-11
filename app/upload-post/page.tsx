"use client"
import Form from 'next/form';
import styles from './index.module.css';
import useScreenSize from '../lib/useScreenSize';
import { useSession } from 'next-auth/react';
import NavBarMobile from '../ui/mobile/navigation/nav-bar-mobile';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PortalPopup from '../ui/common/portal-popup/portal-popup';
import Loading from '../ui/common/loading';
import { formatPrice } from '../utils/price-formatter';

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
    const [propertyType, setPropertyType] = useState('NHA_RIENG');
    const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
    const [legalType, setLegalType] = useState('SO_DO');
    const [isLegalTypeOpen, setIsLegalTypeOpen] = useState(false);
    const [furnitureType, setFurnitureType] = useState('');
    const [isFurnitureTypeOpen, setIsFurnitureTypeOpen] = useState(false);
    const [directionType, setDirectionType] = useState('');
    const [isDirectionTypeOpen, setIsDirectionTypeOpen] = useState(false);
    const [provinces, setProvince] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [isProvinceOpen, setIsProvinceOpen] = useState(false);
    const [isWardOpen, setIsWardOpen] = useState(false);
    const [originalScrollPosition, setOriginalScrollPosition] = useState(0);
    const [step, setStep] = useState<number>(1);
    const [selectedPriority, setSelectedPriority] = useState('NORMAL');
    const [imageMapping] = useState<{ [key: string]: string }>({}); // Map image IDs to URLs
    const [headline, setHeadline] = useState('Bước 1. Thông tin BĐS');

    // Form validation states
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        acreage: '',
        bedrooms: '',
        bathrooms: '',
        furniture: '',
        floors: '',
        legal: 'SO_DO',
        price: '',
        provinceCode: '',
        wardCode: '',
        address: '',
        direction: '',
        type: 'NHA_RIENG',
        rankingDto: {
            priorityLevel: 'NORMAL'
        },
        frontage: '',
        contactName: '',
        phone: '',
        images: []
    });

    // Image upload states
    interface UploadedImage {
        id: string;
        file: File;
        preview: string;
        isPrimary: boolean;
        rotation: number;
    }

    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

    // Popup states
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showFailurePopup, setShowFailurePopup] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleTransactionTypeChange = (type: string) => {
        setTransactionType(type);
        setIsTransactionTypeOpen(false);
        requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollPosition);
        });
    };

    const handlePropertyTypeChange = (type: string) => {
        setPropertyType(type);
        setFormData(prev => ({
            ...prev,
            type: type
        }));
        setIsPropertyTypeOpen(false);
        requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollPosition);
        });
    };

    const handleLegalTypeChange = (type: string) => {
        setLegalType(type);
        setFormData(prev => ({
            ...prev,
            legal: type
        }));
        setIsLegalTypeOpen(false);
        requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollPosition);
        });
    };

    const handleFurnitureTypeChange = (type: string) => {
        setFurnitureType(type);
        if (type && type !== '') {
            setFormData(prev => ({
                ...prev,
                furniture: type
            }));
        }
        setIsFurnitureTypeOpen(false);
        requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollPosition);
        });
    };

    const handleDirectionTypeChange = (type: string) => {
        setDirectionType(type);
        if (type && type !== '') {
            setFormData(prev => ({
                ...prev,
                direction: type
            }));
        }
        setIsDirectionTypeOpen(false);
        requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollPosition);
        });
    };

    const handleProvinceChange = (provinceCode: string, provinceName: string) => {
        setSelectedProvince(provinceName);
        if (provinceCode && provinceCode !== '') {
            setFormData(prev => ({
                ...prev,
                provinceCode: provinceCode
            }));
        }
        setSelectedWard(''); // Reset ward when province changes
        setWards([]); // Clear wards
        setIsProvinceOpen(false);
        updateFullAddress(detailAddress, '', provinceName); // Update address with new province
        fetchWards(provinceCode); // Fetch wards for selected province
        requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollPosition);
        });
    };

    const handleWardChange = (wardName: string) => {
        setSelectedWard(wardName);
        setIsWardOpen(false);
        updateFullAddress(detailAddress, wardName, selectedProvince);
        requestAnimationFrame(() => {
            window.scrollTo(0, originalScrollPosition);
        });
    };

    const handleDetailAddressChange = (value: string) => {
        setDetailAddress(value);
        updateFullAddress(value, selectedWard, selectedProvince);
    };

    const updateFullAddress = (detail: string, ward: string, province: string) => {
        let fullAddress = '';
        if (detail) fullAddress += detail;
        if (ward) {
            fullAddress += (fullAddress ? ', ' : '') + ward;
        }
        if (province) {
            fullAddress += (fullAddress ? ', ' : '') + province;
        }

        setFormData(prev => ({
            ...prev,
            address: fullAddress
        }));
    };

    // Image management functions
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
        const newImages: UploadedImage[] = [];
        let processedCount = 0;

        fileArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage: UploadedImage = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    file,
                    preview: e.target?.result as string,
                    isPrimary: uploadedImages.length === 0 && index === 0, // Only first image is primary when no existing images
                    rotation: 0
                };
                newImages.push(newImage);
                processedCount++;

                // When all files are processed, update state once
                if (processedCount === fileArray.length) {
                    setUploadedImages(prev => [...prev, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset the input
        event.target.value = '';
    };

    const removeImage = (imageId: string) => {
        setUploadedImages(prev => {
            const updatedImages = prev.filter(img => img.id !== imageId);
            // If we removed the primary image, make the first remaining image primary
            if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
                updatedImages[0].isPrimary = true;
            }
            return updatedImages;
        });
    };

    const setPrimaryImage = (imageId: string) => {
        setUploadedImages(prev =>
            prev.map(img => ({
                ...img,
                isPrimary: img.id === imageId
            }))
        );
    };

    const rotateImage = (imageId: string) => {
        setUploadedImages(prev =>
            prev.map(img =>
                img.id === imageId
                    ? { ...img, rotation: (img.rotation + 90) % 360 }
                    : img
            )
        );
    };

    // Price formatting function
    const formatPrice = (value: string) => {
        // Remove all non-numeric characters
        const numericValue = value.replace(/\D/g, '');

        // Return empty if no numeric value
        if (!numericValue) return '';

        // Format with dots as thousand separators
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (value: string) => {
        // Remove all non-numeric characters for storage
        const numericValue = value.replace(/\D/g, '');

        // Update form data with the numeric value (without dots)
        setFormData(prev => ({
            ...prev,
            price: numericValue
        }));
    };

    // Check if step 2 is valid (at least 4 images)
    const isStep2Valid = () => {
        return uploadedImages.length >= 4;
    };

    // Function to check if all mandatory fields are filled
    const isFormValid = () => {
        return (
            transactionType &&
            formData.title.trim() &&
            formData.description.trim() &&
            selectedProvince &&
            selectedWard &&
            propertyType &&
            formData.acreage.trim() &&
            formData.price.trim() &&
            legalType &&
            formData.contactName.trim() &&
            formData.phone.trim()
        );
    };

    // Handle input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const [tabItemState, setTabBtnState] = useState({
        firstTab: styles.activeTabItem,
        secondTab: styles.inactiveTabItem,
        thirdTab: styles.inactiveTabItem,
    });

    const handleStepChange = (newStep: number) => {
        setStep(newStep);
        if (newStep === 1) {
            setHeadline('Bước 1. Thông tin BĐS');
        } else if (newStep === 2) {
            setHeadline('Bước 2. Hình ảnh');
        } else if (newStep === 3) {
            setHeadline('Bước 3. Thanh toán & Đăng tin');
        }
    }

    // Property type options constant
    const PROPERTY_TYPES = [
        { value: 'NHA_RIENG', label: 'Nhà riêng', icon: 'HouseLine.svg' },
        { value: 'CHCC', label: 'Chung cư', icon: 'BuildingApartment.svg' },
        { value: 'NHA_PHO', label: 'Nhà phố', icon: 'BuildingOffice.svg' },
        { value: 'KHO_NHA_XUONG', label: 'Kho xưởng', icon: 'Warehouse.svg' },
        { value: 'CONDOTEL', label: 'Condotel', icon: 'Condotel.svg' },
        { value: 'BIET_THU', label: 'Biệt thự', icon: 'OtherProperty.svg' },
        { value: 'DAT_NEN', label: 'Đất nền', icon: 'OtherProperty.svg' },
        { value: 'BDS_KHAC', label: 'Khác', icon: 'OtherProperty.svg' }

    ];

    // Legal options constant
    const LEGAL_TYPES = [
        { value: 'SO_DO', label: 'Sổ đỏ' },
        { value: 'HOP_DONG_MUA_BAN', label: 'Hợp đồng mua bán' },
        { value: 'KHONG_SO', label: 'Không sổ' }
    ];

    // Furniture options constant
    const FURNITURE_TYPES = [
        { value: 'DAY_DU', label: 'Đầy đủ' },
        { value: 'CO_BAN', label: 'Cơ bản' },
        { value: 'KHONG_NOI_THAT', label: 'Không nội thất' }
    ];

    // Direction options constant
    const DIRECTION_TYPES = [
        { value: 'DONG', label: 'Đông' },
        { value: 'TAY', label: 'Tây' },
        { value: 'NAM', label: 'Nam' },
        { value: 'BAC', label: 'Bắc' },
        { value: 'DONG_BAC', label: 'Đông Bắc' },
        { value: 'DONG_NAM', label: 'Đông Nam' },
        { value: 'TAY_BAC', label: 'Tây Bắc' },
        { value: 'TAY_NAM', label: 'Tây Nam' }
    ];

    const PRIORITY_LEVEL = [
        { value: 'DIAMOND', label: 'Vip Kim Cương', cost: 100000, icon: 'VipDiamond.svg' },
        { value: 'GOLD', label: 'Vip Vàng', cost: 50000, icon: 'VipGold.svg' },
        { value: 'SILVER', label: 'Vip Bạc', cost: 25000, icon: 'VipSilver.svg' },
        { value: 'NORMAL', label: 'Tin Thường', cost: 10000, icon: 'NormalPriority.svg' }
    ];

    const fetchProvince = async () => {
        const response = await fetch('/api/province', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch provinces");
        }
        const data = await response.json();
        return setProvince(data);
    }

    const fetchWards = async (cityCode: string) => {
        const response = await fetch(`/api/province?cityCode=${cityCode}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch wards");
        }
        const data = await response.json();
        return setWards(data);
    };

    const draftUploadImages = async () => {
        if(Object.keys(imageMapping).length > 0) return; // Already uploaded
        
        for (const img of uploadedImages) {
            try {
                const formData = new FormData();
                formData.append('file', img.file);
                const response = await fetch('/api/media/draft', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload images');
                }

                const result = await response.json();                
                imageMapping[img.id] = result.imageUrl;

            } catch (error) {
                console.error('Error uploading draft images:', error);
            }
        }        
    };

    const uploadPost = async () => {        
        setIsUploading(true); // Start loading
        
        const images = uploadedImages.map(img => ({
            fileName: img.file.name,
            fileUrl: imageMapping[img.id] || img.file.name, // Use the uploaded URL from mapping
            isPrimary: img.isPrimary,
        }));
        const data = {
            ...formData,
            acreage: Number(formData.acreage),
            bedrooms: Number(formData.bedrooms) > 0 ? Number(formData.bedrooms) : null, // non-mandatory field
            bathrooms: Number(formData.bathrooms) > 0 ? Number(formData.bathrooms) : null, // non-mandatory field
            floors: Number(formData.floors) > 0 ? Number(formData.floors) : null, // non-mandatory field
            price: Number(formData.price),
            frontage: Number(formData.frontage) > 0 ? Number(formData.frontage) : null, // non-mandatory field
            images: images
        };        
        // Add uploaded images to FormData
        try {
            const response = await fetch('/api/posts/upload', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();            

            if (response.ok) {
                for(const img of uploadedImages) {
                    try{
                        const formData = new FormData();
                        formData.append('file', img.file);
                        const key = imageMapping[img.id] || img.file.name;
                        await fetch(`/api/media/upload/${key}`, {
                            method: 'POST',
                            body: formData
                        });
                    }catch(error){
                        console.error('Error uploading images:', error);
                    }
                }
                setShowSuccessPopup(true); // Show success popup
            } else {                
                setShowFailurePopup(true); // Show failure popup
            }

        } catch (error) {            
            setShowFailurePopup(true);  // Show failure popup
        } finally {
            setIsUploading(false); // Stop loading
            console.log('Upload finished, loading set to false');
        }
    };

    useEffect(() => {
        fetchProvince();
    }, []);

    // Update form data when session becomes available
    useEffect(() => {
        if (session?.user?.username || session?.user?.phoneNumber) {
            setFormData(prev => ({
                ...prev,
                contactName: session.user.username || prev.contactName,
                phone: session.user.phoneNumber || prev.phone
            }));
        }
    }, [session]);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.headerUploadPost}>
                <div>
                    <p className="heading-h8">Tạo tin đăng</p>
                </div>
                <div><p>{headline}</p></div>
                <div className={styles.tab}>
                    <div className={tabItemState.firstTab}></div>
                    <div className={tabItemState.secondTab}></div>
                    <div className={tabItemState.thirdTab}></div>
                </div>
            </div>
            <div className={`${styles.formContainer} flex-1`}>
                <form id="uploadPostForm" onSubmit={(e) => { e.preventDefault(); uploadPost(); }} className={`${styles.mainContent} flex flex-col flex-1`}>
                    {step === 1 && (
                        <div className="flex-1">
                            <div className={styles.inputGroup}>
                                <div className={styles.fullWidthItem}>
                                    <div className={styles.transactionTypeHeader} onClick={() => {
                                        setOriginalScrollPosition(window.scrollY);
                                        setIsTransactionTypeOpen(!isTransactionTypeOpen);
                                    }}>
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
                                                        onChange={() => { }}
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
                                                        onChange={() => { }}
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
                                    <input
                                        className={styles.inputField}
                                        type="text"
                                        id="title"
                                        name="title"
                                        placeholder="Nhập tiêu đề (tối đa 70 ký tự)"
                                        maxLength={70}
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={`${styles.inputItem} ${styles.fullWidthItem}`}>
                                    <label className="body-2-medium" htmlFor="description">Mô tả <span style={{ color: 'red' }}>*</span></label>
                                    <textarea
                                        className={styles.textAreaField}
                                        id="description"
                                        name="description"
                                        placeholder="Nhập mô tả chi tiết về bất động sản của bạn..."
                                        maxLength={1000}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputItem}>
                                    <div className={styles.transactionTypeHeader} onClick={() => {
                                        setOriginalScrollPosition(window.scrollY);
                                        setIsProvinceOpen(!isProvinceOpen);
                                    }}>
                                        <label className="body-2-medium">
                                            Tỉnh/Thành phố: <span className={styles.selectedType} style={!selectedProvince ? { color: '#9ca3af', opacity: 0.7 } : {}}>{selectedProvince || 'Chọn tỉnh/thành phố'}</span> <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <Image
                                            src="/icons/CaretDown.svg"
                                            alt="Expand"
                                            width={16}
                                            height={16}
                                            className={`${styles.caretIcon} ${isProvinceOpen ? styles.caretOpen : ''}`}
                                        />
                                    </div>
                                    {isProvinceOpen && (
                                        <div className={styles.transactionOptions}>
                                            {provinces.map((province: any) => (
                                                <div
                                                    key={province.code}
                                                    className={`${styles.transactionOption} ${selectedProvince === province.name ? styles.selectedOption : ''}`}
                                                    onClick={() => handleProvinceChange(province.code, province.name)}
                                                >
                                                    <div className={styles.optionContent}>
                                                        <div className={styles.optionRadio}>
                                                            <input
                                                                type="radio"
                                                                id={province.code}
                                                                name="province"
                                                                value={province.code}
                                                                checked={selectedProvince === province.name}
                                                                onChange={() => { }}
                                                            />
                                                            <div className={styles.radioIndicator}></div>
                                                        </div>
                                                        <label htmlFor={province.code}>{province.name}</label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.inputItem}>
                                    <div className={styles.transactionTypeHeader} onClick={() => {
                                        if (selectedProvince) {
                                            setOriginalScrollPosition(window.scrollY);
                                            setIsWardOpen(!isWardOpen);
                                        }
                                    }}>
                                        <label className="body-2-medium">
                                            Quận/Huyện: <span className={styles.selectedType} style={!selectedWard ? { color: '#9ca3af', opacity: 0.7 } : {}}>{selectedWard || (selectedProvince ? 'Chọn quận/huyện' : 'Chọn tỉnh trước')}</span> <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <Image
                                            src="/icons/CaretDown.svg"
                                            alt="Expand"
                                            width={16}
                                            height={16}
                                            className={`${styles.caretIcon} ${isWardOpen ? styles.caretOpen : ''} ${!selectedProvince ? 'opacity-50' : ''}`}
                                        />
                                    </div>
                                    {isWardOpen && selectedProvince && (
                                        <div className={styles.transactionOptions}>
                                            {wards.map((ward: any) => (
                                                <div
                                                    key={ward.code}
                                                    className={`${styles.transactionOption} ${selectedWard === ward.name ? styles.selectedOption : ''}`}
                                                    onClick={() => { handleWardChange(ward.name); handleInputChange('wardCode', ward.code) }}
                                                >
                                                    <div className={styles.optionContent}>
                                                        <div className={styles.optionRadio}>
                                                            <input
                                                                type="radio"
                                                                id={ward.code}
                                                                name="ward"
                                                                value={ward.code}
                                                                checked={selectedWard === ward.name}
                                                                onChange={() => { }}
                                                            />
                                                            <div className={styles.radioIndicator}></div>
                                                        </div>
                                                        <label htmlFor={ward.code}>{ward.name}</label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Address Input */}
                                <div className={`${styles.inputItem} ${styles.detailAddressContainer}`}>
                                    <label className="body-2-medium">
                                        Địa chỉ chi tiết (số nhà, tên đường...):
                                    </label>
                                    <input
                                        type="text"
                                        value={detailAddress}
                                        onChange={(e) => handleDetailAddressChange(e.target.value)}
                                        placeholder="VD: 123 Lê Duẩn, Khu phố 1..."
                                        className={styles.inputField}
                                    />

                                    {/* Address Preview */}
                                    {(detailAddress || selectedWard || selectedProvince) && (
                                        <div className={styles.addressPreview}>
                                            <div className="flex items-start">
                                                <Image
                                                    src="/icons/location.svg"
                                                    alt="Location"
                                                    width={16}
                                                    height={16}
                                                    className="mr-2 mt-1 flex-shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <p className="body-3-regular text-gray-600 mb-1">
                                                        Địa chỉ đầy đủ:
                                                    </p>
                                                    <p className="body-3-medium">
                                                        <span className={styles.addressText}>
                                                            {formData.address || 'Vui lòng nhập địa chỉ chi tiết'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputItem}>
                                    <div className={styles.transactionTypeHeader} onClick={() => {
                                        setOriginalScrollPosition(window.scrollY);
                                        setIsPropertyTypeOpen(!isPropertyTypeOpen);
                                    }}>
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
                                                                onChange={() => { }}
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
                                    <input
                                        className={styles.inputField}
                                        type="number"
                                        id="area"
                                        name="area"
                                        placeholder="Nhập diện tích sử dụng (m²)"
                                        value={formData.acreage}
                                        onChange={(e) => handleInputChange('acreage', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.inputItem}>
                                    <label className="body-2-medium" htmlFor="price">Giá <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        className={styles.inputField}
                                        type="text"
                                        id="price"
                                        name="price"
                                        placeholder="Nhập giá bán hoặc giá thuê"
                                        value={formatPrice(formData.price)}
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputItem}>
                                    <div className={styles.transactionTypeHeader} onClick={() => {
                                        setOriginalScrollPosition(window.scrollY);
                                        setIsLegalTypeOpen(!isLegalTypeOpen);
                                    }}>
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
                                                                onChange={() => { }}
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
                                    <div className={styles.transactionTypeHeader} onClick={() => {
                                        setOriginalScrollPosition(window.scrollY);
                                        setIsFurnitureTypeOpen(!isFurnitureTypeOpen);
                                    }}>
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
                                                                onChange={() => { }}
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
                                    <input className={styles.inputField} type="number" value={formData.bedrooms} id="bedrooms" name="bedrooms" placeholder="Nhập số phòng ngủ" onChange={(e) => handleInputChange('bedrooms', e.target.value)} />
                                </div>
                                <div className={styles.inputItem}>
                                    <label className="body-2-medium" htmlFor="bathrooms">Số phòng tắm</label>
                                    <input className={styles.inputField} type="number" value={formData.bathrooms} id="bathrooms" name="bathrooms" placeholder="Nhập số phòng tắm" onChange={(e) => handleInputChange('bathrooms', e.target.value)} />
                                </div>
                                <div className={styles.inputItem}>
                                    <label className="body-2-medium" htmlFor="floors">Số tầng</label>
                                    <input className={styles.inputField} type="number" value={formData.floors} id="floors" name="floors" placeholder="Nhập số tầng" onChange={(e) => handleInputChange('floors', e.target.value)} />
                                </div>
                                <div className={styles.inputItem}>
                                    <div className={styles.transactionTypeHeader} onClick={() => {
                                        setOriginalScrollPosition(window.scrollY);
                                        setIsDirectionTypeOpen(!isDirectionTypeOpen);
                                    }}>
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
                                                                onChange={() => { }}
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
                                    <input className={styles.inputField} type="number" id="frontage" name="frontage" placeholder="Nhập mặt tiền" onChange={(e) => handleInputChange('frontage', e.target.value)} value={formData.frontage} />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <div className={styles.inputItem}>
                                    <label className="body-2-medium" htmlFor="contactName">Tên liên hệ <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        className={styles.inputField}
                                        type="text"
                                        id="contactName"
                                        name="contactName"
                                        placeholder="Tên liên hệ"
                                        value={formData.contactName}
                                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.inputItem}>
                                    <label className="body-2-medium" htmlFor="phone">Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        className={styles.inputField}
                                        type="number"
                                        id="phone"
                                        name="phone"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="flex-1">
                            <div className="p-4">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Hình ảnh</h2>

                                {/* Upload Button */}
                                <div className="mb-6">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center w-full px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                                    >
                                        <Image
                                            src="/icons/Plus.svg"
                                            alt="Add"
                                            width={16}
                                            height={16}
                                            className="mr-2"
                                        />
                        Thêm hình ảnh
                    </label>
                    {uploadedImages.length < 4 && (
                        <p className="text-sm text-red-600 mt-2">
                            Cần tối thiểu 4 hình ảnh để tiếp tục ({uploadedImages.length}/4)
                        </p>
                    )}
                    {uploadedImages.length >= 4 && (
                        <p className="text-sm text-green-600 mt-2">
                            ✓ Đã có đủ hình ảnh ({uploadedImages.length} hình)
                        </p>
                    )}
                </div>                                {/* Image Preview Grid */}
                                {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {[...uploadedImages].sort((a, b) => {
                                            // Primary image always comes first
                                            if (a.isPrimary) return -1;
                                            if (b.isPrimary) return 1;
                                            return 0;
                                        }).map((image) => (
                                            <div key={image.id} className="relative bg-gray-100 rounded-lg overflow-hidden">
                                                {/* Primary Badge */}
                                                {image.isPrimary && (
                                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded z-10">
                                                        Ảnh chính
                                                    </div>
                                                )}

                                                {/* Image */}
                                                <div className="aspect-square relative">
                                                    <img
                                                        src={image.preview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        style={{
                                                            transform: `rotate(${image.rotation}deg)`
                                                        }}
                                                    />
                                                </div>

                                                {/* Control Buttons */}
                                                <div className="absolute bottom-2 right-2 flex gap-1">
                                                    {/* Set as Primary Button */}
                                                    {!image.isPrimary && (
                                                        <button
                                                            onClick={() => setPrimaryImage(image.id)}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded text-xs"
                                                            title="Đặt làm ảnh chính"
                                                        >
                                                            ⭐
                                                        </button>
                                                    )}

                                                    {/* Rotate Button */}
                                                    <button
                                                        onClick={() => rotateImage(image.id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded text-xs"
                                                        title="Xoay ảnh"
                                                    >
                                                        ↻
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => removeImage(image.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-xs"
                                                        title="Xóa ảnh"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Empty State */}
                                {uploadedImages.length === 0 && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Image
                                            src="/icons/CameraIcon.svg"
                                            alt="Camera"
                                            width={48}
                                            height={48}
                                            className="mx-auto mb-4 opacity-50"
                                        />
                                        <p className="text-gray-500 mb-2">Chưa có hình ảnh nào</p>
                                        <p className="text-sm text-gray-400">Nhấn "Thêm hình ảnh" để tải lên</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="flex-1 flex flex-col">
                            <div className='p-3 flex-1'>
                                <h2 className="text-base font-semibold mb-3 text-gray-800">Chọn loại tin đăng</h2>
                                <div className="mb-4">
                                    <div className="space-y-2">
                                        {PRIORITY_LEVEL.map((priority) => (
                                            <button
                                                key={priority.value}
                                                type="button"
                                                onClick={() => { setSelectedPriority(priority.value); setFormData(prev => ({ ...prev, rankingDto: { ...prev.rankingDto, priorityLevel: priority.value } })); }}
                                                className={`w-full flex items-center justify-between p-3 border-2 rounded-lg transition-all ${selectedPriority === priority.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className="mr-2">
                                                        <Image
                                                            src={`/icons/${priority.icon}`}
                                                            alt={priority.label}
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </div>
                                                    <span className="text-base font-medium">{priority.label}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-base font-bold text-blue-600">
                                                        {priority.cost.toLocaleString('vi-VN')} đ
                                                    </div>
                                                    <div className="text-xs text-gray-500">/ 30 ngày</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <h4 className="text-base font-semibold mb-3 text-gray-800">Thông tin thanh toán</h4>
                                    <div className="p-3 border-2 border-gray-200 rounded-lg bg-white">
                                        {/* Thông tin đăng tin */}
                                        <div className="space-y-2 mb-3">
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">Loại tin đăng</span>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {PRIORITY_LEVEL.find(p => p.value === selectedPriority)?.label}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">Số ngày đăng</span>
                                                <span className="text-xs font-medium text-gray-700">30 ngày</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-xs text-gray-500">Thời gian hết hạn</span>
                                                <span className="text-xs font-medium text-gray-700">
                                                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>

                                        <hr className="mb-3 border-gray-200" />

                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Phí đăng tin</span>
                                            <span className="text-base font-bold text-blue-600">
                                                {PRIORITY_LEVEL.find(p => p.value === selectedPriority)?.cost.toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </form>

                <div className={styles.footer}>
                    {step === 1 && (
                        <button
                            type="button"
                            className={`${styles.submitButton} ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isFormValid()}
                            onClick={() => { handleStepChange(2); setTabBtnState({ ...tabItemState, secondTab: styles.activeTabItem }); }}
                        >
                            Tiếp tục
                        </button>
                    )}
                    {step === 2 && (
                        <>
                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={() => { handleStepChange(1); setTabBtnState({ ...tabItemState, secondTab: styles.inactiveTabItem }); }}
                            >
                                Quay lại
                            </button>
                            <button
                                type="button"
                                className={`${styles.nextButton} ${!isStep2Valid() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!isStep2Valid()}
                                onClick={() => { handleStepChange(3); setTabBtnState({ ...tabItemState, thirdTab: styles.activeTabItem }); draftUploadImages();}}
                            >
                                Tiếp tục
                            </button>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <button
                                type="button"
                                className={styles.backButton}
                                onClick={() => { handleStepChange(2); setTabBtnState({ ...tabItemState, thirdTab: styles.inactiveTabItem }); }}
                            >
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                form="uploadPostForm"
                                className={styles.nextButton}
                            >
                                Hoàn tất
                            </button>
                        </>
                    )}

                </div>
            </div>

            {/* Success Popup */}
            {showSuccessPopup && (
                <PortalPopup 
                    overlayColor="rgba(113, 113, 113, 0.3)" 
                    placement="Centered"                    
                >
                    <div style={{
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        padding: '24px',
                        maxWidth: '320px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ color: '#22c55e', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                                Đăng tin thành công!
                            </h3>
                            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                                Tin đăng của bạn đã được tạo thành công.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <button
                                onClick={() => {
                                    setShowSuccessPopup(false);
                                    window.location.reload();
                                }}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Đăng tin mới
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccessPopup(false);
                                    router.push('/manage/posts');
                                }}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Quản lý tin đăng
                            </button>
                        </div>
                    </div>
                </PortalPopup>
            )}

            {/* Failure Popup */}
            {showFailurePopup && (
                <PortalPopup 
                    overlayColor="rgba(113, 113, 113, 0.3)" 
                    placement="Centered"                    
                >
                    <div style={{
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        padding: '24px',
                        maxWidth: '320px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ color: '#ef4444', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                                Đăng tin thất bại!
                            </h3>
                            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                                Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFailurePopup(false)}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </PortalPopup>
            )}
            
            {/* Loading overlay while uploading */}
            {isUploading && (
                <Loading 
                    fullScreen
                    size="large"
                    message="Đang đăng tin..." 
                />
            )}
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