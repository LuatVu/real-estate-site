import Image from "next/image";
import styles from "./popup.module.css";
import Form from "next/form";
import { useState } from "react";

interface PropertyType {
    name: string;
    value: string;
    checked: boolean;
    image?: string;
}

interface PropertyTypePopupProps {
    onClose: () => void;
    selectProperType: (types: PropertyType[]) => void;
    selectedPropertyTypes?: PropertyType[];
}

export default function PropertyTypePopup({ 
    onClose, 
    selectProperType, 
    selectedPropertyTypes = [] 
}: PropertyTypePopupProps) {
    // Initialize property types with checked state based on selectedPropertyTypes
    const initializePropertyTypes = (): PropertyType[] => {
        const allTypes: PropertyType[] = [
            { name: "Tất cả nhà bán", value: "ALL", checked: false}, 
            { name: "Căn hộ chung cư", value: "CHCC", checked: false, image:"/icons/Building.svg" },
            { name: "Nhà riêng, biệt thự, nhà phố", value: "NHA_RIENG", checked: false, image: "/icons/HouseLine.svg" },
            { name: "Đất nền", value: "DAT_NEN", checked: false, image: "/icons/BaseSquare.svg" }, 
            { name: "Condotel", value: "CONDOTEL", checked: false, image: "/icons/Condotel.svg" },
            { name: "Kho, nhà xưởng", value: "KHO_NHA_XUONG", checked: false, image: "/icons/Warehouse.svg" }, 
            { name: "Bất động sản khác", value: "BDS_KHAC", checked: false, image: "/icons/OtherProperty.svg" }        
        ];

        // Mark as checked if the type is in selectedPropertyTypes
        return allTypes.map(type => ({
            ...type,
            checked: selectedPropertyTypes.some((selected: PropertyType) => selected.value === type.value)
        }));
    };

    const [properTypes, setProperTypes] = useState<PropertyType[]>(initializePropertyTypes());

    const submit = () => {
        const _selectedProperType: PropertyType[] = [];
        properTypes.forEach((element: PropertyType) => {
            // Exclude "ALL" checkbox from the values sent to API
            if(element.checked && element.value !== "ALL"){
                _selectedProperType.push(element);
            }
        });
        selectProperType(_selectedProperType);
        onClose();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    return (
        <Form 
            action={submit} 
            className={styles.container}
            onKeyDown={handleKeyDown}
            role="dialog" 
            aria-labelledby="property-type-title"
            aria-modal="true"
        >
            <div className={styles.headerPopup}>
                <div className={styles.loiBtNgSnParent}>
                    <h2 id="property-type-title" className={styles.loiBtNg}>Loại bất động sản</h2>
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
                {properTypes.map((element: PropertyType) => (
                    <label 
                        className={styles.frameParent} 
                        key={element.value}
                        htmlFor={`property-${element.value}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                const checkbox = document.getElementById(`property-${element.value}`) as HTMLInputElement;
                                checkbox?.click();
                            }
                        }}
                    >
                        <div className={styles.buildingapartmentParent}>
                            {element.image && (
                                <Image 
                                    className={styles.buildingapartmentIcon} 
                                    width={20} 
                                    height={20} 
                                    alt={`${element.name} icon`} 
                                    src={element.image} 
                                />
                            )}
                            <p>{element.name}</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input 
                                type="checkbox" 
                                id={`property-${element.value}`}
                                name={element.value} 
                                value={element.value} 
                                className={styles.checkbox} 
                                checked={element.checked}
                                aria-describedby={`desc-${element.value}`}
                                onChange={() => {
                                    if (element.value === "ALL") {
                                        // If ALL is clicked, check/uncheck all other checkboxes
                                        const newCheckedState = !element.checked;
                                        setProperTypes(prev => prev.map(type => ({
                                            ...type,
                                            checked: newCheckedState
                                        })));
                                    } else {
                                        // If individual item is clicked
                                        setProperTypes(prev => {
                                            const newTypes = prev.map(type => 
                                                type.value === element.value 
                                                    ? { ...type, checked: !type.checked }
                                                    : type
                                            );
                                            
                                            // Check if all non-ALL items are selected
                                            const nonAllTypes = newTypes.filter(type => type.value !== "ALL");
                                            const allSelected = nonAllTypes.every(type => type.checked);
                                            
                                            // Update ALL checkbox based on whether all items are selected
                                            return newTypes.map(type =>
                                                type.value === "ALL"
                                                    ? { ...type, checked: allSelected }
                                                    : type
                                            );
                                        });
                                    }
                                }} 
                            />
                        </div>                                                
                    </label>
                ))}

            </div>
            <div className={styles.footerPopup}>
                <button 
                    type="submit" 
                    className={styles.btnApply}
                    aria-label="Áp dụng các loại bất động sản đã chọn"
                >
                    Áp dụng
                </button>
            </div>
        </Form>);
}