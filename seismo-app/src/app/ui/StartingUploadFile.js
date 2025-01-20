import UploadFileButton from "@/components/UploadFileButton"
import ToolTip from "@/components/ToolTip";

import { fastapiEndpoints } from "@/utils/static";

import { IoInformationCircleOutline } from "react-icons/io5";

export default function StartingUploadFile({ setTraces, setBackupTraces, setError, setSuccess, setLoading }) {
    return (
        <>
            <p className="text-center text-3xl">
                <span>Upload a seismic file</span>
                <ToolTip text="Browse the ObsPy read function to check the supported file types">
                    <a href="https://docs.obspy.org/master/packages/autogen/obspy.core.stream.read.html" target="_blank" className="btn btn-md btn-ghost ms-1">
                        <IoInformationCircleOutline className="size-5" />
                    </a>
                </ToolTip>
            </p>
            <p className="text-center text-md font-light">
                Don't have a seismic data file ? 
                Click <a className="link link-info" href={fastapiEndpoints['DOWNLOAD-TEST-FILE']}>here</a> to download one, to experiment 
                with the tool. 
            </p>
            <UploadFileButton 
                setTraces={setTraces} 
                setBackupTraces={setBackupTraces}
                setLoading={setLoading} 
                buttonClass="block mx-auto" 
                setError={setError}
                setSuccess={setSuccess}
                />
        </>
    )
}