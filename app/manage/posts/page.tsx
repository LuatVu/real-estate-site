"use client";
import useScreenSize from "../../lib/useScreenSize";
import styles from './index.module.css';
import { useSession } from 'next-auth/react';
import NavBarMobile from '../../ui/mobile/navigation/nav-bar-mobile';
import NavBarDesktop from '../../ui/desktop/navigation/nav-bar-desktop';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Alert from '../../ui/common/alert';
import { useAlert } from '../../hook/useAlert';
import Confirmation from '../../ui/common/confirmation';
import { useConfirmation } from '../../hook/useConfirmation';
import ChargeFeePopup, { ChargeFeeData } from '../../ui/common/charge-fee-popup';
import VipPackagePopup, { PostChargeFeeData } from '../../ui/common/vip-package-popup';
import { useRouter } from 'next/navigation';
import { formatPrice } from "@/app/utils/price-formatter";
import { formatLegalStatus, formatFurnitureStatus, formatDirection, getPropertyTypeLabel, getTransactionTypeLabel } from "@/app/utils/commons-utils";
import { formatDescription } from "@/app/utils/markdown-utils";
import DesktopFooter from "@/app/ui/desktop/footer/desktop-footer";
import MbFooter from "@/app/ui/mobile/footer/mb.footer";

// Function to get CSS class for transaction type
function getTransactionTypeClass(transactionType: string): string {
    const transactionClasses: { [key: string]: string } = {
        'SELL': 'sellType',
        'RENT': 'rentType',
        'PROJECT': 'projectType'
    };
    return transactionClasses[transactionType] || 'sellType';
}

// Function to convert priority level codes to readable labels
function getPriorityLevelLabel(priorityLevel: string): string {
    const priorityLabels: { [key: string]: string } = {
        'DIAMOND': 'Kim cương',
        'GOLD': 'Vàng',
        'SILVER': 'Bạc',
        'NORMAL': 'Thường'
    };
    return priorityLabels[priorityLevel] || priorityLevel;
}

// Function to get CSS class for priority level
function getPriorityLevelClass(priorityLevel: string): string {
    const priorityClasses: { [key: string]: string } = {
        'DIAMOND': 'priorityDiamond',
        'GOLD': 'priorityGold',
        'SILVER': 'prioritySilver',
        'NORMAL': 'priorityNormal'
    };
    return priorityClasses[priorityLevel] || 'priorityNormal';
}

export default function Page() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();

    return (
        <div className="flex flex-col min-h-screen">
            {(screenSize === "sm" || screenSize === "md") ? (<MobileView session={session} />) : (<DesktopView session={session} />)}
        </div>
    );
}

