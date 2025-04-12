"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import MbFooter from "../ui/mobile/footer/mb.footer";
import Button from "../ui/common/button/button";
import Submit from "../ui/common/button/submit";
import btnstyle from '../ui/common/button/btn.module.css';
import Link from 'next/link';

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
        <main>
            <div className={styles.signIn}>
                <Image className={styles.headerImageIcon} width={393} height={151} alt="" src="/icons/Header_Image.png" />
                <form className={styles.loginFormContainer} action="/sign-in-action">
                    <div className={styles.loginFormTitle}>
                        <div className={styles.headingTitle}>Đăng nhập để tiếp tục</div>
                    </div>
                    <div className={styles.inputFieldsContainer}>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input className={styles.inputText} placeholder="Số điện thoại"/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.loginFormContainerInner}>
                        <div className={styles.frameParent}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/lockIcon.svg" />
                                <input className={styles.inputText} placeholder="Mật khẩu" type="password"/>
                            </div>
                            <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/eyeIcon.svg" />
                        </div>
                    </div>
                    <Link href="/recover-passwod" className={styles.forgotPassword}>Quên mật khẩu?</Link>
                    <Submit text="Đăng nhập" cssClass={[styles.button, btnstyle.buttonprimary]} onClick={() => console.log("Click")} />
                </form>
                <div className={styles.dividerWithText}>
                    <div className={styles.dividerText}>Hoặc</div>
                    <div className={styles.dividerWithTextChild} />
                    <div className={styles.dividerWithTextItem} />
                </div>
                <div className={styles.socialLoginContainer}>
                    <Button cssClass={[styles.button2, btnstyle.buttonsecondary]} text="Tiếp tục với Google" onClick={() => console.log("Click")} icon="/icons/googleIcon.svg" />
                    <Button cssClass={[styles.button2, btnstyle.buttonsecondary]} text="Tiếp tục với Facebook" onClick={() => console.log("Click")} icon="/icons/facebookIcon.svg" />
                    <div className={styles.signUpPromptParent}>
                        <div className={styles.signUpPrompt}>Bạn chưa là thành viên?</div>
                        <Link href="/sign-up" className={styles.ngK}>Đăng Ký</Link>
                    </div>
                </div>
            </div>
            <MbFooter />
        </main>

    );
}

function DesktopSignIn() {
    return (
        <h1>The Desktop SignIn</h1>
    );
}