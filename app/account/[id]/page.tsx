"use client";
import useScreenSize from "../../lib/useScreenSize";
import { useSession } from 'next-auth/react';
import styles from './index.module.css'
import NavBarMobile from "../../ui/mobile/navigation/nav-bar-mobile";
import NavBarDesktop from "../../ui/desktop/navigation/nav-bar-desktop";
import DesktopFooter from "../../ui/desktop/footer/desktop-footer";
import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import MbFooter from "../../ui/mobile/footer/mb.footer";

export default function Account() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? <MobileAccount session={session} /> : <DesktopAccount session={session} />}
        </div>
    )
}

function MobileAccount({ session }: { session?: any }) {

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

    const registerPackage = () => {
        router.push(`/packages/${params.id || session?.user?.id}`);
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

                    <div className={styles.addMorePackages}>
                        <button className={styles.registerMoreButton} onClick={registerPackage}>
                            <Image src="/icons/plus.svg" alt="Đăng ký thêm" width={16} height={16} className={styles.registerButtonIcon} />
                            <span>Đăng ký thêm</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.emptyPackages}>
                    <div className="mb-4">
                        <p className={styles.emptyMessage}>Bạn chưa đăng ký gói hội viên nào</p>
                        <button className={styles.exploreButton} onClick={registerPackage}>
                            <Image src="/icons/question.svg" alt="Đăng ký thêm" width={16} height={16} className={styles.exploreButtonIcon} />
                            <span>Tìm hiểu ngay</span>
                        </button>
                    </div>
                </div>
            )}
        </div>

        <MbFooter />
    </div>;
}

