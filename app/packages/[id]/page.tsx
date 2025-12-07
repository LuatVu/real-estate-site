"use client";
import useScreenSize from '../../lib/useScreenSize';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './index.module.css';
import NavBarMobile from '../../ui/mobile/navigation/nav-bar-mobile';
import { useParams } from 'next/navigation';
import PackagePurchasePopup from '../../ui/common/package-purchase-popup/package-purchase-popup';
import PackagePurchaseDesktopPopup from '../../ui/common/package-purchase-desktop-popup/package-purchase-desktop-popup';

export default function PackagesPage() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobilePackages session={session} /> : <DesktopPackages session={session} />}
        </div>
    )
}

function MobilePackages({ session }: { session?: any }){
    const [packages, setPackages] = useState<Array<any>>([]);
    const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<any>({});
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const params = useParams();        

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const togglePackage = (packageId: string) => {
        setExpandedPackage(expandedPackage === packageId ? null : packageId);
    };

    const handleBuyPackage = (pkg: any) => {
        setSelectedPackage(pkg);
        setShowPurchasePopup(true);
    };

    const closePurchasePopup = () => {
        setShowPurchasePopup(false);
        setSelectedPackage(null);
    };

    const getPostsDescription = (pkg: any) => {
        const posts = [];
        if (pkg.diamondPosts > 0) posts.push(`${pkg.diamondPosts} tin Diamond`);
        if (pkg.goldPosts > 0) posts.push(`${pkg.goldPosts} tin Gold`);
        if (pkg.silverPosts > 0) posts.push(`${pkg.silverPosts} tin Silver`);
        if (pkg.normalPosts > 0) posts.push(`${pkg.normalPosts} tin thường`);
        return posts;
    };

    const fetchAllPackages = async () => {
        try {
            const response = await fetch('/api/packages', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch packages');
            }
            const res = await response.json();
            const data = res.response;
            setPackages(data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    }

    const fetchUserBalance = async () => {
        const userId = params.id || session?.user?.id;
        const response = await fetch(`/api/users/balances/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const res = await response.json();
            const data = res.response;
            setUserBalance({
                mainBalance: data.mainBalance,
                promoBalance: data.promoBalance,
                mainBalanceExpiredDate: data.mainBalanceExpiredDate,
                promoBalanceExpiredDate: data.promoBalanceExpiredDate
            });
        }
    }

    useEffect(() => {
        fetchAllPackages();
        fetchUserBalance();
    }, []);

    return(
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            <div className={styles.packagesContainer}>
                <h1 className={styles.title}>Mua gói hội viên</h1>
                <div className={styles.packagesList}>
                    {packages.map((pkg) => {
                        const isExpanded = expandedPackage === pkg.packageId;
                        const postsDescription = getPostsDescription(pkg);
                        
                        return (
                            <div key={pkg.packageId} className={styles.packageItem}>
                                <div 
                                    className={styles.packageHeader}
                                    onClick={() => togglePackage(pkg.packageId)}
                                >
                                    <div className={styles.packageInfo}>
                                        <Image
                                            src={pkg.image}
                                            alt={pkg.packageName}
                                            width={48}
                                            height={48}
                                            className={styles.packageImage}
                                        />
                                        <div className={styles.packageDetails}>
                                            <h3 className={styles.packageName}>{pkg.packageName}</h3>
                                            <p className={styles.packagePrice}>
                                                {formatPrice(pkg.price)} VND/ tháng
                                            </p>
                                        </div>
                                    </div>
                                    <Image
                                        src="/icons/CaretDown.svg"
                                        alt="Expand"
                                        width={16}
                                        height={16}
                                        className={`${styles.caretIcon} ${isExpanded ? styles.caretOpen : ''}`}
                                    />
                                </div>
                                
                                <div 
                                    className={`${styles.packageContent} ${isExpanded ? styles.expanded : ''}`}
                                >
                                    <div className={styles.packageBody}>
                                        <div className={styles.description}>
                                            <h4 className={styles.descriptionTitle}>Gói bao gồm:</h4>
                                            <ul className={styles.postsList}>
                                                {postsDescription.map((post, index) => (
                                                    <li key={index} className={styles.postItem}>
                                                        {post}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <button 
                                            className={styles.buyButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBuyPackage(pkg);
                                            }}
                                        >
                                            Đăng ký mua
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Purchase Popup */}
            {showPurchasePopup && selectedPackage && (
                <PackagePurchasePopup
                    onClose={closePurchasePopup}
                    packageData={{
                        packageId: selectedPackage.packageId,
                        packageName: selectedPackage.packageName,
                        price: selectedPackage.price,
                        discount: selectedPackage.discount,
                        image: selectedPackage.image
                    }}
                    userBalance={userBalance}
                    session={session}
                />
            )}
        </div>
    );
}

function DesktopPackages({ session }: { session?: any }){
    const [packages, setPackages] = useState<Array<any>>([]);
    const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<any>({});
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const params = useParams();
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const togglePackage = (packageId: string) => {
        setExpandedPackage(expandedPackage === packageId ? null : packageId);
    };

    const handleBuyPackage = (pkg: any) => {
        setSelectedPackage(pkg);
        setShowPurchasePopup(true);
    };

    const closePurchasePopup = () => {
        setShowPurchasePopup(false);
        setSelectedPackage(null);
    };

    const getPostsDescription = (pkg: any) => {
        const posts = [];
        if (pkg.diamondPosts > 0) posts.push(`${pkg.diamondPosts} tin Diamond`);
        if (pkg.goldPosts > 0) posts.push(`${pkg.goldPosts} tin Gold`);
        if (pkg.silverPosts > 0) posts.push(`${pkg.silverPosts} tin Silver`);
        if (pkg.normalPosts > 0) posts.push(`${pkg.normalPosts} tin thường`);
        return posts;
    };

    const fetchAllPackages = async () => {
        try {
            const response = await fetch('/api/packages', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if (!response.ok) {
                throw new Error('Failed to fetch packages');
            }
            const res = await response.json();
            const data = res.response;
            setPackages(data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    }

    const fetchUserBalance = async () => {
        const userId = params.id || session?.user?.id;
        const response = await fetch(`/api/users/balances/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const res = await response.json();
            const data = res.response;
            setUserBalance({
                mainBalance: data.mainBalance,
                promoBalance: data.promoBalance,
                mainBalanceExpiredDate: data.mainBalanceExpiredDate,
                promoBalanceExpiredDate: data.promoBalanceExpiredDate
            });
        }
    }

    useEffect(() => {
        fetchAllPackages();
        fetchUserBalance();
    }, []);

    return(
        <div className="flex flex-col min-h-screen">
            <div className={styles.desktopPackagesContainer}>
                <h1 className={styles.desktopTitle}>Mua gói hội viên</h1>
                <div className={styles.desktopPackagesList}>
                    {packages.map((pkg) => {
                        const postsDescription = getPostsDescription(pkg);
                        
                        return (
                            <div key={pkg.packageId} className={styles.desktopPackageItem}>
                                <div className={styles.desktopPackageHeader}>
                                    <div className={styles.desktopPackageInfo}>
                                        <Image
                                            src={pkg.image}
                                            alt={pkg.packageName}
                                            width={64}
                                            height={64}
                                            className={styles.desktopPackageImage}
                                        />
                                        <div className={styles.desktopPackageDetails}>
                                            <h3 className={styles.desktopPackageName}>{pkg.packageName}</h3>
                                            <p className={styles.desktopPackagePrice}>
                                                {formatPrice(pkg.price)} VND/ tháng
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.desktopDescription}>
                                        <h4 className={styles.desktopDescriptionTitle}>Gói bao gồm:</h4>
                                        <ul className={styles.postsList}>
                                            {postsDescription.map((post, index) => (
                                                <li key={index} className={styles.postItem}>
                                                    {post}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className={styles.desktopPackageBody}>
                                    <button 
                                        className={styles.desktopBuyButton}
                                        onClick={() => handleBuyPackage(pkg)}
                                    >
                                        Đăng ký mua
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Purchase Popup - Desktop Modal */}
            {showPurchasePopup && selectedPackage && (
                <PackagePurchaseDesktopPopup
                    onClose={closePurchasePopup}
                    packageData={{
                        packageId: selectedPackage.packageId,
                        packageName: selectedPackage.packageName,
                        price: selectedPackage.price,
                        discount: selectedPackage.discount,
                        image: selectedPackage.image
                    }}
                    userBalance={userBalance}
                />
            )}
        </div>
    );
}