"use client";
import useScreenSize from "../../lib/useScreenSize";
import { useSession } from 'next-auth/react';
import styles from './index.module.css'
import NavBarMobile from "../../ui/mobile/navigation/nav-bar-mobile";
import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function Account(){
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return(
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobileAccount session={session} /> : <DesktopAccount session={session} />}
        </div>
    )
}

function MobileAccount({ session }: { session?: any }){

    const [userBalance, setUserBalance] = useState<any>({});
    const [userPackages, setUserPackages] = useState<Array<any>>([]);
    const [expandedPackages, setExpandedPackages] = useState<{ [key: number]: boolean }>({});
    const [isBalanceExpanded, setIsBalanceExpanded] = useState<boolean>(false);
    const params = useParams();
    const router = useRouter();

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

    const fetchUserPackages = async () => {
        const userId = params.id || session?.user?.id;
        const response = await fetch(`/api/packages/userPackages/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const res = await response.json();
            const data = res.response;
            setUserPackages(data);
        }
    }

    useEffect(() => {
        fetchUserBalance();
        fetchUserPackages();
    }, [session])

    const togglePackageExpansion = (index: number) => {
        setExpandedPackages(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleBalanceExpansion = () => {
        setIsBalanceExpanded(prev => !prev);
    };

    const depositMoney = () => {
        router.push(`/deposit/${params.id || session?.user?.id}`);
    }

    return <div className="flex flex-col min-h-screen">
        <NavBarMobile displayNav={true} session={session} />
        
        {/* Balance Section - Collapsible */}
        <div className={styles.balanceCard}>
            {/* Balance Header Row - Contains both expandable content and deposit button */}
            <div className="flex justify-between items-center">
                {/* Balance Header - Clickable for expansion */}
                <div className={styles.balanceHeader} onClick={toggleBalanceExpansion} style={{ flex: 1, margin: 0 }}>
                    <div className={styles.balanceHeaderLeft}>
                        <div className={styles.balanceIconContainer}>
                            <Image src="/icons/CurrencyCircleDollar.svg" alt="Total Balance" width={16} height={16} className={styles.balanceIcon} />
                        </div>
                        <div className={styles.balanceSummary}>
                            <h3 className={styles.balanceTitle}>Tổng số dư</h3>
                            <p className={styles.totalBalanceAmount}>
                                {((userBalance.mainBalance || 0) + (userBalance.promoBalance || 0)).toLocaleString('vi-VN')} VND
                            </p>
                        </div>
                        <Image
                            src="/icons/CaretDown.svg"
                            alt="Expand"
                            width={16}
                            height={16}
                            className={`${styles.caretIcon} ${isBalanceExpanded ? styles.caretOpen : ''}`}
                        />
                    </div>               
                </div>
                
                {/* Deposit Button - Separate from collapsible area */}
                <div className={styles.balanceHeaderRight}>
                    <button className={styles.depositButton} onClick={depositMoney}>
                        <Image src="/icons/deposit.svg" alt="Nạp tiền" width={16} height={16} className={styles.depositIcon} />
                        <span>Nạp tiền</span>
                    </button>                    
                </div>
            </div>

            {/* Balance Details - Collapsible */}
            <div className={`${styles.balanceContent} ${isBalanceExpanded ? styles.expanded : ''}`}>
                <div className="space-y-3">
                    <div className={styles.balanceItem}>
                        <div>
                            <p className={styles.balanceLabel}>Số dư chính</p>
                            <p className={styles.balanceAmount}>
                                {userBalance.mainBalance?.toLocaleString('vi-VN') || '0'} VND
                            </p>
                            {userBalance.mainBalanceExpiredDate && (
                                <p className={styles.balanceExpiry}>
                                    Hết hạn: {new Date(userBalance.mainBalanceExpiredDate).toLocaleDateString('vi-VN')}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className={styles.balanceItem}>
                        <div>
                            <p className={styles.balanceLabel}>Số dư khuyến mãi</p>
                            <p className={styles.balanceAmount}>
                                {userBalance.promoBalance?.toLocaleString('vi-VN') || '0'} VND
                            </p>
                            {userBalance.promoBalanceExpiredDate && (
                                <p className={styles.balanceExpiry}>
                                    Hết hạn: {new Date(userBalance.promoBalanceExpiredDate).toLocaleDateString('vi-VN')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* User Packages Section */}
        <div className={styles.packageCard}>
            <div className="flex justify-between items-center mb-3">
                <h3 className={styles.packageTitle}>Gói hội viên</h3>
                {userPackages && userPackages.length > 0 && (
                    <div className={styles.packageSummary}>
                        <span className={styles.packageCount}>{userPackages.length} gói</span>
                    </div>
                )}
            </div>
            
            {userPackages && userPackages.length > 0 ? (
                <div className={styles.packagesList}>
                    {userPackages.map((pkg, index) => (
                        <div key={index} className={styles.packageItemCompact}>
                            {/* Package Header - Clickable */}
                            <div 
                                className={styles.packageHeader}
                                onClick={() => togglePackageExpansion(index)}
                            >
                                <div className={styles.packageHeaderLeft}>
                                    {pkg.image && (
                                        <div className={styles.packageImageContainer}>
                                            <Image src={pkg.image} alt="VIP Badge" width={16} height={16} />
                                        </div>
                                    )}
                                    <div className={styles.packageBasicInfo}>
                                        <p className={styles.packageNameCompact}>{pkg.packageDescription || 'Gói hội viên'}</p>
                                        <div className={styles.packageQuickStats}>
                                            {/* Show total posts as quick preview */}
                                            <span className={styles.quickStat}>
                                                {(pkg.remainingDiamondPosts || 0) + 
                                                 (pkg.remainingGoldPosts || 0) + 
                                                 (pkg.remainingSilverPosts || 0) + 
                                                 (pkg.remainingNormalPosts || 0)} tin còn lại
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.packageHeaderRight}>
                                    <Image
                                        src="/icons/CaretDown.svg"
                                        alt="Expand"
                                        width={16}
                                        height={16}
                                        className={`${styles.caretIcon} ${expandedPackages[index] ? styles.caretOpen : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Package Content - Collapsible */}
                            <div className={`${styles.packageContent} ${expandedPackages[index] ? styles.expanded : ''}`}>
                                {/* Package Posts Information */}
                                <div className={styles.postsGrid}>
                                    {pkg.remainingDiamondPosts !== undefined && (
                                        <div className={`${styles.postCard}`}>
                                            <div className={styles.postIcon}>💎</div>
                                            <div className={styles.postDetails}>
                                                <div className={styles.postLabel}>Kim Cương</div>
                                                <div className={styles.postValue}>{pkg.remainingDiamondPosts}</div>
                                            </div>
                                        </div>
                                    )}
                                    {pkg.remainingGoldPosts !== undefined && (
                                        <div className={`${styles.postCard}`}>
                                            <div className={styles.postIcon}>🥇</div>
                                            <div className={styles.postDetails}>
                                                <div className={styles.postLabel}>Vàng</div>
                                                <div className={styles.postValue}>{pkg.remainingGoldPosts}</div>
                                            </div>
                                        </div>
                                    )}
                                    {pkg.remainingSilverPosts !== undefined && (
                                        <div className={`${styles.postCard}`}>
                                            <div className={styles.postIcon}>🥈</div>
                                            <div className={styles.postDetails}>
                                                <div className={styles.postLabel}>Bạc</div>
                                                <div className={styles.postValue}>{pkg.remainingSilverPosts}</div>
                                            </div>
                                        </div>
                                    )}
                                    {pkg.remainingNormalPosts !== undefined && (
                                        <div className={`${styles.postCard}`}>
                                            <div className={styles.postIcon}>📄</div>
                                            <div className={styles.postDetails}>
                                                <div className={styles.postLabel}>Thường</div>
                                                <div className={styles.postValue}>{pkg.remainingNormalPosts}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {pkg.expiredDate && (
                                    <p className={styles.packageExpiry}>
                                        Hết hạn: {new Date(pkg.expiredDate).toLocaleDateString('vi-VN')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyPackages}>
                    <div className="mb-4">
                        <p className={styles.emptyMessage}>Bạn chưa đăng ký gói hội viên nào</p>
                        <button className={styles.exploreButton}>
                            Tìm hiểu ngay
                        </button>
                    </div>
                </div>
            )}
        </div>

    </div>;
}

function DesktopAccount({ session }: { session?: any }){
    return <div>Desktop Account Page</div>;
}