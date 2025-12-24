"use client"
import useScreenSize from "@/app/lib/useScreenSize";
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import styles from './index.module.css';
import Image from 'next/image';
import NavBarMobile from "@/app/ui/mobile/navigation/nav-bar-mobile";
import { use, useEffect, useState } from 'react';

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

const LEGAL_TYPES = [
    { value: 'SO_DO', label: 'Sổ đỏ' },
    { value: 'HOP_DONG_MUA_BAN', label: 'Hợp đồng mua bán' },
    { value: 'KHONG_SO', label: 'Không sổ' }
];

const FURNITURE_TYPES = [
    { value: 'DAY_DU', label: 'Đầy đủ' },
    { value: 'CO_BAN', label: 'Cơ bản' },
    { value: 'KHONG_NOI_THAT', label: 'Không nội thất' }
];

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

export default function EditPostPage() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobileEditPostPage session={session} /> : <DesktopEditPostPage session={session} />}
        </div>
    );
}

function MobileEditPostPage({ session }: { session?: any }) {
    const [transactionType, setTransactionType] = useState('sell');
    const [headline, setHeadline] = useState('Bước 1. Thông tin BĐS');
    const [tabItemState, setTabBtnState] = useState({
        firstTab: styles.activeTabItem,
        secondTab: styles.inactiveTabItem,
    });
    const [step, setStep] = useState<number>(1);
    const [propertyType, setPropertyType] = useState('');
    const [legalType, setLegalType] = useState('');
    const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
    const [originalScrollPosition, setOriginalScrollPosition] = useState(0);
    const [furnitureType, setFurnitureType] = useState('');
    const [isProvinceOpen, setIsProvinceOpen] = useState(false);
    const [isWardOpen, setIsWardOpen] = useState(false);
    const [provinces, setProvince] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [isDirectionTypeOpen, setIsDirectionTypeOpen] = useState(false);
    const [isLegalTypeOpen, setIsLegalTypeOpen] = useState(false);
    const [isFurnitureTypeOpen, setIsFurnitureTypeOpen] = useState(false);
    const [directionType, setDirectionType] = useState('');
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const params = useParams();
    // Form validation states
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        acreage: '',
        bedrooms: '',
        bathrooms: '',
        furniture: '',
        floors: 0,
        legal: '',
        price: 0,
        provinceCode: '',
        wardCode: '',
        address: '',
        direction: '',
        type: '',
        rankingDto: {
            priorityLevel: 'NORMAL'
        },
        frontage: '',
        contactName: '',
        phone: '',
        images: []
    });

    interface UploadedImage {
        id: string;
        file: File;
        preview: string;
        isPrimary: boolean;
        rotation: number;
    }

    const editPost = async () => {

    }

    const handleStepChange = (newStep: number) => {
        setStep(newStep);
        if (newStep === 1) {
            setHeadline('Bước 1. Thông tin BĐS');
        } else if (newStep === 2) {
            setHeadline('Bước 2. Hình ảnh');
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const isFormValid = () => {
        return (
            transactionType &&
            formData.title.trim() &&
            formData.description.trim() &&
            selectedProvince &&
            selectedWard &&
            propertyType &&
            formData.acreage &&
            formData.price &&
            legalType &&
            formData.contactName.trim() &&
            formData.phone.trim()
        );
    }

    const handleProvinceChange = (provinceCode: string, provinceName: string) => {
        setSelectedProvince(provinceName);
        if (provinceCode && provinceCode !== '') {
            setFormData(prev => ({
                ...prev,
                provinceCode: provinceCode
            }));
        }
        setSelectedWard('');
        setWards([]);
        setIsProvinceOpen(false);
        updateFullAddress(detailAddress, '', provinceName);
        fetchWards(provinceCode);
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

    const handlePriceChange = (value: number) => {
        // Update form data with the numeric value (without dots)
        setFormData(prev => ({
            ...prev,
            price: value
        }));
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

    const formatPrice = (value: string) => {
        // Remove all non-numeric characters
        const numericValue = value.replace(/\D/g, '');

        // Return empty if no numeric value
        if (!numericValue) return '';

        // Format with dots as thousand separators
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

    const fetchPostData = async () => {
        try {
            const postId = params.id;
            const response = await fetch(`/api/posts/private/${postId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const res = await response.json();
            const data = res.response;
            if (response.ok) {
                setFormData({
                    ...formData,
                    title: data.title || '',
                    description: data.description || '',
                    acreage: data.acreage || '',
                    bedrooms: data.bedrooms || '',
                    bathrooms: data.bathrooms || '',
                    furniture: data.furniture || '',
                    floors: data.floors || '',
                    legal: data.legal || '',
                    price: data.price || 0,
                    provinceCode: data.provinceCode || '',
                    wardCode: data.wardCode || '',
                    address: data.address || '',
                    direction: data.direction || '',
                    type: data.type || '',
                    frontage: data.frontage || '',
                    contactName: data.user.username || '',
                    phone: data.user.phoneNumber || '',
                    images: data.images || []
                });
                const addressArr = data.address.split(",");
                const detailAddr = addressArr.slice(0, addressArr.length - 2).join(",");
                setDetailAddress(detailAddr || '');
                setPropertyType(data.type || 'NHA_RIENG');
                setLegalType(data.legal || 'SO_DO');
                setFurnitureType(data.furniture || '');
                setDirectionType(data.direction || '');                
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    const fetchProvince = async () => {
        try {
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
            setProvince(data);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    }

    const fetchWards = async (cityCode: string) => {
        try {
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
            setWards(data);
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    useEffect(() => {
        fetchProvince();
        fetchPostData();
    }, []);

    useEffect(() => {
        const selectedProvinceData: any = provinces.find((prov: any) => prov.code === formData.provinceCode);
        if (selectedProvinceData) {            
            fetchWards(formData.provinceCode);
            setSelectedProvince(selectedProvinceData.name);
        }
        
    }, [formData.provinceCode]);

    useEffect(() => {
        const selectedWardData: any = wards.find((ward: any) => ward.code === formData.wardCode);
        if (selectedWardData) {
            setSelectedWard(selectedWardData.name);
        }
    }, [wards]);

    useEffect(() => {
        updateFullAddress(detailAddress, selectedWard, selectedProvince);
    }, [detailAddress, selectedWard, selectedProvince]);


    return (
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.headerUploadPost}>
                <div>
                    <p className="heading-h8">Sửa tin đăng</p>
                </div>
                <div><p>{headline}</p></div>
                <div className={styles.tab}>
                    <div className={tabItemState.firstTab}></div>
                    <div className={tabItemState.secondTab}></div>
                </div>
            </div>
            <div className={`${styles.formContainer} flex-1`}>
                <form id="edit-post-form" onSubmit={(e) => { e.preventDefault(); editPost(); }} className={`${styles.mainContent} flex flex-col flex-1`}>
                    {step === 1 && (
                        <div className="flex-1">
                            <div className={styles.inputGroup}>
                                <div className={styles.fullWidthItem}>
                                    <label className="body-2-medium">
                                        Loại giao dịch: <span className={styles.selectedType}>{true ? 'Bán Nhà' : 'Cho Thuê'}</span>
                                    </label>
                                </div>
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
                                        type="number"
                                        id="price"
                                        name="price"
                                        placeholder="Nhập giá bán hoặc giá thuê"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
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
                                type="submit"
                                form="edit-post-form"
                                className={styles.nextButton}
                            >
                                Hoàn tất
                            </button>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

function DesktopEditPostPage({ session }: { session?: any }) {
    return (<div></div>);
}