import Image from "next/image";
import styles from './index.module.css';
import Button from '../../common/button/button';
import btnStyle from '../../common/button/btn.module.css';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function NavBarDesktop({ session }: any) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const router = useRouter();

    const handleProfileClick = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleCloseMenu = () => {
        setIsProfileMenuOpen(false);
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
        setIsProfileMenuOpen(false);
    };

    const handleLoginClick = () => {
        router.push('/sign-in');
    };

    const handleUploadPost = () => {
        router.push('/upload-post');
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <nav className={styles.desktopNav}>
            <div className={styles.navContainer}>
                {/* Navigation Links */}
                <div className={styles.navLinks}>
                    <Image 
                        className={styles.logo} 
                        alt="Nha Dep Qua!" 
                        width={120} 
                        height={30} 
                        src="/icons/nhadepqua_logo.svg"
                        onClick={handleLogoClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <Link href="/posts?query=&transactionType=SELL&page=1" className={styles.navLink}>
                        Mua bán
                    </Link>
                    <Link href="/posts?query=&transactionType=RENT&page=1" className={styles.navLink}>
                        Cho thuê
                    </Link>
                    <Link href="/posts?query=&transactionType=PROJECT&page=1" className={styles.navLink}>
                        Dự án
                    </Link>
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {session ? (
                        <div className={styles.userSection}>
                            <Button 
                                cssClass={[btnStyle.buttonprimary, styles.uploadBtn]} 
                                text="Đăng Tin" 
                                onClick={handleUploadPost} 
                            />
                            
                            <div className={styles.userProfile} onClick={handleProfileClick}>
                                {session.user?.picture ? (
                                    <img 
                                        className={styles.userAvatar} 
                                        width="80" 
                                        height="80"
                                        alt="User Avatar" 
                                        src={session.user?.picture}
                                    />
                                ) : (
                                    <img 
                                        className={styles.userAvatar} 
                                        width="80" 
                                        height="80"
                                        alt="User Avatar" 
                                        src="/temp/avatar.jpg" 
                                    />
                                )}
                                {/* <span className={styles.userName}>{session.user?.username || session.user?.name}</span>                                 */}
                            </div>

                            {/* Profile Dropdown */}
                            {isProfileMenuOpen && (
                                <>
                                    <div 
                                        className={styles.dropdownOverlay}
                                        onClick={handleCloseMenu}
                                    />
                                    <div className={styles.profileDropdown}>
                                        <div className={styles.dropdownHeader}>
                                            <div className={styles.dropdownUser}>
                                                <span className={styles.dropdownUserName}>
                                                    {session.user?.username || session.user?.name}
                                                </span>
                                                <span className={styles.dropdownUserEmail}>
                                                    {session.user?.email}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.dropdownDivider}></div>
                                        
                                        <div className={styles.dropdownItems}>
                                            <Link href={`/profile/${session.user?.id}`} className={styles.dropdownItem} onClick={handleCloseMenu}>
                                                <Image width={18} height={18} alt="Profile" src="/icons/useIcon.svg" />
                                                <span>Thông tin cá nhân</span>
                                            </Link>

                                            <Link href={`/account/${session.user?.id}`} className={styles.dropdownItem} onClick={handleCloseMenu}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="2"/>
                                                    <path d="M16 14h1.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2H8" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                                <span>Quản lý tài khoản</span>
                                            </Link>
                                            
                                            <Link href="/manage/posts" className={styles.dropdownItem} onClick={handleCloseMenu}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                                <span>Tin đăng của tôi</span>
                                            </Link>
                                            
                                            <Link href="/favorites" className={styles.dropdownItem} onClick={handleCloseMenu}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                                <span>Tin đã lưu</span>
                                            </Link>
                                        </div>
                                        
                                        <div className={styles.dropdownDivider}></div>
                                        
                                        <button className={styles.dropdownSignOut} onClick={handleSignOut}>
                                            <Image width={18} height={18} alt="Sign Out" src="/icons/ArrowArcLeft.svg" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={styles.guestSection}>
                            <Button 
                                cssClass={[btnStyle.buttonprimary, styles.loginBtn]} 
                                text="Đăng nhập" 
                                onClick={handleLoginClick} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}