function MobileView({ session }: { session?: any }) {
    const { alert, showSuccess, showError, showWarning, showInfo, hideAlert } = useAlert();
    const { confirmation, showConfirmation, hideConfirmation, setConfirmButtonLoading } = useConfirmation();
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
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10); // Number of posts per page

    // Charge fee popup state
    const [chargeFeePopup, setChargeFeePopup] = useState({
        isVisible: false,
        postId: '',
        type: 'new' as 'new' | 'up' | 'renew',
        postTitle: '',
        confirmButtonLoading: false
    });

    // VIP package popup state
    const [vipPackagePopup, setVipPackagePopup] = useState({
        isVisible: false,
        postId: '',
        postTitle: '',
        confirmButtonLoading: false
    });

    // Preview popup state
    const [previewPopup, setPreviewPopup] = useState({
        isVisible: false,
        post: null as any
    });

    const router = useRouter();

    // Handle preview popup
    const handlePreviewPost = (post: any) => {
        setPreviewPopup({ isVisible: true, post });
    };

    const closePreviewPopup = () => {
        setPreviewPopup({ isVisible: false, post: null });
    };

    // Handle search input events
    const handleSearchSubmit = () => {
        const newParams = {
            ...searchParams,
            title: searchTerm
        };
        setSearchParams(newParams);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {        
        handleSearchSubmit();        
    };

    const handleSearchBlur = () => {
        handleSearchSubmit();
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < getTotalPages()) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Charge fee popup handlers
    const showChargeFeePopup = (postId: string, type: 'new' | 'up' | 'renew', postTitle: string) => {
        setChargeFeePopup({
            isVisible: true,
            postId,
            type,
            postTitle,
            confirmButtonLoading: false
        });
    };

    const hideChargeFeePopup = () => {
        setChargeFeePopup(prev => ({
            ...prev,
            isVisible: false,
            confirmButtonLoading: false
        }));
    };

    // VIP package popup handlers
    const showVipPackagePopup = (postId: string, postTitle: string) => {
        setVipPackagePopup({
            isVisible: true,
            postId,
            postTitle,
            confirmButtonLoading: false
        });
    };

    const hideVipPackagePopup = () => {
        setVipPackagePopup(prev => ({
            ...prev,
            isVisible: false,
            confirmButtonLoading: false
        }));
    };

    const handleChargeFeeConfirm = async (feeData: ChargeFeeData) => {
        setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: true }));

        try {
            if (chargeFeePopup.type === 'new' || chargeFeePopup.type === 'renew') {
                const response = await renewPost(chargeFeePopup.postId);
                const data = await response.json();
                if (!response.ok) {
                    setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: false }));
                    showError(`Thanh toán thất bại. ${data.message || ''}`);
                    return;
                }

            } else if (chargeFeePopup.type === 'up') {
                const response = await reupPost(chargeFeePopup.postId);
                const data = await response.json();
                if (!response.ok) {
                    setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: false }));
                    showError(`Thanh toán thất bại. ${data.message || ''}`);
                    return;
                }
            }

            hideChargeFeePopup();
            showSuccess(`Thanh toán thành công!`);
            // Refresh posts data
            await fetchPosts(searchParams);
        } catch (error) {
            setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: false }));
            showError('Thanh toán thất bại. Vui lòng thử lại sau.');
        }
    };

    const handleVipPackageConfirm = async (selectedPackage: PostChargeFeeData) => {
        setVipPackagePopup(prev => ({ ...prev, confirmButtonLoading: true }));

        try {
            const response = await fetch('/api/posts/update-priority', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: vipPackagePopup.postId,
                    priorityLevel: selectedPackage.priorityLevel
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setVipPackagePopup(prev => ({ ...prev, confirmButtonLoading: false }));
                showError(`Cập nhật gói VIP thất bại. ${data.message || ''}`);
                return;
            }

            hideVipPackagePopup();
            showSuccess('Cập nhật gói VIP thành công!');
            // Refresh posts data
            await fetchPosts(searchParams);
        } catch (error) {
            setVipPackagePopup(prev => ({ ...prev, confirmButtonLoading: false }));
            showError('Cập nhật gói VIP thất bại. Vui lòng thử lại sau.');
        }
    };

    // Calculate active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (searchParams.transactionType) count++;
        if (searchParams.lastDate !== 0) count++; // 0 is the default value
        return count;
    };

    // Pagination calculations
    const getFilteredPosts = () => {
        return posts?.filter((post) => {
            // Filter by tab status
            let matchesTab = true;
            if (activeTab === 'active') matchesTab = post.status === 'PUBLISHED';
            else if (activeTab === 'expired') matchesTab = post.status === 'EXPIRED';
            else if (activeTab === 'pending') matchesTab = post.status === 'DRAFT';
            // 'all' tab shows everything

            // Filter by search term
            let matchesSearch = true;
            if (searchParams.title && searchParams.title.trim() !== '') {
                matchesSearch = post.title.toLowerCase().includes(searchParams.title.toLowerCase());
            }

            // Filter by transaction type
            let matchesTransaction = true;
            if (searchParams.transactionType && searchParams.transactionType !== '') {
                matchesTransaction = post.transactionType === searchParams.transactionType;
            }

            // Filter by date (lastDate is in days)
            let matchesDate = true;
            if (searchParams.lastDate !== 0) {
                const postDate = new Date(post.createdDate);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - searchParams.lastDate);
                matchesDate = postDate >= cutoffDate;
            }

            return matchesTab && matchesSearch && matchesTransaction && matchesDate;
        }) || [];
    };

    const getPaginatedPosts = () => {
        const filteredPosts = getFilteredPosts();
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        return filteredPosts.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filteredPosts = getFilteredPosts();
        return Math.ceil(filteredPosts.length / postsPerPage);
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
            case 'upload-new': // status = 'DRAFT'                
                showChargeFeePopup(post.postId, 'new', post.title);
                break;
            case 'reup': // status = 'Published'
                showChargeFeePopup(post.postId, 'up', post.title);
                break;
            case 'renew': // status = 'Expired'
                showChargeFeePopup(post.postId, 'renew', post.title);
                break;
            case 'edit':
                router.push(`/edit-post/${post.postId}`);
                break;
            case 'upgrade':
                showVipPackagePopup(post.postId, post.title);
                break;
            case 'delete':
                // Show confirmation dialog for delete
                showConfirmation({
                    title: 'Xác nhận xóa tin',
                    message: `Bạn có chắc chắn muốn xóa tin "${post.title}"? Hành động này không thể hoàn tác.`,
                    type: 'danger',
                    confirmText: 'Xóa tin',
                    cancelText: 'Hủy',
                    onConfirm: async () => {
                        setConfirmButtonLoading(true);
                        try {
                            await updatePostStatus(post.postId, 'DELETED');
                            hideConfirmation();
                            showSuccess(`Đã xóa tin "${post.title}" thành công`);
                            await fetchPosts(searchParams);
                        } catch (error) {
                            setConfirmButtonLoading(false);
                            showError('Không thể xóa tin đăng. Vui lòng thử lại sau.');
                        }
                    },
                    onCancel: () => {
                        hideConfirmation();
                    }
                });
                break;
        }
    };

    // Get the correct repost/reup label based on post status
    const getRepostLabel = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'Đẩy tin';
            case 'EXPIRED':
                return 'Gia hạn';
            case 'DRAFT':
                return 'Đăng tin';
            default:
                return 'Gia hạn';
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

    const getRepostAction = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return 'upload-new';
            case 'EXPIRED':
                return 'renew';
            case 'PUBLISHED':
                return 'reup';
            default:
                return 'renew';
        }
    }

    // Handle filter popup actions
    const handleFilterReset = () => {
        const currentFilterCount = getActiveFilterCount();

        if (currentFilterCount > 0) {
            showConfirmation({
                title: 'Xác nhận đặt lại bộ lọc',
                message: `Bạn có muốn xóa tất cả ${currentFilterCount} bộ lọc đang áp dụng không?`,
                type: 'warning',
                confirmText: 'Đặt lại',
                cancelText: 'Hủy',
                onConfirm: () => {
                    setSearchParams({
                        ...searchParams,
                        transactionType: '',
                        lastDate: 180
                    });
                    hideConfirmation();
                    showInfo('Đã đặt lại tất cả bộ lọc');
                },
                onCancel: () => {
                    hideConfirmation();
                }
            });
        } else {
            setSearchParams({
                ...searchParams,
                transactionType: '',
                lastDate: 180
            });
            showInfo('Bộ lọc đã được đặt lại');
        }
    };

    const handleFilterApply = async () => {
        const newParams = {
            ...searchParams,
            transactionType: tempFilterParams.transactionType,
            lastDate: tempFilterParams.lastDate
        };
        
        setSearchParams(newParams);
        setOpenDropdownId(null);
        setCurrentPage(1); // Reset to first page when applying filters

        // Re-fetch posts with new filters
        await fetchPosts(newParams);

        // Show filter applied success message
        let filterCount = 0;
        if(newParams.transactionType) filterCount++;
        if(newParams.lastDate != undefined && newParams.lastDate > 0) filterCount++;

        if (filterCount > 0) {
            showSuccess(`Đã áp dụng ${filterCount} bộ lọc thành công`);
        } else {
            showInfo('Đã xóa tất cả bộ lọc');
        }
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

    const fetchChargeFee = async (postId: string) => {
        try {
            const response = await fetch(`/api/manage/posts/charge-fee/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
        } catch (error) {
            console.error("Error charging fee:", error);
            showError("Không thể tính phí tin đăng. Vui lòng thử lại sau.");
        }
    }

    // Fetch posts from API
    const fetchPosts = async (params = searchParams) => {
        try {
            const response = await fetch('/api/manage/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                if(response.status === 401 || response.status === 403) {                    
                    router.push('/sign-in?error=session-expired');
                    return;
                }
            }

            const data = await response.json();
            setPosts(data.response);
            setTabData({
                all: data.response.length,
                active: data.response.filter((post: any) => post.status === 'PUBLISHED').length,
                expired: data.response.filter((post: any) => post.status === 'EXPIRED').length,
                pending: data.response.filter((post: any) => post.status === 'DRAFT').length
            });

            // Show success message when posts are loaded (optional, can be removed if too frequent)
            // showSuccess(`Đã tải ${data.response.length} tin đăng thành công`);
        } catch (error) {
            router.push('/sign-in?error=session-expired');
        }
    }

    const updatePostStatus = async (postId: string, status: string) => {
        await fetch(`/api/manage/post-status?postId=${postId}&status=${status}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    const reupPost = async (postId: string): Promise<Response> => {
        const response = await fetch(`/api/manage/posts/reup/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    };

    const renewPost = async (postId: string): Promise<Response> => {
        const response = await fetch(`/api/manage/posts/renew/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    useEffect(() => {
        fetchPosts();
    }, [session]);

    // Initialize temp filter params when filter dropdown opens
    useEffect(() => {
        if (openDropdownId === 'filter') {
            setTempFilterParams({
                transactionType: searchParams.transactionType,
                lastDate: searchParams.lastDate
            });
        }
    }, [openDropdownId, searchParams]);

    const POST_STATUSES = {
        PUBLISHED: 'PUBLISHED',
        DRAFT: 'DRAFT',
        EXPIRED: 'EXPIRED',
        DELETED: 'DELETED'
    };

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
                            onKeyDown={handleSearchKeyDown}
                            onBlur={handleSearchBlur}
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
                                        <option value="PROJECT">Dự án</option>
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
                                        <option value={0}>Tất cả</option>
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
                            onClick={() => {
                                setActiveTab(tab.id);
                                setCurrentPage(1); // Reset to first page when changing tabs
                            }}
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
                    {getPaginatedPosts().map((post) => (
                        <div key={post.postId} className={styles.postCard}>
                            <div className={styles.postImageContainer}>
                                 {post.images && post.images.length > 0 ? (
                                    <Image
                                        src={`${post.images[0].fileUrl}`}
                                        alt={post.title}
                                        width={120}
                                        height={80}
                                        className={styles.postImage}
                                    />
                                ) : (
                                    <Image
                                        src="/temp/11.jpg"
                                        alt={post.title}
                                        width={120}
                                        height={80}
                                        className={styles.postImage}
                                    />
                                )}
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
                                        <span className={`${styles.transactionType} ${styles[getTransactionTypeClass(post.transactionType)]}`}>
                                            {getTransactionTypeLabel(post.transactionType)}
                                        </span>
                                        <span className={styles.propertyType}>
                                            {getPropertyTypeLabel(post.type)}
                                        </span>
                                        {post.rankingDto?.priorityLevel && (
                                            <span className={`${styles.priorityLevel} ${styles[getPriorityLevelClass(post.rankingDto.priorityLevel)]}`}>
                                                {getPriorityLevelLabel(post.rankingDto.priorityLevel)}
                                            </span>
                                        )}

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
                                            <span className={styles.dateLabel}>Ngày tạo:</span>
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
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handlePreviewPost(post)}
                                >
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
                                            {post.transactionType !== 'PROJECT' && (
                                            <button
                                                onClick={() => handleDropdownAction(getRepostAction(post.status), post)}
                                                className={styles.btnFacility}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Image src={getRepostIcon(post.status)} alt="renew" width={16} height={16} />
                                                {getRepostLabel(post.status)}
                                            </button>
                                            )}
                                            {post.transactionType !== 'PROJECT' && (
                                            <button
                                                onClick={() => handleDropdownAction('edit', post)}
                                                className={styles.btnFacility}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Image src="/icons/editIcon.svg" alt="Edit" width={16} height={16} />
                                                Sửa tin
                                            </button>
                                            )}
                                            {post.transactionType !== 'PROJECT' && (
                                            <button
                                                onClick={() => handleDropdownAction('upgrade', post)}
                                                className={styles.btnFacility}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Image src="/icons/VipDiamond.svg" alt="Upgrade" width={16} height={16} />
                                                Nâng/Hạ Vip
                                            </button>
                                            )}
                                            <button
                                                onClick={() => handleDropdownAction('delete', post)}
                                                className={styles.btnFacility}
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

                {/* Pagination Controls */}
                {getTotalPages() > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '20px',
                        padding: '20px'
                    }}>
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                                color: currentPage === 1 ? '#9ca3af' : '#374151',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            ← Trước
                        </button>

                        {Array.from({ length: getTotalPages() }, (_, index) => {
                            const page = index + 1;
                            const isCurrentPage = page === currentPage;
                            const showPage = page === 1 || page === getTotalPages() ||
                                Math.abs(page - currentPage) <= 2;

                            if (!showPage && page !== currentPage - 3 && page !== currentPage + 3) {
                                return null;
                            }

                            if ((page === currentPage - 3 || page === currentPage + 3) &&
                                page !== 1 && page !== getTotalPages()) {
                                return (
                                    <span key={`ellipsis-${page}`} style={{ color: '#9ca3af', fontSize: '14px' }}>
                                        ...
                                    </span>
                                );
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        backgroundColor: isCurrentPage ? '#3b82f6' : 'white',
                                        color: isCurrentPage ? 'white' : '#374151',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        minWidth: '40px'
                                    }}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === getTotalPages()}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                backgroundColor: currentPage === getTotalPages() ? '#f3f4f6' : 'white',
                                color: currentPage === getTotalPages() ? '#9ca3af' : '#374151',
                                cursor: currentPage === getTotalPages() ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Tiếp →
                        </button>

                        <div style={{
                            marginLeft: '16px',
                            fontSize: '14px',
                            color: '#6b7280'
                        }}>
                            Trang {currentPage} / {getTotalPages()} ({getFilteredPosts().length} tin)
                        </div>
                    </div>
                )}
            </div>

            {/* Alert Component */}
            <Alert
                type={alert.type}
                message={alert.message}
                isVisible={alert.isVisible}
                onClose={hideAlert}
            />

            {/* Confirmation Component */}
            <Confirmation
                isVisible={confirmation.isVisible}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
                confirmText={confirmation.confirmText}
                cancelText={confirmation.cancelText}
                onConfirm={confirmation.onConfirm}
                onCancel={confirmation.onCancel}
                confirmButtonLoading={confirmation.confirmButtonLoading}
            />

            {/* Charge Fee Popup */}
            <ChargeFeePopup
                isVisible={chargeFeePopup.isVisible}
                postId={chargeFeePopup.postId}
                type={chargeFeePopup.type}
                postTitle={chargeFeePopup.postTitle}
                onConfirm={handleChargeFeeConfirm}
                onCancel={hideChargeFeePopup}
                confirmButtonLoading={chargeFeePopup.confirmButtonLoading}
            />

            {/* VIP Package Popup */}
            <VipPackagePopup
                isVisible={vipPackagePopup.isVisible}
                postId={vipPackagePopup.postId}
                postTitle={vipPackagePopup.postTitle}
                onConfirm={handleVipPackageConfirm}
                onCancel={hideVipPackagePopup}
                confirmButtonLoading={vipPackagePopup.confirmButtonLoading}
            />

            {/* Preview Popup */}
            {previewPopup.isVisible && previewPopup.post && (
                <div className={styles.previewOverlay} onClick={closePreviewPopup}>
                    <div className={styles.previewContainer} onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <button className={styles.previewCloseButton} onClick={closePreviewPopup}>
                            ×
                        </button>

                        {/* Primary Image */}
                        <div className={styles.previewImageContainer}>
                            {previewPopup.post.images && previewPopup.post.images.length > 0 ? (
                                <Image
                                    src={`${previewPopup.post.images[0].fileUrl}`}
                                    alt={previewPopup.post.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className={styles.previewImagePlaceholder}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.5L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor" />
                                    </svg>
                                    <span className={styles.previewImagePlaceholderText}>Không có hình ảnh</span>
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className={styles.previewMainContent}>
                            {/* Property Title and Address */}
                            <div className={styles.previewHeader}>
                                <h1 className={styles.previewTitle}>
                                    {previewPopup.post.title}
                                </h1>
                                <div className={styles.previewAddress}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor" />
                                    </svg>
                                    <span>{previewPopup.post.address || 'Chưa có địa chỉ'}</span>
                                </div>
                            </div>

                            {/* Property Description */}
                            {previewPopup.post.description && (
                                <div className={styles.previewDescriptionSection}>
                                    <h2 className={styles.previewDescriptionTitle}>
                                        Thông tin mô tả
                                    </h2>
                                    <div className={styles.previewDescriptionContent}>
                                        {formatDescription(previewPopup.post.description)}
                                    </div>
                                </div>
                            )}

                            {/* Property Features */}
                            <div className={styles.previewFeaturesSection}>
                                <h2 className={styles.previewFeaturesTitle}>
                                    Đặc điểm bất động sản
                                </h2>
                                <div className={styles.previewFeaturesGrid}>
                                    {previewPopup.post.price && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>💰</span>
                                                <span className={styles.previewFeatureLabel}>Mức giá</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatPrice(previewPopup.post.price)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.acreage && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>📐</span>
                                                <span className={styles.previewFeatureLabel}>Diện tích</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.acreage} m²
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.bedrooms && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🛏️</span>
                                                <span className={styles.previewFeatureLabel}>Số phòng ngủ</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.bedrooms} PN
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.bathrooms && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🚿</span>
                                                <span className={styles.previewFeatureLabel}>Số phòng tắm</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.bathrooms} Phòng
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.floors && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🏢</span>
                                                <span className={styles.previewFeatureLabel}>Số tầng</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.floors} Tầng
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.legal && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>📄</span>
                                                <span className={styles.previewFeatureLabel}>Pháp lý</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatLegalStatus(previewPopup.post.legal)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.furniture && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🪑</span>
                                                <span className={styles.previewFeatureLabel}>Nội thất</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatFurnitureStatus(previewPopup.post.furniture)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.direction && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🧭</span>
                                                <span className={styles.previewFeatureLabel}>Hướng</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatDirection(previewPopup.post.direction)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.frontage && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🏠</span>
                                                <span className={styles.previewFeatureLabel}>Mặt tiền</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.frontage} m
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/*Footer */}
                        <div className={styles.previewFooter}>
                            <div className={styles.previewFooterContent}>
                                <div className={styles.previewFooterProfile}>
                                    <div className={styles.previewFooterAvatar}>
                                        📝
                                    </div>
                                    <div>
                                        <p className={styles.previewFooterUserName}>
                                            Mã bài đăng
                                        </p>
                                        <p className={styles.previewFooterUserId}>
                                            {previewPopup.post.postId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className={styles.previewDetailButton} onClick={() => 
                            {
                                if (previewPopup.post.transactionType === 'PROJECT') {
                                    router.push(`/landing-page/${previewPopup.post.postId}`);
                                    return;
                                }
                                router.push(`/post/${previewPopup.post.postId}`);
                            }}>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <MbFooter />
        </div>
    );
}

function DesktopView({ session }: { session?: any }) {
    const { alert, showSuccess, showError, showWarning, showInfo, hideAlert } = useAlert();
    const { confirmation, showConfirmation, hideConfirmation, setConfirmButtonLoading } = useConfirmation();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
    const [dropdownCoordinates, setDropdownCoordinates] = useState<{x: number, y: number}>({x: 0, y: 0});
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
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10); // More posts per page for desktop

    // Charge fee popup state
    const [chargeFeePopup, setChargeFeePopup] = useState({
        isVisible: false,
        postId: '',
        type: 'new' as 'new' | 'up' | 'renew',
        postTitle: '',
        confirmButtonLoading: false
    });

    // VIP package popup state
    const [vipPackagePopup, setVipPackagePopup] = useState({
        isVisible: false,
        postId: '',
        postTitle: '',
        confirmButtonLoading: false
    });

    // Preview popup state
    const [previewPopup, setPreviewPopup] = useState({
        isVisible: false,
        post: null as any
    });

    const router = useRouter();

    // Handle preview popup
    const handlePreviewPost = (post: any) => {
        setPreviewPopup({ isVisible: true, post });
    };

    const closePreviewPopup = () => {
        setPreviewPopup({ isVisible: false, post: null });
    };

    // Handle search input events
    const handleSearchSubmit = () => {
        const newParams = {
            ...searchParams,
            title: searchTerm
        };
        setSearchParams(newParams);
        setCurrentPage(1);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {        
        handleSearchSubmit();        
    };

    const handleSearchBlur = () => {
        handleSearchSubmit();
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < getTotalPages()) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Charge fee popup handlers
    const showChargeFeePopup = (postId: string, type: 'new' | 'up' | 'renew', postTitle: string) => {
        setChargeFeePopup({
            isVisible: true,
            postId,
            type,
            postTitle,
            confirmButtonLoading: false
        });
    };

    const hideChargeFeePopup = () => {
        setChargeFeePopup(prev => ({
            ...prev,
            isVisible: false,
            confirmButtonLoading: false
        }));
    };

    // VIP package popup handlers
    const showVipPackagePopup = (postId: string, postTitle: string) => {
        setVipPackagePopup({
            isVisible: true,
            postId,
            postTitle,
            confirmButtonLoading: false
        });
    };

    const hideVipPackagePopup = () => {
        setVipPackagePopup(prev => ({
            ...prev,
            isVisible: false,
            confirmButtonLoading: false
        }));
    };

    const handleChargeFeeConfirm = async (feeData: ChargeFeeData) => {
        setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: true }));

        try {
            if (chargeFeePopup.type === 'new' || chargeFeePopup.type === 'renew') {
                const response = await renewPost(chargeFeePopup.postId);
                const data = await response.json();
                if (!response.ok) {
                    setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: false }));
                    showError(`Thanh toán thất bại. ${data.message || ''}`);
                    return;
                }

            } else if (chargeFeePopup.type === 'up') {
                const response = await reupPost(chargeFeePopup.postId);
                const data = await response.json();
                if (!response.ok) {
                    setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: false }));
                    showError(`Thanh toán thất bại. ${data.message || ''}`);
                    return;
                }
            }

            hideChargeFeePopup();
            showSuccess(`Thanh toán thành công!`);
            await fetchPosts(searchParams);
        } catch (error) {
            setChargeFeePopup(prev => ({ ...prev, confirmButtonLoading: false }));
            showError('Thanh toán thất bại. Vui lòng thử lại sau.');
        }
    };

    const handleVipPackageConfirm = async (selectedPackage: PostChargeFeeData) => {
        setVipPackagePopup(prev => ({ ...prev, confirmButtonLoading: true }));

        try {
            const response = await fetch('/api/posts/update-priority', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: vipPackagePopup.postId,
                    priorityLevel: selectedPackage.priorityLevel
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setVipPackagePopup(prev => ({ ...prev, confirmButtonLoading: false }));
                showError(`Cập nhật gói VIP thất bại. ${data.message || ''}`);
                return;
            }

            hideVipPackagePopup();
            showSuccess('Cập nhật gói VIP thành công!');
            await fetchPosts(searchParams);
        } catch (error) {
            setVipPackagePopup(prev => ({ ...prev, confirmButtonLoading: false }));
            showError('Cập nhật gói VIP thất bại. Vui lòng thử lại sau.');
        }
    };

    // Calculate active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (searchParams.transactionType) count++;
        if (searchParams.lastDate !== 0) count++;
        return count;
    };

    // Pagination calculations
    const getFilteredPosts = () => {
        return posts?.filter((post) => {
            // Filter by tab status
            let matchesTab = true;
            if (activeTab === 'active') matchesTab = post.status === 'PUBLISHED';
            else if (activeTab === 'expired') matchesTab = post.status === 'EXPIRED';
            else if (activeTab === 'pending') matchesTab = post.status === 'DRAFT';
            // 'all' tab shows everything

            // Filter by search term
            let matchesSearch = true;
            if (searchParams.title && searchParams.title.trim() !== '') {
                matchesSearch = post.title.toLowerCase().includes(searchParams.title.toLowerCase());
            }

            // Filter by transaction type
            let matchesTransaction = true;
            if (searchParams.transactionType && searchParams.transactionType !== '') {
                matchesTransaction = post.transactionType === searchParams.transactionType;
            }

            // Filter by date (lastDate is in days)
            let matchesDate = true;
            if (searchParams.lastDate !== 0) {
                const postDate = new Date(post.createdDate);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - searchParams.lastDate);
                matchesDate = postDate >= cutoffDate;
            }

            return matchesTab && matchesSearch && matchesTransaction && matchesDate;
        }) || [];
    };

    const getPaginatedPosts = () => {
        const filteredPosts = getFilteredPosts();
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        return filteredPosts.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filteredPosts = getFilteredPosts();
        return Math.ceil(filteredPosts.length / postsPerPage);
    };

    // Toggle dropdown for specific post
    const toggleDropdown = (postId: string, buttonElement: HTMLButtonElement) => {
        if (openDropdownId === postId) {
            setOpenDropdownId(null);
            return;
        }

        const buttonRect = buttonElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const dropdownHeight = 180;
        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // Determine if dropdown should appear above or below
        const positionBelow = spaceBelow >= dropdownHeight || spaceAbove < dropdownHeight;
        setDropdownPosition(positionBelow ? 'below' : 'above');

        // Calculate fixed position coordinates
        const x = buttonRect.right - 192; // 192px = w-48 (12rem)
        const y = positionBelow 
            ? buttonRect.bottom + 8 
            : buttonRect.top - dropdownHeight - 8;

        setDropdownCoordinates({ x, y });
        setOpenDropdownId(postId);
    };

    // Handle dropdown actions
    const handleDropdownAction = (action: string, post: any) => {
        setOpenDropdownId(null);

        switch (action) {
            case 'upload-new':
                showChargeFeePopup(post.postId, 'new', post.title);
                break;
            case 'reup':
                showChargeFeePopup(post.postId, 'up', post.title);
                break;
            case 'renew':
                showChargeFeePopup(post.postId, 'renew', post.title);
                break;
            case 'edit':
                router.push(`/edit-post/${post.postId}`);
                break;
            case 'upgrade':
                showVipPackagePopup(post.postId, post.title);
                break;
            case 'delete':
                showConfirmation({
                    title: 'Xác nhận xóa tin',
                    message: `Bạn có chắc chắn muốn xóa tin "${post.title}"? Hành động này không thể hoàn tác.`,
                    type: 'danger',
                    confirmText: 'Xóa tin',
                    cancelText: 'Hủy',
                    onConfirm: async () => {
                        setConfirmButtonLoading(true);
                        try {
                            await updatePostStatus(post.postId, 'DELETED');
                            hideConfirmation();
                            showSuccess(`Đã xóa tin "${post.title}" thành công`);
                            await fetchPosts(searchParams);
                        } catch (error) {
                            setConfirmButtonLoading(false);
                            showError('Không thể xóa tin đăng. Vui lòng thử lại sau.');
                        }
                    },
                    onCancel: () => {
                        hideConfirmation();
                    }
                });
                break;
        }
    };

    // Get the correct repost/reup label based on post status
    const getRepostLabel = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'Đẩy tin';
            case 'EXPIRED':
                return 'Gia hạn';
            case 'DRAFT':
                return 'Đăng tin';
            default:
                return 'Gia hạn';
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

    const getRepostAction = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return 'upload-new';
            case 'EXPIRED':
                return 'renew';
            case 'PUBLISHED':
                return 'reup';
            default:
                return 'renew';
        }
    }

    // Handle filter popup actions
    const handleFilterReset = () => {
        const currentFilterCount = getActiveFilterCount();

        if (currentFilterCount > 0) {
            showConfirmation({
                title: 'Xác nhận đặt lại bộ lọc',
                message: `Bạn có muốn xóa tất cả ${currentFilterCount} bộ lọc đang áp dụng không?`,
                type: 'warning',
                confirmText: 'Đặt lại',
                cancelText: 'Hủy',
                onConfirm: () => {
                    setSearchParams({
                        ...searchParams,
                        transactionType: '',
                        lastDate: 180
                    });
                    hideConfirmation();
                    showInfo('Đã đặt lại tất cả bộ lọc');
                },
                onCancel: () => {
                    hideConfirmation();
                }
            });
        } else {
            setSearchParams({
                ...searchParams,
                transactionType: '',
                lastDate: 180
            });
            showInfo('Bộ lọc đã được đặt lại');
        }
    };

    const handleFilterApply = async () => {
        const newParams = {
            ...searchParams,
            transactionType: tempFilterParams.transactionType,
            lastDate: tempFilterParams.lastDate
        };

        setSearchParams(newParams);
        setOpenDropdownId(null);
        setCurrentPage(1);

        // Re-fetch posts with new filters
        await fetchPosts(newParams);

        let filterCount = 0;
        if (newParams.transactionType) filterCount++;
        if (newParams.lastDate != undefined && newParams.lastDate > 0) filterCount++;

        if (filterCount > 0) {
            showSuccess(`Đã áp dụng ${filterCount} bộ lọc thành công`);
        } else {
            showInfo('Đã xóa tất cả bộ lọc');
        }
    };

    const handleFilterClose = () => {
        setTempFilterParams({
            transactionType: searchParams.transactionType,
            lastDate: searchParams.lastDate
        });
        setOpenDropdownId(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.closest('[data-dropdown-content]')) {
                return;
            }
            setOpenDropdownId(null);
        };

        const handleScroll = () => {
            setOpenDropdownId(null);
        };

        if (openDropdownId) {
            document.addEventListener('click', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true); // true for capture phase
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [openDropdownId]);

    const tabs = [
        { id: 'all', label: 'Tất cả', count: tabData.all },
        { id: 'active', label: 'Đang hiển thị', count: tabData.active },
        { id: 'expired', label: 'Hết hạn', count: tabData.expired },
        { id: 'pending', label: 'Chờ xuất bản', count: tabData.pending }
    ];

    const fetchChargeFee = async (postId: string) => {
        try {
            const response = await fetch(`/api/manage/posts/charge-fee/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
        } catch (error) {
            console.error("Error charging fee:", error);
            showError("Không thể tính phí tin đăng. Vui lòng thử lại sau.");
        }
    }

    // Fetch posts from API
    const fetchPosts = async (params = searchParams) => {
        try {
            const response = await fetch('/api/manage/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                if(response.status === 401 || response.status === 403) {                    
                    router.push('/sign-in?error=session-expired');
                    return;
                }
            }

            const data = await response.json();
            setPosts(data.response);
            setTabData({
                all: data.response.length,
                active: data.response.filter((post: any) => post.status === 'PUBLISHED').length,
                expired: data.response.filter((post: any) => post.status === 'EXPIRED').length,
                pending: data.response.filter((post: any) => post.status === 'DRAFT').length
            });
        } catch (error) {
            router.push('/sign-in?error=session-expired');
        }
    }

    const updatePostStatus = async (postId: string, status: string) => {
        await fetch(`/api/manage/post-status?postId=${postId}&status=${status}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    const reupPost = async (postId: string): Promise<Response> => {
        const response = await fetch(`/api/manage/posts/reup/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    };

    const renewPost = async (postId: string): Promise<Response> => {
        const response = await fetch(`/api/manage/posts/renew/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    useEffect(() => {
        fetchPosts();
    }, [session]);

    // Initialize temp filter params when filter dropdown opens
    useEffect(() => {
        if (openDropdownId === 'filter') {
            setTempFilterParams({
                transactionType: searchParams.transactionType,
                lastDate: searchParams.lastDate
            });
        }
    }, [openDropdownId, searchParams]);

    const POST_STATUSES = {
        PUBLISHED: 'PUBLISHED',
        DRAFT: 'DRAFT',
        EXPIRED: 'EXPIRED',
        DELETED: 'DELETED'
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarDesktop displayNav={true} session={session} />
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý tin đăng</h1>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề tin"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                    onBlur={handleSearchBlur}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="mr-2"
                                    />
                                    Lọc
                                    {getActiveFilterCount() > 0 && (
                                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
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
                                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                                        style={{
                                            [dropdownPosition === 'above' ? 'bottom' : 'top']: '100%',
                                        }}
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                                                <button
                                                    onClick={handleFilterClose}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            {/* Transaction Type Filter */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Loại giao dịch
                                                </label>
                                                <select
                                                    value={tempFilterParams.transactionType}
                                                    onChange={(e) => setTempFilterParams(prev => ({
                                                        ...prev,
                                                        transactionType: e.target.value
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Tất cả</option>
                                                    <option value="SELL">Bán</option>
                                                    <option value="RENT">Cho thuê</option>
                                                    <option value="PROJECT">Dự án</option>
                                                </select>
                                            </div>

                                            {/* Last Date Filter */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Ngày đăng tin
                                                </label>
                                                <select
                                                    value={tempFilterParams.lastDate}
                                                    onChange={(e) => setTempFilterParams(prev => ({
                                                        ...prev,
                                                        lastDate: parseInt(e.target.value)
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >                                                    
                                                    <option value={7}>7 ngày qua</option>
                                                    <option value={30}>30 ngày qua</option>
                                                    <option value={90}>90 ngày qua</option>
                                                    <option value={180}>180 ngày qua</option>
                                                    <option value={0}>Tất cả</option>
                                                </select>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={handleFilterReset}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Đặt lại
                                                </button>
                                                <button
                                                    onClick={handleFilterApply}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                >
                                                    Áp dụng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="flex space-x-1 border-b border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-t-md ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tin đăng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Địa chỉ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo/Hết hạn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getPaginatedPosts().map((post) => (
                                    <tr key={post.postId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-20 h-16">
                                                    {post.images && post.images.length > 0 ? (
                                                        <Image
                                                            src={`${post.images[0].fileUrl}`}
                                                            alt={post.title}
                                                            width={120}
                                                            height={80}
                                                            className={styles.postImage}
                                                        />
                                                    ) : (
                                                        <Image
                                                            src="/temp/11.jpg"
                                                            alt={post.title}
                                                            width={120}
                                                            height={80}
                                                            className={styles.postImage}
                                                        />
                                                    )}                                                    
                                                </div>
                                                <div className="ml-4 flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {post.title}
                                                    </div>
                                                    <span className={`${styles.transactionType} ${styles[getTransactionTypeClass(post.transactionType)]}`}>
                                                        {getTransactionTypeLabel(post.transactionType)}
                                                    </span>
                                                    <span className={styles.propertyType}>
                                                        {getPropertyTypeLabel(post.type)}
                                                    </span>
                                                    {post.rankingDto?.priorityLevel && (
                                                        <span className={`${styles.priorityLevel} ${styles[getPriorityLevelClass(post.rankingDto.priorityLevel)]}`}>
                                                            {getPriorityLevelLabel(post.rankingDto.priorityLevel)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                <Image src="/icons/location.svg" alt="Location" width={12} height={12} className="mr-1" />
                                                {post.address ? `${post.address.split(',').slice(-2).join(',').trim()}` : 'Chưa cập nhật'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                                post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                                    post.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {post.status === 'PUBLISHED' && 'Đã xuất bản'}
                                                {post.status === 'DRAFT' && 'Nháp'}
                                                {post.status === 'EXPIRED' && 'Hết hạn'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                Ngày tạo: {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Hết hạn: {post.expiredAt ? new Date(post.expiredAt).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handlePreviewPost(post)}
                                                    className={styles.actionButton}
                                                    title="Xem trước"
                                                >
                                                    <Image src="/icons/EyeOpen.svg" alt="View" width={18} height={18} />
                                                </button>
                                                <div style={{ position: 'relative' }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDropdown(post.postId, e.currentTarget);
                                                        }}
                                                        className={styles.actionButton}
                                                        title="Thêm thao tác"
                                                    >
                                                        <Image src="/icons/threeDots.svg" alt="More actions" width={18} height={18} />
                                                    </button>

                                                    {/* Dropdown menu */}
                                                    {openDropdownId === post.postId && (
                                                        <div
                                                            ref={dropdownRef}
                                                            data-dropdown-content="true"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="fixed w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]"
                                                            style={{
                                                                left: `${dropdownCoordinates.x}px`,
                                                                top: `${dropdownCoordinates.y}px`,
                                                            }}
                                                        >
                                                            <div className="py-1">
                                                                {post.transactionType !== 'PROJECT' && (
                                                                <button
                                                                    onClick={() => handleDropdownAction(getRepostAction(post.status), post)}                                                                    
                                                                    className={styles.btnFacility}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    <Image src={getRepostIcon(post.status)} alt={getRepostLabel(post.status)} width={18} height={18} />
                                                                    {getRepostLabel(post.status)}
                                                                </button>
                                                                )}
                                                                {post.transactionType !== 'PROJECT' && (
                                                                <button
                                                                    onClick={() => handleDropdownAction('edit', post)}                                                                    
                                                                    className={styles.btnFacility}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    <Image src="/icons/editIcon.svg" alt="Edit" width={16} height={16} className="mr-2" />
                                                                    Sửa tin
                                                                </button>
                                                                )}
                                                                {post.transactionType !== 'PROJECT' && (
                                                                <button
                                                                    onClick={() => handleDropdownAction('upgrade', post)}
                                                                    className={styles.btnFacility}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    <Image src="/icons/VipDiamond.svg" alt="Upgrade" width={16} height={16} className="mr-2" />
                                                                    Nâng/Hạ Vip
                                                                </button>
                                                                )}                                                                
                                                                <button
                                                                    onClick={() => handleDropdownAction('delete', post)}
                                                                    className={styles.btnFacility}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    <Image src="/icons/X.svg" alt="Delete" width={16} height={16} className="mr-2" style={{ filter: 'invert(18%) sepia(94%) saturate(7496%) hue-rotate(354deg) brightness(101%) contrast(109%)' }} />
                                                                    Xoá tin
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Empty State */}
                        {getPaginatedPosts().length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg">Không có tin đăng nào</div>
                                <div className="text-gray-400 text-sm mt-2">Hãy thử thay đổi bộ lọc hoặc tạo tin đăng mới</div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {getTotalPages() > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                >
                                    ← Trước
                                </button>

                                {Array.from({ length: getTotalPages() }, (_, index) => {
                                    const page = index + 1;
                                    const isCurrentPage = page === currentPage;
                                    const showPage = page === 1 || page === getTotalPages() ||
                                        Math.abs(page - currentPage) <= 2;

                                    if (!showPage && page !== currentPage - 3 && page !== currentPage + 3) {
                                        return null;
                                    }

                                    if ((page === currentPage - 3 || page === currentPage + 3) &&
                                        page !== 1 && page !== getTotalPages()) {
                                        return (
                                            <span key={`ellipsis-${page}`} className="text-gray-400 text-sm px-2">
                                                ...
                                            </span>
                                        );
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md min-w-[40px] ${isCurrentPage
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === getTotalPages()}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === getTotalPages()
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                >
                                    Tiếp →
                                </button>

                                <div className="ml-4 text-sm text-gray-500">
                                    Trang {currentPage} / {getTotalPages()} ({getFilteredPosts().length} tin)
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Alert Component */}
            <Alert
                type={alert.type}
                message={alert.message}
                isVisible={alert.isVisible}
                onClose={hideAlert}
            />

            {/* Confirmation Component */}
            <Confirmation
                isVisible={confirmation.isVisible}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
                confirmText={confirmation.confirmText}
                cancelText={confirmation.cancelText}
                onConfirm={confirmation.onConfirm}
                onCancel={confirmation.onCancel}
                confirmButtonLoading={confirmation.confirmButtonLoading}
            />

            {/* Charge Fee Popup */}
            <ChargeFeePopup
                isVisible={chargeFeePopup.isVisible}
                postId={chargeFeePopup.postId}
                type={chargeFeePopup.type}
                postTitle={chargeFeePopup.postTitle}
                onConfirm={handleChargeFeeConfirm}
                onCancel={hideChargeFeePopup}
                confirmButtonLoading={chargeFeePopup.confirmButtonLoading}
            />

            {/* VIP Package Popup */}
            <VipPackagePopup
                isVisible={vipPackagePopup.isVisible}
                postId={vipPackagePopup.postId}
                postTitle={vipPackagePopup.postTitle}
                onConfirm={handleVipPackageConfirm}
                onCancel={hideVipPackagePopup}
                confirmButtonLoading={vipPackagePopup.confirmButtonLoading}
            />

            {/* Preview Popup */}
            {previewPopup.isVisible && previewPopup.post && (
                <div className={styles.previewOverlay} onClick={closePreviewPopup}>
                    <div className={styles.previewContainer} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.previewCloseButton} onClick={closePreviewPopup}>
                            ×
                        </button>

                        <div className={styles.previewImageContainer}>
                            {previewPopup.post.images && previewPopup.post.images.length > 0 ? (
                                <Image
                                    src={`${previewPopup.post.images[0].fileUrl}`}
                                    alt={previewPopup.post.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className={styles.previewImagePlaceholder}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.5L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor" />
                                    </svg>
                                    <span className={styles.previewImagePlaceholderText}>Không có hình ảnh</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.previewMainContent}>
                            <div className={styles.previewHeader}>
                                <h1 className={styles.previewTitle}>
                                    {previewPopup.post.title}
                                </h1>
                                <div className={styles.previewAddress}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor" />
                                    </svg>
                                    <span>{previewPopup.post.address || 'Chưa có địa chỉ'}</span>
                                </div>
                            </div>

                            {previewPopup.post.description && (
                                <div className={styles.previewDescriptionSection}>
                                    <h2 className={styles.previewDescriptionTitle}>
                                        Thông tin mô tả
                                    </h2>
                                    <div className={styles.previewDescriptionContent}>
                                        {formatDescription(previewPopup.post.description)}
                                    </div>
                                </div>
                            )}

                            <div className={styles.previewFeaturesSection}>
                                <h2 className={styles.previewFeaturesTitle}>
                                    Đặc điểm bất động sản
                                </h2>
                                <div className={styles.previewFeaturesGrid}>
                                    {previewPopup.post.price && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>💰</span>
                                                <span className={styles.previewFeatureLabel}>Mức giá</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatPrice(previewPopup.post.price)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.acreage && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>📐</span>
                                                <span className={styles.previewFeatureLabel}>Diện tích</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.acreage} m²
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.bedrooms && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🛏️</span>
                                                <span className={styles.previewFeatureLabel}>Số phòng ngủ</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.bedrooms} PN
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.bathrooms && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🚿</span>
                                                <span className={styles.previewFeatureLabel}>Số phòng tắm</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.bathrooms} Phòng
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.floors && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🏢</span>
                                                <span className={styles.previewFeatureLabel}>Số tầng</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.floors} Tầng
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.legal && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>📄</span>
                                                <span className={styles.previewFeatureLabel}>Pháp lý</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatLegalStatus(previewPopup.post.legal)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.furniture && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🪑</span>
                                                <span className={styles.previewFeatureLabel}>Nội thất</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatFurnitureStatus(previewPopup.post.furniture)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.direction && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🧭</span>
                                                <span className={styles.previewFeatureLabel}>Hướng</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {formatDirection(previewPopup.post.direction)}
                                            </div>
                                        </div>
                                    )}
                                    {previewPopup.post.frontage && (
                                        <div className={styles.previewFeatureItem}>
                                            <div className={styles.previewFeatureTitle}>
                                                <span className={styles.previewFeatureIcon}>🏠</span>
                                                <span className={styles.previewFeatureLabel}>Mặt tiền</span>
                                            </div>
                                            <div className={styles.previewFeatureValue}>
                                                {previewPopup.post.frontage} m
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.previewFooter}>
                            <div className={styles.previewFooterContent}>
                                <div className={styles.previewFooterProfile}>
                                    <div className={styles.previewFooterAvatar}>
                                        📝
                                    </div>
                                    <div>
                                        <p className={styles.previewFooterUserName}>
                                            Mã bài đăng
                                        </p>
                                        <p className={styles.previewFooterUserId}>
                                            {previewPopup.post.postId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className={styles.previewDetailButton} onClick={() =>                                 
                                {
                                    if(previewPopup.post.transactionType === 'PROJECT') {
                                        router.push(`/landing-page/${previewPopup.post.postId}`);
                                        return;
                                    }
                                    router.push(`/post/${previewPopup.post.postId}`);
                                }
                                }>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <DesktopFooter />
        </div>
    );
} 