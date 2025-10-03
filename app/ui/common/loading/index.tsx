import React from 'react';
import Image from 'next/image';
import styles from './loading.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  message, 
  fullScreen = false, 
  className = '' 
}) => {
  const sizeClasses = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  };

  const containerClass = fullScreen 
    ? `${styles.fullScreenContainer} ${className}` 
    : `${styles.container} ${className}`;

  return (
    <div className={containerClass}>
      <div className={`${styles.loadingContent} ${sizeClasses[size]}`}>
        <div className={styles.logoContainer}>
          <Image
            src="/icons/nhadepqua_logo.svg"
            alt="Nhà đẹp quá Loading"
            width={80}
            height={19}
            className={styles.logo}
            priority
          />
        </div>
        {message && (
          <p className={styles.message}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;