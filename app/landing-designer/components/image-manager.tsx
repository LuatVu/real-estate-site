"use client";
import { useState, useRef } from 'react';
import { LandingPageSection } from '../landing-page-designer';
import Button from '../../ui/common/button/button';
import btnStyle from '../../ui/common/button/btn.module.css';
import styles from './image-manager.module.css';

interface ImageManagerProps {
    section: LandingPageSection;
    isActive: boolean;
    onUpdate: (updates: Partial<LandingPageSection['content']>) => void;
}

export default function ImageManager({ section, isActive, onUpdate }: ImageManagerProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file hình ảnh.');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('landingPageId', section.id); // Pass landing page ID for backend association

            const response = await fetch('/api/media/upload-landing-image', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                onUpdate({ 
                    imageUrl: result.url,
                    imageAlt: file.name.split('.')[0] // Use filename without extension as default alt
                });
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ imageUrl: e.target.value });
    };

    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ imageAlt: e.target.value });
    };

    const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ layout: e.target.value as 'left' | 'right' | 'center' });
    };

    const removeImage = () => {
        onUpdate({ imageUrl: '', imageAlt: '' });
    };

    if (!isActive && section.content.imageUrl) {
        return (
            <div className={styles.inactiveImage}>
                <img 
                    src={section.content.imageUrl} 
                    alt={section.content.imageAlt || 'Landing page image'}
                    className={styles.previewImage}
                />
                <div className={styles.imageOverlay}>
                    <span>Nhấp để chỉnh sửa hình ảnh</span>
                </div>
            </div>
        );
    }

    if (!isActive && !section.content.imageUrl) {
        return (
            <div className={styles.inactiveEmpty}>
                <div className={styles.emptyImagePlaceholder}>
                    <div>📷</div>
                    <span>Nhấp để thêm hình ảnh</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.imageManagerContainer}>
            <div className={styles.imageManagerHeader}>
                <h4>Quản lý hình ảnh</h4>
            </div>

            <div className={styles.imageManagerContent}>
                {!section.content.imageUrl ? (
                    <div className={styles.uploadArea}>
                        <div 
                            className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? (
                                <div className={styles.uploadingState}>
                                    <div className={styles.spinner}></div>
                                    <span>Đang tải lên...</span>
                                </div>
                            ) : (
                                <div className={styles.dropzoneContent}>
                                    <div className={styles.uploadIcon}>📷</div>
                                    <div className={styles.uploadText}>
                                        <p>Kéo thả hình ảnh vào đây hoặc nhấp để chọn</p>
                                        <small>Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</small>
                                    </div>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className={styles.hiddenInput}
                        />

                        <div className={styles.orDivider}>
                            <span>hoặc</span>
                        </div>

                        <div className={styles.urlInput}>
                            <label>URL hình ảnh:</label>
                            <input
                                type="url"
                                value={section.content.imageUrl || ''}
                                onChange={handleUrlChange}
                                placeholder="https://example.com/image.jpg"
                                className={styles.input}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.imageEditor}>
                        <div className={styles.currentImage}>
                            <img 
                                src={section.content.imageUrl} 
                                alt={section.content.imageAlt || 'Landing page image'}
                                className={styles.editImage}
                            />
                            <div className={styles.imageActions}>
                                <Button
                                    text="Thay đổi"
                                    onClick={() => fileInputRef.current?.click()}
                                    cssClass={[btnStyle.buttonSecondary, styles.actionBtn]}
                                />
                                <Button
                                    text="Xóa"
                                    onClick={removeImage}
                                    cssClass={[btnStyle.buttonSecondary, styles.deleteBtn]}
                                />
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            className={styles.hiddenInput}
                        />

                        <div className={styles.imageSettings}>
                            <div className={styles.settingGroup}>
                                <label>Mô tả hình ảnh (ALT text):</label>
                                <input
                                    type="text"
                                    value={section.content.imageAlt || ''}
                                    onChange={handleAltChange}
                                    placeholder="Mô tả ngắn gọn về hình ảnh"
                                    className={styles.input}
                                />
                                <small className={styles.helpText}>
                                    Mô tả này giúp người khiếm thị và cải thiện SEO
                                </small>
                            </div>

                            <div className={styles.settingGroup}>
                                <label>Vị trí hiển thị:</label>
                                <select
                                    value={section.content.layout || 'center'}
                                    onChange={handleLayoutChange}
                                    className={styles.select}
                                >
                                    <option value="left">Trái</option>
                                    <option value="center">Giữa</option>
                                    <option value="right">Phải</option>
                                </select>
                            </div>

                            <div className={styles.settingGroup}>
                                <label>URL trực tiếp:</label>
                                <input
                                    type="url"
                                    value={section.content.imageUrl || ''}
                                    onChange={handleUrlChange}
                                    placeholder="https://example.com/image.jpg"
                                    className={styles.input}
                                />
                                <small className={styles.helpText}>
                                    Bạn có thể chỉnh sửa URL trực tiếp
                                </small>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}