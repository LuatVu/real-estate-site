"use client";
import { useCallback, useState, useEffect } from "react";
import styles from "./ward-popup.module.css";
import Image from "next/image";
import Form from "next/form";

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

    const [wards, setWards] = useState(initializeWardList());

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

    const submit = () => {
        const selectedWardsList: any = [];
        wards.forEach((element: any) => {
            if(element.checked){
                selectedWardsList.push(element);
            }
        });
        selectWard(selectedWardsList);
        onClose();
    }

    return (
        <Form action={submit} className={styles.districtContainer}>
            <div className={styles.headerPopupAddress}>
                <div className={styles.khuVcParent}>
                    <div className={styles.khuVc}>Địa phương</div>
                    <button onClick={onClose}>
                        <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg" />
                    </button>
                </div>
            </div>
            <div className={styles.bodyPopup}>
                <div className={styles.titleBlock}>
                    <div className={styles.title}>
                        <p>Bạn đang tìm tại:</p><p className={styles.dynamicTitle}>{city.name}</p>
                        <button onClick={back2Address}>
                            <Image className={styles.caretDown} width={16} height={16} alt="" src="/icons/CaretDown.svg" />
                        </button>                        
                    </div>
                </div>
                <div className={styles.itemBlock}>
                    {wards && wards.length > 0 ? (
                        wards.map((element:any) => (                        
                            <div className={styles.items} key={element.code}>
                                <div className={styles.textBlock}>
                                    <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                                    <p>{element.name}</p>
                                </div>
                                <div className={styles.checkboxBlock}>
                                    <input 
                                        type="checkbox" 
                                        name={element.name} 
                                        value={element.code} 
                                        className={styles.checkbox} 
                                        checked={element.checked}
                                        onChange={() => {
                                            setWards(prev => prev.map(ward => 
                                                ward.code === element.code 
                                                    ? { ...ward, checked: !ward.checked }
                                                    : ward
                                            ));
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.items}>
                            <p>Đang tải danh sách quận/huyện...</p>
                        </div>
                    )}            
                </div>
            </div>
            <div className={styles.footerPopup}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>
        </Form>
    );
}