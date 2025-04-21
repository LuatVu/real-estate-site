import Image from "next/image";
import styles from './index.module.css';
import Button from '../../common/button/button';
import btnStyle from '../../common/button/btn.module.css';


export default function NavBarMobile({displayNav}: any){
  	return (
    		<div className={styles.navtypenavVisitor}>
                {displayNav?<Image className={styles.arrowarcleftIcon} width={24} height={24} alt="" src="/icons/ArrowArcLeft.svg" />: ""}
      			<Image className={styles.nhPParent} alt="Nha Dep Qua!" width={72} height={18} src="/icons/nhadepqua_logo.svg"/>
				<div className={styles.button}>
					<Button cssClass={[btnStyle.buttonprimary]} text="Đăng nhập" onClick={ () => console.log("Đăng Nhập CLick")} />      	
				</div>      			
    		</div>
    );
};


