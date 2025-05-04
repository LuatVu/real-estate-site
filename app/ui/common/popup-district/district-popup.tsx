import styles from "./district-popup.module.css";
import Image from "next/image";

export default function DistrictPopup({ onClose }: any) {
    return (
        <div className={styles.districtContainer}>
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
                        <p>Bạn đang tìm tại:</p><p className={styles.dynamicTitle}>Hà Nội</p>
                        <button onClick={onClose}>
                            <Image className={styles.caretDown} width={16} height={16} alt="" src="/icons/CaretDown.svg" />
                        </button>                        
                    </div>
                </div>
                <div className={styles.itemBlock}>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                    <div className={styles.items}>
                        <div className={styles.textBlock}>
                            <Image className={styles.locationIcon} width={16} height={16} alt="" src="/icons/location.svg" />
                            <p>Quận Ba Đình</p>
                        </div>
                        <div className={styles.checkboxBlock}>
                            <input type="checkbox" name="" value="" className={styles.checkbox}/>
                        </div>
                    </div>
                </div>

            </div>
            <div className={styles.footerPopup}>
                <button className={styles.btnApply}>Áp dụng</button>
            </div>
        </div>
    );
}