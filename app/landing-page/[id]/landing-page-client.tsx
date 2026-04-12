"use client";
import { useSession } from "next-auth/react";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { useState, useEffect } from 'react';
import styles from './landing-page.module.css';
import useScreenSize from '../../lib/useScreenSize';
import NavBarDesktop from "@/app/ui/desktop/navigation/nav-bar-desktop";
import NavBarMobile from "@/app/ui/mobile/navigation/nav-bar-mobile";
import MbFooter from "@/app/ui/mobile/footer/mb.footer";
import DesktopFooter from "@/app/ui/desktop/footer/desktop-footer";
import { Nav } from "rsuite";

interface LandingPageSection {
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

interface LandingPageData {
  id: string;
  title: string;
  address: string;
  sections: LandingPageSection[];
  isPublic: boolean;
}

interface LandingPageClientProps {
  landingPage: LandingPageData;
}

export default function LandingPageClient({ landingPage }: LandingPageClientProps) {
  const { data: session } = useSession();
  const screenSize = useScreenSize();

  return (
    <div className="h-full">
      {(screenSize === 'sm' || screenSize === 'md') ? (
        <LandingPageOnMobile
          landingPage={landingPage}
        />
      ) : (
        <LandingPageOnDesktop
          landingPage={landingPage}
        />
      )}
    </div>
  );
}
  
function LandingPageOnMobile({
  landingPage
}: {
  landingPage: LandingPageData;
}) {
  const { data: session } = useSession();
  if (!landingPage) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Landing Page Not Found</h1>
        <p className={styles.errorMessage}>The requested landing page could not be found.</p>
      </div>
    );
  }

  const sortedSections = [...landingPage.sections].sort((a, b) => a.order - b.order);
  const previewMode = 'mobile';

  return (
    <div className={styles.pageContainer}>
      <NavBarMobile session={session} />
      <div className={`${styles.previewContent} ${styles.mobilePreview}`}>
        <div className={`${styles.landingPage} ${styles.mobileLandingPage}`}>
          {/* Main Title and Address */}
          {landingPage.title && (
            <div className={styles.pageTitle}>
              <h1 className={previewMode === 'mobile' ? styles.mobileTitleText : styles.desktopTitleText}>
                {landingPage.title}
              </h1>
              {landingPage.address && (
                <div className={`${styles.pageAddress} ${previewMode === 'mobile' ? styles.mobileAddressText : styles.desktopAddressText}`}>
                  {landingPage.address}
                </div>
              )}
            </div>
          )}

          {/* Sections */}
          {sortedSections.map((section) => (
            <div
              key={section.id}
              className={`${styles.previewSection} ${styles.mobileSectionSpacing}`}
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
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
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
                        className={`${styles.previewImage} ${styles.mobileImage}`}
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
                <div className={`${styles.textImageSection} ${getLayoutClass(section.content.layout)} ${styles.mobileTextImage}`}>
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
                          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
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
                        className={`${styles.previewImage} ${styles.mobileImage}`}
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
      <MbFooter />
    </div>
  );
}

function LandingPageOnDesktop({
  landingPage
}: {
  landingPage: LandingPageData;
}) {
  const { data: session } = useSession();
  if (!landingPage) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Landing Page Not Found</h1>
        <p className={styles.errorMessage}>The requested landing page could not be found.</p>
      </div>
    );
  }

  const sortedSections = [...landingPage.sections].sort((a, b) => a.order - b.order);
  const previewMode = 'desktop';

  return (
    <div className={styles.pageContainer}>
      <NavBarDesktop session={session} />
      <div className={`${styles.previewContent} ${styles.desktopPreview}`}>
        <div className={`${styles.landingPage} ${styles.desktopLandingPage}`}>
          {/* Main Title and Address */}
          {landingPage.title && (
            <div className={styles.pageTitle}>
              <h1 className={styles.desktopTitleText}>
                {landingPage.title}
              </h1>
              {landingPage.address && (
                <div className={`${styles.pageAddress} ${styles.desktopAddressText}`}>
                  {landingPage.address}
                </div>
              )}
            </div>
          )}

          {/* Sections */}
          {sortedSections.map((section) => (
            <div
              key={section.id}
              className={`${styles.previewSection} ${styles.desktopSectionSpacing}`}
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
                        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
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
                        className={`${styles.previewImage} ${styles.desktopImage}`}
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
                        fontSize: getFontSize(section.content.fontSize, previewMode),
                        textAlign: section.content.layout === 'center' ? 'center' : 'left'
                      }}
                    >
                      {section.content.text ? (
                        <div className={styles.markdownContent}>
                          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
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
                        className={`${styles.previewImage} ${styles.desktopImage}`}
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
      <DesktopFooter />
    </div>
  );
}

function getFontSize(size?: string, mode: 'desktop' | 'mobile' = 'desktop') {
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