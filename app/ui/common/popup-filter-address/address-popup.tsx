import styles from "./filter-address.module.css";
import Image from "next/image";
import { useState } from "react";

interface City {
    code: string;
    name: string;
    image: string;
}

interface AddressFilterPopupProps {
    onClose: () => void;
    cities: City[];
    selectCity: (city: City) => void;
}

export default function AddressFilterPopup({ onClose, cities, selectCity }: AddressFilterPopupProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Function to remove Vietnamese accents
    const removeVietnameseAccents = (str: string) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    // Filter cities based on search term (with accent-insensitive matching)
    const filteredCities = cities.filter(city => {
        const normalizedCityName = removeVietnameseAccents(city.name.toLowerCase());
        const normalizedSearchTerm = removeVietnameseAccents(searchTerm.toLowerCase());
        return normalizedCityName.includes(normalizedSearchTerm);
    });

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    const handleCitySelect = (city: City) => {
        selectCity(city);
    };

    return (
        <div 
            className={styles.popUpFilterAddress}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-labelledby="address-popup-title"
            aria-modal="true"
        >
            <div className={styles.headerPopupAddress}>
                <div className={styles.khuVcParent}>
                    <h2 id="address-popup-title" className={styles.khuVc}>Chọn khu vực</h2>
                    <button 
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng popup"
                        title="Đóng popup"
                        className={styles.closeButton}
                    >
                        <Image className={styles.xIcon} width={24} height={24} alt="Đóng" src="/icons/X.svg" />
                    </button>
                </div>
            </div>
            
            <div className={styles.bodyPopup}>
                {/* Search Section */}
                <div className={styles.searchSection}>
                    <div className={styles.searchInputWrapper}>
                        <Image 
                            className={styles.searchIcon} 
                            width={16} 
                            height={16} 
                            alt="Search" 
                            src="/icons/search.svg" 
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tỉnh/thành phố..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                            aria-label="Tìm kiếm tỉnh thành"
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

                {/* Cities Grid */}
                <div className={styles.frameParent}>
                    {filteredCities.length > 0 ? (
                        filteredCities.map((element: City) => (
                            <button 
                                className={styles.cityCard} 
                                onClick={() => handleCitySelect(element)} 
                                key={element.code}
                                aria-label={`Chọn ${element.name}`}
                                title={`Chọn ${element.name}`}
                            >
                                <div className={styles.cityImageContainer}>
                                    <Image 
                                        src={element.image} 
                                        className={styles.cityImage} 
                                        alt={element.name} 
                                        width={157} 
                                        height={85} 
                                    />
                                    <div className={styles.imageOverlay}></div>
                                </div>
                                <div className={styles.cityNameContainer}>
                                    <span className={styles.cityName}>{element.name}</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            <p>Không tìm thấy tỉnh/thành phố nào phù hợp với "{searchTerm}"</p>
                        </div>
                    )}                    
                </div>
            </div>
        </div>
    );
}