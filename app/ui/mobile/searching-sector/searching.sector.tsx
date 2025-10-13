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
                                <Image className={styles.searchIconLeft} width={20} height={20} alt="Search" src="/icons/search.svg" />
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
                            <button 
                                type="submit" 
                                className={`${styles.searchButton} ${isSearching ? styles.searching : ''}`}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <div className={styles.loadingSpinner}></div>
                                ) : (
                                    <Image className={styles.searchIcon} width={20} height={20} alt="Search" src="/icons/search.svg" />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.filterGroup}>
                        <button 
                            className={`${styles.filterButton} ${filterNum > 0 ? styles.filterActive : ''}`} 
                            onClick={openFilterPopup}
                            type="button"
                        >
                            <Image className={styles.funnelIcon} width={20} height={20} alt="Filter" src="/icons/Funnel.svg" />
                            <span className={styles.filterText}>Bộ lọc</span>
                            {filterNum > 0 && (
                                <div className={styles.filterBadge}>
                                    <span className={styles.filterCount}>{filterNum}</span>
                                </div>
                            )}
                        </button>
                        
                        {filterNum > 0 && (
                            <div className={styles.activeFiltersInfo}>
                                <span className={styles.activeFiltersText}>{filterNum} bộ lọc đang áp dụng</span>
                            </div>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
}