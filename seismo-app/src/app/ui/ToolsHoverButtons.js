'use client';
import Image from "next/image";
export default function ToolsHoverButtons({ onMouseEnter, icon, title }) {
  return (
    <div 
      className="w-36 flex flex-col gap-3 items-center justify-center p-2 rounded-lg  hover:shadow-lg bg-base-100" 
      onMouseEnter={onMouseEnter}
    >
        <Image src={icon} alt="button icon" />
        <p className="text-center font-semibold text-sm">{ title }</p>
    </div>
  )
}
