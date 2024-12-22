'use client';
import Image from "next/image";
export default function ToolsHoverButtons({ onMouseEnter, icon, title }) {

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" onMouseEnter={onMouseEnter}>
        <button className="rounded p-3">
            <Image src={icon} alt="button icon" />
        </button>
        <p className="text-center fw-semibold">{ title }</p>
    </div>
  )
}
