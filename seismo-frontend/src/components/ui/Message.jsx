import { IoMdClose } from "react-icons/io";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

import { useEffect } from "react";

export default function Message({
  message,
  type = "success", // 'success' | 'error'
  autoDismiss = 5000, // false or duration in ms
  showCloseButton = true, // true | false
  onClose = () => { },
  position = "bottom-right", // e.g. 'top-right', 'bottom-left', 'center'
}) {
  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(onClose, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose]);

  const getPositionClasses = () => {
    if (position === "top-left") {
      return "top-4 left-4";
    } else if (position === "top-right") {
      return "top-4 right-4";
    } else if (position === "bottom-left") {
      return "bottom-4 left-4";
    } else if (position === "bottom-right") {
      return "bottom-4 right-4";
    } else if (position === "center") {
      return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    } else {
      return "bottom-4 right-4";
    }
  };

  const bgColor =
    type === "success"
      ? "bg-green-100/90 text-green-800"
      : "bg-red-100/90 text-red-800";
  const Icon = type === "success" ? FaCheckCircle : MdError;

  return (
    <div
      className={`fixed lg:max-w-92 z-50 p-4 ms-4 rounded-lg shadow-lg flex items-center gap-3 ${bgColor} ${getPositionClasses()}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className="flex-shrink-0 flex-grow-0">
        <Icon className="text-xl" />
      </span>
      <span className="text-sm font-medium flex-grow">{message}</span>
      {showCloseButton && (
        <button
          className="btn btn-ghost ml-auto text-lg flex-shrink-0 flex-grow-0"
          onClick={onClose}
          aria-label="Close message"
        >
          <IoMdClose />
        </button>
      )}
    </div>
  );
}