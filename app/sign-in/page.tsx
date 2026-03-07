"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import MbFooter from "../ui/mobile/footer/mb.footer";
import Link from 'next/link';
import Form from 'next/form';
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
    const [inputText, setInputText] = useState({ type: "password", imagePath: "/icons/eyeIconClose.svg" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [formErrors, setFormErrors] = useState({ phoneNumber: "", password: "" });
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const router = useRouter();    

    const changeInputType = () => {
        if (inputText.type == 'password') {
            setInputText({ type: "text", imagePath: "/icons/EyeOpen.svg"});
        } else {
            setInputText({ type: "password", imagePath: "/icons/eyeIconClose.svg" });
        }
    }

const validateForm = () => {
        const errors = { phoneNumber: "", password: "" };
        let isValid = true;

        // Phone number validation
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
            errors.phoneNumber = "Số điện thoại không hợp lệ";
            isValid = false;
        }

        // Password validation
        if (!formData.password.trim()) {
            errors.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const signInHandle = async (formDataEvent: FormData) => {
        setIsFormSubmitting(true);
        setError("");
        
        if (!validateForm()) {
            setIsFormSubmitting(false);
            return;
        }

        try {
            const pn = formDataEvent.get('phoneNumber') as string;
            const phoneNumber = pn.replace(/\D/g, '');
            const password = formDataEvent.get('password');
            
            const result = await signIn("credentials", {
                redirect: false,
                phoneNumber: phoneNumber,
                password: password,
                callbackUrl: '/'
            });
            
            if(result?.error) {
                setError("Số điện thoại hoặc mật khẩu không đúng. Vui lòng thử lại.");
                console.log(result?.error);
            } else if (result?.ok) {
                router.push('/');
            }
        } catch (err) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            console.error("Sign-in error:", err);
        } finally {
            setIsFormSubmitting(false);
        }
    }

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");
        
        try {
            const result = await signIn("google", {
                redirect: false, // Don't redirect immediately to handle errors
                callbackUrl: '/'
            });
            
            if(result?.error){
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
            
            if(result?.error){
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

                <Form className={styles.loginFormContainer} action={signInHandle}>
                    <div className={styles.loginFormTitle}>
                        <h1>Đăng nhập để tiếp tục</h1>
                        <p className={styles.subtitle}>Chào mừng bạn quay trở lại!</p>
                    </div>
                    <div className={styles.inputFieldsContainer}>
                        <div className={`${styles.inputFieldsContainerInner} ${formErrors.phoneNumber ? styles.inputError : ''}`}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="user icon" src="/icons/useIcon.svg" />
                                <input 
                                    className={styles.inputText} 
                                    name="phoneNumber" 
                                    placeholder="Số điện thoại"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    aria-label="Số điện thoại"
                                    aria-invalid={!!formErrors.phoneNumber}
                                />
                            </div>
                            {formErrors.phoneNumber && (
                                <div className={styles.errorIcon}>
                                    <Image width={16} height={16} alt="error" src="/icons/error.svg" />
                                </div>
                            )}
                        </div>
                        {formErrors.phoneNumber && (
                            <div className={styles.errorMessage}>{formErrors.phoneNumber}</div>
                        )}
                        
                        <div className={`${styles.inputFieldsContainerInner} ${formErrors.password ? styles.inputError : ''}`}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="lock icon" src="/icons/lockIcon.svg" />
                                <input 
                                    className={styles.inputText} 
                                    name="password" 
                                    placeholder="Mật khẩu" 
                                    type={inputText.type}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    aria-label="Mật khẩu"
                                    aria-invalid={!!formErrors.password}
                                />
                            </div>
                            <button 
                                type="button" 
                                className={styles.eyeButton} 
                                onClick={changeInputType} 
                                aria-label={inputText.type === 'password' ? 'Hiển thị mật khẩu' : 'Ẩn mật khẩu'}
                            >
                                <Image className={styles.userIcon} width={24} height={24} alt="toggle password visibility" src={inputText.imagePath} />
                            </button>
                        </div>
                        {formErrors.password && (
                            <div className={styles.errorMessage}>{formErrors.password}</div>
                        )}
                    </div>
                    <div>
                        <Link href="/recover-password" className={styles.forgotPassword}>Quên mật khẩu?</Link>
                    </div>
                    <button 
                        type="submit" 
                        className={`${styles.btnSubmit} ${isFormSubmitting ? styles.btnLoading : ''}`}
                        disabled={isFormSubmitting}
                        aria-label="Đăng nhập"
                    >
                        {isFormSubmitting ? (
                            <>
                                <div className={styles.spinner}></div>
                                Đang đăng nhập...
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </Form>
                
                {error && (
                    <div className={styles.errorAlert}>
                        <Image width={20} height={20} alt="error" src="/icons/error.svg" />
                        <span>{error}</span>
                    </div>
                )}
                
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
                        <div className={styles.signUpPrompt}>Bạn chưa là thành viên?</div>
                        <Link href="/sign-up" className={styles.ngK}>Đăng Ký</Link>
                    </div>
                </div>
            </div>
            <MbFooter />
        </div>

    );
}

function DesktopSignIn() {
    const [inputText, setInputText] = useState({ type: "password", imagePath: "/icons/eyeIconClose.svg" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [formErrors, setFormErrors] = useState({ phoneNumber: "", password: "" });
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const router = useRouter();

    const changeInputType = () => {
        if (inputText.type == 'password') {
            setInputText({ type: "text", imagePath: "/icons/EyeOpen.svg"});
        } else {
            setInputText({ type: "password", imagePath: "/icons/eyeIconClose.svg" });
        }
    }

    const validateForm = () => {
        const errors = { phoneNumber: "", password: "" };
        let isValid = true;

        // Phone number validation
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
            errors.phoneNumber = "Số điện thoại không hợp lệ";
            isValid = false;
        }

        // Password validation
        if (!formData.password.trim()) {
            errors.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const signInHandle = async (formDataEvent: FormData) => {
        setIsFormSubmitting(true);
        setError("");
        
        if (!validateForm()) {
            setIsFormSubmitting(false);
            return;
        }

        try {
            const pn = formDataEvent.get('phoneNumber') as string;
            const phoneNumber = pn.replace(/\D/g, '');
            const password = formDataEvent.get('password');
            
            const result = await signIn("credentials", {
                redirect: false,
                phoneNumber: phoneNumber,
                password: password,
                callbackUrl: '/'
            });
            
            if(result?.error) {
                setError("Số điện thoại hoặc mật khẩu không đúng. Vui lòng thử lại.");
                console.log(result?.error);
            } else if (result?.ok) {
                router.push('/');
            }
        } catch (err) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            console.error("Sign-in error:", err);
        } finally {
            setIsFormSubmitting(false);
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");
        
        try {
            const result = await signIn("google", {
                redirect: false,
                callbackUrl: '/'
            });
            
            if(result?.error){
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
            
            if(result?.error){
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
                    <Form className={styles.desktopLoginForm} action={signInHandle}>
                        <div className={styles.desktopLoginTitle}>
                            <h1>Đăng nhập</h1>
                            <p>Nhập thông tin để tiếp tục</p>
                        </div>
                        
                        {error && (
                            <div className={styles.errorAlert}>
                                <Image width={20} height={20} alt="error" src="/icons/error.svg" />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className={styles.desktopInputFields}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Số điện thoại</label>
                                <div className={`${styles.inputWrapper} ${formErrors.phoneNumber ? styles.inputError : ''}`}>
                                    <Image className={styles.inputIcon} width={20} height={20} alt="user icon" src="/icons/useIcon.svg" />
                                    <input 
                                        className={styles.desktopInput} 
                                        name="phoneNumber" 
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        aria-label="Số điện thoại"
                                        aria-invalid={!!formErrors.phoneNumber}
                                    />
                                </div>
                                {formErrors.phoneNumber && (
                                    <div className={styles.errorMessage}>{formErrors.phoneNumber}</div>
                                )}
                            </div>
                            
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Mật khẩu</label>
                                <div className={`${styles.inputWrapper} ${formErrors.password ? styles.inputError : ''}`}>
                                    <Image className={styles.inputIcon} width={20} height={20} alt="lock icon" src="/icons/lockIcon.svg" />
                                    <input 
                                        className={styles.desktopInput} 
                                        name="password" 
                                        placeholder="Nhập mật khẩu" 
                                        type={inputText.type}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        aria-label="Mật khẩu"
                                        aria-invalid={!!formErrors.password}
                                    />
                                    <button 
                                        type="button" 
                                        className={styles.eyeButton} 
                                        onClick={changeInputType} 
                                        aria-label={inputText.type === 'password' ? 'Hiển thị mật khẩu' : 'Ẩn mật khẩu'}
                                    >
                                        <Image width={20} height={20} alt="toggle password visibility" src={inputText.imagePath} />
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <div className={styles.errorMessage}>{formErrors.password}</div>
                                )}
                            </div>
                        </div>
                        
                        <div className={styles.forgotPasswordWrapper}>
                            <Link href="/recover-password" className={styles.desktopForgotPassword}>Quên mật khẩu?</Link>
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`${styles.desktopBtnSubmit} ${isFormSubmitting ? styles.btnLoading : ''}`}
                            disabled={isFormSubmitting}
                            aria-label="Đăng nhập"
                        >
                            {isFormSubmitting ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                        
                        <div className={styles.dividerWithText}>
                            <div className={styles.dividerWithTextItem} />
                            <div className={styles.dividerText}>Hoặc</div>
                            <div className={styles.dividerWithTextItem} />
                        </div>
                        
                        <div className={styles.desktopSocialLogin}>
                            <button 
                                type="button"
                                className={styles.desktopBtnSecondary} 
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                <Image className={styles.searchIcon} width={20} height={20} alt="google" src="/icons/googleIcon.svg" />
                                {isLoading ? "Đang kết nối..." : "Tiếp tục với Google"}
                            </button>
                            <button 
                                type="button"
                                className={styles.desktopBtnSecondary}
                                onClick={handleFacebookSignIn}
                                disabled={isLoading}
                            >
                                <Image className={styles.searchIcon} width={20} height={20} alt="facebook" src="/icons/facebookIcon.svg" />
                                {isLoading ? "Đang kết nối..." : "Tiếp tục với Facebook"}
                            </button>
                        </div>
                        
                        <div className={styles.desktopSignUpPrompt}>
                            <span>Bạn chưa là thành viên? </span>
                            <Link href="/sign-up" className={styles.signUpLink}>Đăng Ký</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}