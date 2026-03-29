import Image from 'next/image';
import Form from 'next/form';
import styles from './index.module.css'
import { useRouter } from 'next/navigation';
import { transformSearchRequest } from '@/app/utils/transform.param';
import { useState, useRef, useEffect } from 'react';

export default function SearchingSectorDesktop({searchRequest, openFilterPopup, filterNum}: any) {  
    const router = useRouter(); 
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState(searchRequest?.query || '');
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync searchValue with searchRequest prop
    useEffect(() => {
        if (searchRequest?.query !== undefined && searchRequest.query !== searchValue) {
            setSearchValue(searchRequest.query);
        }
    }, [searchRequest?.query]);
    
    async function search(formData: FormData) {
        setIsSearching(true);
        const query: any = formData.get('searchKeyword');
        
        // Preserve the current input value
        const currentQuery = query ? query : "";
        setSearchValue(currentQuery);
        
        // Create a new search request object instead of mutating
        const updatedSearchRequest = {
            ...searchRequest,
            query: currentQuery
        };
        
        const postSearchRequest = transformSearchRequest(updatedSearchRequest);                         
        if(updatedSearchRequest.transactionType === "PROJECT") {
            // Navigate immediately without delay
            const newUrl = `/landing-page?${postSearchRequest}&page=1`;
            router.push(newUrl);
        }else{
            // Navigate immediately without delay
            const newUrl = `/posts?${postSearchRequest}&page=1`;        
            router.push(newUrl);
        }
        setIsSearching(false);
    }

    const handleInputFocus = () => {
        setIsSearchFocused(true);
    };

    const handleInputBlur = () => {
        setIsSearchFocused(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchValue(newValue);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleAutoSubmit = () => {
        if (inputRef.current && inputRef.current.form) {
            // Ensure the input value is current before creating FormData
            if (inputRef.current.value !== searchValue) {
                inputRef.current.value = searchValue;
            }
            // Create FormData from the form
            const formData = new FormData(inputRef.current.form);
            // Trigger the search function
            search(formData);
        }
    };

    const handleInputSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        // When user selects text (like from autocomplete), check if it's a meaningful selection
        if (target.value.trim().length > 2 && target.selectionStart !== target.selectionEnd) {
            // Auto-submit immediately when text is selected
            handleAutoSubmit();
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle Enter key press
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAutoSubmit();
        }
        // Handle Tab key (often used to accept autocomplete suggestions)
        if (e.key === 'Tab' && searchValue.trim()) {
            handleAutoSubmit();
        }
    };

    return (
        <div className={styles.desktopSearchContainer}>
            <Form action={search} className={styles.desktopSearchForm}>
                <div className={styles.searchWrapper}>
                    <div className={`${styles.searchBox} ${isSearchFocused ? styles.focused : ''}`}>
                        <div className={styles.searchIcon}>
                            <Image width={24} height={24} alt="Search" src="/icons/searchBIcon.svg" />
                        </div>
                        
                        <div className={styles.inputWrapper}>
                            <input 
                                ref={inputRef}
                                name="searchKeyword" 
                                className={styles.searchInput} 
                                placeholder="Tìm kiếm theo địa điểm, dự án, hoặc từ khóa..." 
                                value={searchValue}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                onSelect={handleInputSelect}
                                onKeyDown={handleInputKeyDown}
                                autoComplete="on"
                            />
                            {searchValue && (
                                <button 
                                    type="button" 
                                    className={styles.clearSearchButton}
                                    onClick={handleClearSearch}
                                    aria-label="Clear search"
                                >
                                    <Image width={20} height={20} alt="Clear" src="/icons/closeIcon.svg" />
                                </button>
                            )}
                        </div>
                        
                        <div className={styles.filterGroupInline}>
                            <button 
                                className={styles.filterButtonInline} 
                                onClick={openFilterPopup}
                                type="button"
                                title={filterNum > 0 ? `${filterNum} bộ lọc đang áp dụng` : 'Mở bộ lọc'}
                            >
                                <Image width={20} height={20} alt="Filter" src="/icons/Funnel.svg" />
                                {filterNum > 0 && (
                                    <div className={styles.filterBadgeInline}>
                                        <span className={styles.filterCountInline}>{filterNum}</span>
                                    </div>
                                )}
                            </button>
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`${styles.searchSubmitButton} ${isSearching ? styles.searching : ''}`}
                            disabled={isSearching}
                            title="Tìm kiếm"
                        >
                            {isSearching ? (
                                <div className={styles.loadingSpinner}></div>
                            ) : (
                                <Image width={20} height={20} alt="Search" src="/icons/search.svg" />
                            )}
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
}