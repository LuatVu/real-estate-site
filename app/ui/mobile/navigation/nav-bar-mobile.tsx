import Image from "next/image";
import styles from './index.module.css';
import Button from '../../common/button/button';
import btnStyle from '../../common/button/btn.module.css';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';


export default function NavBarMobile({displayNav, session}: any){
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
		window.location.href = '/sign-in';
	};

  	return (
		<>
    		<div className={styles.navtypenavVisitor}>
                {displayNav?<Image className={styles.arrowarcleftIcon} width={24} height={24} alt="" src="/icons/ArrowArcLeft.svg" />: ""}
      			<Image className={styles.nhPParent} alt="Nha Dep Qua!" width={72} height={18} src="/icons/nhadepqua_logo.svg"/>
				<div className={styles.profileBlk}>
					{session?(
						<div 
							onClick={handleProfileClick}
							style={{ cursor: 'pointer' }}
						>
							<Image 
								alt="User profile" 
								className={styles.profilePicture} 
								width={36} 
								height={36} 
								src="/temp/avatar.jpg"
							/>
						</div>
					): (
						<Button 
							cssClass={[btnStyle.buttonprimary]} 
							text="Đăng nhập" 
							onClick={handleLoginClick} 
						/>
					)}					
				</div>      			
    		</div>

		{/* Profile Menu Popup */}
		{isProfileMenuOpen && session && (
			<>
				{/* Overlay */}
				<div 
					className={styles.menuOverlay}
					onClick={handleCloseMenu}
					style={{ backgroundColor: 'rgba(113, 113, 113, 0.3)' }} // Temporary red tint to see overlay
				/>
				
				{/* Menu */}
				<div className={styles.profileMenu} style={{ border: '2px solid var(--color-primary-p100)' }}>
					<div className={styles.profileMenuHeader}>
						<Image 
							className={styles.profileMenuAvatar} 
							width={48} 
							height={48} 
							alt="User Avatar" 
							src="/temp/avatar.jpg" 
						/>
						<div className={styles.profileMenuInfo}>
							<h3 className={styles.profileMenuName}>{session.user?.username || session.user?.name}</h3>
							<p className={styles.profileMenuEmail}>{session.user?.email}</p>
						</div>
					</div>						<div className={styles.profileMenuDivider}></div>
						
						<div className={styles.profileMenuItems}>
							<Link href="/profile" className={styles.profileMenuItem} onClick={handleCloseMenu}>
								<Image width={20} height={20} alt="Profile" src="/icons/useIcon.svg" />
								<span>Thông tin cá nhân</span>
							</Link>
							
							<Link href="/my-posts" className={styles.profileMenuItem} onClick={handleCloseMenu}>
								<Image width={20} height={20} alt="Posts" src="/icons/Building.svg" />
								<span>Tin đăng của tôi</span>
							</Link>
							
							<Link href="/favorites" className={styles.profileMenuItem} onClick={handleCloseMenu}>
								<Image width={20} height={20} alt="Favorites" src="/icons/BaseSquare.svg" />
								<span>Tin đã lưu</span>
							</Link>
							
							<Link href="/settings" className={styles.profileMenuItem} onClick={handleCloseMenu}>
								<Image width={20} height={20} alt="Settings" src="/icons/Funnel.svg" />
								<span>Cài đặt</span>
							</Link>
						</div>
						
						<div className={styles.profileMenuDivider}></div>
						
						<button className={styles.profileMenuSignOut} onClick={handleSignOut}>
							<Image width={20} height={20} alt="Sign Out" src="/icons/ArrowArcLeft.svg" />
							<span>Đăng xuất</span>
						</button>
					</div>
				</>
			)}
		</>
    );
};


