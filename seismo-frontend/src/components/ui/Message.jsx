import { IoMdClose } from "react-icons/io";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

import { useEffect } from "react";

export default function Message({
  message,
  type = "success", // 'success' | 'error'
  autoDismiss = 5000, // false or duration in ms
  showCloseButton = true, // true | false
  onClose = () => {},
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

// ************

// <Message
//   message="An error occurred"
//   type="error"
//   position="center"
//   autoDismiss={false}
//   showCloseButton={true}
//   onClose={() => setShow(false)}
// />;

// export default function Message({
//   message = null,
//   type = "error",
//   position = "bottom-right",
//   autoDismiss = true,
//   showCloseButton = true,
//   onClose = null,
// }) {
//   const baseClass =
//     "flex flex-row items-center gap-4 transition-all duration-250vlg:w-92 p-8 z-40";
//   const positionMapping = {
//     "bottom-right": `bottom-4 end-4 ${
//       message ? "translate-y-0" : "-translate-y-80 lg:translate-y-80"
//     }`,
//   };
//   const positionClass = `fixed ${positionMapping[position]}`;
//   const textClass = `text-sm text-start font-semibold ${
//     type === "error" ? "text-error/80" : "text-success/80"
//   }`;
//   const styleClass = `border border-neutral-500/20 rounded-lg bg-base-300 shadow-2xl opacity-100`;
//   const globalClass = `${baseClass} ${positionClass} ${textClass} ${styleClass}`;

//   return (
//     <div
//       className={globalClass}
//       role="alert"
//       aria-live="assertive"
//       aria-atomic="true"
//     >
//       {showCloseButton && (
//         <button
//           className="btn btn-ghost btn-sm absolute end-1 top-1"
//           onClick={() => {
//             setError([]);
//             setSuccess(null);
//             if (successTimeoutRef.current) {
//               clearTimeout(successTimeoutRef.current);
//               successTimeoutRef.current = null;
//             }
//           }}
//           aria-label="Close message"
//         >
//           <IoMdClose />
//         </button>
//       )}
//       <div className="flex-grow-0 flex-shrink-0">
//         {type === "error" ? (
//           <MdError className="size-8 text-error" />
//         ) : (
//           <FaCheckCircle className="size-8 text-success" />
//         )}
//       </div>
//       <div className="flex-grow">
//         {type === "error" ? (
//           error.map((msg, i) => <p key={i}>{msg}</p>)
//         ) : (
//           <p>{success}</p>
//         )}
//       </div>
//     </div>
//   );
// }
