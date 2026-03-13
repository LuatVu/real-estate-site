"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import MbFooter from "../ui/mobile/footer/mb.footer";
import Link from 'next/link';

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const screenSize = useScreenSize();
    return (
        <div className="h-full">
            {screenSize === 'sm' ? (<MobileSignIn />) : (<DesktopSignIn />)}
        </div>
    );
}

function MobileSignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("google", {
                redirect: false, // Don't redirect immediately to handle errors
                callbackUrl: '/'
            });

            if (result?.error) {
                console.log("Google sign-in error:", result.error);
                if (result.error.includes("ENOTFOUND") || result.error.includes("network")) {
                    setError("Không thể kết nối đến Google. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.");
                } else {
                    setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
                }
            } else if (result?.ok) {
                // Successful sign-in, redirect manually
                window.location.href = result.url || '/';
            }
        } catch (err) {
            console.error("Google sign-in error:", err);
            setError("Không thể kết nối đến Google. Vui lòng kiểm tra kết nối mạng.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleFacebookSignIn = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("facebook", {
                redirect: false, // Don't redirect immediately to handle errors
                callbackUrl: '/'
            });

            if (result?.error) {
                console.log("Facebook sign-in error:", result.error);
                if (result.error.includes("ENOTFOUND") || result.error.includes("network")) {
                    setError("Không thể kết nối đến Facebook. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.");
                } else if (result.error.includes("OAuthAccountNotLinked")) {
                    setError("Tài khoản Facebook này đã được liên kết với một tài khoản khác.");
                } else {
                    setError("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
                }
            } else if (result?.ok) {
                // Successful sign-in, redirect manually
                window.location.href = result.url || '/';
            }
        } catch (err) {
            console.error("Facebook sign-in error:", err);
            setError("Không thể kết nối đến Facebook. Vui lòng kiểm tra kết nối mạng.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-full">
            <div className={styles.container}>
                <div>
                    <Image className={styles.headerImageIcon} width={393} height={151} alt="" src="/img/wallpaper.jpg" />
                </div>

                <div className={styles.loginFormContainer}>
                    <div className={styles.loginFormTitle}>
                        <h1>Đăng nhập để tiếp tục</h1>
                        <p className={styles.subtitle}>Chào mừng bạn quay trở lại!</p>
                    </div>

                    {error && (
                        <div className={styles.errorAlert}>
                            <Image width={20} height={20} alt="error" src="/icons/error.svg" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.socialLoginContainer}>
                        <button
                            className={styles.btnSubmit}
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <Image className={styles.searchIcon} width={24} height={24} alt="google" src="/icons/googleIcon.svg" />
                            {isLoading ? "Đang kết nối..." : "Tiếp tục với Google"}
                        </button>
                        <button
                            className={styles.btnSubmit}
                            onClick={handleFacebookSignIn}
                            disabled={isLoading}
                        >
                            <Image className={styles.searchIcon} width={24} height={24} alt="facebook" src="/icons/facebookIcon.svg" />
                            {isLoading ? "Đang kết nối..." : "Tiếp tục với Facebook"}
                        </button>
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.footerChild} />
                    <div className={styles.copyright2025}>Copyright © 2025 - nhadepqua.com.vn</div>
                </div>
            </div>
        </div>

    );
}

function DesktopSignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("google", {
                redirect: false,
                callbackUrl: '/'
            });

            if (result?.error) {
                console.log("Google sign-in error:", result.error);
                if (result.error.includes("ENOTFOUND") || result.error.includes("network")) {
                    setError("Không thể kết nối đến Google. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.");
                } else {
                    setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
                }
            } else if (result?.ok) {
                window.location.href = result.url || '/';
            }
        } catch (err) {
            console.error("Google sign-in error:", err);
            setError("Không thể kết nối đến Google. Vui lòng kiểm tra kết nối mạng.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleFacebookSignIn = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("facebook", {
                redirect: false,
                callbackUrl: '/'
            });

            if (result?.error) {
                console.log("Facebook sign-in error:", result.error);
                if (result.error.includes("ENOTFOUND") || result.error.includes("network")) {
                    setError("Không thể kết nối đến Facebook. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.");
                } else if (result.error.includes("OAuthAccountNotLinked")) {
                    setError("Tài khoản Facebook này đã được liên kết với một tài khoản khác.");
                } else {
                    setError("Đăng nhập Facebook thất bại. Vui lòng thử lại.");
                }
            } else if (result?.ok) {
                window.location.href = result.url || '/';
            }
        } catch (err) {
            console.error("Facebook sign-in error:", err);
            setError("Không thể kết nối đến Facebook. Vui lòng kiểm tra kết nối mạng.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.desktopContainer}>
            <div className={styles.desktopLeft}>
                <div className={styles.brandSection}>
                    <Image
                        className={styles.brandLogo}
                        width={300}
                        height={100}
                        alt="Logo"
                        src="/icons/nhadepqua_logo_white.svg"
                    />
                    <h2 className={styles.brandTitle}>Chào mừng trở lại!</h2>
                    <p className={styles.brandSubtitle}>Đăng nhập để khám phá hàng ngàn bất động sản chất lượng</p>
                </div>
                <div className={styles.featuresSection}>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🏡</div>
                        <span>Hàng ngàn bất động sản</span>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>🔍</div>
                        <span>Tìm kiếm thông minh</span>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>💼</div>
                        <span>Đăng tin miễn phí</span>
                    </div>
                </div>
            </div>

            <div className={styles.desktopRight}>
                <div className={styles.desktopFormContainer}>
                    <div className={styles.desktopLoginForm}>
                        <div className={styles.desktopLoginTitle}>
                            <h1>Đăng nhập</h1>
                            <p>Chọn phương thức đăng nhập</p>
                        </div>

                        {error && (
                            <div className={styles.errorAlert}>
                                <Image width={20} height={20} alt="error" src="/icons/error.svg" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className={styles.desktopSocialLogin}>
                            <button
                                type="button"
                                className={styles.desktopBtnSubmit}
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                <Image className={styles.searchIcon} width={20} height={20} alt="google" src="/icons/googleIcon.svg" />
                                {isLoading ? "Đang kết nối..." : "Tiếp tục với Google"}
                            </button>
                            <button
                                type="button"
                                className={styles.desktopBtnSubmit}
                                onClick={handleFacebookSignIn}
                                disabled={isLoading}
                            >
                                <Image className={styles.searchIcon} width={20} height={20} alt="facebook" src="/icons/facebookIcon.svg" />
                                {isLoading ? "Đang kết nối..." : "Tiếp tục với Facebook"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}