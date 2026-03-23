import Image from "next/image";
import styles from './index.module.css';
import Button from '../../common/button/button';
import btnStyle from '../../common/button/btn.module.css';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";


export default function NavBarMobile({displayNav, session}: any){
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const router = useRouter();

	const handleProfileClick = () => {
		console.log('Profile clicked, opening menu...');
		setIsProfileMenuOpen(true);
	};

	const handleCloseMenu = () => {
		console.log('Closing menu...');
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

	const handleBackClick = () => {
		window.history.back();
	};

	const handleLogoClick = () => {
		router.push('/');
	};

  	return (
		<>
    		<div className={styles.navtypenavVisitor}>
                {displayNav?<Image 
					className={styles.arrowarcleftIcon} 
					width={24} 
					height={24} 
					alt="Go back" 
					src="/icons/ArrowArcLeft.svg" 
					onClick={handleBackClick}
					style={{ cursor: 'pointer' }}
				/>: ""}
      			<Image 
					className={styles.nhPParent} 
					alt="Nha Dep Qua!" 
					width={72} 
					height={18} 
					src="/icons/nhadepqua_logo.svg"
					onClick={handleLogoClick}
					onTouchStart={handleLogoClick}
					style={{ cursor: 'pointer' }}
				/>
				<div className={styles.menuButtonContainer}>
					<div 
						className={styles.menuButton}
						onClick={handleProfileClick}
						 // Temporary debug border
					>
						<div className={styles.menuLine}></div>
						<div className={styles.menuLine}></div>
						<div className={styles.menuLine}></div>
					</div>
				</div>      			
    		</div>

		{/* Profile Menu Popup */}
		{isProfileMenuOpen && (
			<>
				{/* Overlay */}
				<div 
					className={styles.menuOverlay}
					onClick={handleCloseMenu}
					style={{ backgroundColor: 'rgba(113, 113, 113, 0.3)' }} // Temporary red tint to see overlay
				/>
				
				{/* Menu */}
				<div className={styles.profileMenu} style={{ border: '2px solid var(--color-primary-p100)' }}>
					{session ? (
						<>
							<div className={styles.profileMenuHeader}>
								{session.user?.picture?
								(<img 
									className={styles.profileMenuAvatar} 
									width="48" 
									height="48" 
									alt="User Avatar" 
									src={session.user?.picture}
								/>)
								:(<img 
									className={styles.profileMenuAvatar} 
									width="48" 
									height="48"
									alt="User Avatar" 
									src="/temp/avatar.jpg" 
								/>)}								
								<div className={styles.profileMenuInfo}>
									<h3 className={styles.profileMenuName}>{session.user?.username || session.user?.name}</h3>
									<p className={styles.profileMenuEmail}>{session.user?.email}</p>
								</div>
							</div>
							<div className={styles.uploadPostBtn}>
								<Button cssClass={[btnStyle.buttonprimary, styles.guestLoginButton]} text="Đăng Tin" onClick={handleUploadPost} />
							</div>
							<div className={styles.profileMenuDivider}></div>
							
							<div className={styles.profileMenuItems}>
								
								<Link href={`/profile/${session.user?.id}`} className={styles.profileMenuItem} onClick={handleCloseMenu}>
									<Image width={20} height={20} alt="Profile" src="/icons/useIcon.svg" />
									<span>Thông tin cá nhân</span>
								</Link>

								<Link href={`/account/${session.user?.id}`} className={styles.profileMenuItem} onClick={handleCloseMenu}>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<path d="M16 14h1.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<circle cx="19" cy="8" r="1" fill="currentColor"/>
										<path d="m15 14 2-2 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>Quản lý tài khoản</span>
								</Link>
								
								<Link href="/manage/posts" className={styles.profileMenuItem} onClick={handleCloseMenu}>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>Tin đăng của tôi</span>
								</Link>
								
								<Link href="/manage/favorites" className={styles.profileMenuItem} onClick={handleCloseMenu}>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									<span>Tin đã lưu</span>
								</Link>
							</div>
							
							<div className={styles.profileMenuDivider}></div>
							
							<button className={styles.profileMenuSignOut} onClick={handleSignOut}>
								<Image width={20} height={20} alt="Sign Out" src="/icons/ArrowArcLeft.svg" />
								<span>Đăng xuất</span>
							</button>
						</>
					) : (
						<div className={styles.profileMenuGuest}>
							<div className={styles.profileMenuGuestHeader}>
								<h3>Chào mừng!</h3>
								<p>Đăng nhập để trải nghiệm đầy đủ</p>
							</div>
							
							<div className={styles.profileMenuDivider}></div>
							
							<div className={styles.profileMenuGuestActions}>
								<Button 
									cssClass={[btnStyle.buttonprimary, styles.guestLoginButton]} 
									text="Đăng nhập" 
									onClick={handleLoginClick} 
								/>
								<Link href="/sign-up" className={styles.guestSignUpLink} onClick={handleCloseMenu}>
									Đăng ký tài khoản
								</Link>
							</div>
						</div>
					)}
				</div>
			</>
		)}
		</>
    );
};


