import { FiAlertTriangle } from "react-icons/fi";

export default function SmallScreenToolAlert() {
  return (
    <div>
      <p className="flex flex-row items-center gap-4 my-4">
        <FiAlertTriangle />
        <span>Screen Too Small</span>
      </p>
      <p>
        For the best experience, please use this tool on a larger screen, such
        as a tablet, laptop, or desktop computer. Some features may not display
        or function properly on smaller mobile devices.
      </p>
    </div>
  );
}
