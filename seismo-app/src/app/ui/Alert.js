import { IoInformationCircleOutline } from "react-icons/io5";

export default  function AlertInfo({ type, children }) {
    return (
        <div 
            role={`${type}`} 
            className={`alert alert-${type} text-lg my-8 max-w-4xl mx-auto font-light`}
        >
            <IoInformationCircleOutline />
            { children }
        </div>
    )
}