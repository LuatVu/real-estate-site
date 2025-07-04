"use client";
import useScreenSize from "../lib/useScreenSize";
import Image from "next/image";
import styles from './index.module.css';
import MbFooter from "../ui/mobile/footer/mb.footer";
import Button from "../ui/common/button/button";
import btnstyle from '../ui/common/button/btn.module.css';
import Link from 'next/link';
import Form from 'next/form';

export default function SignIn() {
    const screenSize = useScreenSize();
    return (
        <div className="h-full">
            {screenSize === 'sm' ? (<MobileSignIn />) : (<DesktopSignIn />)}
        </div>
    );
}

function MobileSignIn() {
    return (
        <div className="h-full">
            <div className={styles.container}>
                <div>
                    <Image className={styles.headerImageIcon} width={393} height={151} alt="" src="/icons/Header_Image.png" />
                </div>

                <Form className={styles.loginFormContainer} action="/sign-in-action">
                    <div className={styles.loginFormTitle}>
                        <p>Đăng nhập để tiếp tục</p>
                    </div>
                    <div className={styles.inputFieldsContainer}>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/useIcon.svg" />
                                <input className={styles.inputText} placeholder="Số điện thoại" />
                            </div>
                        </div>
                        <div className={styles.inputFieldsContainerInner}>
                            <div className={styles.userParent}>
                                <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/lockIcon.svg" />
                                <input className={styles.inputText} placeholder="Mật khẩu" type="password" />
                            </div>
                            <Image className={styles.userIcon} width={24} height={24} alt="" src="/icons/eyeIcon.svg" />
                        </div>
                    </div>
                    <div>
                        <Link href="/recover-passwod" className={styles.forgotPassword}>Quên mật khẩu?</Link>
                    </div>
                    <button type="submit" className={styles.btnSubmit}>Đăng nhập</button>
                </Form>
                <div className={styles.dividerWithText}>
                    <div className={styles.dividerWithTextItem} />
                    <div className={styles.dividerText}>Hoặc</div>
                    <div className={styles.dividerWithTextItem} />
                </div>
                <div className={styles.socialLoginContainer}>
                    <Button cssClass={[styles.button2, btnstyle.buttonsecondary]} text="Tiếp tục với Google" onClick={() => console.log("Click")} iconInFront="/icons/googleIcon.svg" />
                    <Button cssClass={[styles.button2, btnstyle.buttonsecondary]} text="Tiếp tục với Facebook" onClick={() => console.log("Click")} iconInFront="/icons/facebookIcon.svg" />
                    <div className={styles.signUpPromptParent}>
                        <div className={styles.signUpPrompt}>Bạn chưa là thành viên?</div>
                        <Link href="/sign-up" className={styles.ngK}>Đăng Ký</Link>
                    </div>
                </div>
                <MbFooter />
            </div>
        </div>

    );
}

function DesktopSignIn() {
    return (
        <h1>The Desktop SignIn</h1>
    );
}