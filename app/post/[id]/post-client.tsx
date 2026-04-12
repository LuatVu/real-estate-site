"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useScreenSize from "../../lib/useScreenSize";
import styles from './index.module.css';
import NavBarMobile from '../../ui/mobile/navigation/nav-bar-mobile';
import MbFooter from "../../ui/mobile/footer/mb.footer";
import NavBarDesktop from '../../ui/desktop/navigation/nav-bar-desktop';
import DesktopFooter from '../../ui/desktop/footer/desktop-footer';
// import DownloadApp from "../../ui/mobile/download-app/mb.download";
// import ExtraInfo from "../../ui/mobile/extra-info/mb.extra.info";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { formatPrice } from '../../utils/price-formatter';
import { formatLegalStatus, formatFurnitureStatus, formatDirection } from '../../utils/commons-utils';
import { formatDescription } from '../../utils/markdown-utils';

interface PostClientProps {
  post: any;
}

export default function PostClient({ post }: PostClientProps) {
  const { data: session, status } = useSession();
  const screenSize = useScreenSize();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Optimize viewport for mobile devices
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
    }
  }, []);
  
  // Prevent hydration mismatch by showing loading state until client renders
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      {(screenSize === 'sm' || screenSize === 'md') ? (
        <MobilePosts post={post} session={session} />
      ) : (
        <DesktopPosts post={post} session={session} />
      )}
    </div>
  );
}

