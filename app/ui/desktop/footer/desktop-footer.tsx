import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';

export default function DesktopFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerContent}>
                    {/* Company Info */}
                    <div className={styles.footerSection}>
                        <div className={styles.logoSection}>
                            <Image 
                                alt="Nha Dep Qua!" 
                                width={120} 
                                height={30} 
                                src="/icons/nhadepqua_logo.svg"
                            />
                            <p className={styles.companyDesc}>
                                Nền tảng bất động sản hàng đầu Việt Nam, kết nối người mua và người bán bất động sản một cách hiệu quả và tin cậy.
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerTitle}>Danh mục</h4>
                        <ul className={styles.footerLinks}>
                            <li>
                                <Link href="/posts?query=&transactionType=SELL&page=1" className={styles.footerLink}>
                                    Mua bán
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts?query=&transactionType=RENT&page=1" className={styles.footerLink}>
                                    Cho thuê
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts?query=&transactionType=PROJECT&page=1" className={styles.footerLink}>
                                    Dự án
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerTitle}>Dịch vụ</h4>
                        <ul className={styles.footerLinks}>
                            <li>
                                <Link href="/upload-post" className={styles.footerLink}>
                                    Đăng tin
                                </Link>
                            </li>
                            <li>
                                <Link href="/packages" className={styles.footerLink}>
                                    Gói dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link href="/manage/posts" className={styles.footerLink}>
                                    Quản lý tin đăng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerTitle}>Hỗ trợ</h4>
                        <ul className={styles.footerLinks}>
                            <li>
                                <Link href="/help" className={styles.footerLink}>
                                    Trợ giúp
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className={styles.footerLink}>
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className={styles.footerLink}>
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className={styles.footerLink}>
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerTitle}>Thông tin liên hệ</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <Image width={16} height={16} alt="Phone" src="/icons/phone.svg" />
                                <span>1900 123 456</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Image width={16} height={16} alt="Email" src="/icons/mail.svg" />
                                <span>info@nhadepqua.com.vn</span>
                            </div>
                            <div className={styles.contactItem}>
                                <Image width={16} height={16} alt="Location" src="/icons/location.svg" />
                                <span>Hà Nội, Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        Copyright © 2025 - nhadepqua.com.vn. Tất cả quyền được bảo lưu.
                    </div>
                    <div className={styles.socialLinks}>
                        <Link href="#" className={styles.socialLink}>
                            <Image width={20} height={20} alt="Facebook" src="/icons/facebook.svg" />
                        </Link>
                        <Link href="#" className={styles.socialLink}>
                            <Image width={20} height={20} alt="Twitter" src="/icons/twitter.svg" />
                        </Link>
                        <Link href="#" className={styles.socialLink}>
                            <Image width={20} height={20} alt="Instagram" src="/icons/instagram.svg" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}