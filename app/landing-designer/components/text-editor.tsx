"use client";
import { useState } from 'react';
import { LandingPageSection } from '../landing-page-designer';
import styles from './text-editor.module.css';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import remarkBreaks from 'remark-breaks';

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface TextEditorProps {
    section: LandingPageSection;
    isActive: boolean;
    onUpdate: (updates: Partial<LandingPageSection['content']>) => void;
}

export default function TextEditor({ section, isActive, onUpdate }: TextEditorProps) {
    const [isEditing, setIsEditing] = useState(false);

    const handleTextChange = (value?: string) => {
        const escapedText = autoEscapeMarkdownLists(value || '');
        onUpdate({ text: escapedText });
    };

    const handleStyleChange = (field: string, value: any) => {
        onUpdate({ [field]: value });
    };

    function removeEscapeCharacters(text: string): string {
        if (!text) return text;

        return text
            .replace(/\\([-+*])/g, '$1')  // Remove escape from unordered list markers
            .replace(/(\d+)\\\./g, '$1.'); // Remove escape from numbered list markers
    }

    // Add this function before the TextEditor component
    function autoEscapeMarkdownLists(text: string): string {
        if (!text) return text;

        // Split text into lines
        const lines = text.split('\n');

        // Process each line
        const processedLines = lines.map(line => {
            // Check if line starts with unordered list markers (-, +, *) followed by space
            const unorderedListRegex = /^(\s*)([-+*])(\s+)/;
            const unorderedMatch = line.match(unorderedListRegex);

            if (unorderedMatch) {
                // If it matches unordered list pattern, add escape character
                const [, indent, marker, space] = unorderedMatch;
                const restOfLine = line.slice(unorderedMatch[0].length);
                return `${indent}\\${marker}${space}${restOfLine}`;
            }

            // Check if line starts with numbered list markers (1., 2., etc.) followed by space
            const numberedListRegex = /^(\s*)(\d+\.)(\s+)/;
            const numberedMatch = line.match(numberedListRegex);

            if (numberedMatch) {
                // If it matches numbered list pattern, add escape character before the period
                const [, indent, marker, space] = numberedMatch;
                const restOfLine = line.slice(numberedMatch[0].length);
                const number = marker.slice(0, -1); // Remove the period
                return `${indent}${number}\\.${space}${restOfLine}`;
            }

            return line;
        });

        return processedLines.join('\n');
    }

    if (!isActive) {
        return (
            <div className={styles.inactiveText} onClick={() => setIsEditing(true)}>
                <div
                    style={{
                        color: section.content.textColor,
                        fontSize: getFontSize(section.content.fontSize),
                        textAlign: section.content.layout as any
                    }}
                >
                    {section.content.text ? (
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}
                        >
                            {section.content.text}
                        </ReactMarkdown>
                    ) : (
                        'Nhấp để chỉnh sửa văn bản...'
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.textEditorContainer}>
            <div className={styles.textEditorHeader}>
                <h4>Chỉnh sửa văn bản</h4>
            </div>

            <div className={styles.textEditorContent}>
                <div className={styles.textArea}>
                    <label>Nội dung (hỗ trợ Markdown):</label>
                    <div className={styles.mdEditorWrapper}>
                        <MDEditor
                            value={removeEscapeCharacters(section.content.text || '')}
                            onChange={handleTextChange}
                            preview="edit"
                            height={250}
                            data-color-mode="light"
                            style={{
                                backgroundColor: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                            }}
                        />
                    </div>
                    <div className={styles.markdownHint}>
                        <small>💡 Bạn có thể sử dụng Markdown: **đậm**, *nghiêng*, [liên kết](url), # tiêu đề, v.v.</small>
                    </div>
                </div>

                <div className={styles.styleControls}>
                    <div className={styles.controlRow}>
                        <div className={styles.controlGroup}>
                            <label>Căn chỉnh:</label>
                            <select
                                value={section.content.layout || 'left'}
                                onChange={(e) => handleStyleChange('layout', e.target.value)}
                                className={styles.select}
                            >
                                <option value="left">Trái</option>
                                <option value="center">Giữa</option>
                                <option value="right">Phải</option>
                            </select>
                        </div>

                        <div className={styles.controlGroup}>
                            <label>Cỡ chữ:</label>
                            <select
                                value={section.content.fontSize || 'medium'}
                                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                className={styles.select}
                            >
                                <option value="small">Nhỏ</option>
                                <option value="medium">Trung bình</option>
                                <option value="large">Lớn</option>
                                <option value="xl">Rất lớn</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.controlRow}>
                        <div className={styles.controlGroup}>
                            <label>Màu chữ:</label>
                            <div className={styles.colorInputWrapper}>
                                <input
                                    type="color"
                                    value={section.content.textColor || '#333333'}
                                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="text"
                                    value={section.content.textColor || '#333333'}
                                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                                    className={styles.colorText}
                                    placeholder="#333333"
                                />
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <label>Màu nền:</label>
                            <div className={styles.colorInputWrapper}>
                                <input
                                    type="color"
                                    value={section.content.backgroundColor || '#ffffff'}
                                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="text"
                                    value={section.content.backgroundColor || '#ffffff'}
                                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    className={styles.colorText}
                                    placeholder="#ffffff"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className={styles.preview}>
                    <label>Xem trước với định dạng:</label>
                    <div
                        className={styles.previewContent}
                        style={{
                            backgroundColor: section.content.backgroundColor,
                            color: section.content.textColor,
                            fontSize: getFontSize(section.content.fontSize),
                            textAlign: section.content.layout as any,
                            padding: '20px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            minHeight: '60px',                            
                        }}
                    >
                        {section.content.text ? (
                            <ReactMarkdown remarkPlugins={[remarkBreaks]}
                            >
                                {section.content.text}
                            </ReactMarkdown>
                        ) : (
                            'Nhập nội dung để xem trước...'
                        )}
                    </div>
                </div> */}

            </div>
        </div>
    );
}

function getFontSize(size?: string) {
    switch (size) {
        case 'small': return '14px';
        case 'medium': return '16px';
        case 'large': return '20px';
        case 'xl': return '28px';
        default: return '16px';
    }
}