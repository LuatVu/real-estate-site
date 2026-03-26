"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import NavBarDesktop from '../ui/desktop/navigation/nav-bar-desktop';
import DesktopFooter from '../ui/desktop/footer/desktop-footer';
import Button from '../ui/common/button/button';
import btnStyle from '../ui/common/button/btn.module.css';
import TextEditor from './components/text-editor';
import ImageManager from './components/image-manager';
import PagePreview from './components/page-preview';
import SaveDialog from './components/save-dialog';
import styles from './landing-page-designer.module.css';

export interface LandingPageData {
    id?: string;
    title: string;
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
    const [landingPageData, setLandingPageData] = useState<LandingPageData>({
        id: `lp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate ID upfront
        title: '',
        sections: []
    });
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [saving, setSaving] = useState(false);

    const addSection = (type: 'text' | 'image' | 'text-image') => {
        const newSection: LandingPageSection = {
            id: `section-${Date.now()}`,
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

    const handleSaveConfirm = async (title: string, isPublic: boolean) => {
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
                    isPublic
                })
            });

            if (response.ok) {
                const result = await response.json();
                setLandingPageData(prev => ({ ...prev, id: result.id, title }));
                alert('Trang đã được lưu thành công!');
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
                    onSave={handleSaveConfirm}
                    onCancel={() => setShowSaveDialog(false)}
                    saving={saving}
                />
            )}

            <DesktopFooter />
        </div>
    );
}