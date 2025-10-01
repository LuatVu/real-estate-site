"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import useScreenSize from "../../lib/useScreenSize";
import styles from './index.module.css';
import NavBarMobile from '../../ui/mobile/navigation/nav-bar-mobile';
import MbFooter from "../../ui/mobile/footer/mb.footer";
import DownloadApp from "../../ui/mobile/download-app/mb.download";
import ExtraInfo from "../../ui/mobile/extra-info/mb.extra.info";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

interface PostClientProps {
  post: any;
  session?: any;
}

export default function PostClient({ post, session }: PostClientProps) {
  const screenSize = useScreenSize();
  
  // Add viewport event for better mobile performance
  useEffect(() => {
    // Optimize viewport for mobile devices
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
    }
  }, []);
  
  return (
    <div>
      {screenSize === 'sm' ? (
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

  // Helper function to format price to readable Vietnamese format
  const formatPrice = (price: string | number) => {
    if (!price) return 'Thỏa thuận';

    // Remove any non-numeric characters except decimal points
    const numericPrice = parseFloat(String(price).replace(/[^\d.]/g, ''));

    if (isNaN(numericPrice)) return price;

    if (numericPrice >= 1000000000) {
      // Billions (tỷ)
      const billions = numericPrice / 1000000000;
      return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)} tỷ`;
    } else if (numericPrice >= 1000000) {
      // Millions (triệu)
      const millions = numericPrice / 1000000;
      return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu`;
    } else if (numericPrice >= 1000) {
      // Thousands (nghìn)
      const thousands = numericPrice / 1000;
      return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)} nghìn`;
    } else {
      // Less than 1000, show as is with VND
      return `${numericPrice.toLocaleString('vi-VN')} VND`;
    }
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

  // Helper function to format legal status to readable Vietnamese labels
  const formatLegalStatus = (legal: string) => {
    if (!legal) return '';
    
    const legalMap: { [key: string]: string } = {
      'SO_DO': 'Sổ đỏ',
      'HOP_DONG_MUA_BAN': 'Hợp đồng mua bán',
      'KHONG_SO': 'Không sổ'
    };
    
    return legalMap[legal] || legal;
  };

  const formatFurnitureStatus = (furniture: string) => {
    if (!furniture) return '';
    
    const furnitureMap: { [key: string]: string } = {
      'DAY_DU': 'Đầy đủ',
      'CO_BAN': 'Cơ bản',
      'KHONG_NOI_THAT': 'Không nội thất'
    };
    return furnitureMap[furniture] || furniture;
  };

  const formatDirection = (direction: string) => {
    if (!direction) return '';
    const directionMap: { [key: string]: string } = {
      'BAC': 'Bắc',
      'NAM': 'Nam',
      'DONG': 'Đông',
      'TAY': 'Tây',
      'DONG_BAC': 'Đông Bắc',
      'TAY_BAC': 'Tây Bắc',
      'DONG_NAM': 'Đông Nam',
      'TAY_NAM': 'Tây Nam'
    };
    return directionMap[direction] || direction;
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
                        backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${img.fileUrl})`
                      }}
                    />

                    {/* Main image with SEO-optimized alt text */}
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${img.fileUrl}`}
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
            <h1 className="heading-h9" itemProp="name">{post?.title}</h1>
            <address className={styles.subHeading + " body-sm"} itemProp="address">
              {post?.address}
            </address>
          </header>

          {/* Property Summary */}
          <section className={styles.briefProperty} aria-label="Property Summary">
            <div>
              <p className={styles.subHeading + " body-sm"}>Mức giá</p>
              <p className="body-sm" itemProp="price">{formatPrice(post?.price)}</p>
            </div>
            <div>
              <p className={styles.subHeading + " body-sm"}>Diện tích</p>
              <p className="body-sm" itemProp="floorSize">{post?.acreage} m²</p>
            </div>
            <div>
              <p className={styles.subHeading + " body-sm"}>Phòng ngủ</p>
              <p className="body-sm" itemProp="numberOfBedrooms">{post?.bedrooms} PN</p>
            </div>
          </section>

          {/* Property Description */}
          <section className={styles.descrip}>
            <h2 className="heading-h9">Thông tin mô tả</h2>
            <div className="body-sm" itemProp="description">
              {post?.description}
            </div>
          </section>

          {/* Property Features */}
          <section className={styles.descrip}>
            <h2 className="heading-h9">Đặc điểm bất động sản</h2>
            <div className={styles.featureProperty}>
              {post?.price && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/CurrencyCircleDollar.svg" width={15} height={15} alt="Price icon" />
                    <p>Mức giá</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatPrice(post?.price)}</p></div>
                </div>
              )}
              {post?.acreage && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/rectangleIcon.svg" width={15} height={15} alt="Area icon" />
                    <p>Diện tích</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.acreage} m²</p></div>
                </div>
              )}
              {post?.bedrooms && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/bedIcon.svg" width={15} height={15} alt="Bedroom icon" />
                    <p>Số phòng ngủ</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.bedrooms} PN</p></div>
                </div>
              )}
              {post?.bathrooms && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/bathroomIcon.svg" width={15} height={15} alt="Bathroom icon" />
                    <p>Số phòng tắm, vệ sinh</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.bathrooms} Phòng</p></div>
                </div>
              )}
              {post?.floors && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/floorIcon.svg" width={15} height={15} alt="Floor icon" />
                    <p>Số tầng</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.floors} Tầng</p></div>
                </div>
              )}
              {post?.legal && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/fileIcon.svg" width={15} height={15} alt="Legal document icon" />
                    <p>Pháp lý</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatLegalStatus(post?.legal)}</p></div>
                </div>
              )}
              {post?.furniture && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/furnitureIcon.svg" width={15} height={15} alt="Furniture icon" />
                    <p>Nội thất</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatFurnitureStatus(post?.furniture)}</p></div>
                </div>
              )}
              {post?.direction && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/directionIcon.svg" width={15} height={15} alt="Direction icon" />
                    <p>Hướng</p>
                  </div>
                  <div className={styles.featureValue}><p>{formatDirection(post?.direction)}</p></div>
                </div>
              )}
              {post?.frontage && (
                <div className={styles.featureItem}>
                  <div className={styles.featureTitle}>
                    <Image src="/icons/HouseLine.svg" width={15} height={15} alt="Frontage icon" />
                    <p>Mặt tiền</p>
                  </div>
                  <div className={styles.featureValue}><p>{post?.frontage} m</p></div>
                </div>
              )}
            </div>
          </section>
        </article>

        <ExtraInfo />
        <DownloadApp />
        <MbFooter />
      </div>

      {/* Contact Footer */}
      <footer className={styles.footer}>
        <Image
          className={styles.profileMenuAvatar}
          width="48"
          height="48"
          alt={`${post?.user?.fullName || 'User'} profile picture`}
          src={post?.user?.profilePicture || "/temp/avatar.jpg"}
        />
        <Image src="/icons/zaloIcon.svg" width={60} height={60} alt="Contact via Zalo" />
        <button
          className={styles.contactBtn}
          onClick={handlePhoneClick}
          aria-label={`Call ${post?.user?.contactPhoneNumber || post?.user?.phoneNumber}`}
        >
          <Image src="/icons/phoneIcon.svg" width={20} height={20} alt="" />
          {showFullPhone
            ? (post?.user?.contactPhoneNumber || post?.user?.phoneNumber)
            : formatPhoneNumber(post?.user?.contactPhoneNumber || post?.user?.phoneNumber)
          }
          {!showFullPhone && <span className={styles.clickHint}>Nhấn để hiện số</span>}
        </button>
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
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/public/image/${post.images[currentImageIndex]?.fileUrl}`}
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
  // TODO: Implement desktop version with similar SEO optimizations
  return (
    <div>Desktop version - TODO: Implement with SEO optimizations</div>
  );
}