function DesktopAccount({ session }: { session?: any }) {
    const [userBalance, setUserBalance] = useState<any>({});
    const [userPackages, setUserPackages] = useState<Array<any>>([]);
    const [expandedPackages, setExpandedPackages] = useState<{ [key: number]: boolean }>({});
    const [isBalanceExpanded, setIsBalanceExpanded] = useState<boolean>(true); // Default expanded for desktop
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

    const registerPackage = () => {
        router.push(`/packages/${params.id || session?.user?.id}`);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarDesktop session={session} />
            <div className="flex-1">
                <div className="container mx-auto px-6 py-8 max-w-6xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tài khoản của tôi</h1>
                        <p className="text-gray-600">Quản lý số dư và gói hội viên của bạn</p>
                    </div>

                    {/* Desktop Layout - Two columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Balance Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center cursor-pointer" onClick={toggleBalanceExpansion}>
                                    <div className="flex items-center mr-3">
                                        <Image src="/icons/CurrencyCircleDollar.svg" alt="Total Balance" width={20} height={20} className="mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-800">Tổng số dư</h2>
                                    </div>
                                    <Image
                                        src="/icons/CaretDown.svg"
                                        alt="Expand"
                                        width={16}
                                        height={16}
                                        className={`transform transition-transform ${isBalanceExpanded ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                                    onClick={depositMoney}
                                >
                                    <Image src="/icons/deposit.svg" alt="Nạp tiền" width={16} height={16} className="mr-2" />
                                    Nạp tiền
                                </button>
                            </div>

                            {/* Total Balance Display */}
                            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">
                                    {((userBalance.mainBalance || 0) + (userBalance.promoBalance || 0)).toLocaleString('vi-VN')} VND
                                </p>
                            </div>

                            {/* Balance Details */}
                            {isBalanceExpanded && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <h3 className="font-medium text-gray-800">Số dư chính</h3>
                                            </div>
                                            <p className="text-lg font-semibold text-green-600">
                                                {userBalance.mainBalance?.toLocaleString('vi-VN') || '0'} VND
                                            </p>
                                            {userBalance.mainBalanceExpiredDate && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Hết hạn: {new Date(userBalance.mainBalanceExpiredDate).toLocaleDateString('vi-VN')}
                                                </p>
                                            )}
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <h3 className="font-medium text-gray-800">Số dư khuyến mãi</h3>
                                            </div>
                                            <p className="text-lg font-semibold text-orange-600">
                                                {userBalance.promoBalance?.toLocaleString('vi-VN') || '0'} VND
                                            </p>
                                            {userBalance.promoBalanceExpiredDate && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Hết hạn: {new Date(userBalance.promoBalanceExpiredDate).toLocaleDateString('vi-VN')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Packages Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Gói hội viên</h2>
                                {userPackages && userPackages.length > 0 && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                                        <span className="text-sm text-gray-600">{userPackages.length} gói</span>
                                    </div>
                                )}
                            </div>

                            {userPackages && userPackages.length > 0 ? (
                                <div className="space-y-4">
                                    {userPackages.map((pkg, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Package Header */}
                                            <div
                                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                                onClick={() => togglePackageExpansion(index)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        {pkg.image && (
                                                            <div className="mr-3">
                                                                <Image src={pkg.image} alt="VIP Badge" width={20} height={20} />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3 className="font-medium text-gray-800">{pkg.packageDescription || 'Gói hội viên'}</h3>
                                                            <p className="text-sm text-gray-600">
                                                                {(pkg.remainingDiamondPosts || 0) +
                                                                    (pkg.remainingGoldPosts || 0) +
                                                                    (pkg.remainingSilverPosts || 0) +
                                                                    (pkg.remainingNormalPosts || 0)} tin còn lại
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Image
                                                        src="/icons/CaretDown.svg"
                                                        alt="Expand"
                                                        width={16}
                                                        height={16}
                                                        className={`transform transition-transform ${expandedPackages[index] ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Package Content */}
                                            {expandedPackages[index] && (
                                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                                        {pkg.remainingDiamondPosts !== undefined && (
                                                            <div className="bg-white p-3 rounded-lg text-center border">
                                                                <div className="text-lg mb-1">💎</div>
                                                                <div className="text-xs text-gray-600 mb-1">Kim Cương</div>
                                                                <div className="font-semibold text-gray-800">{pkg.remainingDiamondPosts}</div>
                                                            </div>
                                                        )}
                                                        {pkg.remainingGoldPosts !== undefined && (
                                                            <div className="bg-white p-3 rounded-lg text-center border">
                                                                <div className="text-lg mb-1">🥇</div>
                                                                <div className="text-xs text-gray-600 mb-1">Vàng</div>
                                                                <div className="font-semibold text-gray-800">{pkg.remainingGoldPosts}</div>
                                                            </div>
                                                        )}
                                                        {pkg.remainingSilverPosts !== undefined && (
                                                            <div className="bg-white p-3 rounded-lg text-center border">
                                                                <div className="text-lg mb-1">🥈</div>
                                                                <div className="text-xs text-gray-600 mb-1">Bạc</div>
                                                                <div className="font-semibold text-gray-800">{pkg.remainingSilverPosts}</div>
                                                            </div>
                                                        )}
                                                        {pkg.remainingNormalPosts !== undefined && (
                                                            <div className="bg-white p-3 rounded-lg text-center border">
                                                                <div className="text-lg mb-1">📄</div>
                                                                <div className="text-xs text-gray-600 mb-1">Thường</div>
                                                                <div className="font-semibold text-gray-800">{pkg.remainingNormalPosts}</div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {pkg.expiredDate && (
                                                        <p className="text-sm text-gray-500">
                                                            Hết hạn: {new Date(pkg.expiredDate).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="pt-4">
                                        <button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center transition-colors"
                                            onClick={registerPackage}
                                        >
                                            <Image src="/icons/plus.svg" alt="Đăng ký thêm" width={16} height={16} className="mr-2" />
                                            Đăng ký thêm gói
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mb-4">
                                        <p className="text-gray-600 mb-4">Bạn chưa đăng ký gói hội viên nào</p>
                                        <button
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto transition-colors"
                                            onClick={registerPackage}
                                        >
                                            <Image src="/icons/question.svg" alt="Đăng ký thêm" width={16} height={16} className="mr-2" />
                                            Tìm hiểu ngay
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* End User Packages Section */}
                    </div>
                    {/* End Desktop Layout - Two columns */}
                </div>
                {/* End container */}
            </div>
            {/* End flex-1 */}
            <DesktopFooter />
        </div>
    );
}