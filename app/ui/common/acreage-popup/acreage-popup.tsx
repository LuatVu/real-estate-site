"use client";
import styles from "./acreage-popup.module.css";
import Form from "next/form";
import Image from "next/image";
import { useState } from "react";
import RangeSlider from "../range-slider/range-slider";

export default function AcreagePopup({onClose, setRangeMethod, currentMinAcreage, currentMaxAcreage}: any){
    // Initialize with current values if they exist, otherwise use default [30, 100]
    const initializeAcreageRange = () => {
        if (currentMinAcreage !== undefined && currentMaxAcreage !== undefined) {
            return [currentMinAcreage, currentMaxAcreage];
        }
        if (currentMinAcreage !== undefined) {
            return [currentMinAcreage, 1000]; // Default max if only min is set
        }
        if (currentMaxAcreage !== undefined) {
            return [0, currentMaxAcreage]; // Default min if only max is set
        }
        return [30, 100]; // Default range
    };

    const [acreageRange, setAcreageRange] = useState(initializeAcreageRange());
    const submit = () =>{
        setRangeMethod(acreageRange);
        onClose();
    }

    return(
        <Form action={submit} className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Diện tích</div>
                <button onClick={onClose}>
                    <Image className={styles.xIcon} width={24} height={24} alt="" src="/icons/X.svg" />
                </button>
            </div>
            <div className={styles.bodyPopup}>                                    
                    <RangeSlider
                        label="Diện tích (m2)"
                        min={0}
                        max={1000}
                        step={10}
                        defaultMin={acreageRange[0]}
                        defaultMax={acreageRange[1]}
                        onChange={setAcreageRange}
                        prefix=""
                        suffix="m2"
                        minLabel="Diện tích tối thiểu"
                        maxLabel="Diện tích tối đa"
                    />                                    
            </div>
            <div className={styles.footer}>
                <button type="submit" className={styles.btnApply}>Áp dụng</button>
            </div>
        </Form>
    );
}