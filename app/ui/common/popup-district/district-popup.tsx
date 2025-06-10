"use client";
import { useCallback, useState } from "react";
import styles from "./district-popup.module.css";
import Image from "next/image";
import Form from "next/form";

export default function DistrictPopup({ onClose, city, districtList, selectDistrict }: any) {
    const submit = () => {
        const selectedDistricts: any = [];
        districtList.forEach((element: any) => {
            if(element.checked){
                selectedDistricts.push(element);
            }
        });
        selectDistrict(selectedDistricts);
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
                        <button onClick={onClose}>
                            <Image className={styles.caretDown} width={16} height={16} alt="" src="/icons/CaretDown.svg" />
                        </button>                        
                    </div>
                </div>
                <div className={styles.itemBlock}>
                    {districtList.map((element:any) => (                        
                        <div className={styles.items} key={element.value}>
                            <div className={styles.textBlock}>
                                <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                                <p>{element.name}</p>
                            </div>
                            <div className={styles.checkboxBlock}>
                                <input type="checkbox" name={element.value} value={element.value} className={styles.checkbox} onChange={() => {element.checked = !element.checked}}/>
                            </div>
                        </div>
                    ))}            
                </div>
            </div>
            <div className={styles.footerPopup}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>
        </Form>
    );
}