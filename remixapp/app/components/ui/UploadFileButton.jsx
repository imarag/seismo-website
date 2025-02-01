import { useRef, useState } from "react";

import Message from "@/components/ui/Message"
import Button from "@/components/ui/Button";

import fetchRequest from "@/utils/functions/fetchRequest";
import { fastapiEndpoints } from "@/utils/static";

import { MdOutlineFileUpload } from "react-icons/md";


export default function UploadFileButton({setTraces, setBackupTraces}) {

    const inputRef = useRef();
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

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
            {
                error && <Message type="error" text={error} />
            }
            {
                success && <Message type="success" text={success} />
            }
            <input ref={inputRef} name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <div className="flex justify-center">
                <Button onClick={handleFileUpload} >
                    Upload file
                    <MdOutlineFileUpload />
                </Button>
            </div>
        </>
    )
}