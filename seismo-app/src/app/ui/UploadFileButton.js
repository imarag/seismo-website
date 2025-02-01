import { useRef, useState } from "react";

import Button from "@/components/Button";
import AlignVertical from "./AlignVertical";

import fetchRequest from "@/utils/functions/fetchRequest";
import { fastapiEndpoints } from "@/utils/static";

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
        <AlignVertical>
            <input ref={inputRef} name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <p className="text-center text-md font-light">
                Don't have a seismic data file ? 
                Click <a className="link link-info" href={fastapiEndpoints['DOWNLOAD-TEST-FILE']}>here</a> to download one, to experiment 
                with the tool. 
            </p>
            <Button onClick={handleFileUpload} >
                Upload file
                <MdOutlineFileUpload />
            </Button>
        </AlignVertical>
        </>
    )
}