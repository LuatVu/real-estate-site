"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import MbFooter from "../ui/mobile/footer/mb.footer";
import Link from 'next/link';
import Form from 'next/form';
import { useState } from "react";
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
    const router = useRouter();

    const changeInputType = () => {
        if (inputText.type == 'password') {
            setInputText({ type: "text", imagePath: "/icons/EyeOpen.svg"});
        } else {
            setInputText({ type: "password", imagePath: "/icons/eyeIconClose.svg" });
        }
    }

    const signInHandle = async (formData: FormData) => {
        const userAccount = formData.get('account');
        const password = formData.get('password');
        console.log(userAccount + " - " + password);

        const result = await signIn("credentials", {
            redirect: true,
            email: userAccount,
            password: password,
            callbackUrl: '/'
        });
        if(result?.error){            
            console.log(result?.error);
        }
    }

    return (
        <div className="h-full">
            <div className={styles.container}>
                <div>
                    <Image className={styles.headerImageIcon} width={393} height={151} alt="" src="/icons/Header_Image.png" />
                </div>

                <Form className={styles.loginFormContainer} action={signInHandle}>
                    <div className={styles.loginFormTitle}>
                        <p>Đăng nhập để tiếp tục</p>
                    </div>
                    <div className={styles.inputFieldsContainer}>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input className={styles.inputText} name="account" placeholder="Số điện thoại / Email" />
                            </div>
                        </div>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/lockIcon.svg" />
                                <input className={styles.inputText} name="password" placeholder="Mật khẩu" type={inputText.type} />
                            </div>
                            <Image className={styles.userIcon} width={24} height={24} alt="" src={inputText.imagePath} onClick={changeInputType} />
                        </div>
                    </div>
                    <div>
                        <Link href="/recover-passwod" className={styles.forgotPassword}>Quên mật khẩu?</Link>
                    </div>
                    <button type="submit" className={styles.btnSubmit + " hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"}>Đăng nhập</button>
                </Form>
                <div className={styles.dividerWithText}>
                    <div className={styles.dividerWithTextItem} />
                    <div className={styles.dividerText}>Hoặc</div>
                    <div className={styles.dividerWithTextItem} />
                </div>
                <div className={styles.socialLoginContainer}>
                    <button className={styles.btnSecondary}><Image className={styles.searchIcon} width={24} height={24} alt="google" src="/icons/googleIcon.svg" onClick={() => "/sign-in/google"} />Tiếp tục với Google</button>
                    <button className={styles.btnSecondary}><Image className={styles.searchIcon} width={24} height={24} alt="facebook" src="/icons/facebookIcon.svg" onClick={() => "/sign-in/google"} />Tiếp tục với Facebook</button>
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
    return (
        <h1>The Desktop SignIn</h1>
    );
}