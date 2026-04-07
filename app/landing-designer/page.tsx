"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useScreenSize from "../lib/useScreenSize";
import LandingPageDesigner from './landing-page-designer';
import styles from './index.module.css';

export default function LandingDesignerPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const screenSize = useScreenSize();

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'loading') return; // Still loading
        if (!session) {
            router.push('/sign-in?redirect=/landing-designer');
            return;
        }
    }, [session]);

    // Only allow desktop access
    if (screenSize === 'sm' || screenSize === 'md') {
        return (
            <div className={styles.mobileBlock}>
                <div className={styles.mobileMessage}>
                    <h1>Thiết kế trang chủ</h1>
                    <p>Tính năng này chỉ khả dụng trên phiên bản desktop. Vui lòng truy cập từ màn hình lớn hơn.</p>
                </div>
            </div>
        );
    }

    // Show loading state
    if (status === 'loading' || !session) {
        return (
            <div className={styles.loading}>
                <div>Đang tải...</div>
            </div>
        );
    }

    return <LandingPageDesigner />;
}