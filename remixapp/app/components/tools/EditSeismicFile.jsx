
import { useRef, useState } from "react"

import LineGraph from "@/components/ui/LineGraph"
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { IoMdClose } from "react-icons/io";
import Message from "@/components/ui/Message";
import { NumberInputElement, TextInputElement, DateInputElement, TimeInputElement, LabelElement } from "@/components/ui/UIElements";
import { FiUpload } from "react-icons/fi";
import { fastapiEndpoints } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";
import { downloadURI } from "@/utils/functions";

import { MdOutlineFileDownload, MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";
import { RiResetLeftFill } from "react-icons/ri";

function TraceInfoMenu({ activatedMenuIndex, setActivatedMenuIndex, traces, setTraces, ind, trace }) {

    function handleInputChange(traceId, parameter, value) {
        console.log(traceId, parameter, value)
        let newTraces = traces.map((trace, i) => {
            if (trace.trace_id === traceId) {
                let newTrace = {...trace, stats: {...trace.stats, [parameter]: value}}
                return newTrace
            } else {
                return trace
            }
        })
       setTraces(newTraces)
    }

    return (
        <>
            {
                activatedMenuIndex === ind && (
                    <div className="flex flex-col py-6 px-4 items-stretch gap-1 absolute top-100 end-0 bg-white border shadow rounded z-50">
                        <div  className="absolute top-1 end-2">
                            <Button 
                                variant="ghost" 
                                size="small"
                                onClick={() => setActivatedMenuIndex(null)}
                                toolTipText="Close the menu."
                            >
                                <IoMdClose />
                            </Button>
                        </div>
                        <div>
                            <LabelElement id="station" label="station" />
                            <TextInputElement
                                id={"station"}
                                name={"station"}
                                value={trace.stats.station}
                                onChange={(e) => handleInputChange(trace.trace_id, "station", e.target.value)}
                                placeholder={"e.g. SEIS"}
                                className={"input-sm"}
                            />
                        </div>
                        <div>
                            <LabelElement id="start_date" label="Start date" />
                            <DateInputElement
                                id={"start_date"}
                                name={"start_date"}
                                value={trace.stats.start_date}
                                onChange={(e) => handleInputChange(trace.trace_id, "start_date", e.target.value)}
                                className={"input-sm block w-full"}
                            />
                        </div>
                        <div>
                            <LabelElement id="start_time" label="Start time" />
                            <TimeInputElement
                                id={"start_time"}
                                name={"start_time"}
                                value={trace.stats.start_time}
                                onChange={(e) => handleInputChange(trace.trace_id, "start_time", e.target.value)}
                                className={"input-sm block w-full"}
                            />
                        </div>
                        <div>
                            <LabelElement id="fs" label="Sampling rate *" />
                            <NumberInputElement
                                id={"fs"}
                                name={"fs"}
                                value={trace.stats.sampling_rate}
                                onChange={(e) => handleInputChange(trace.trace_id, "sampling_rate", e.target.value)}
                                className={"input-sm"}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            <LabelElement id="npts" label="Total sample points *" />
                            <NumberInputElement
                                id={"npts"}
                                name={"npts"}
                                value={trace.stats.npts}
                                onChange={(e) => handleInputChange(trace.trace_id, "npts", e.target.value)}
                                className={"input-sm"}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            <LabelElement id="channel" label="Component" />
                            <TextInputElement
                                id={"channel"}
                                name={"channel"}
                                value={trace.stats.channel}
                                onChange={(e) => handleInputChange(trace.trace_id, "channel", e.target.value)}
                                placeholder={"e.g. E"}
                                className={"input-sm"}
                            />
                        </div>
                        <p className="text-sm text-center my-1">Elements with "*" are readonly</p>
                    </div>
                )
            }
        </>
    )
}

function MainMenu({ traces, setTraces, setLoading, setError, setSuccess, handleFileUpload, backupTraces }) {
    

    async function handleDownloadFile(fileType, data, downloadName) {
        const blobData = await fetchRequest({
            endpoint: fastapiEndpoints["DOWNLOAD-FILE"],
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "POST",
            data: {data: data, file_type: fileType},
            returnType: "blob",
        });

        const url = window.URL.createObjectURL(blobData);
        downloadURI(url, downloadName + "." + fileType)
    }


    return (
        <>
            <div className="flex flex-row items-center justify-start">
                <Button 
                    onClick={handleFileUpload} 
                    variant="ghost"
                    size="small"
                    toolTipText="Upload a seismic file"
                >
                    <FiUpload />
                    Upload file
                </Button>
                <Button  
                    variant="ghost"
                    size="small"
                    onClick={() => setTraces(backupTraces)} 
                    disabled={traces.length===0} 
                    toolTipText="Restore the initial uploaded traces"
                >
                    <RiResetLeftFill />
                    Reset traces
                </Button>
                <Button 
                    variant="ghost"
                    size="small"
                    onClick={() => handleDownloadFile("mseed", traces, traces[0].stats.record_name + "_download")} 
                    disabled={traces.length===0} 
                    toolTipText="Download the updated traces to MiniSEED file format"
                >
                    Download to MSEED
                    <MdOutlineFileDownload />
                </Button>
                <Button 
                    variant="ghost"
                    size="small"
                    onClick={() => handleDownloadFile("json", traces.map(tr => tr.stats), traces[0].stats.record_name + "_header")} 
                    disabled={traces.length===0} 
                    toolTipText="Download the header information of updated traces in a json format"
                >
                    Download header
                    <MdOutlineFileDownload />
                </Button>
                <Button 
                    variant="ghost"
                    size="small"
                    onClick={() => handleDownloadFile("json", traces.map(tr => ({"component": tr.stats.channel, "data": tr.ydata})), traces[0].stats.record_name + "_data")}
                    disabled={traces.length===0} 
                    toolTipText="Download the data values of the traces in a json file format"
                >
                    Download Data samples
                    <MdOutlineFileDownload />
                </Button>
            </div>
        </>
    )
}

function Graphs({ traces, setTraces, activatedMenuIndex, setActivatedMenuIndex }) {

    function handleOptionsMenuButtonClick(ind) {
        if (activatedMenuIndex === ind) {
            setActivatedMenuIndex(null)
        }
        else {
            setActivatedMenuIndex(ind)
        }
    }

    function handleDeleteTrace(traceId) {
        const newTraces = traces.filter(tr => tr.trace_id !== traceId)
        setTraces(newTraces)
    }

    return (
        <>
            {
                traces.map((tr, ind) => (
                    <div key={tr.trace_id} className="h-1/3">
                        <div className="flex flex-row justify-end gap-2">
                            <Button 
                                onClick={() => handleOptionsMenuButtonClick(ind)}
                                variant="ghost"
                                size="small"
                                toolTipText="Open the trace header menu. Feel free to update the fields."
                            >
                                <PiGearLight />
                            </Button>
                            <Button 
                                onClick={() => handleDeleteTrace(tr.trace_id)}
                                variant="ghost"
                                size="small"
                                toolTipText="Remove the respective trace."
                            >
                                <MdDeleteOutline />
                            </Button>
                        </div>
                        <TraceInfoMenu 
                            activatedMenuIndex = {activatedMenuIndex}
                            setActivatedMenuIndex = {setActivatedMenuIndex}
                            traces = {traces} 
                            setTraces = {setTraces}
                            ind = {ind}
                            trace = {tr}
                        />
                        <LineGraph 
                            xData={[tr["xdata"]]} 
                            yData={[tr["ydata"]]} 
                            height="220px"
                            legendTitle={[`Component: ${tr["stats"]["channel"]}`]}
                            showGraphTitle={ind === 0}
                            graphTitle={""}
                        />
                    </div>
                ))
            }
        </>   
    )
}


export default function EditSeismicFile() {
    const [error, setError] = useState([])
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([]);    
    const [activatedMenuIndex, setActivatedMenuIndex] = useState(null)
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
            {
                error.length !==0 && <Message setError={setError} setSuccess={setSuccess} type="error" text={error} />
            }
            {
                success && <Message setError={setError} setSuccess={setSuccess} type="success" text={success} />
            }
            <input ref={inputRef} name="file" type="file" onChange={handleFileSelection} hidden />
            <div className="h-screen min-h-96">
                <div className="border rounded-t-lg bg-base-100 p-3">
                    <MainMenu 
                        traces={traces} 
                        setTraces={setTraces} 
                        setLoading={setLoading} 
                        setError={setError} 
                        setSuccess={setSuccess} 
                        handleFileUpload={handleFileUpload} 
                        backupTraces={backupTraces}
                    />
                </div>
                <div className="border h-2/3 overflow-y-scroll p-4 relative">
                    <>
                        <div className="absolute start-1/2 ">
                            <Spinner visible={loading} />
                        </div>
                        {
                            traces.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <h1 className="font-semibold text-3xl">Upload a seismic file</h1>
                                    <p className="text-lg">Start by uploading a seismic file to interact with the tool</p>
                                    <Button 
                                        onClick={handleFileUpload}
                                        toolTipText="Upload a seismic file"
                                    >
                                        <FiUpload />
                                        Upload file
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Graphs 
                                        traces={traces} 
                                        setTraces={setTraces}
                                        activatedMenuIndex={activatedMenuIndex}
                                        setActivatedMenuIndex={setActivatedMenuIndex}
                                    />
                                </>
                            )
                        }
                    </>
                </div>
            </div>
        </>
    )
}
