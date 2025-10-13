import Image from 'next/image';
import Form from 'next/form';
import styles from './index.module.css'
import { useRouter } from 'next/navigation';
import { transformSearchRequest } from '@/app/utils/transform.param';
import { useState, useRef, useEffect } from 'react';

export default function SearchingSector({searchRequest, openFilterPopup, filterNum}: any) {  
    const router = useRouter(); 
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    async function search(formData: FormData) {
        setIsSearching(true);
        const query: any = formData.get('searchKeyword');
        
        // Create a new search request object instead of mutating
        const updatedSearchRequest = {
            ...searchRequest,
            query: query ? query : ""
        };
        
        const postSearchRequest = transformSearchRequest(updatedSearchRequest);                         
        // Navigate immediately without delay
        const newUrl = `/posts?${postSearchRequest}&page=1`;        
        router.push(newUrl);
        setIsSearching(false);
    }

    const handleInputFocus = () => {
        setIsSearchFocused(true);
    };

    const handleInputBlur = () => {
        setIsSearchFocused(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={styles.searchContainer}>
            <Form action={search} className={styles.searchingsession}>
                <div className={styles.searchFieldsParent}>
                    <div className={styles.searchFields}>
                        <div className={`${styles.frameParent} ${isSearchFocused ? styles.focused : ''}`}>
                            <div className={styles.searchIconContainer}>
                                <Image className={styles.searchIconLeft} width={20} height={20} alt="Search" src="/icons/searchBIcon.svg" />
                            </div>
                            <div className={styles.placeHolderWrapper}>
                                <input 
                                    ref={inputRef}
                                    name="searchKeyword" 
                                    className={styles.inputText} 
                                    placeholder="Tìm kiếm bất động sản..." 
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />
                                {searchValue && (
                                    <button 
                                        type="button" 
                                        className={styles.clearButton}
                                        onClick={handleClearSearch}
                                        aria-label="Clear search"
                                    >
                                        <Image width={16} height={16} alt="Clear" src="/icons/closeIcon.svg" />
                                    </button>
                                )}
                            </div>
                            
                            <div className={styles.filterGroupInline}>
                                <button 
                                    className={`${styles.filterButtonInline} ${filterNum > 0 ? styles.filterActiveInline : ''}`} 
                                    onClick={openFilterPopup}
                                    type="button"
                                    title={filterNum > 0 ? `${filterNum} bộ lọc đang áp dụng` : 'Mở bộ lọc'}
                                >
                                    <Image className={styles.funnelIconInline} width={18} height={18} alt="Filter" src="/icons/Funnel.svg" />
                                    {filterNum > 0 && (
                                        <div className={styles.filterBadgeInline}>
                                            <span className={styles.filterCountInline}>{filterNum}</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`${styles.searchButton} ${isSearching ? styles.searching : ''} ${searchValue.trim() ? styles.searchButtonActive : ''}`}
                                disabled={isSearching}
                                title={isSearching ? 'Đang tìm kiếm...' : 'Tìm kiếm bất động sản'}
                            >
                                {isSearching ? (
                                    <div className={styles.loadingContainer}>
                                        <div className={styles.loadingSpinner}></div>
                                        <span className={styles.loadingText}>Đang tìm...</span>
                                    </div>
                                ) : (
                                    <div className={styles.searchButtonContent}>
                                        <Image className={styles.searchIcon} width={20} height={20} alt="Search" src="/icons/search.svg" />
                                        {/* <span className={styles.searchButtonText}>Tìm</span> */}
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}