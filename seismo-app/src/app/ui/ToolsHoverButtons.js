'use client';
import Image from "next/image";
export default function ToolsHoverButtons({ onMouseEnter, icon, title }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded bg-base-100" onMouseEnter={onMouseEnter}>
        <Image src={icon} alt="button icon" />
        <p className="text-center font-semibold">{ title }</p>
    </div>
  )
}
