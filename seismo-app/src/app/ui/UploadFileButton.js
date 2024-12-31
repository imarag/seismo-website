import fetchRequest from "@/utils/functions/fetchRequest";
import { fastapiEndpoints } from "@/utils/static";
import { useRef } from "react";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { MdOutlineFileUpload } from "react-icons/md";


export default function UploadFileButton({setTraces, setError, setLoading, buttonClass}) {

    const inputRef = useRef();

    function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        
        fetchRequest({endpoint: fastapiEndpoints["UPLOAD-SEISMIC-FILE"], method: "POST", data: formData})
        .then(jsonData => {
            setTraces(jsonData);
        })
        .catch(error => {
            setError(error.message)
            setTimeout(() => setError(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function handleFileUpload(e) {
        e.preventDefault();
        inputRef.current.click();
    }

    return (
        <>
            <input ref={inputRef} name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <ButtonWithIcon 
                text="Upload file" 
                onClick={handleFileUpload} 
                icon={<MdOutlineFileUpload />} 
                className={`btn-primary ${buttonClass ? buttonClass : ""}`}
            />
        </>
    )
}