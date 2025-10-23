"use client";
import { useCallback, useState, useEffect } from "react";
import styles from "./ward-popup.module.css";
import Image from "next/image";
import Form from "next/form";

interface Ward {
    code: string;
    name: string;
    checked: boolean;
}

export default function WardPopup({ onClose, city, wardList, selectWard, selectedWards = [], back2Address }: any) {
    // Initialize ward list with proper checked state based on selectedWards
    const initializeWardList = () => {
        // Handle case where wardList might be undefined or empty
        if (!wardList || !Array.isArray(wardList)) {
            return [];
        }
        return wardList.map((ward: any) => ({
            ...ward,
            checked: selectedWards.some((selected: any) => selected.code === ward.code)
        }));
    };

    const [wards, setWards] = useState<Ward[]>(initializeWardList());
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    // Filter wards based on search term
    const filteredWards = wards.filter(ward => 
        ward.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Check if all filtered wards are selected
    const allWardsSelected = filteredWards.length > 0 && filteredWards.every(ward => ward.checked);
    const someWardsSelected = filteredWards.some(ward => ward.checked);

    // Update wards when wardList prop changes (for async loading)
    useEffect(() => {
        if (wardList && Array.isArray(wardList)) {
            const updatedWards = wardList.map((ward: any) => ({
                ...ward,
                checked: selectedWards.some((selected: any) => selected.code === ward.code)
            }));
            setWards(updatedWards);
        }
    }, [wardList, selectedWards]);

    const handleCheckAll = () => {
        const newCheckedState = !allWardsSelected;
        setWards(prev => prev.map(ward => {
            // Only change the checked state for wards that match the current filter
            if (filteredWards.some(filtered => filtered.code === ward.code)) {
                return { ...ward, checked: newCheckedState };
            }
            return ward;
        }));
    };

    const handleWardChange = (wardCode: string) => {
        setWards(prev => prev.map(ward => 
            ward.code === wardCode 
                ? { ...ward, checked: !ward.checked }
                : ward
        ));
    };

    const submit = () => {
        const selectedWardsList: any = [];
        wards.forEach((element: any) => {
            if(element.checked){
                selectedWardsList.push(element);
            }
        });
        selectWard(selectedWardsList);
        onClose();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
        // Focus search input when user starts typing
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const searchInput = document.querySelector('.ward-search-input') as HTMLInputElement;
            if (searchInput && document.activeElement !== searchInput) {
                searchInput.focus();
            }
        }
    };

    return (
        <Form 
            action={submit} 
            className={styles.districtContainer}
            onKeyDown={handleKeyDown}
            role="dialog" 
            aria-labelledby="ward-popup-title"
            aria-modal="true"
        >
            <div className={styles.headerPopupAddress}>
                <div className={styles.khuVcParent}>
                    <h2 id="ward-popup-title" className={styles.khuVc}>Địa phương</h2>
                    <button 
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng popup"
                        title="Đóng popup"
                    >
                        <Image className={styles.xIcon} width={24} height={24} alt="Đóng" src="/icons/X.svg" />
                    </button>
                </div>
            </div>
            <div className={styles.bodyPopup}>
                <div className={styles.titleBlock}>
                    <div className={styles.title}>
                        <button 
                            className={styles.cityButton} 
                            onClick={back2Address}
                            aria-label={`Quay lại chọn địa phương khác, hiện tại: ${city.name}`}
                            title="Nhấn để chọn tỉnh/thành phố khác"
                        >
                            <div className={styles.cityButtonContent}>
                                <div className={styles.locationSection}>
                                    <Image 
                                        className={styles.locationIcon} 
                                        width={16} 
                                        height={16} 
                                        alt="" 
                                        src="/icons/location.svg" 
                                    />
                                    <div className={styles.locationText}>
                                        <span className={styles.locationLabel}>Địa điểm:</span>
                                        <span className={styles.locationName}>{city.name}</span>
                                    </div>
                                </div>
                                <div className={styles.actionSection}>
                                    <span className={styles.changeText}>Thay đổi</span>
                                    <Image 
                                        className={styles.chevronIcon} 
                                        width={14} 
                                        height={14} 
                                        alt="" 
                                        src="/icons/CaretRight.svg" 
                                    />
                                </div>
                            </div>
                        </button>                        
                    </div>
                </div>
                
                {/* Search Section */}
                <div className={styles.searchSection}>
                    <div className={styles.searchInputWrapper}>
                        <Image 
                            className={styles.searchIcon} 
                            width={16} 
                            height={16} 
                            alt="Search" 
                            src="/icons/searchBIcon.svg" 
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm phường/xã..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${styles.searchInput} ward-search-input`}
                            aria-label="Tìm kiếm phường xã"
                            autoFocus
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                className={styles.clearSearch}
                                aria-label="Xóa tìm kiếm"
                            >
                                <Image 
                                    width={14} 
                                    height={14} 
                                    alt="Clear" 
                                    src="/icons/X.svg" 
                                />
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Check All Section */}
                {filteredWards && filteredWards.length > 0 && (
                    <div className={styles.checkAllSection}>
                        <label className={styles.checkAllItem} htmlFor="check-all-wards">
                            <div className={styles.textBlock}>
                                <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                                <p>Chọn tất cả ({filteredWards.length} phường/xã{searchTerm ? ` - "${searchTerm}"` : ""})</p>
                            </div>
                            <div className={styles.checkboxBlock}>
                                <input 
                                    type="checkbox" 
                                    id="check-all-wards"
                                    name="check-all" 
                                    className={styles.checkbox} 
                                    checked={allWardsSelected}
                                    ref={(input) => {
                                        if (input) input.indeterminate = someWardsSelected && !allWardsSelected;
                                    }}
                                    onChange={handleCheckAll}
                                />
                            </div>
                        </label>
                    </div>
                )}

                <div className={styles.itemBlock}>
                    {filteredWards && filteredWards.length > 0 ? (
                        filteredWards.map((element:any) => (                        
                            <label 
                                className={styles.items} 
                                key={element.code}
                                htmlFor={`ward-${element.code}`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleWardChange(element.code);
                                    }
                                }}
                            >
                                <div className={styles.textBlock}>
                                    <Image 
                                        className={styles.locationIcon} 
                                        width={16} 
                                        height={16} 
                                        alt={`${element.name} location`} 
                                        src="/icons/location.svg" 
                                    />
                                    <p>{element.name}</p>
                                </div>
                                <div className={styles.checkboxBlock}>
                                    <input 
                                        type="checkbox"
                                        id={`ward-${element.code}`}
                                        name={element.name} 
                                        value={element.code} 
                                        className={styles.checkbox} 
                                        checked={element.checked}
                                        onChange={() => handleWardChange(element.code)}
                                        aria-describedby={`ward-desc-${element.code}`}
                                    />
                                </div>
                            </label>
                        ))
                    ) : searchTerm ? (
                        <div className={styles.noResults}>
                            <p>Không tìm thấy phường/xã nào phù hợp với "{searchTerm}"</p>
                        </div>
                    ) : wards.length === 0 ? (
                        <div className={styles.items}>
                            <p>Đang tải danh sách phường/xã...</p>
                        </div>
                    ) : null}            
                </div>
            </div>
            <div className={styles.footerPopup}>
                <button 
                    type="submit" 
                    className={styles.btnApply}
                    aria-label={`Áp dụng ${wards.filter(w => w.checked).length} phường/xã đã chọn`}
                >
                    Áp dụng ({wards.filter(w => w.checked).length})
                </button>
            </div>
        </Form>
    );
}