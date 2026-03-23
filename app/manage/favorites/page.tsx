"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useScreenSize from "@/app/lib/useScreenSize";
import { useSession } from "next-auth/react";
import NavBarMobile from "@/app/ui/mobile/navigation/nav-bar-mobile";
import styles from './index.module.css';
import Image from 'next/image';
import { useConfirmation } from "@/app/hook/useConfirmation";
import { useAlert } from "@/app/hook/useAlert";
import Alert from "@/app/ui/common/alert";
import { formatDescription } from "@/app/utils/markdown-utils";
import { formatPrice } from "@/app/utils/price-formatter";
import { formatDirection, formatFurnitureStatus, formatLegalStatus, getPropertyTypeLabel, getTransactionTypeLabel } from "@/app/utils/commons-utils";
import NavBarDesktop from "@/app/ui/desktop/navigation/nav-bar-desktop";
import MbFooter from "@/app/ui/mobile/footer/mb.footer";
import Confirmation from "@/app/ui/common/confirmation";
import DesktopFooter from "@/app/ui/desktop/footer/desktop-footer";

// Function to get CSS class for transaction type
function getTransactionTypeClass(transactionType: string): string {
    const transactionClasses: { [key: string]: string } = {
        'SELL': 'sellType',
        'RENT': 'rentType',
        'PROJECT': 'projectType'
    };
    return transactionClasses[transactionType] || 'sellType';
}

export default function Page() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();

    return (
        <div className="flex flex-col min-h-screen">
            {(screenSize === "sm" || screenSize === "md") ? (
                <MobileFavorites session={session} />
            ) : (
                <DesktopFavorites session={session} />
            )}
        </div>
    );
}

