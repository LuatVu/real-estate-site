"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import MbFooter from "../ui/mobile/footer/mb.footer";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from 'next/link';

export default function SignUp() {
    const screenSize = useScreenSize();

    return (
        <div className="h-full">
            {screenSize === 'sm' ? (<MobileSignUp />) : (<DesktopSignUp />)}
        </div>
    );
}

function MobileSignUp() {
    const [step, setStep] = useState<number>(1);
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
                    <Image className={styles.headerImageIcon} width={393} height={151} alt="" src="/icons/Header_Image.png" />
                </div>
                {step === 1 && (<div className={styles.signUpForm}>
                    <div className={styles.signUpFormHeader}>
                        <p>Đăng ký tài khoản mới</p>
                    </div>
                    <div className={styles.signUpFormBody}>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input className={styles.inputText} name="account" placeholder="Số điện thoại" />
                            </div>
                        </div>
                    </div>
                    <button className={styles.btnSubmit + " hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"}>Tiếp tục</button>
                </div>)}
                {step === 2 && (<div className={styles.signUpForm}>

                </div>)}
                {step === 3 && (<div className={styles.signUpForm}>

                </div>)}
                <div className={styles.dividerWithText}>
                    <div className={styles.dividerWithTextItem} />
                    <div className={styles.dividerText}>Hoặc</div>
                    <div className={styles.dividerWithTextItem} />
                </div>
                <div className={styles.socialLoginContainer}>
                    <button
                        className={styles.btnSecondary}
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <Image className={styles.searchIcon} width={24} height={24} alt="google" src="/icons/googleIcon.svg" />
                        {isLoading ? "Đang kết nối..." : "Tiếp tục với Google"}
                    </button>
                    <button
                        className={styles.btnSecondary}
                        onClick={handleFacebookSignIn}
                        disabled={isLoading}
                    >
                        <Image className={styles.searchIcon} width={24} height={24} alt="facebook" src="/icons/facebookIcon.svg" />
                        {isLoading ? "Đang kết nối..." : "Tiếp tục với Facebook"}
                    </button>                    
                </div>
            </div>
            <MbFooter />
        </div>
    );
}

function DesktopSignUp() {
    return (
        <div className="hidden sm:block">
            <h1 className="text-center text-2xl font-bold mt-10">Sign Up Page</h1>
            <p className="text-center mt-4">This is the sign-up page for larger screens.</p>
        </div>
    );
}
