import styles from './btn.module.css';
import Image from 'next/image';

export default function Button({text, onClick, iconInFront, iconInBack,cssClass}: any){    
    return (
        <button className={cssClass.join(" ") + " focus:ring-4 focus:outline-none focus:ring-gray-100 " + styles.btn} onClick={onClick}>
            {iconInFront?<Image className={styles.searchIcon} width={24} height={24} alt="" src={iconInFront}></Image>:""}
            {text}
            {iconInBack?<Image className={styles.searchIcon} width={24} height={24} alt="" src={iconInBack}></Image>:""}
        </button>
    )
}