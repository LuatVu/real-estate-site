import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

export default function MbFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <Image 
                        alt="Nha Dep Qua!" 
                        width={100} 
                        height={25} 
                        src="/icons/nhadepqua_logo.svg"
                        className={styles.logo}
                    />
                    <p className={styles.companyDesc}>
                        Nền tảng bất động sản hàng đầu Việt Nam
                    </p>
                </div>

                {/* Quick Links Grid */}
                <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                        <h5 className={styles.columnTitle}>Danh mục</h5>
                        <Link href="/posts?query=&transactionType=SELL&page=1" className={styles.footerLink}>
                            Mua bán
                        </Link>
                        <Link href="/posts?query=&transactionType=RENT&page=1" className={styles.footerLink}>
                            Cho thuê
                        </Link>
                        <Link href="/posts?query=&transactionType=PROJECT&page=1" className={styles.footerLink}>
                            Dự án
                        </Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h5 className={styles.columnTitle}>Dịch vụ</h5>
                        <Link href="/upload-post" className={styles.footerLink}>
                            Đăng tin
                        </Link>
                        <Link href="/packages" className={styles.footerLink}>
                            Gói dịch vụ
                        </Link>
                        <Link href="/manage/posts" className={styles.footerLink}>
                            Quản lý tin
                        </Link>
                    </div>
                </div>

                {/* Contact Info */}
                <div className={styles.contactSection}>
                    <h5 className={styles.columnTitle}>Liên hệ</h5>
                    <div className={styles.contactGrid}>
                        <div className={styles.contactItem}>
                            <Image width={14} height={14} alt="Phone" src="/icons/phone.svg" />
                            <span>1900 123 456</span>
                        </div>
                        <div className={styles.contactItem}>
                            <Image width={14} height={14} alt="Email" src="/icons/mail.svg" />
                            <span>info@nhadepqua.com.vn</span>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className={styles.socialSection}>
                    <Link href="#" className={styles.socialLink}>
                        <Image width={24} height={24} alt="Facebook" src="/icons/facebook.svg" />
                    </Link>
                    <Link href="#" className={styles.socialLink}>
                        <Image width={24} height={24} alt="Twitter" src="/icons/twitter.svg" />
                    </Link>
                    <Link href="#" className={styles.socialLink}>
                        <Image width={24} height={24} alt="Instagram" src="/icons/instagram.svg" />
                    </Link>
                </div>

                {/* Copyright */}
                <div className={styles.copyright}>
                    <div className={styles.divider} />
                    <p className={styles.copyrightText}>Copyright © 2025 - nhadepqua.com.vn</p>
                </div>
            </div>
        </footer>
    );
}