import fetchRequest from "@/utils/functions/fetchRequest";
import { fastapiEndpoints } from "@/utils/static";
import { useRef, useState } from "react";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { MdOutlineFileUpload } from "react-icons/md";


export default function UploadFileButton({setTraces, setBackupTraces, setError, setSuccess, setLoading, buttonClass}) {

    const inputRef = useRef();
    async function handleFileSelection(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        const traces = await fetchRequest({
            endpoint: fastapiEndpoints["UPLOAD-SEISMIC-FILE"],
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "POST",
            data: formData,
            successMessage: "The file has been succesfully uploaded!"
        });

        setTraces(traces);
        setBackupTraces(traces)
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
                icon={<MdOutlineFileUpload className="size-4" />} 
                className={`btn-primary ${buttonClass ? buttonClass : ""}`}
            />
        </>
    )
}