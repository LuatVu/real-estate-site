"use client";
import { LandingPageData } from '../landing-page-designer';
import ReactMarkdown from 'react-markdown';
import styles from './page-preview.module.css';
import remarkBreaks from 'remark-breaks';

interface PagePreviewProps {
    landingPageData: LandingPageData;
}

export default function PagePreview({ landingPageData }: PagePreviewProps) {
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
                <div className={styles.previewMeta}>
                    <span>📱 Chế độ xem trước</span>
                </div>
            </div>

            <div className={styles.previewContent}>
                <div className={styles.landingPage}>
                    {landingPageData.title && (
                        <div className={styles.pageTitle}>
                            <h1>{landingPageData.title}</h1>
                        </div>
                    )}

                    {sortedSections.map((section) => (
                        <div
                            key={section.id}
                            className={styles.previewSection}
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
                                            fontSize: getFontSize(section.content.fontSize),
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
                                                className={styles.previewImage}
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
                                <div className={`${styles.textImageSection} ${getLayoutClass(section.content.layout)}`}>
                                    <div className={styles.textPart}>
                                        <div
                                            className={styles.textContent}
                                            style={{
                                                color: section.content.textColor || '#333333',
                                                fontSize: getFontSize(section.content.fontSize),
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
                                                className={styles.previewImage}
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
                        💡 Đây là bản xem trước. Trang thực tế có thể khác một chút tùy thuộc vào thiết bị của người xem.
                    </small>
                </div>
            </div>
        </div>
    );
}

function getFontSize(size?: string) {
    switch (size) {
        case 'small': return '14px';
        case 'medium': return '18px';
        case 'large': return '24px';
        case 'xl': return '32px';
        default: return '18px';
    }
}

function getLayoutClass(layout?: string) {
    switch (layout) {
        case 'left': return styles.textImageLeft;
        case 'right': return styles.textImageRight;
        default: return styles.textImageCenter;
    }
}