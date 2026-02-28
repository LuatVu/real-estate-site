"use client";
import useScreenSize from "./lib/useScreenSize";
import MobileHome from "./mobile-home/mobile-home";

export default function Home() {
  const screenSize = useScreenSize();
  return (
    <div className="h-full">
        {screenSize === 'sm' ? (<MobileHome />) : (<p>Home Page</p>)}
    </div>
  )
}
