"use client";
import { LandingPageData } from '../landing-page-designer';
import ReactMarkdown from 'react-markdown';
import styles from './page-preview.module.css';
import remarkBreaks from 'remark-breaks';
import { useState } from 'react';

interface PagePreviewProps {
    landingPageData: LandingPageData;
}

type PreviewMode = 'desktop' | 'mobile';

export default function PagePreview({ landingPageData }: PagePreviewProps) {
    const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');

    if (landingPageData.sections.length === 0) {
        return (
            <div className={styles.emptyPreview}>
                <h3>Xem trước trang</h3>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🖼️</div>
                    <p>Trang chưa có nội dung để hiển thị.</p>
                    <p>Thêm phần tử từ thanh bên để bắt đầu thiết kế.</p>
                </div>
            </div>
        );
    }

    const sortedSections = [...landingPageData.sections].sort((a, b) => a.order - b.order);

    return (
        <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
                <h3>Xem trước: {landingPageData.title || 'Trang chưa có tiêu đề'}</h3>
                
                {/* Preview Mode Toggle */}
                <div className={styles.previewControls}>
                    <div className={styles.modeToggle}>
                        <button
                            className={`${styles.modeButton} ${previewMode === 'desktop' ? styles.active : ''}`}
                            onClick={() => setPreviewMode('desktop')}
                        >
                            🖥️ Desktop
                        </button>
                        <button
                            className={`${styles.modeButton} ${previewMode === 'mobile' ? styles.active : ''}`}
                            onClick={() => setPreviewMode('mobile')}
                        >
                            📱 Mobile
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${styles.previewContent} ${previewMode === 'mobile' ? styles.mobilePreview : styles.desktopPreview}`}>
                <div className={`${styles.landingPage} ${previewMode === 'mobile' ? styles.mobileLandingPage : styles.desktopLandingPage}`}>
                    {landingPageData.title && (
                        <div className={styles.pageTitle}>
                            <h1 className={previewMode === 'mobile' ? styles.mobileTitleText : styles.desktopTitleText}>
                                {landingPageData.title}
                            </h1>
                            {landingPageData.address && (
                                <div className={`${styles.pageAddress} ${previewMode === 'mobile' ? styles.mobileAddressText : styles.desktopAddressText}`}>
                                    {landingPageData.address}
                                </div>
                            )}
                        </div>
                    )}

                    {sortedSections.map((section) => (
                        <div
                            key={section.id}
                            className={`${styles.previewSection} ${previewMode === 'mobile' ? styles.mobileSectionSpacing : styles.desktopSectionSpacing}`}
                            style={{
                                backgroundColor: section.content.backgroundColor || '#ffffff'
                            }}
                        >
                            {section.type === 'text' && (
                                <div className={styles.textSection}>
                                    <div
                                        className={styles.textContent}
                                        style={{
                                            color: section.content.textColor || '#333333',
                                            fontSize: getFontSize(section.content.fontSize, previewMode),
                                            textAlign: section.content.layout as any
                                        }}
                                    >
                                        {section.content.text ? (
                                            <div className={styles.markdownContent}>
                                                <ReactMarkdown remarkPlugins={[remarkBreaks]}                                                    
                                                >
                                                    {section.content.text}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            'Nội dung văn bản...'
                                        )}
                                    </div>
                                </div>
                            )}

                            {section.type === 'image' && (
                                <div className={styles.imageSection}>
                                    {section.content.imageUrl ? (
                                        <div
                                            className={styles.imageContainer}
                                            style={{
                                                textAlign: section.content.layout as any
                                            }}
                                        >
                                            <img
                                                src={section.content.imageUrl}
                                                alt={section.content.imageAlt || 'Landing page image'}
                                                className={`${styles.previewImage} ${previewMode === 'mobile' ? styles.mobileImage : styles.desktopImage}`}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <div className={styles.placeholderIcon}>🖼️</div>
                                            <span>Hình ảnh chưa được thiết lập</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {section.type === 'text-image' && (
                                <div className={`${styles.textImageSection} ${getLayoutClass(section.content.layout)} ${previewMode === 'mobile' ? styles.mobileTextImage : ''}`}>
                                    <div className={styles.textPart}>
                                        <div
                                            className={styles.textContent}
                                            style={{
                                                color: section.content.textColor || '#333333',
                                                fontSize: getFontSize(section.content.fontSize, previewMode),
                                                textAlign: section.content.layout === 'center' ? 'center' : 'left'
                                            }}
                                        >
                                            {section.content.text ? (
                                                <div className={styles.markdownContent}>
                                                    <ReactMarkdown remarkPlugins={[remarkBreaks]}                                                        
                                                    >
                                                        {section.content.text}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                'Nội dung văn bản...'
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.imagePart}>
                                        {section.content.imageUrl ? (
                                            <img
                                                src={section.content.imageUrl}
                                                alt={section.content.imageAlt || 'Landing page image'}
                                                className={`${styles.previewImage} ${previewMode === 'mobile' ? styles.mobileImage : styles.desktopImage}`}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <div className={styles.placeholderIcon}>🖼️</div>
                                                <span>Chưa có hình ảnh</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.previewFooter}>
                <div className={styles.footerNote}>
                    <small>
                        💡 Đang xem ở chế độ {previewMode === 'desktop' ? 'Desktop' : 'Mobile'}. 
                        Trang thực tế có thể khác một chút tùy thuộc vào thiết bị của người xem.
                    </small>
                </div>
            </div>
        </div>
    );
}

function getFontSize(size?: string, mode: PreviewMode = 'desktop') {
    const baseSize = (() => {
        switch (size) {
            case 'small': return mode === 'mobile' ? 12 : 14;
            case 'medium': return mode === 'mobile' ? 15 : 18;
            case 'large': return mode === 'mobile' ? 20 : 24;
            case 'xl': return mode === 'mobile' ? 26 : 32;
            default: return mode === 'mobile' ? 15 : 18;
        }
    })();
    
    return `${baseSize}px`;
}

function getLayoutClass(layout?: string) {
    switch (layout) {
        case 'left': return styles.textImageLeft;
        case 'right': return styles.textImageRight;
        default: return styles.textImageCenter;
    }
}