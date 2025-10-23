import Image from "next/image";
import styles from "./popup.module.css";
import Form from "next/form";
import { useState } from "react";

export default function PropertyTypePopup({ onClose, selectProperType, selectedPropertyTypes = [] }: any) {
    // Initialize property types with checked state based on selectedPropertyTypes
    const initializePropertyTypes = () => {
        const allTypes = [
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
            checked: selectedPropertyTypes.some((selected: any) => selected.value === type.value)
        }));
    };

    const [properTypes, setProperTypes] = useState(initializePropertyTypes());

    const submit = () => {
        const _selectedProperType:any = [];
        properTypes.forEach((element: any) => {
            // Exclude "ALL" checkbox from the values sent to API
            if(element.checked && element.value !== "ALL"){
                _selectedProperType.push(element);
            }
        });
        selectProperType(_selectedProperType);
        onClose();
    }
    return (
        <Form action={submit} className={styles.container}>
            <div className={styles.headerPopup}>
                <div className={styles.loiBtNgSnParent}>
                    <div className={styles.loiBtNg}>Loại bất động sản</div>
                    <button onClick={onClose}>
                        <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg" />
                    </button>
                </div>
            </div>
            <div className={styles.bodyPopup}>
                {properTypes.map((element: any) => (
                    <div className={styles.frameParent} key={element.value}>
                        <div className={styles.buildingapartmentParent}>
                            {element.image && (
                                <Image className={styles.buildingapartmentIcon} width={16} height={16} alt="" src={element.image} />
                            )}
                            <p>{element.name}</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input 
                                type="checkbox" 
                                name={element.value} 
                                value={element.value} 
                                className={styles.checkbox} 
                                checked={element.checked}
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
                    </div>
                ))}

            </div>
            <div className={styles.footerPopup}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>
        </Form>);
}