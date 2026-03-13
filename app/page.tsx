"use client";
import useScreenSize from "./lib/useScreenSize";
import MobileHome from "./mobile-home/mobile-home";
import DesktopHome from "./desktop-home/desktop-home";

export default function Home() {
  const screenSize = useScreenSize();
  return (
    <div className="h-full">
        {screenSize === 'sm' ? (<MobileHome />) : (<DesktopHome />)}
    </div>
  )
}
