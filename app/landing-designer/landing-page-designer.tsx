"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NavBarDesktop from '../ui/desktop/navigation/nav-bar-desktop';
import DesktopFooter from '../ui/desktop/footer/desktop-footer';
import Button from '../ui/common/button/button';
import btnStyle from '../ui/common/button/btn.module.css';
import TextEditor from './components/text-editor';
import ImageManager from './components/image-manager';
import PagePreview from './components/page-preview';
import SaveDialog from './components/save-dialog';
import PortalPopup from '../ui/common/portal-popup/portal-popup';
import styles from './landing-page-designer.module.css';
import { v4 as uuidv4 } from 'uuid';

export interface LandingPageData {
    id?: string;
    title: string;
    address?: string;
    sections: LandingPageSection[];
    createdAt?: string;
    updatedAt?: string;
}

export interface LandingPageSection {
    id: string;
    type: 'text' | 'image' | 'text-image';
    order: number;
    content: {
        text?: string;
        imageUrl?: string;
        imageAlt?: string;
        layout?: 'left' | 'right' | 'center';
        backgroundColor?: string;
        textColor?: string;
        fontSize?: 'small' | 'medium' | 'large' | 'xl';
    };
}

export default function LandingPageDesigner() {
    const { data: session } = useSession();
    const router = useRouter();
    const [landingPageData, setLandingPageData] = useState<LandingPageData>({        
        id: uuidv4(), // Use UUID for unique ID generation
        title: '',
        address: '',
        sections: []
    });
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [saving, setSaving] = useState(false);

    const addSection = (type: 'text' | 'image' | 'text-image') => {
        const newSection: LandingPageSection = {
            id: uuidv4(),
            type,
            order: landingPageData.sections.length,
            content: {
                text: type !== 'image' ? 'Nhập nội dung của bạn...' : undefined,
                imageUrl: type !== 'text' ? '' : undefined,
                imageAlt: type !== 'text' ? '' : undefined,
                layout: 'left',
                backgroundColor: '#ffffff',
                textColor: '#333333',
                fontSize: 'medium'
            }
        };

        setLandingPageData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
        setActiveSection(newSection.id);
    };

    const updateSection = (sectionId: string, updates: Partial<LandingPageSection['content']>) => {
        setLandingPageData(prev => ({
            ...prev,
            sections: prev.sections.map(section => 
                section.id === sectionId 
                    ? { ...section, content: { ...section.content, ...updates } }
                    : section
            )
        }));
    };

    const deleteSection = (sectionId: string) => {
        setLandingPageData(prev => ({
            ...prev,
            sections: prev.sections
                .filter(section => section.id !== sectionId)
                .map((section, index) => ({ ...section, order: index }))
        }));
        setActiveSection(null);
    };

    const reorderSection = (sectionId: string, direction: 'up' | 'down') => {
        setLandingPageData(prev => {
            const sections = [...prev.sections];
            const index = sections.findIndex(s => s.id === sectionId);
            
            if (
                (direction === 'up' && index > 0) ||
                (direction === 'down' && index < sections.length - 1)
            ) {
                const swapIndex = direction === 'up' ? index - 1 : index + 1;
                [sections[index], sections[swapIndex]] = [sections[swapIndex], sections[index]];
                
                // Update order values
                sections.forEach((section, i) => {
                    section.order = i;
                });
            }
            
            return { ...prev, sections };
        });
    };

    const handleSave = () => {
        setShowSaveDialog(true);
    };

    const handleSaveConfirm = async (title: string, address: string, isPublic: boolean) => {
        setSaving(true);
        try {
            const response = await fetch('/api/landing-pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...landingPageData,
                    title,
                    address,
                    isPublic
                })
            });

            if (response.ok) {
                const result = await response.json();
                setLandingPageData(prev => ({ ...prev, id: result.id, title, address }));
                setShowSuccessPopup(true);
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi lưu trang. Vui lòng thử lại.');
        } finally {
            setSaving(false);
            setShowSaveDialog(false);
        }
    };

    return (
        <div className={styles.container}>
            <NavBarDesktop session={session} />
            
            <div className={styles.designerLayout}>
                {/* Left Sidebar - Controls */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarContent}>
                        <h2>Thiết kế trang</h2>
                        
                        <div className={styles.titleInput}>
                            <label>Tiêu đề trang:</label>
                            <input
                                type="text"
                                value={landingPageData.title}
                                onChange={(e) => setLandingPageData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề trang..."
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.addressInput}>
                            <label>Địa chỉ dự án:</label>
                            <input
                                type="text"
                                value={landingPageData.address}
                                onChange={(e) => setLandingPageData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Nhập địa chỉ dự án..."
                                className={styles.input}
                            />
                        </div>


                        <div className={styles.addSectionButtons}>
                            <h3>Thêm phần tử</h3>
                            <Button
                                text="Văn bản"
                                onClick={() => addSection('text')}
                                cssClass={[btnStyle.buttonSecondary, styles.addBtn]}
                            />
                            <Button
                                text="Hình ảnh"
                                onClick={() => addSection('image')}
                                cssClass={[btnStyle.buttonSecondary, styles.addBtn]}
                            />
                            <Button
                                text="Văn bản + Hình ảnh"
                                onClick={() => addSection('text-image')}
                                cssClass={[btnStyle.buttonSecondary, styles.addBtn]}
                            />
                        </div>

                        <div className={styles.sectionList}>
                            <h3>Danh sách phần tử ({landingPageData.sections.length})</h3>
                            {landingPageData.sections.map((section, index) => (
                                <div
                                    key={section.id}
                                    className={`${styles.sectionItem} ${activeSection === section.id ? styles.active : ''}`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <span>{index + 1}. {section.type === 'text' ? 'Văn bản' : section.type === 'image' ? 'Hình ảnh' : 'Văn bản + Hình ảnh'}</span>
                                    <div className={styles.sectionControls}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); reorderSection(section.id, 'up'); }}
                                            disabled={index === 0}
                                            className={styles.controlBtn}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); reorderSection(section.id, 'down'); }}
                                            disabled={index === landingPageData.sections.length - 1}
                                            className={styles.controlBtn}
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                                            className={styles.deleteBtn}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Button
                                text={previewMode ? "Chỉnh sửa" : "Xem trước"}
                                onClick={() => setPreviewMode(!previewMode)}
                                cssClass={[btnStyle.buttonSecondary]}
                            />
                            <Button
                                text="Lưu trang"
                                onClick={handleSave}
                                cssClass={[btnStyle.buttonprimary]}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={styles.mainContent}>
                    {previewMode ? (
                        <PagePreview landingPageData={landingPageData} />
                    ) : (
                        <div className={styles.editorArea}>
                            {landingPageData.sections.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <h3>Chào mừng đến với trình thiết kế trang!</h3>
                                    <p>Bắt đầu bằng cách thêm phần tử từ thanh bên trái.</p>
                                </div>
                            ) : (
                                landingPageData.sections.map((section) => (
                                    <div
                                        key={section.id}
                                        className={`${styles.sectionEditor} ${activeSection === section.id ? styles.activeEditor : ''}`}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        {(section.type === 'text' || section.type === 'text-image') && (
                                            <TextEditor
                                                section={section}
                                                isActive={activeSection === section.id}
                                                onUpdate={(updates) => updateSection(section.id, updates)}
                                            />
                                        )}
                                        {(section.type === 'image' || section.type === 'text-image') && (
                                            <ImageManager
                                                section={section}
                                                isActive={activeSection === section.id}
                                                onUpdate={(updates) => updateSection(section.id, updates)}
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showSaveDialog && (
                <SaveDialog
                    currentTitle={landingPageData.title}
                    currentAddress={landingPageData.address || ''}
                    onSave={handleSaveConfirm}
                    onCancel={() => setShowSaveDialog(false)}
                    saving={saving}
                />
            )}

            {showSuccessPopup && (
                <PortalPopup 
                    overlayColor="rgba(113, 113, 113, 0.3)" 
                    placement="Centered"                    
                >
                    <div style={{
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        padding: '24px',
                        maxWidth: '320px',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ color: '#22c55e', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                                Lưu trang thành công!
                            </h3>
                            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
                                Trang landing của bạn đã được lưu thành công.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <button
                                onClick={() => {
                                    setShowSuccessPopup(false);
                                    setLandingPageData({                                        
                                        id: uuidv4(),
                                        title: '',
                                        address: '',
                                        sections: []
                                    });
                                    setActiveSection(null);
                                    setPreviewMode(false);
                                }}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Tạo trang mới
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccessPopup(false);
                                    router.push('/manage/landing-page');
                                }}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Quản lý tin đăng
                            </button>
                        </div>
                    </div>
                </PortalPopup>
            )}

            <DesktopFooter />
        </div>
    );
}