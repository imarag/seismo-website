import { IoInformationCircleOutline } from "react-icons/io5";

export function AlertInfo({ children }) {
    return (
        <div 
            role="alert" 
            className="alert alert-info text-lg my-8 max-w-4xl mx-auto font-light"
        >
            <IoInformationCircleOutline />
            { children }
        </div>
    )
}