function MobileFavorites({ session }: { session?: any }) {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useState({
        title: '',
        transactionType: '',
        propertyType: '',
        lastDate: 180
    });
    const { confirmation, showConfirmation, hideConfirmation, setConfirmButtonLoading } = useConfirmation();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [tempFilterParams, setTempFilterParams] = useState({
        transactionType: '',
        propertyType: '',
        lastDate: 180
    });
    // Favorite button state
    const [showFavoriteToast, setShowFavoriteToast] = useState(false);
    const [favoriteToastMessage, setFavoriteToastMessage] = useState('');
    const [isToastError, setIsToastError] = useState(false);
    const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null);
    // Preview popup state
    const [previewPopup, setPreviewPopup] = useState({
        isVisible: false,
        post: null as any
    });
    const router = useRouter();
    const { alert, showSuccess, showError, showWarning, showInfo, hideAlert } = useAlert();

    const fetchFavorites = async (params = searchParams) => {
        if (!session?.user?.id) return; // Ensure user ID is available before fetching favorites
        try {
            const userId = session?.user?.id;
            const response = await fetch(`/api/users/favorites/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch favorites");
            }
            const data = await response.json();
            setFavorites(data.response);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }

    // Handle preview popup
    const handlePreviewPost = (post: any) => {
        setPreviewPopup({ isVisible: true, post });
    };

    const closePreviewPopup = () => {
        setPreviewPopup({ isVisible: false, post: null });
    };

    const handleRemoveFavorite = async (postId: string) => {
        try {
            setRemovingFavoriteId(postId);
            const userId = session?.user?.id;
            const response = await fetch(`/api/users/favorites/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    postId: postId
                })
            });
            if (!response.ok) {
                throw new Error("Failed to remove favorite");
            }

            // Remove post from local state instead of refetching
            setFavorites(prev => prev.filter(fav => fav.postId !== postId));

            // Show success toast
            setFavoriteToastMessage('Đã xóa khỏi danh sách yêu thích');
            setIsToastError(false);
            setShowFavoriteToast(true);

            // Hide toast after 3 seconds
            setTimeout(() => {
                setShowFavoriteToast(false);
            }, 3000);

        } catch (error) {
            console.error("Error removing favorite:", error);
            // Show error toast
            setFavoriteToastMessage('Không thể xóa khỏi danh sách yêu thích');
            setIsToastError(true);
            setShowFavoriteToast(true);

            // Hide toast after 3 seconds
            setTimeout(() => {
                setShowFavoriteToast(false);
            }, 3000);
        } finally {
            setRemovingFavoriteId(null);
        }
    };

    // Handle favorite button click
    const handleFavoriteClick = (postId: string) => {
        handleRemoveFavorite(postId);
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

    const getTotalPages = () => {
        const filteredPosts = getFilteredPosts();
        return Math.ceil(filteredPosts.length / postsPerPage);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        handleSearchSubmit();
    };

    const handleSearchBlur = () => {
        handleSearchSubmit();
    };

    const handleSearchSubmit = () => {
        const newParams = {
            ...searchParams,
            title: searchTerm
        };
        setSearchParams(newParams);
        setCurrentPage(1); // Reset to first page when searching
    };

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
                        propertyType: '',
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
                propertyType: '',
                lastDate: 180
            });
            showInfo('Bộ lọc đã được đặt lại');
        }
    };

    const handleFilterApply = () => {
        const newParams = {
            ...searchParams,
            transactionType: tempFilterParams.transactionType,
            propertyType: tempFilterParams.propertyType,
            lastDate: tempFilterParams.lastDate
        };

        setSearchParams(newParams);
        setOpenDropdownId(null);
        setCurrentPage(1);

        // Calculate filter count based on new params instead of outdated state
        let filterCount = 0;
        if (newParams.transactionType) filterCount++;
        if (newParams.lastDate !== 0) filterCount++; // 0 is the default value
        if (newParams.propertyType) filterCount++;

        if (filterCount > 0) {
            showSuccess(`Đã áp dụng ${filterCount} bộ lọc thành công`);
        } else {
            showInfo('Đã xóa tất cả bộ lọc');
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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

    const handleFilterClose = () => {
        // Reset temp params to current search params when closing without applying
        setTempFilterParams({
            transactionType: searchParams.transactionType,
            propertyType: searchParams.propertyType,
            lastDate: searchParams.lastDate
        });
        setOpenDropdownId(null);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (searchParams.transactionType) count++;
        if (searchParams.lastDate !== 0) count++; // 0 is the default value
        if (searchParams.propertyType) count++;
        return count;
    };

    const getFilteredPosts = () => {
        return favorites?.filter((post) => {
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

            // Filter by property type            
            let matchesProperty = true;
            if (searchParams.propertyType && searchParams.propertyType !== '') {
                matchesProperty = post.type === searchParams.propertyType;
            }

            // Filter by date (lastDate is in days)
            let matchesDate = true;
            if (searchParams.lastDate !== 0) {
                const postDate = new Date(post.createdDate);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - searchParams.lastDate);
                matchesDate = postDate >= cutoffDate;
            }

            return matchesSearch && matchesTransaction && matchesProperty && matchesDate;
        }) || [];
    };

    const getPaginatedPosts = () => {
        const filteredPosts = getFilteredPosts();
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        return filteredPosts.slice(startIndex, endIndex);
    };

    useEffect(() => {
        fetchFavorites();
    }, [session?.user?.id]);

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

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.headerUploadPost}>
                <div>
                    <p className="heading-h8">Tin đã lưu</p>
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

                                {/* Property Type Filter */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        Loại bất động sản
                                    </label>
                                    <select
                                        value={tempFilterParams.propertyType}
                                        onChange={(e) => setTempFilterParams(prev => ({
                                            ...prev,
                                            propertyType: e.target.value
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
                                        <option value="CHCC">Căn hộ chung cư</option>
                                        <option value="NHA_RIENG">Nhà riêng</option>
                                        <option value="BIET_THU">Biệt thự</option>
                                        <option value="NHA_PHO">Nhà phố</option>
                                        <option value="DAT_NEN">Đất nền</option>
                                        <option value="CONDOTEL">Condotel</option>
                                        <option value="KHO_NHA_XUONG">Kho/Nhà xưởng</option>
                                        <option value="BDS_KHAC">BDS khác</option>
                                    </select>
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
            </div>
            <div className={`${styles.formContainer} flex-1`}>
                <div className={styles.postsGrid}>
                    {getPaginatedPosts().map((post) => (
                        <div key={post.postId} className={styles.postCard}>
                            <div className={styles.postImageContainer}>
                                {post.images && post.images.length > 0 ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${post.images[0].fileUrl}`}
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
                            <div className={styles.postContent}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 className={styles.postTitle}>{post.title}</h3>
                                    {session && (
                                        <div className="relative">
                                            <button
                                                className="p-2 rounded-full transition-all duration-200 text-red-500 bg-red-50 hover:bg-red-100"
                                                onClick={() => handleFavoriteClick(post.postId)}
                                                disabled={removingFavoriteId === post.postId}
                                                aria-label="Remove from favorites"
                                                style={{
                                                    opacity: removingFavoriteId === post.postId ? 0.6 : 1,
                                                    cursor: removingFavoriteId === post.postId ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {removingFavoriteId === post.postId ? (
                                                    <div className="animate-spin">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                                                            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.postInfo}>
                                    <div className={styles.postType}>
                                        <span className={`${styles.transactionType} ${styles[getTransactionTypeClass(post.transactionType)]}`}>
                                            {getTransactionTypeLabel(post.transactionType)}
                                        </span>
                                        <span className={styles.propertyType}>
                                            {getPropertyTypeLabel(post.type)}
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
                                            <span className={styles.dateLabel}>Ngày tạo:</span>
                                            <span className={styles.dateValue}>
                                                {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Actions */}
                            <div className={styles.postActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handlePreviewPost(post)}
                                >
                                    <Image src="/icons/EyeOpen.svg" alt="View" width={16} height={16} />
                                </button>
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
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${previewPopup.post.images[0].fileUrl}`}
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
                            <button className={styles.previewDetailButton} onClick={() => router.push(`/post/${previewPopup.post.postId}`)}>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Favorite Toast Notification */}
            {showFavoriteToast && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-4 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap transition-all duration-300 ${showFavoriteToast ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    } ${isToastError ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                    {favoriteToastMessage}
                </div>
            )}
            <MbFooter />
        </div>
    );
}

function DesktopFavorites({ session }: { session?: any }) {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useState({
        title: '',
        transactionType: '',
        propertyType: '',
        lastDate: 180
    });
    const { confirmation, showConfirmation, hideConfirmation, setConfirmButtonLoading } = useConfirmation();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(12); // More posts per page for desktop
    const [tempFilterParams, setTempFilterParams] = useState({
        transactionType: '',
        propertyType: '',
        lastDate: 180
    });
    // Favorite button state
    const [showFavoriteToast, setShowFavoriteToast] = useState(false);
    const [favoriteToastMessage, setFavoriteToastMessage] = useState('');
    const [isToastError, setIsToastError] = useState(false);
    const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null);
    // Preview popup state
    const [previewPopup, setPreviewPopup] = useState({
        isVisible: false,
        post: null as any
    });
    const router = useRouter();
    const { alert, showSuccess, showError, showWarning, showInfo, hideAlert } = useAlert();

    const fetchFavorites = async (params = searchParams) => {
        if (!session?.user?.id) return;
        try {
            const userId = session?.user?.id;
            const response = await fetch(`/api/users/favorites/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch favorites");
            }
            const data = await response.json();
            setFavorites(data.response);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    }

    // Handle preview popup
    const handlePreviewPost = (post: any) => {
        setPreviewPopup({ isVisible: true, post });
    };

    const closePreviewPopup = () => {
        setPreviewPopup({ isVisible: false, post: null });
    };

    const handleRemoveFavorite = async (postId: string) => {
        try {
            setRemovingFavoriteId(postId);
            const userId = session?.user?.id;
            const response = await fetch(`/api/users/favorites/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    postId: postId
                })
            });
            if (!response.ok) {
                throw new Error("Failed to remove favorite");
            }

            // Remove post from local state instead of refetching
            setFavorites(prev => prev.filter(fav => fav.postId !== postId));

            // Show success toast
            setFavoriteToastMessage('Đã xóa khỏi danh sách yêu thích');
            setIsToastError(false);
            setShowFavoriteToast(true);

            // Hide toast after 3 seconds
            setTimeout(() => {
                setShowFavoriteToast(false);
            }, 3000);

        } catch (error) {
            console.error("Error removing favorite:", error);
            // Show error toast
            setFavoriteToastMessage('Không thể xóa khỏi danh sách yêu thích');
            setIsToastError(true);
            setShowFavoriteToast(true);

            // Hide toast after 3 seconds
            setTimeout(() => {
                setShowFavoriteToast(false);
            }, 3000);
        } finally {
            setRemovingFavoriteId(null);
        }
    };

    // Handle favorite button click
    const handleFavoriteClick = (postId: string) => {
        handleRemoveFavorite(postId);
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
        const dropdownHeight = 300;
        const spaceBelow = windowHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            setDropdownPosition('above');
        } else {
            setDropdownPosition('below');
        }

        setOpenDropdownId(postId);
    };

    const getTotalPages = () => {
        const filteredPosts = getFilteredPosts();
        return Math.ceil(filteredPosts.length / postsPerPage);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        handleSearchSubmit();
    };

    const handleSearchBlur = () => {
        handleSearchSubmit();
    };

    const handleSearchSubmit = () => {
        const newParams = {
            ...searchParams,
            title: searchTerm
        };
        setSearchParams(newParams);
        setCurrentPage(1);
    };

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
                        propertyType: '',
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
                propertyType: '',
                lastDate: 180
            });
            showInfo('Bộ lọc đã được đặt lại');
        }
    };

    const handleFilterApply = () => {
        const newParams = {
            ...searchParams,
            transactionType: tempFilterParams.transactionType,
            propertyType: tempFilterParams.propertyType,
            lastDate: tempFilterParams.lastDate
        };

        setSearchParams(newParams);
        setOpenDropdownId(null);
        setCurrentPage(1);

        // Calculate filter count based on new params instead of outdated state
        let filterCount = 0;
        if (newParams.transactionType) filterCount++;
        if (newParams.lastDate !== 180) filterCount++;
        if (newParams.propertyType) filterCount++;

        if (filterCount > 0) {
            showSuccess(`Đã áp dụng ${filterCount} bộ lọc thành công`);
        } else {
            showInfo('Đã xóa tất cả bộ lọc');
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < getTotalPages()) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFilterClose = () => {
        setTempFilterParams({
            transactionType: searchParams.transactionType,
            propertyType: searchParams.propertyType,
            lastDate: searchParams.lastDate
        });
        setOpenDropdownId(null);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (searchParams.transactionType) count++;
        if (searchParams.lastDate !== 180) count++;
        if (searchParams.propertyType) count++;
        return count;
    };

    const getFilteredPosts = () => {
        return favorites?.filter((post) => {
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

            // Filter by property type            
            let matchesProperty = true;
            if (searchParams.propertyType && searchParams.propertyType !== '') {
                matchesProperty = post.type === searchParams.propertyType;
            }

            // Filter by date (lastDate is in days)
            let matchesDate = true;
            if (searchParams.lastDate !== 180) {
                const postDate = new Date(post.createdDate);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - searchParams.lastDate);
                matchesDate = postDate >= cutoffDate;
            }

            return matchesSearch && matchesTransaction && matchesProperty && matchesDate;
        }) || [];
    };

    const getPaginatedPosts = () => {
        const filteredPosts = getFilteredPosts();
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        return filteredPosts.slice(startIndex, endIndex);
    };

    useEffect(() => {
        fetchFavorites();
    }, [session?.user?.id]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarDesktop displayNav={true} session={session} />
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Tin đã lưu</h1>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="flex items-center gap-4 mb-4">
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

                                            {/* Property Type Filter */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Loại bất động sản
                                                </label>
                                                <select
                                                    value={tempFilterParams.propertyType}
                                                    onChange={(e) => setTempFilterParams(prev => ({
                                                        ...prev,
                                                        propertyType: e.target.value
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Tất cả</option>
                                                    <option value="CHCC">Căn hộ chung cư</option>
                                                    <option value="NHA_RIENG">Nhà riêng</option>
                                                    <option value="BIET_THU">Biệt thự</option>
                                                    <option value="NHA_PHO">Nhà phố</option>
                                                    <option value="DAT_NEN">Đất nền</option>
                                                    <option value="CONDOTEL">Condotel</option>
                                                    <option value="KHO_NHA_XUONG">Kho/Nhà xưởng</option>
                                                    <option value="BDS_KHAC">BDS khác</option>
                                                </select>
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
                                                    <option value="RENT">Thuê</option>
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
                                                    <option value={60}>60 ngày qua</option>
                                                    <option value={90}>90 ngày qua</option>
                                                    <option value={180}>180 ngày qua</option>
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
                                        Loại giao dịch
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
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
                                                    <Image
                                                        src="/temp/11.jpg"
                                                        alt={post.title}
                                                        width={80}
                                                        height={64}
                                                        className="w-20 h-16 object-cover rounded-md"
                                                    />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {post.title}
                                                    </div>
                                                    <div className="flex items-center mt-1 gap-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.transactionType === 'SELL'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {getTransactionTypeLabel(post.transactionType)}
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {getPropertyTypeLabel(post.type)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 line-clamp-2">
                                                {post.address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.transactionType === 'SELL'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {getTransactionTypeLabel(post.transactionType)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors"
                                                    onClick={() => handlePreviewPost(post)}
                                                >
                                                    <Image src="/icons/EyeOpen.svg" alt="View" width={14} height={14} className="mr-1" />
                                                    Xem
                                                </button>
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md text-xs font-medium hover:bg-red-600 hover:text-white transition-colors"
                                                    onClick={() => handleFavoriteClick(post.postId)}
                                                    disabled={removingFavoriteId === post.postId}
                                                >
                                                    {removingFavoriteId === post.postId ? (
                                                        <div className="animate-spin mr-1">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3" />
                                                                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                        </svg>
                                                    )}
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Empty State */}
                        {getPaginatedPosts().length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg">Không có tin đăng yêu thích nào</div>
                                <div className="text-gray-400 text-sm mt-2">Hãy thêm tin đăng vào danh sách yêu thích để quản lý dễ dàng hơn</div>
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

            {/* Alert, Confirmation, and other components remain the same... */}
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

            {/* Preview Popup - same as before */}
            {previewPopup.isVisible && previewPopup.post && (
                <div className={styles.previewOverlay} onClick={closePreviewPopup}>
                    <div className={styles.previewContainer} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.previewCloseButton} onClick={closePreviewPopup}>
                            ×
                        </button>

                        <div className={styles.previewImageContainer}>
                            {previewPopup.post.images && previewPopup.post.images.length > 0 ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${previewPopup.post.images[0].fileUrl}`}
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
                                <h1 className={styles.previewTitle}>{previewPopup.post.title}</h1>
                                <div className={styles.previewAddress}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor" />
                                    </svg>
                                    <span>{previewPopup.post.address || 'Chưa có địa chỉ'}</span>
                                </div>
                            </div>

                            {previewPopup.post.description && (
                                <div className={styles.previewDescriptionSection}>
                                    <h2 className={styles.previewDescriptionTitle}>Thông tin mô tả</h2>
                                    <div className={styles.previewDescriptionContent}>
                                        {formatDescription(previewPopup.post.description)}
                                    </div>
                                </div>
                            )}

                            <div className={styles.previewFeaturesSection}>
                                <h2 className={styles.previewFeaturesTitle}>Đặc điểm bất động sản</h2>
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
                                    <div className={styles.previewFooterAvatar}>📝</div>
                                    <div>
                                        <p className={styles.previewFooterUserName}>Mã bài đăng</p>
                                        <p className={styles.previewFooterUserId}>{previewPopup.post.postId}</p>
                                    </div>
                                </div>
                            </div>
                            <button className={styles.previewDetailButton} onClick={() => router.push(`/post/${previewPopup.post.postId}`)}>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showFavoriteToast && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-4 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap transition-all duration-300 ${showFavoriteToast ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    } ${isToastError ? 'bg-red-600' : 'bg-green-600'
                    }`}>
                    {favoriteToastMessage}
                </div>
            )}

            <DesktopFooter />
        </div>
    );
}