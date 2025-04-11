"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';

export default function SignIn() {
    const screenSize = useScreenSize();
    return (
        <div>
            {screenSize === 'sm' ? (<MobileSignIn />) : (<DesktopSignIn />)}
        </div>
    );
}

function MobileSignIn() {
    return (
        <div className={styles.signIn}>
            <Image className={styles.headerImageIcon} width={393} height={151} alt="" src="/icons/Header_Image.png" />
            <div className={styles.loginFormContainer}>
                <div className={styles.loginFormTitle}>
                    <div className={styles.headingTitle}>Đăng nhập để tiếp tục</div>
                </div>
                <div className={styles.inputFieldsContainer}>
                    <div className={styles.inputFieldsContainerInner}>
                        <div className={styles.userParent}>
                            <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                            <div className={styles.placeHolder}>Số điện thoại</div>
                        </div>
                    </div>
                </div>
                <div className={styles.loginFormContainerInner}>
                    <div className={styles.frameParent}>
                        <div className={styles.userParent}>
                            <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/lockIcon.svg" />
                            <div className={styles.placeHolder}>Mật khẩu</div>
                        </div>
                        <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/eyeIcon.svg" />
                    </div>
                </div>
                <div className={styles.forgotPassword}>Quên mật khẩu?</div>
                <div className={styles.button}>
                    <div className={styles.placeHolder}>Đăng nhập</div>
                </div>
            </div>
            <div className={styles.dividerWithText}>
                <div className={styles.dividerText}>Hoặc</div>
                <div className={styles.dividerWithTextChild} />
                <div className={styles.dividerWithTextItem} />
            </div>
            <div className={styles.socialLoginContainer}>
                <div className={styles.button2}>
                    <Image className={styles.googleGLogosvg1Icon} width={12} height={12} alt="" src="/icons/googleIcon.svg" />
                    <div className={styles.placeHolder}>Tiếp tục với Google</div>
                </div>
                <div className={styles.button2}>
                    <Image className={styles.googleGLogosvg1Icon} width={12} height={12} alt="" src="/icons/facebookIcon.svg" />
                    <div className={styles.placeHolder}>Tiếp tục với Facebook</div>
                </div>
                <div className={styles.signUpPromptContainer}>
                    <span>
                        <span>{`Bạn chưa là thành viên? `}</span>
                        <span className={styles.ngK}>Đăng Ký</span>
                    </span>
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.footerChild} />
                <div className={styles.copyright2025}>Copyright © 2025 - nhadepqua.com.vn</div>
            </div>
        </div>
    );
}

function DesktopSignIn() {
    return (
        <h1>The Desktop SignIn</h1>
    );
}