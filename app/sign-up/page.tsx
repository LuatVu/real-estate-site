"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import MbFooter from "../ui/mobile/footer/mb.footer";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { validateVietnamesePhoneNumber, formatPhoneNumberInput, getCarrierDisplayName } from '../utils/phone-validation';

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
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formatted = formatPhoneNumberInput(value);
        setPhoneNumber(formatted);

        // Validate phone number
        const validation = validateVietnamesePhoneNumber(formatted);
        if (value.length === 0) {
            setPhoneError("");
            setIsPhoneValid(false);
        } else if (!validation.isValid) {
            setPhoneError(validation.message);
            setIsPhoneValid(false);
        } else {
            setPhoneError("");
            setIsPhoneValid(true);
        }
    };

    const handleContinue = () => {
        if (!phoneNumber) {
            setPhoneError("Vui lòng nhập số điện thoại");
            return;
        }

        const validation = validateVietnamesePhoneNumber(phoneNumber);
        if (!validation.isValid) {
            setPhoneError(validation.message);
            return;
        }

        // Phone is valid, continue to next step
        setError("");
        setStep(2);
    };
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
                {error && (
                    <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}
                {step === 1 && (<div className={styles.signUpForm}>
                    <div className={styles.signUpFormHeader}>
                        <p>Đăng ký tài khoản mới</p>
                    </div>
                    <div className={styles.signUpFormBody}>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input 
                                    className={`${styles.inputText} ${phoneError ? 'border-red-500' : isPhoneValid ? 'border-green-500' : ''}`}
                                    name="phoneNumber" 
                                    placeholder="Số điện thoại (0xxx xxx xxx)" 
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    maxLength={13} // Max length for formatted input
                                />
                            </div>
                        </div>
                        {phoneError && (
                            <div className="mt-1 text-red-500 text-sm px-2">
                                {phoneError}
                            </div>
                        )}
                        {isPhoneValid && phoneNumber && (
                            <div className="mt-1 text-green-600 text-sm px-2">
                                ✓ Số điện thoại hợp lệ {(() => {
                                    const validation = validateVietnamesePhoneNumber(phoneNumber);
                                    return validation.carrier ? `(${getCarrierDisplayName(validation.carrier)})` : '';
                                })()}
                            </div>
                        )}
                    </div>
                    <button 
                        className={`${styles.btnSubmit} ${!isPhoneValid ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
                        onClick={handleContinue}
                        disabled={!isPhoneValid}
                    >
                        Tiếp tục
                    </button>
                </div>)}
                {step === 2 && (<div className={styles.signUpForm}>
                    <div className={styles.signUpFormHeader}>
                        <p>Xác thực số điện thoại</p>
                    </div>
                    <div className={styles.signUpFormBody}>
                        <div className="text-center mb-4">
                            <p className="text-sm text-gray-600">
                                Mã xác thực đã được gửi đến số điện thoại
                            </p>
                            <p className="text-sm font-semibold text-blue-600 mt-1">
                                {phoneNumber}
                            </p>
                        </div>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input 
                                    className={styles.inputText}
                                    name="verificationCode" 
                                    placeholder="Nhập mã xác thực 6 chữ số"
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                />
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <button 
                                className="text-sm text-blue-600 hover:text-blue-500"
                                onClick={() => setStep(1)}
                            >
                                ← Quay lại thay đổi số điện thoại
                            </button>
                        </div>
                    </div>
                    <button onClick={() => setStep(3)} className={styles.btnSubmit + " hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"}>
                        Xác thực
                    </button>
                </div>)}
                {step === 3 && (<div className={styles.signUpForm}>
                    <div className={styles.signUpFormHeader}>
                        <p>Hoàn tất đăng ký</p>
                    </div>
                    <div className={styles.signUpFormBody}>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input className={styles.inputText} name="fullName" placeholder="Họ và tên" />
                            </div>
                        </div>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input className={styles.inputText} name="email" placeholder="Email (tùy chọn)" type="email" />
                            </div>
                        </div>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/lockIcon.svg" />
                                <input className={styles.inputText} name="password" placeholder="Mật khẩu" type="password" />
                            </div>
                        </div>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/lockIcon.svg" />
                                <input className={styles.inputText} name="confirmPassword" placeholder="Xác nhận mật khẩu" type="password" />
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <button 
                                className="text-sm text-blue-600 hover:text-blue-500"
                                onClick={() => setStep(2)}
                            >
                                ← Quay lại bước trước
                            </button>
                        </div>
                    </div>
                    <button className={styles.btnSubmit + " hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"}>
                        Hoàn tất đăng ký
                    </button>
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
                    <div className={styles.signUpPromptParent}>
                        <div className={styles.signUpPrompt}>Đã có tài khoản?</div>
                        <Link href="/sign-in" className={styles.ngK}>Đăng nhập</Link>
                    </div>    
                </div>
            </div>
            <MbFooter />
        </div>
    );
}

function DesktopSignUp() {
    const [step, setStep] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formatted = formatPhoneNumberInput(value);
        setPhoneNumber(formatted);

        // Validate phone number
        const validation = validateVietnamesePhoneNumber(formatted);
        if (value.length === 0) {
            setPhoneError("");
            setIsPhoneValid(false);
        } else if (!validation.isValid) {
            setPhoneError(validation.message);
            setIsPhoneValid(false);
        } else {
            setPhoneError("");
            setIsPhoneValid(true);
        }
    };

    const handleContinue = () => {
        if (!phoneNumber) {
            setPhoneError("Vui lòng nhập số điện thoại");
            return;
        }

        const validation = validateVietnamesePhoneNumber(phoneNumber);
        if (!validation.isValid) {
            setPhoneError(validation.message);
            return;
        }

        // Phone is valid, continue to next step
        setError("");
        setStep(2);
    };

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
    };

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
    };

    return (
        <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <Image width={200} height={80} alt="Logo" src="/icons/nhadepqua_logo.svg" className="mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Đăng ký</h2>
                    <p className="text-gray-600">Tạo tài khoản mới</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Số điện thoại
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    phoneError ? 'border-red-500' : isPhoneValid ? 'border-green-500' : 'border-gray-300'
                                }`}
                                placeholder="0xxx xxx xxx"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                maxLength={13}
                            />
                            {phoneError && (
                                <p className="mt-1 text-red-500 text-sm">{phoneError}</p>
                            )}
                            {isPhoneValid && phoneNumber && (
                                <p className="mt-1 text-green-600 text-sm">
                                    ✓ Số điện thoại hợp lệ {(() => {
                                        const validation = validateVietnamesePhoneNumber(phoneNumber);
                                        return validation.carrier ? `(${getCarrierDisplayName(validation.carrier)})` : '';
                                    })()}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleContinue}
                            disabled={!isPhoneValid}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                !isPhoneValid 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            Tiếp tục
                        </button>
                    </div>
                )}

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Hoặc</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Image
                                className="mr-2"
                                width={20}
                                height={20}
                                alt="Google"
                                src="/icons/googleIcon.svg"
                            />
                            {isLoading ? "Đang kết nối..." : "Tiếp tục với Google"}
                        </button>
                        
                        <button
                            onClick={handleFacebookSignIn}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Image
                                className="mr-2"
                                width={20}
                                height={20}
                                alt="Facebook"
                                src="/icons/facebookIcon.svg"
                            />
                            {isLoading ? "Đang kết nối..." : "Tiếp tục với Facebook"}
                        </button>
                        
                        <div className="text-center">
                            <span className="text-sm text-gray-600">Đã có tài khoản? </span>
                            <Link href="/sign-in" className="text-sm text-blue-600 hover:text-blue-500">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
