"use client";
import useScreenSize from "../lib/useScreenSize";
import NavBarMobile from "../ui/mobile/navigation/nav-bar-mobile";
import MbFooter from "../ui/mobile/footer/mb.footer";
import style from "./index.module.css"

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const screenSize = useScreenSize();
    return (
        <div>
            {screenSize === 'sm' ? (<MobileHomePage children={children} />) : (<DesktopHomePage children={children}/>)}
        </div>
    );
}

function MobileHomePage({ children }: any) {
    return (                    
            <main>        
                <NavBarMobile displayNav={false}/>        
                    <div className={style.mainContent}>{children}</div>   
                <MbFooter />         
            </main>                    
    );
}

function DesktopHomePage({ children }: any) {
    return (
    <main>
        <div>{children}</div>
    </main>);
}

