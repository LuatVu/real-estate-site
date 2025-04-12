import styles from './btn.module.css';
import Image from 'next/image';

export default function Button({text, onClick, icon, cssClass}: any){    
    return (
        <button className={cssClass.join(" ") + " focus:ring-4 focus:outline-none focus:ring-gray-100 " + styles.btn} onClick={onClick}>
            {icon?<Image className={styles.searchIcon} width={12} height={12} alt="" src={icon}></Image>:""}
            {text}
        </button>
    )
}