import { TiInfo } from "react-icons/ti";
import { FaCircleInfo } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

const ICONS = {
    info: <FaCircleInfo />,
    warning: <TiInfo />,
    error: <MdError />,
    success: <FaCircleCheck />,
};

export default function AlertMessage({ type="info", children }) {
    return (
        <div role="alert" className={`alert alert-${type} flex items-center my-8`}>
            {ICONS[type]}
            <span>{children}</span>
        </div>
    );
}