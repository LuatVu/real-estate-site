"use client";
import useScreenSize from "../../lib/useScreenSize";
import styles from './index.module.css';
import { useSession } from 'next-auth/react';
import NavBarMobile from '../../ui/mobile/navigation/nav-bar-mobile';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Page() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();

    return(
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm'?(<MobileView session={session} />):(<DesktopView session={session} />)}
        </div>
    );
}

function MobileView({ session }: { session?: any }){
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle dropdown for specific post
    const toggleDropdown = (postId: string, buttonElement: HTMLButtonElement) => {
        if (openDropdownId === postId) {
            setOpenDropdownId(null);
            return;
        }

        // Calculate dropdown position
        const buttonRect = buttonElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dropdownHeight = 180; // Approximate height of dropdown menu
        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // Determine if dropdown should appear above or below
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            setDropdownPosition('above');
        } else {
            setDropdownPosition('below');
        }

        setOpenDropdownId(postId);
    };

    // Handle dropdown actions
    const handleDropdownAction = (action: string, post: any) => {
        setOpenDropdownId(null);
        
        switch (action) {
            case 'repost':
                console.log('Repost/Reup post:', post.postId);
                // Implement repost logic
                break;
            case 'edit':
                console.log('Edit post:', post.postId);
                // Implement edit logic
                break;
            case 'upgrade':
                console.log('Upgrade post:', post.postId);
                // Implement upgrade logic
                break;
            case 'delete':
                console.log('Delete post:', post.postId);
                // Implement delete logic
                break;
        }
    };

    // Get the correct repost/reup label based on post status
    const getRepostLabel = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'Đẩy tin';
            case 'EXPIRED':
                return 'Đăng lại';
            case 'DRAFT':
                return 'Đăng tin';
            default:
                return 'Đăng lại';                
        };
    };

    // Get the correct repost/reup icon based on post status
    const getRepostIcon = (status: string) => {
        return status === 'PUBLISHED' ? '/icons/ArrowRight.svg' : '/icons/ArrowArcLeft.svg';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdownId(null);
        };

        if (openDropdownId) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openDropdownId]);

    // Sample data - replace with actual data from your API
    const tabData = {
        all: 24,
        active: 18,
        expired: 4,
        pending: 2
    };

    const tabs = [
        { id: 'all', label: 'Tất cả', count: tabData.all },
        { id: 'active', label: 'Đang hiển thị', count: tabData.active },
        { id: 'expired', label: 'Hết hạn', count: tabData.expired },
        { id: 'pending', label: 'Chờ xuất bản', count: tabData.pending }
    ];

    const samplePosts = [
        {
            "postId": "1cc98576-3e88-4b4d-9eb9-7b9a1c077043",
            "userId": "4d756a86-e8fb-4ecb-9ac3-90fed4c6458b",
            "title": "Bán nhà Tứ Liên, Tây Hồ - 50m2 - 7 tầng - thang máy - sổ đỏ giao dịch ",
            "description": "Chính chủ cần bán nhà tại phố Tứ Liên, Tây Hồ, Hà Nội\nNhà xây mới 7 tầng thang máy.\nSổ đỏ chính chủ, cất két giao dịch ngay.\nVị trí đẹp, đắc địa, phân lô oto chánh.\nLiên hệ ngay e.Luật nhận tư vấn hỗ trợ.",
            "acreage": 50.00,
            "legal": "SO_DO",
            "price": 2150000000.00,
            "provinceCode": "01",
            "wardCode": "00004",
            "address": "24 Van Cao, Ba Đình, Hà Nội",
            "createdDate": "2025-09-07T11:36:37",
            "updatedDate": "2025-09-07T11:36:37",
            "expiredAt": "2025-09-07T11:36:37",
            "status": "PUBLISHED",
            "type": "NHA_RIENG",
            "transactionType": "SELL",
            "images": [
                {
                    "imageId": "f30e83a9-0c8a-4ea2-96bb-d903973502d1",
                    "postId": "1cc98576-3e88-4b4d-9eb9-7b9a1c077043",
                    "fileUrl": "1757219673933-206a34cd-512b-4f63-9858-d42df7c37907.jpg",
                    "fileName": "116191181-3145-ban-nha-mat-tien-da-nang-gia-re.jpg",
                    "isPrimary": true
                }
            ]
        },
        {
            "postId": "a8b1964b-0ed0-462e-8a7a-97504a165e57",
            "userId": "4d756a86-e8fb-4ecb-9ac3-90fed4c6458b",
            "title": "Bán nhà Tứ Liên, Tây Hồ - 50m2 - 7 tầng - thang máy - sổ đỏ giao dịch ",
            "description": "Chính chủ cần bán nhà tại phố Tứ Liên, Tây Hồ, Hà Nội\nNhà xây mới 7 tầng thang máy.\nSổ đỏ chính chủ, cất két giao dịch ngay.\nVị trí đẹp, đắc địa, phân lô oto chánh.\nLiên hệ ngay e.Luật nhận tư vấn hỗ trợ.",
            "acreage": 50.00,
            "legal": "SO_DO",
            "price": 2150000000.00,
            "provinceCode": "01",
            "wardCode": "00004",
            "address": "24 Van Cao, Ba Đình, Hà Nội",
            "createdDate": "2025-09-07T11:34:36",
            "updatedDate": "2025-09-07T11:34:36",
            "expiredAt": "2025-09-07T11:34:36",
            "status": "EXPIRED",
            "type": "NHA_RIENG",
            "transactionType": "SELL",
            "images": [
                {
                    "imageId": "3cf64241-5599-403a-a73a-60b7a3e0606c",
                    "postId": "a8b1964b-0ed0-462e-8a7a-97504a165e57",
                    "fileUrl": "1757219673933-206a34cd-512b-4f63-9858-d42df7c37907.jpg",
                    "fileName": "116191181-3145-ban-nha-mat-tien-da-nang-gia-re.jpg",
                    "isPrimary": true
                }
            ]
        },
        {
            "postId": "0c6f29b8-4e2a-466a-a7f0-77c098f33dc3",
            "userId": "4d756a86-e8fb-4ecb-9ac3-90fed4c6458b",
            "title": "Bán nhà Tứ Liên, Tây Hồ - 50m2 - 7 tầng - thang máy - sổ đỏ giao dịch ",
            "description": "Chính chủ cần bán nhà tại phố Tứ Liên, Tây Hồ, Hà Nội\nNhà xây mới 7 tầng thang máy.\nSổ đỏ chính chủ, cất két giao dịch ngay.\nVị trí đẹp, đắc địa, phân lô oto chánh.\nLiên hệ ngay e.Luật nhận tư vấn hỗ trợ.",
            "acreage": 50.00,
            "bedrooms": 3,
            "bathrooms": 2,
            "furniture": "CO_BAN",
            "legal": "SO_DO",
            "price": 2350000000.00,
            "provinceCode": "01",
            "wardCode": "00004",
            "address": "89 Van Cao, Ba Đình, Hà Nội",
            "createdDate": "2025-09-07T10:42:47",
            "updatedDate": "2025-09-07T10:42:47",
            "expiredAt": "2025-09-07T10:42:47",
            "status": "DRAFT",
            "floors": 4,
            "direction": "TAY_BAC",
            "type": "NHA_RIENG",
            "transactionType": "RENT",
            "images": [
                {
                    "imageId": "3774b702-ab87-4053-9e18-e319a91f8c20",
                    "postId": "0c6f29b8-4e2a-466a-a7f0-77c098f33dc3",
                    "fileUrl": "1757216562959-80ca0f95-917c-4d2c-8549-655195c271bd.jpg",
                    "fileName": "1217250571-1919-ban-nha-mat-tien-da-nang-chinh-chu.jpg",
                    "isPrimary": true
                }
            ]
        },
        // Add more sample posts as needed
    ];

    return(
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.headerUploadPost}>
                <div>
                    <p className="heading-h8">Quản lý tin đăng</p>
                </div>
                <div className={styles.searchFilterContainer}>
                    <div className={styles.searchInputContainer}>
                        <input
                            type="text"
                            placeholder="Nhập tiêu đề tin"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button className={styles.filterButton}>
                        <Image 
                            src="/icons/Funnel.svg" 
                            alt="Filter" 
                            width={20} 
                            height={20} 
                        />
                    </button>
                </div>
                <div className={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
                        >
                            <span className={styles.tabLabel}>{tab.label}</span>
                            <span className={styles.tabCount}>{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className={`${styles.formContainer} flex-1`}>
                <div className={styles.postsGrid}>
                    {samplePosts.map((post) => (
                        <div key={post.postId} className={styles.postCard}>
                            <div className={styles.postImageContainer}>
                                <Image
                                    src="/temp/11.jpg" // Replace with post.images[0].fileUrl when available
                                    alt={post.title}
                                    width={120}
                                    height={80}
                                    className={styles.postImage}
                                />
                                <div className={`${styles.statusBadge} ${styles[`status${post.status}`]}`}>
                                    {post.status === 'PUBLISHED' && 'Đã xuất bản'}
                                    {post.status === 'DRAFT' && 'Nháp'}
                                    {post.status === 'EXPIRED' && 'Hết hạn'}
                                </div>
                            </div>
                            
                            <div className={styles.postContent}>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                
                                <div className={styles.postInfo}>
                                    <div className={styles.postType}>
                                        <span className={`${styles.transactionType} ${post.transactionType === 'SELL' ? styles.sellType : styles.rentType}`}>
                                            {post.transactionType === 'SELL' ? 'Bán' : 'Cho thuê'}
                                        </span>
                                        <span className={styles.propertyType}>
                                            {post.type === 'NHA_RIENG' ? 'Nhà riêng' : 
                                             post.type === 'CHUNG_CU' ? 'Chung cư' :
                                             post.type === 'VILLA' ? 'Villa' : post.type}
                                        </span>
                                    </div>
                                    
                                    <div className={styles.postAddress}>
                                        <Image 
                                            src="/icons/location.svg" 
                                            alt="Location" 
                                            width={14} 
                                            height={14} 
                                        />
                                        <span>{post.address}</span>
                                    </div>
                                    
                                    <div className={styles.postDates}>
                                        <div className={styles.dateItem}>
                                            <span className={styles.dateLabel}>Ngày đăng:</span>
                                            <span className={styles.dateValue}>
                                                {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className={styles.dateItem}>
                                            <span className={styles.dateLabel}>Hết hạn:</span>
                                            <span className={styles.dateValue}>
                                                {new Date(post.expiredAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.postActions}>
                                <button className={styles.actionButton}>
                                    <Image src="/icons/EyeOpen.svg" alt="View" width={16} height={16} />
                                </button>
                                <div style={{ position: 'relative' }}>
                                    <button 
                                        className={styles.actionButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(post.postId, e.currentTarget);
                                        }}
                                    >
                                        <Image src="/icons/threeDots.svg" alt="More actions" width={16} height={16} />
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    {openDropdownId === post.postId && (
                                        <div 
                                            ref={dropdownRef}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                position: 'absolute',
                                                [dropdownPosition === 'above' ? 'bottom' : 'top']: '100%',
                                                right: 0,
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                zIndex: 50,
                                                minWidth: '160px',
                                                marginTop: dropdownPosition === 'below' ? '4px' : '0',
                                                marginBottom: dropdownPosition === 'above' ? '4px' : '0'
                                            }}
                                        >
                                            <button
                                                onClick={() => handleDropdownAction('repost', post)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 16px',
                                                    textAlign: 'left',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    fontSize: '14px',
                                                    color: '#374151',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #f3f4f6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Image src={getRepostIcon(post.status)} alt="Repost" width={16} height={16} />
                                                {getRepostLabel(post.status)}
                                            </button>
                                            <button
                                                onClick={() => handleDropdownAction('edit', post)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 16px',
                                                    textAlign: 'left',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    fontSize: '14px',
                                                    color: '#374151',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #f3f4f6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Image src="/icons/useIcon.svg" alt="Edit" width={16} height={16} />
                                                Sửa tin
                                            </button>
                                            <button
                                                onClick={() => handleDropdownAction('upgrade', post)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 16px',
                                                    textAlign: 'left',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    fontSize: '14px',
                                                    color: '#374151',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #f3f4f6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Image src="/icons/VipDiamond.svg" alt="Upgrade" width={16} height={16} />
                                                Nâng Vip
                                            </button>
                                            <button
                                                onClick={() => handleDropdownAction('delete', post)}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 16px',
                                                    textAlign: 'left',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    fontSize: '14px',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    borderRadius: '0 0 8px 8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Image src="/icons/X.svg" alt="Delete" width={16} height={16} style={{ filter: 'invert(18%) sepia(94%) saturate(7496%) hue-rotate(354deg) brightness(101%) contrast(109%)' }} />
                                                Xoá tin
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DesktopView({ session }: { session?: any }){
    return(
        <div className={styles.desktopContainer}>
            <h1 className="text-3xl font-bold mb-6">Desktop View</h1>
            {/* Desktop-specific content goes here */}
        </div>
    );
} 