function MobilePosts({ post, session }: { post: any; session?: any }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFavoriteToast, setShowFavoriteToast] = useState(false);
  const [favoriteToastMessage, setFavoriteToastMessage] = useState('');
  const [isToastError, setIsToastError] = useState(false);

  // Fetch initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session?.user?.id || !post?.postId) return;
      
      try {
        const response = await fetch(`/api/users/favorites/${session.user.id}/${post.postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data?.response?.userId != undefined && data?.response?.postId != undefined) {
            setIsFavorited(true);
          }else {
            setIsFavorited(false);
          }          
        } else {
          // If API returns error, default to false
          setIsFavorited(false);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsFavorited(false);
      }
    };
    
    checkFavoriteStatus();
  }, [session?.user?.id, post?.postId]);

  // Handle keyboard events for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) {
        switch (event.key) {
          case 'Escape':
            closeFullscreen();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
        }
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isFullscreen]);

  const openFullscreen = (index: number) => {
    setCurrentImageIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < (post?.images?.length - 1) ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : (post?.images?.length - 1)
    );
  };



  // Helper function to format phone number (hide last 3 digits)
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 4) return phone;

    if (showFullPhone) {
      return cleanPhone;
    } else {
      const hiddenPart = cleanPhone.slice(0, -3) + '***';
      return hiddenPart;
    }
  };

  // Handle phone button click
  const handlePhoneClick = () => {
    const phoneNumber = post?.user?.contactPhoneNumber || post?.user?.phoneNumber;
    
    if (!showFullPhone) {
      // First click: show full number
      setShowFullPhone(true);
    } else {
      // Second click: trigger phone call
      if (phoneNumber) {
        const confirmed = window.confirm(`Bạn có muốn gọi đến số ${phoneNumber}?`);
        if (confirmed) {
          window.location.href = `tel:${phoneNumber}`;
        }
      }
    }
  };

  // Handle favorite button click
  const handleFavoriteClick = async () => {
    try {
      const newFavoriteState = !isFavorited;
      const endpoint = newFavoriteState ? '/api/users/favorites/add' : '/api/users/favorites/remove';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          postId: post?.postId
        })
      });
      
      if (response.ok) {
        // Only update state and show toast if API call succeeds
        setIsFavorited(newFavoriteState);
        
        // Show toast notification
        const message = newFavoriteState ? 'Đã lưu tin' : 'Đã bỏ lưu tin';
        setFavoriteToastMessage(message);
        setIsToastError(false);
        setShowFavoriteToast(true);
        
        // Auto hide after 2 seconds
        setTimeout(() => {
          setShowFavoriteToast(false);
        }, 2000);
      } else {
        // Show error message
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Có lỗi xảy ra. Vui lòng thử lại.';
        setFavoriteToastMessage(errorMessage);
        setIsToastError(true);
        setShowFavoriteToast(true);
        
        // Auto hide error after 3 seconds
        setTimeout(() => {
          setShowFavoriteToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      // Show error toast
      setFavoriteToastMessage('Không thể kết nối. Vui lòng kiểm tra kết nối internet.');
      setIsToastError(true);
      setShowFavoriteToast(true);
      
      // Auto hide error after 3 seconds
      setTimeout(() => {
        setShowFavoriteToast(false);
      }, 3000);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <div className={`${styles.rootContainer} flex-1`}>
        <NavBarMobile displayNav={true} session={session} />

        {/* Property Image Gallery */}
        <header className={styles.slideContainer}>
          <Swiper
            loop={true}
            navigation
            pagination={{ type: 'bullets', clickable: true }}
            zoom={{ maxRatio: 3, minRatio: 1 }}
            modules={[Navigation, Pagination, Zoom]}
            onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
            className={styles.imageSwiper}
            aria-label="Property image gallery"
          >
            {post?.images?.map((img: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container">
                  <div
                    className={styles.imageContainer}
                    onClick={() => openFullscreen(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openFullscreen(index)}
                    aria-label={`View image ${index + 1} in fullscreen`}
                  >
                    {/* Blurred background image */}
                    <div
                      className={styles.blurredBackground}
                      style={{
                        backgroundImage: `url(${img.fileUrl})`
                      }}
                    />

                    {/* Main image with SEO-optimized alt text */}
                    <Image
                      src={`${img.fileUrl}`}
                      fill
                      alt={`${post?.title} - Property image ${index + 1} of ${post?.images?.length}`}
                      className={styles.propertyImage}
                      loading={index < 2 ? "eager" : "lazy"}
                      priority={index === 0}
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                      quality={index === 0 ? 90 : 75}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyužnyužnyužnbuMcnha/9k="
                      onError={() => {
                        // Handle image loading errors gracefully
                        console.warn(`Failed to load image: ${img.fileUrl}`);
                      }}
                    />

                    <div className={styles.imageOverlay}>
                      <div className={styles.zoomHint}>
                        <Image src="/icons/search.svg" width={24} height={24} alt="" />
                        <span>Click to view fullscreen</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </header>

        {/* Main Content with Semantic HTML */}
        <article className={styles.postContainer} itemScope itemType="https://schema.org/RealEstateListing">
          {/* Property Title and Address */}
          <header className={styles.headingBlock}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className={styles.propertyTitle + " heading-h6"} itemProp="name">{post?.title}</h1>
                <address className={styles.propertyAddress + " body-med"} itemProp="address">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.locationIcon}>
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor"/>
                  </svg>
                  {post?.address}
                </address>
              </div>
              {session && (
                <div className="relative">
                  <button 
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isFavorited 
                        ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-400'
                    }`}
                    onClick={handleFavoriteClick}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  
                  {/* Toast Notification */}
                  {showFavoriteToast && (
                    <div className={`absolute top-full right-0 mt-2 px-3 py-2 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap transform transition-all duration-300 ${
                      showFavoriteToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                    } ${
                      isToastError ? 'bg-red-600' : 'bg-gray-800'
                    }`}>
                      {favoriteToastMessage}
                      <div className={`absolute -top-1 right-3 w-2 h-2 transform rotate-45 ${
                        isToastError ? 'bg-red-600' : 'bg-gray-800'
                      }`}></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Property Summary */}
          <section className={styles.briefProperty} aria-label="Property Summary">
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt="Price icon" />
              </div>
              <div className={styles.summaryContent}>
                <p className={styles.summaryLabel + " body-sm"}>Mức giá</p>
                <p className={styles.summaryValue + " heading-h8"} itemProp="price">{formatPrice(post?.price)}</p>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <Image src="/icons/rectangleIcon.svg" width={15} height={15} alt="Area icon" />
              </div>
              <div className={styles.summaryContent}>
                <p className={styles.summaryLabel + " body-sm"}>Diện tích</p>
                <p className={styles.summaryValue + " heading-h8"} itemProp="floorSize">{post?.acreage} m²</p>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <Image src="/icons/fileIcon.svg" width={15} height={15} alt="Legal document icon" />
              </div>
              <div className={styles.summaryContent}>
                <p className={styles.summaryLabel + " body-sm"}>Pháp lý</p>
                <p className={styles.summaryValue + " heading-h8"} itemProp="legal">{formatLegalStatus(post?.legal)}</p>
              </div>
            </div>
          </section>

          {/* Property Description */}
          <section className={styles.descriptionSection}>
            <h2 className={styles.descriptionTitle + " heading-h6"}>Thông tin mô tả</h2>
            <div className={styles.descriptionContent + " body-lg"} itemProp="description">
              {formatDescription(post?.description)}
            </div>
          </section>

          {/* Property Features */}
          <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitle + " heading-h8"}>Đặc điểm bất động sản</h2>
            <div className={styles.featureGrid}>
              {post?.price && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>                    
                    <span className={styles.previewFeatureIcon}>💰</span>
                    <p>Mức giá</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatPrice(post?.price)}</p></div>
                </div>
              )}
              {post?.acreage && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <span className={styles.previewFeatureIcon}>📐</span>
                    <p>Diện tích</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.acreage} m²</p></div>
                </div>
              )}
              {post?.bedrooms && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <span className={styles.previewFeatureIcon}>🛏️</span>
                    <p>Số phòng ngủ</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.bedrooms} PN</p></div>
                </div>
              )}
              {post?.bathrooms && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <span className={styles.previewFeatureIcon}>🛁</span>
                    <p>Số phòng tắm, vệ sinh</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.bathrooms} Phòng</p></div>
                </div>
              )}
              {post?.floors && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <span className={styles.previewFeatureIcon}>🏢</span>
                    <p>Số tầng</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.floors} Tầng</p></div>
                </div>
              )}
              {post?.legal && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <span className={styles.previewFeatureIcon}>📄</span>
                    <p>Pháp lý</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatLegalStatus(post?.legal)}</p></div>
                </div>
              )}
              {post?.furniture && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <span className={styles.previewFeatureIcon}>🛋️</span>
                    <p>Nội thất</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatFurnitureStatus(post?.furniture)}</p></div>
                </div>
              )}
              {post?.direction && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <span className={styles.previewFeatureIcon}>🧭</span>
                    <p>Hướng</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatDirection(post?.direction)}</p></div>
                </div>
              )}
              {post?.frontage && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>                    
                    <span className={styles.previewFeatureIcon}>🏠</span>
                    <p>Mặt tiền</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.frontage} m</p></div>
                </div>
              )}
            </div>
          </section>
        </article>
        {/* Section for recommendations -- todo*/}
        {/* <ExtraInfo /> */}
        {/* <DownloadApp /> */}
        <MbFooter />
      </div>

      {/* Contact Footer */}
      <footer className={styles.footer}>
        <div className={styles.contactInfo}>
          <div className={styles.userProfile}>
            <img
              className={styles.profileMenuAvatar}
              width="48"
              height="48"
              alt={`${post?.user?.username || 'User profile picture'}`}
              src={post?.user?.profilePicture || "/temp/avatar.jpg"}
            />
            <div className={styles.userDetails}>
              <p className={styles.userName + " body-med-bold"}>{post?.user?.username || 'Người bán'}</p>
              <p className={styles.userStatus + " body-sm"}>Đang hoạt động</p>
            </div>
          </div>
        </div>
        <div className={styles.contactActions}>
          <button className={styles.zaloBtn} aria-label="Contact via Zalo">
            <Image src="/icons/zaloIcon.svg" width={24} height={24} alt="" />
          </button>
          <button
            className={styles.contactBtn}
            onClick={handlePhoneClick}
            aria-label={`Call ${post?.user?.contactPhoneNumber || post?.user?.phoneNumber}`}
          >
            <Image src="/icons/phoneIcon.svg" width={18} height={18} alt="" />
            <span className={styles.phoneText}>
              {showFullPhone
                ? (post?.user?.contactPhoneNumber || post?.user?.phoneNumber)
                : formatPhoneNumber(post?.user?.contactPhoneNumber || post?.user?.phoneNumber)
              }
              {!showFullPhone && <span className={styles.clickHint}>Nhấn để hiện</span>}
            </span>
          </button>
        </div>
      </footer>

      {/* Fullscreen Image Modal */}
      {isFullscreen && post?.images && (
        <div 
          className={styles.fullscreenModal} 
          onClick={closeFullscreen}
          role="dialog"
          aria-modal="true"
          aria-label="Property image gallery"
        >
          <div className={styles.fullscreenHeader}>
            <span className={styles.imageCounter}>
              {currentImageIndex + 1} / {post.images.length}
            </span>
            <button 
              className={styles.closeButton} 
              onClick={closeFullscreen}
              aria-label="Close fullscreen gallery"
            >
              ×
            </button>
          </div>
          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.navButton + ' ' + styles.prevButton} 
              onClick={prevImage}
              aria-label="Previous image"
            >
              ‹
            </button>
            <div className={styles.fullscreenImageContainer}>
              <Image
                src={`${post.images[currentImageIndex]?.fileUrl}`}
                fill
                alt={`${post?.title} - Property image ${currentImageIndex + 1} fullscreen view`}
                className={styles.fullscreenImage}
                style={{ objectFit: 'contain' }}
                sizes="100vw"
              />
            </div>
            <button 
              className={styles.navButton + ' ' + styles.nextButton} 
              onClick={nextImage}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function DesktopPosts({ post, session }: { post: any; session?: any }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFavoriteToast, setShowFavoriteToast] = useState(false);
  const [favoriteToastMessage, setFavoriteToastMessage] = useState('');
  const [isToastError, setIsToastError] = useState(false);
  const swiperRef = useRef<any>(null);

  // Fetch initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session?.user?.id || !post?.postId) return;
      
      try {
        const response = await fetch(`/api/users/favorites/${session.user.id}/${post.postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data?.response?.userId != undefined && data?.response?.postId != undefined) {
            setIsFavorited(true);
          }else {
            setIsFavorited(false);
          }          
        } else {
          // If API returns error, default to false
          setIsFavorited(false);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsFavorited(false);
      }
    };
    
    checkFavoriteStatus();
  }, [session?.user?.id, post?.postId]);

  // Handle keyboard events for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) {
        switch (event.key) {
          case 'Escape':
            closeFullscreen();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
          case 'ArrowRight':
            nextImage();
            break;
        }
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isFullscreen]);

  const openFullscreen = (index: number) => {
    setCurrentImageIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < (post?.images?.length - 1) ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : (post?.images?.length - 1)
    );
  };

  // Helper function to format phone number (hide last 3 digits)
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length < 4) return phone;

    if (showFullPhone) {
      return cleanPhone;
    } else {
      const hiddenPart = cleanPhone.slice(0, -3) + '***';
      return hiddenPart;
    }
  };

  // Handle phone button click
  const handlePhoneClick = () => {
    const phoneNumber = post?.user?.contactPhoneNumber || post?.user?.phoneNumber;
    
    if (!showFullPhone) {
      // First click: show full number
      setShowFullPhone(true);
    } else {
      // Second click: trigger phone call
      if (phoneNumber) {
        const confirmed = window.confirm(`Bạn có muốn gọi đến số ${phoneNumber}?`);
        if (confirmed) {
          window.location.href = `tel:${phoneNumber}`;
        }
      }
    }
  };

  // Handle favorite button click
  const handleFavoriteClick = async () => {
    try {
      const newFavoriteState = !isFavorited;
      const endpoint = newFavoriteState ? '/api/users/favorites/add' : '/api/users/favorites/remove';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          postId: post?.postId
        })
      });
      
      if (response.ok) {
        // Only update state and show toast if API call succeeds
        setIsFavorited(newFavoriteState);
        
        // Show toast notification
        const message = newFavoriteState ? 'Đã lưu tin' : 'Đã bỏ lưu tin';
        setFavoriteToastMessage(message);
        setIsToastError(false);
        setShowFavoriteToast(true);
        
        // Auto hide after 2 seconds
        setTimeout(() => {
          setShowFavoriteToast(false);
        }, 2000);
      } else {
        // Show error message
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Có lỗi xảy ra. Vui lòng thử lại.';
        setFavoriteToastMessage(errorMessage);
        setIsToastError(true);
        setShowFavoriteToast(true);
        
        // Auto hide error after 3 seconds
        setTimeout(() => {
          setShowFavoriteToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      // Show error toast
      setFavoriteToastMessage('Không thể kết nối. Vui lòng kiểm tra kết nối internet.');
      setIsToastError(true);
      setShowFavoriteToast(true);
      
      // Auto hide error after 3 seconds
      setTimeout(() => {
        setShowFavoriteToast(false);
      }, 3000);
    }
  };

  // Handle thumbnail click to navigate to specific slide
  const handleThumbnailClick = (index: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarDesktop session={session} />
      
      {/* Desktop Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Image Gallery */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-96 lg:h-[500px]">
              <Swiper
                ref={swiperRef}
                loop={true}
                navigation
                pagination={{ type: 'custom' }}
                zoom={{ maxRatio: 3, minRatio: 1 }}
                modules={[Navigation, Pagination, Zoom]}
                onSlideChange={(swiper) => setCurrentImageIndex(swiper.realIndex)}
                className={styles.imageSwiper}
                aria-label="Property image gallery"
              >
                {post?.images?.map((img: any, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-zoom-container">
                      <div
                        className={styles.imageContainer}
                        onClick={() => openFullscreen(index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openFullscreen(index)}
                        aria-label={`View image ${index + 1} in fullscreen`}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Blurred background image */}
                        <div
                          className={styles.blurredBackground}
                          style={{
                            backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${img.fileUrl})`
                          }}
                        />

                        {/* Main image with SEO-optimized alt text */}
                        <Image
                          src={`${img.fileUrl}`}
                          fill
                          alt={`${post?.title} - Property image ${index + 1} of ${post?.images?.length}`}
                          className={styles.propertyImage}
                          loading={index < 2 ? "eager" : "lazy"}
                          priority={index === 0}
                          style={{ objectFit: 'contain' }}
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          quality={index === 0 ? 90 : 75}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyužnyužnyužnbuMcnha/9k="
                          onError={() => {
                            console.warn(`Failed to load image: ${img.fileUrl}`);
                          }}
                        />

                        {/* Image overlay with hover effect */}
                        <div className={styles.imageOverlay}>
                          <div className={styles.zoomHint}>
                            <Image src="/icons/search.svg" width={24} height={24} alt="" />
                            <span>Click to view fullscreen</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Custom Thumbnail Navigation */}
            {post?.images && post.images.length > 1 && (
              <div className="px-4 py-3 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {post.images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 relative w-16 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        currentImageIndex === index
                          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={`${img.fileUrl}`}
                        fill
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover"
                        sizes="64px"
                        quality={60}
                      />
                      {currentImageIndex === index && (
                        <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">                          
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Property Details */}
          <article className="bg-white rounded-lg shadow-sm p-6" itemScope itemType="https://schema.org/RealEstateListing">
            
            {/* Title and Address */}
            <header className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-3xl font-bold text-gray-900 flex-1" itemProp="name">{post?.title}</h1>
                {session && (
                  <div className="relative">
                    <button 
                      className={`ml-4 p-3 rounded-full transition-all duration-200 ${
                        isFavorited 
                          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-400'
                      }`}
                      onClick={handleFavoriteClick}
                      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    
                    {/* Toast Notification */}
                    {showFavoriteToast && (
                      <div className={`absolute top-full right-0 mt-2 px-4 py-2 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap transform transition-all duration-300 ${
                        showFavoriteToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                      } ${
                        isToastError ? 'bg-red-600' : 'bg-gray-800'
                      }`}>
                        {favoriteToastMessage}
                        <div className={`absolute -top-1 right-4 w-2 h-2 transform rotate-45 ${
                          isToastError ? 'bg-red-600' : 'bg-gray-800'
                        }`}></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <address className="flex items-center gap-2 text-gray-600 not-italic" itemProp="address">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" fill="currentColor"/>
                </svg>
                {post?.address}
              </address>
            </header>

            {/* Quick Stats */}
            <section className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Image src="/icons/CurrencyCircleDollar.svg" width={24} height={24} alt="Price icon" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Mức giá</p>
                <p className="text-xl font-bold text-blue-600" itemProp="price">{formatPrice(post?.price)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Image src="/icons/rectangleIcon.svg" width={24} height={24} alt="Area icon" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Diện tích</p>
                <p className="text-xl font-bold text-gray-900" itemProp="floorSize">{post?.acreage} m²</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Image src="/icons/fileIcon.svg" width={24} height={24} alt="Legal document icon" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Pháp lý</p>
                <p className="text-xl font-bold text-green-600" itemProp="legal">{formatLegalStatus(post?.legal)}</p>
              </div>
            </section>

            {/* Description */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Thông tin mô tả</h2>
              <div className="prose max-w-none text-gray-700" itemProp="description">
                {formatDescription(post?.description)}
              </div>
            </section>

            {/* Property Features Grid */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Đặc điểm bất động sản</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {post?.price && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="text-sm text-gray-600">Mức giá</p>
                      <p className="font-semibold text-gray-900">{formatPrice(post?.price)}</p>
                    </div>
                  </div>
                )}
                {post?.acreage && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📐</span>
                    <div>
                      <p className="text-sm text-gray-600">Diện tích</p>
                      <p className="font-semibold text-gray-900">{post?.acreage} m²</p>
                    </div>
                  </div>
                )}
                {post?.bedrooms && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🛏️</span>
                    <div>
                      <p className="text-sm text-gray-600">Số phòng ngủ</p>
                      <p className="font-semibold text-gray-900">{post?.bedrooms} PN</p>
                    </div>
                  </div>
                )}
                {post?.bathrooms && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🛁</span>
                    <div>
                      <p className="text-sm text-gray-600">Phòng tắm, vệ sinh</p>
                      <p className="font-semibold text-gray-900">{post?.bathrooms} Phòng</p>
                    </div>
                  </div>
                )}
                {post?.floors && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <p className="text-sm text-gray-600">Số tầng</p>
                      <p className="font-semibold text-gray-900">{post?.floors} Tầng</p>
                    </div>
                  </div>
                )}
                {post?.legal && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm text-gray-600">Pháp lý</p>
                      <p className="font-semibold text-gray-900">{formatLegalStatus(post?.legal)}</p>
                    </div>
                  </div>
                )}
                {post?.furniture && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🛋️</span>
                    <div>
                      <p className="text-sm text-gray-600">Nội thất</p>
                      <p className="font-semibold text-gray-900">{formatFurnitureStatus(post?.furniture)}</p>
                    </div>
                  </div>
                )}
                {post?.direction && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🧭</span>
                    <div>
                      <p className="text-sm text-gray-600">Hướng</p>
                      <p className="font-semibold text-gray-900">{formatDirection(post?.direction)}</p>
                    </div>
                  </div>
                )}
                {post?.frontage && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <p className="text-sm text-gray-600">Mặt tiền</p>
                      <p className="font-semibold text-gray-900">{post?.frontage} m</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </article>
        </div>

        {/* Sidebar - Right Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
              
              {/* User Profile */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  alt={`${post?.user?.username || 'User profile picture'}`}
                  src={post?.user?.profilePicture || "/temp/avatar.jpg"}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{post?.user?.username || 'Người bán'}</h4>
                  <p className="text-sm text-green-600">Đang hoạt động</p>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handlePhoneClick}
                  aria-label={`Call ${post?.user?.contactPhoneNumber || post?.user?.phoneNumber}`}
                >
                  <Image src="/icons/phoneIcon.svg" width={20} height={20} alt="" className="filter brightness-0 invert" />
                  <span className="font-medium">
                    {showFullPhone
                      ? (post?.user?.contactPhoneNumber || post?.user?.phoneNumber)
                      : formatPhoneNumber(post?.user?.contactPhoneNumber || post?.user?.phoneNumber)
                    }
                  </span>
                </button>
                
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" aria-label="Contact via Zalo">
                  <Image src="/icons/zaloIcon.svg" width={24} height={24} alt="" />
                  <span className="font-medium">Liên hệ Zalo</span>
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khác</h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">Mã tin: <span className="font-medium text-gray-900">#{post?.id}</span></p>
                <p className="text-gray-600">Ngày đăng: <span className="font-medium text-gray-900">
                  {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span></p>
                <p className="text-gray-600">Loại giao dịch: <span className="font-medium text-gray-900">
                  {post?.transactionType === 'SELL' ? 'Bán' : 
                   post?.transactionType === 'RENT' ? 'Cho thuê' : 
                   post?.transactionType === 'PROJECT' ? 'Dự án' : 'N/A'}
                </span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <DesktopFooter />

      {/* Fullscreen Image Modal - Same as mobile */}
      {isFullscreen && post?.images && (
        <div 
          className={styles.fullscreenModal}
          onClick={closeFullscreen}
          role="dialog"
          aria-modal="true"
          aria-label="Property image gallery"
        >
          <div className={styles.fullscreenHeader}>
            <span className={styles.imageCounter}>
              {currentImageIndex + 1} / {post.images.length}
            </span>
            <button 
              className={styles.closeButton} 
              onClick={closeFullscreen}
              aria-label="Close fullscreen gallery"
            >
              ×
            </button>
          </div>
          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.navButton + ' ' + styles.prevButton} 
              onClick={prevImage}
              aria-label="Previous image"
            >
              ‹
            </button>
            <div className={styles.fullscreenImageContainer}>
              <Image
                src={`${post.images[currentImageIndex]?.fileUrl}`}
                fill
                alt={`${post?.title} - Property image ${currentImageIndex + 1} fullscreen view`}
                className={styles.fullscreenImage}
                style={{ objectFit: 'contain' }}
                sizes="100vw"
              />
            </div>
            <button 
              className={styles.navButton + ' ' + styles.nextButton} 
              onClick={nextImage}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}