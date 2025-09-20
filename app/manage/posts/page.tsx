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

    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? (<MobileView session={session} />) : (<DesktopView session={session} />)}
        </div>
    );
}

function MobileView({ session }: { session?: any }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [tabData, setTabData] = useState({
        all: 0,
        active: 0,
        expired: 0,
        pending: 0
    });
    const [searchParams, setSearchParams] = useState({
        title: '',
        transactionType: '',
        lastDate: 180
    });
    const [tempFilterParams, setTempFilterParams] = useState({
        transactionType: '',
        lastDate: 180
    });

    // Calculate active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (searchParams.transactionType) count++;
        if (searchParams.lastDate !== 180) count++; // 180 is the default value
        return count;
    };

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
        switch (status) {
            case 'DRAFT':
                return '/icons/Plus.svg';
            case 'EXPIRED':
                return '/icons/rotateIcon.svg';
            case 'PUBLISHED':
                return '/icons/upIcon.svg';
            default:
                return '/icons/rotateIcon.svg';
        };
    };

    // Handle filter popup actions
    const handleFilterReset = () => {
        setTempFilterParams({
            transactionType: '',
            lastDate: 180
        });
    };

    const handleFilterApply = async () => {
        const newParams = {
            ...searchParams,
            transactionType: tempFilterParams.transactionType,
            lastDate: tempFilterParams.lastDate
        };
        
        setSearchParams(newParams);
        setOpenDropdownId(null);
        
        // Re-fetch posts with new filters
        await fetchPosts(newParams);
    };

    const handleFilterClose = () => {
        // Reset temp params to current search params when closing without applying
        setTempFilterParams({
            transactionType: searchParams.transactionType,
            lastDate: searchParams.lastDate
        });
        setOpenDropdownId(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Don't close if clicking inside a dropdown
            const target = event.target as HTMLElement;
            if (target.closest('[data-dropdown-content]')) {
                return;
            }
            setOpenDropdownId(null);
        };

        if (openDropdownId) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openDropdownId]);

    
    const tabs = [
        { id: 'all', label: 'Tất cả', count: tabData.all },
        { id: 'active', label: 'Đang hiển thị', count: tabData.active },
        { id: 'expired', label: 'Hết hạn', count: tabData.expired },
        { id: 'pending', label: 'Chờ xuất bản', count: tabData.pending }
    ];

    // Fetch posts from API
    const fetchPosts = async (params = searchParams) => {
        try{
            const response = await fetch('/api/manage/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',                   
                },
                body: JSON.stringify(params)
            });
            const data = await response.json();
            setPosts(data.response);
            setTabData({
                all: data.response.length,
                active: data.response.filter((post: any) => post.status === 'PUBLISHED').length,
                expired: data.response.filter((post: any) => post.status === 'EXPIRED').length,
                pending: data.response.filter((post: any) => post.status === 'DRAFT').length
            });
        }catch(error){
            console.error("Error fetching posts:", error);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    // Initialize temp filter params when filter dropdown opens
    useEffect(() => {
        if (openDropdownId === 'filter') {
            setTempFilterParams({
                transactionType: searchParams.transactionType,
                lastDate: searchParams.lastDate
            });
        }
    }, [openDropdownId, searchParams]);

    return (
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
                    <div style={{ position: 'relative' }}>
                        <button 
                            className={styles.filterButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown('filter', e.currentTarget);
                            }}
                        >
                            <Image
                                src="/icons/Funnel.svg"
                                alt="Filter"
                                width={20}
                                height={20}
                            />
                            {getActiveFilterCount() > 0 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '-6px',
                                        right: '-6px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid white',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    {getActiveFilterCount()}
                                </span>
                            )}
                        </button>

                        {/* Filter Dropdown */}
                        {openDropdownId === 'filter' && (
                            <div
                                ref={dropdownRef}
                                data-dropdown-content="true"
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
                                    minWidth: '280px',
                                    padding: '16px',
                                    marginTop: dropdownPosition === 'below' ? '4px' : '0',
                                    marginBottom: dropdownPosition === 'above' ? '4px' : '0'
                                }}
                            >
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    marginBottom: '16px' 
                                }}>
                                    <h3 style={{ 
                                        margin: 0, 
                                        fontSize: '16px', 
                                        fontWeight: 'bold', 
                                        color: '#374151' 
                                    }}>
                                        Bộ lọc
                                    </h3>
                                    <button
                                        onClick={handleFilterClose}
                                        style={{
                                            border: 'none',
                                            background: 'none',
                                            fontSize: '18px',
                                            cursor: 'pointer',
                                            color: '#6b7280'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Transaction Type Filter */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '6px', 
                                        fontSize: '14px', 
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        Loại giao dịch
                                    </label>
                                    <select
                                        value={tempFilterParams.transactionType}
                                        onChange={(e) => setTempFilterParams(prev => ({
                                            ...prev,
                                            transactionType: e.target.value
                                        }))}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="">Tất cả</option>
                                        <option value="SELL">Bán</option>
                                        <option value="RENT">Thuê</option>
                                    </select>
                                </div>

                                {/* Last Date Filter */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '6px', 
                                        fontSize: '14px', 
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        Ngày đăng tin
                                    </label>
                                    <select
                                        value={tempFilterParams.lastDate}
                                        onChange={(e) => setTempFilterParams(prev => ({
                                            ...prev,
                                            lastDate: parseInt(e.target.value)
                                        }))}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value={7}>7 ngày qua</option>
                                        <option value={30}>30 ngày qua</option>
                                        <option value={60}>60 ngày qua</option>
                                        <option value={90}>90 ngày qua</option>
                                        <option value={180}>180 ngày qua</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '8px', 
                                    justifyContent: 'flex-end' 
                                }}>
                                    <button
                                        onClick={handleFilterReset}
                                        style={{
                                            padding: '8px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            backgroundColor: 'white',
                                            color: '#374151',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Đặt lại
                                    </button>
                                    <button
                                        onClick={handleFilterApply}
                                        style={{
                                            padding: '8px 16px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                    {posts?.filter((post) => {
                        if (activeTab === 'all') return true;
                        if (activeTab === 'active') return post.status === 'PUBLISHED';
                        if (activeTab === 'expired') return post.status === 'EXPIRED';
                        if (activeTab === 'pending') return post.status === 'DRAFT';
                        return true;
                    }).map((post) => (
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
                                            data-dropdown-content="true"
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
                                                <Image src="/icons/editIcon.svg" alt="Edit" width={16} height={16} />
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

function DesktopView({ session }: { session?: any }) {
    return (
        <div className={styles.desktopContainer}>
            <h1 className="text-3xl font-bold mb-6">Desktop View</h1>
            {/* Desktop-specific content goes here */}
        </div>
    );
} 