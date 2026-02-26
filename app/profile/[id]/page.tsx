"use client";
import useScreenSize from "../../lib/useScreenSize";
import DownloadApp from "../../ui/mobile/download-app/mb.download";
import MbFooter from "../../ui/mobile/footer/mb.footer";
import NavBarMobile from "../../ui/mobile/navigation/nav-bar-mobile";
import { useSession } from 'next-auth/react';
import styles from './index.module.css';
import { useState, useEffect } from 'react';
import Form from 'next/form';
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Message } from "rsuite";

export default function Profile() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();
    return (
        <div className="flex flex-col min-h-screen">
            {screenSize === 'sm' ? (<MobileProfile session={session} />) : (<DesktopProfile session={session} />)}
        </div>
    );
}

function MobileProfile({ session }: { session?: any }) {
    const [tabBtnState, setTabBtnState] = useState({
        btnUpdateProfile: styles.tabButton + " " + styles.primaryBtn,
        btnChangePassword: styles.tabButton + " " + styles.secondaryBtn,
        isProfileTab: true
    });

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: session?.user?.username || '',
        address: '',
        idCard: '',
        taxId: ''
    });
    const [nameError, setNameError] = useState<string>('');
    const [passwordFields, setPasswordFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const params = useParams();
    const router = useRouter();
    const [message, setMessage] = useState<{ show: boolean; type: 'success' | 'error' | 'info' | 'warning'; content: string } | null>({
        show: false,
        type: 'success',
        content: ''
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        fileInput?.click();
    };

    // Password validation helpers
    const hasWhitespace = (str: string) => /\s/.test(str);
    const isStrongPassword = (str: string) =>
        /[a-z]/.test(str) &&
        /[A-Z]/.test(str) &&
        /[0-9]/.test(str) &&
        /[^A-Za-z0-9]/.test(str) &&
        str.length >= 8;

    const handlePasswordFieldChange = (field: string, value: string) => {
        setPasswordFields(prev => ({ ...prev, [field]: value }));
        let error = '';
        if (hasWhitespace(value)) {
            error = 'Không được chứa khoảng trắng';
        } else if ((field === 'newPassword' || field === 'confirmPassword') && value) {
            if (!isStrongPassword(value)) {
                error = 'Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt';
            }
        }
        
        // Special handling for confirmPassword to check if it matches newPassword
        if (field === 'confirmPassword') {
            const currentNewPassword = passwordFields.newPassword;
            if (value && currentNewPassword && value !== currentNewPassword) {
                error = 'Mật khẩu xác nhận không khớp';
            }
        }
        
        // If changing newPassword, also validate confirmPassword if it exists
        if (field === 'newPassword') {
            const currentConfirmPassword = passwordFields.confirmPassword;
            if (currentConfirmPassword && value !== currentConfirmPassword) {
                setPasswordErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }));
            } else if (currentConfirmPassword && value === currentConfirmPassword) {
                // Clear confirm password error if they now match
                let confirmError = '';
                if (hasWhitespace(currentConfirmPassword)) {
                    confirmError = 'Không được chứa khoảng trắng';
                } else if (!isStrongPassword(currentConfirmPassword)) {
                    confirmError = 'Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt';
                }
                setPasswordErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            }
        }
        
        setPasswordErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Validate name field
        if (field === 'name') {
            if (value.trim() === '') {
                setNameError('Họ tên không được để trống');
            } else {
                setNameError('');
            }
        }
    };

    const handleSubmit = async () => {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: params.id || session?.user?.id,
                authProvider: session?.provider,
                username: formData.name,
                address: formData.address,
                identificationCode: formData.idCard,
                taxId: formData.taxId,
                profilePicture: uploadedImage
            }),
        });
        if (!response.ok) {
            setMessage({
                show: true,
                type: 'error',
                content: 'Cập nhật thông tin cá nhân thất bại'
            });
            setTimeout(() => {
                setMessage(prev => prev ? ({ ...prev, show: false }) : null);
            }, 3000);
            return;
        }
        const data = await response.json();
        if (data.status === "200 OK") {
            setMessage({
                show: true,
                type: 'success',
                content: 'Cập nhật thông tin cá nhân thành công'
            });
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const currentPassword = passwordFields.currentPassword;
        const newPassword = passwordFields.newPassword;
        const confirmPassword = passwordFields.confirmPassword;

        if (newPassword.trim() === '') {
            setMessage({
                show: true,
                type: 'error',
                content: 'Mật khẩu mới không được để trống'
            });
            setTimeout(() => {
                setMessage(prev => prev ? ({ ...prev, show: false }) : null);
            }, 3000);
            return;
        }
        if (currentPassword.trim() === '') {
            setMessage({
                show: true,
                type: 'error',
                content: 'Mật khẩu hiện tại không được để trống'
            });
            setTimeout(() => {
                setMessage(prev => prev ? ({ ...prev, show: false }) : null);
            }, 3000);
            return;
        }

        if (confirmPassword.trim() === '') {
            setMessage({
                show: true,
                type: 'error',
                content: 'Mật khẩu xác nhận không được để trống'
            });
            setTimeout(() => {
                setMessage(prev => prev ? ({ ...prev, show: false }) : null);
            }, 3000);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({
                show: true,
                type: 'error',
                content: 'Mật khẩu xác nhận không khớp'
            });
            setTimeout(() => {
                setMessage(prev => prev ? ({ ...prev, show: false }) : null);
            }, 3000);
            return;
        }

        const response = await fetch('/api/users/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: params.id || session?.user?.id,
                oldPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }),
        });

        if (!response.ok) {
            setMessage({
                show: true,
                type: 'error',
                content: 'Đổi mật khẩu thất bại'
            });
            setTimeout(() => {
                setMessage(prev => prev ? ({ ...prev, show: false }) : null);
            }, 3000);
            return;
        }
        const data = await response.json();
        if (data.status === "200 OK") {
            setMessage({
                show: true,
                type: 'success',
                content: 'Đổi mật khẩu thành công'
            });
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
    }

    const isFormValid = formData.name.trim() !== '';

    function selectTab(tab: string) {
        if (tab === 'Profile') {
            setTabBtnState({
                btnUpdateProfile: styles.tabButton + " " + styles.primaryBtn,
                btnChangePassword: styles.tabButton + " " + styles.secondaryBtn,
                isProfileTab: true
            });
        } else {
            setTabBtnState({
                btnUpdateProfile: styles.tabButton + " " + styles.secondaryBtn,
                btnChangePassword: styles.tabButton + " " + styles.primaryBtn,
                isProfileTab: false
            });
        }
    }

    const fetchUserData = async () => {
        try {
            const userId = params.id || session?.user?.id;
            const response = await fetch(`/api/users/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (response.ok) {
                setFormData({
                    name: data.response.username || '',
                    address: data.response.address || '',
                    idCard: data.response.identificationCode || '',
                    taxId: data.response.taxId || ''
                });
                setUploadedImage(data.response.profilePicture || null);
            } else {
                console.error("Error fetching user data:", data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [session]);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarMobile displayNav={true} session={session} />
            {message && message.show && (
                <div className={styles.messageContainer}>
                    <Message
                        type={message.type}
                        showIcon={true}
                    >
                        {message.content}
                    </Message>
                </div>
            )}
            <div className={`${styles.profileContainer} flex-1`}>
                <div className={styles.profileHeader}>
                    <div className={styles.profileTitleSection}>
                        <div className={styles.profileIcon}>
                            👤
                        </div>
                        <div>
                            <h1 className={styles.profileTitle}>Thông tin cá nhân</h1>
                            <p className={styles.profileSubtitle}>Quản lý thông tin và tài khoản của bạn</p>
                        </div>
                    </div>
                    <div className={styles.tabContainer}>
                        <button name="btnUpdateProfile" className={tabBtnState.btnUpdateProfile} onClick={() => selectTab('Profile')}>
                            <span className={styles.tabIcon}>📝</span>
                            Chỉnh sửa thông tin
                        </button>
                        {session?.provider === "credentials" && (
                            <button name="btnChangePassword" className={tabBtnState.btnChangePassword} onClick={() => selectTab('Account')}>
                                <span className={styles.tabIcon}>🔒</span>
                                Cài đặt tài khoản
                            </button>
                        )}
                    </div>
                </div>
                {tabBtnState.isProfileTab ? (
                    <div className={styles.profileBody}>
                        <div className={styles.profileCard}>
                            <div className={styles.imageSection}>
                                <div className={styles.imageBlk}>
                                    <div className={styles.uploadImageContainer} onClick={handleUploadClick}>
                                        {uploadedImage ? (
                                            <img
                                                src={uploadedImage}
                                                alt="Profile"
                                                className={styles.uploadedImage}
                                            />
                                        ) : (
                                            <div className={styles.uploadImagePlaceholder}>
                                                <div className={styles.cameraIcon}>📷</div>
                                                <span className={styles.uploadText}>Tải ảnh lên</span>
                                            </div>
                                        )}
                                        <div className={styles.uploadOverlay}>
                                            <span className={styles.uploadOverlayText}>Thay đổi</span>
                                        </div>
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.imageHint}>
                                    <p>Ảnh đại diện giúp mọi người nhận diện bạn dễ dàng hơn</p>
                                </div>
                            </div>
                            <Form action={handleSubmit} className={styles.formContainer}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.formLabel}>
                                        <span className={styles.labelIcon}>👤</span>
                                        Họ tên <span className={styles.required}>*</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={`${styles.inputText} ${nameError ? styles.inputError : ''}`}
                                            type="text"
                                            id="name"
                                            name="name"
                                            defaultValue={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Nhập họ tên của bạn"
                                        />
                                    </div>
                                    {nameError && <span className={styles.errorMessage}>{nameError}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="address" className={styles.formLabel}>
                                        <span className={styles.labelIcon}>📍</span>
                                        Địa chỉ
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={styles.inputText}
                                            type="text"
                                            id="address"
                                            name="address"
                                            defaultValue={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Nhập địa chỉ của bạn"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="idCard" className={styles.formLabel}>
                                        <span className={styles.labelIcon}>🪪</span>
                                        Căn cước công dân
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={styles.inputText}
                                            type="text"
                                            id="idCard"
                                            name="idCard"
                                            defaultValue={formData.idCard}
                                            onChange={(e) => handleInputChange('idCard', e.target.value)}
                                            placeholder="Nhập số căn cước công dân"
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="taxId" className={styles.formLabel}>
                                        <span className={styles.labelIcon}>📊</span>
                                        Mã số thuế cá nhân
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            className={styles.inputText}
                                            type="text"
                                            id="taxId"
                                            name="taxId"
                                            defaultValue={formData.taxId}
                                            onChange={(e) => handleInputChange('taxId', e.target.value)}
                                            placeholder="Nhập mã số thuế cá nhân"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className={`${styles.submitBtn} ${!isFormValid ? styles.submitBtnDisabled : ''}`}
                                    disabled={!isFormValid}
                                >
                                    <span className={styles.buttonIcon}>💾</span>
                                    Lưu thay đổi
                                </button>
                            </Form>
                        </div>
                    </div>
                ) : (
                    <div className={styles.profileBody}>
                        <div className={styles.profileCard}>
                            <div className={styles.passwordHeader}>
                                <h2 className={styles.passwordTitle}>
                                    <span className={styles.passwordIcon}>🔐</span>
                                    Đổi mật khẩu
                                </h2>
                                <p className={styles.passwordSubtitle}>Bảo mật tài khoản với mật khẩu mạnh</p>
                            </div>
                        <form onSubmit={handlePasswordChange} className={styles.formContainer}>
                            <div className={styles.formGroup}>
                                <label htmlFor="currentPassword" className={styles.formLabel}>
                                    <span className={styles.labelIcon}>🔓</span>
                                    Mật khẩu hiện tại
                                </label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`${styles.inputText} ${passwordErrors.currentPassword ? styles.inputError : ''}`}
                                        type="password"
                                        id="currentPassword"
                                        value={passwordFields.currentPassword}
                                        onChange={e => handlePasswordFieldChange('currentPassword', e.target.value)}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        required
                                    />
                                </div>
                                {passwordErrors.currentPassword && <span className={styles.errorMessage}>{passwordErrors.currentPassword}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword" className={styles.formLabel}>
                                    <span className={styles.labelIcon}>🔒</span>
                                    Mật khẩu mới
                                </label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`${styles.inputText} ${passwordErrors.newPassword ? styles.inputError : ''}`}
                                        type="password"
                                        id="newPassword"
                                        value={passwordFields.newPassword}
                                        onChange={e => handlePasswordFieldChange('newPassword', e.target.value)}
                                        placeholder="Nhập mật khẩu mới"
                                        required
                                    />
                                </div>
                                {passwordErrors.newPassword && <span className={styles.errorMessage}>{passwordErrors.newPassword}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.formLabel}>
                                    <span className={styles.labelIcon}>✅</span>
                                    Xác nhận mật khẩu mới
                                </label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        className={`${styles.inputText} ${passwordErrors.confirmPassword ? styles.inputError : ''}`}
                                        type="password"
                                        id="confirmPassword"
                                        value={passwordFields.confirmPassword}
                                        onChange={e => handlePasswordFieldChange('confirmPassword', e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới"
                                        required
                                    />
                                </div>
                                {passwordErrors.confirmPassword && <span className={styles.errorMessage}>{passwordErrors.confirmPassword}</span>}
                            </div>
                            <div className={styles.passwordHintBox}>
                                <div className={styles.hintIcon}>💡</div>
                                <p className={styles.passwordHint}>Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
                            </div>
                            <button
                                type="submit"
                                className={`${styles.submitBtn} ${(passwordErrors.currentPassword || passwordErrors.newPassword || passwordErrors.confirmPassword || !passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) ? styles.submitBtnDisabled : ''}`}
                                disabled={Boolean(passwordErrors.currentPassword || passwordErrors.newPassword || passwordErrors.confirmPassword || !passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword)}
                            >
                                <span className={styles.buttonIcon}>🔄</span>
                                Đổi mật khẩu
                            </button>
                        </form>
                        </div>
                    </div>
                )}

            </div>
            <DownloadApp />
            <MbFooter />
        </div>
    );
}

function DesktopProfile({ session }: { session?: any }) {
    return (
        <div className={styles.desktopContainer}>
            <div className={styles.desktopHeader}>
                <div className={styles.desktopCard}>
                    <div className={styles.desktopIcon}>
                        💻
                    </div>
                    <h1 className={styles.desktopTitle}>Desktop Profile</h1>
                    <p className={styles.desktopSubtitle}>
                        Trang hồ sơ cá nhân được tối ưu hóa cho thiết bị di động. 
                        <br />Vui lòng sử dụng điện thoại để có trải nghiệm tốt nhất.
                    </p>
                    <div className={styles.desktopFeatures}>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>📱</span>
                            <span>Giao diện di động thân thiện</span>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>🔒</span>
                            <span>Bảo mật cao</span>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>⚡</span>
                            <span>Tải nhanh</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}