
import { useRef, useState } from "react"

import LineGraph from "@/components/ui/LineGraph"
import Button from "@/components/ui/Button";
import HRLine from "@/components/utils/HRLine";
import { IoMdClose } from "react-icons/io";
import Message from "@/components/ui/Message";
import { Paragraph } from "@/components/utils/Typography"
import { NumberInputElement, TextInputElement, DateInputElement, TimeInputElement, LabelElement } from "@/components/ui/UIElements";
import { FiUpload } from "react-icons/fi";
import { fastapiEndpoints } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";
import { downloadURI } from "@/utils/functions";

import { MdOutlineFileDownload, MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";
import { RiResetLeftFill } from "react-icons/ri";
import { AiOutlineQuestionCircle } from "react-icons/ai";

function NewTraceMenu({ setActivatedNewTraceMenu, newTraceOptions, setNewTraceOptions, handleFileSelection2 }) {
    const uploadDataInputRef = useRef();
    const fileOptionsTooltip = `Use these parameters to manage the upload process. 
    The 'skip rows' option allows you to skip a specified number of rows at the beginning of the file (e.g., headers), 
    while the 'select column' option lets you choose a specific column to upload when the file contains multiple columns. 
    If no value is specified for the 'select column', the default is 1.`

    const seismicHeaderTooltip = `Use these parameters to specify details about the seismic trace 
    header. Include the station code or name, component code, recording start and end time, and the 
    sampling rate in Hz.`

    function handleDataUpload(e) {
        e.preventDefault();
        uploadDataInputRef.current.click();
    }

    return (
        <div className="flex flex-col py-6 px-4 items-stretch gap-1 absolute start-0 bg-white border shadow rounded z-50 pt-10 w-72">
            <div className="mb-2 z-50"> 
                <h1 className="text-start text-sm font-semibold mb-1 flex items-center justify-between">
                    File parameters
                    <span 
                        className="tooltip tooltip-right"
                        data-tip={fileOptionsTooltip}
                    >
                        <AiOutlineQuestionCircle />
                    </span>
                </h1>
                <HRLine />
            </div>
            <div  className="absolute top-1 end-2">
                <Button 
                    variant="ghost" 
                    size="small"
                    onClick={() => setActivatedNewTraceMenu(false)}
                    toolTipText="Close the menu."
                >
                    <IoMdClose />
                </Button>
            </div>
            
            <div className="flex flex-row items-center gap-2">
                <div className="flex-grow w-1/2">
                    <LabelElement id="skiprows" label="Skip rows" />
                    <NumberInputElement
                        id="skiprows"
                        name="skiprows"
                        className={"input-xs w-full"}
                        value={newTraceOptions.skiprows}
                        onChange={(e) => setNewTraceOptions({...newTraceOptions, skiprows: e.target.value})}
                    />
                </div>
                <div className="flex-grow w-1/2">
                    <LabelElement id="column" label="Select column" />
                    <NumberInputElement
                        id="column"
                        name="column"
                        className={"input-xs w-full"}
                        value={newTraceOptions.column}
                        onChange={(e) => setNewTraceOptions({...newTraceOptions, column: e.target.value})}
                    />
                </div>
            </div>
            <div className="mt-4 mb-2 z-50"> 
                <h1 className="text-start text-sm font-semibold mb-1 flex items-center justify-between">
                    Trace header options
                    <span 
                        className="tooltip tooltip-right"
                        data-tip={seismicHeaderTooltip}
                    >
                        <AiOutlineQuestionCircle />
                    </span>
                </h1>
                <HRLine />
            </div>
            <div className="flex flex-row items-center gap-2 my-1">
                <div className="flex-grow w-1/2">
                    <LabelElement id="station" label="station" />
                    <TextInputElement
                        id={"station"}
                        name={"station"}
                        placeholder={"e.g. SEIS"}
                        className={"input-xs w-full"}
                        value={newTraceOptions.station}
                        onChange={(e) => setNewTraceOptions({...newTraceOptions, station: e.target.value})}
                    />
                </div>
                <div className="flex-grow w-1/2">
                    <LabelElement id="component" label="Component" />
                    <TextInputElement
                        id={"component"}
                        name={"component"}
                        placeholder={"e.g. E"}
                        className={"input-xs w-full"}
                        value={newTraceOptions.component}
                        onChange={(e) => setNewTraceOptions({...newTraceOptions, component: e.target.value})}
                    />
                </div>
            </div>
            <div className="flex flex-row items-center gap-2 my-1">
                <div className="flex-grow w-1/2">
                    <LabelElement id="startdate" label="Start date" />
                    <DateInputElement
                        id={"startdate"}
                        name={"startdate"}
                        className={"input-xs block w-full"}
                        value={newTraceOptions.startdate}
                        onChange={(e) => setNewTraceOptions({...newTraceOptions, startdate: e.target.value})}
                    />
                </div>
                <div className="flex-grow w-1/2">
                    <LabelElement id="starttime" label="Start time" />
                    <TimeInputElement
                        id={"starttime"}
                        name={"starttime"}
                        className={"input-xs block w-full"}
                        value={newTraceOptions.starttime}
                        onChange={(e) => setNewTraceOptions({...newTraceOptions, starttime: e.target.value})}
                    />
                </div>
            </div>
            <div className="flex flex-row items-center gap-2 my-1">
                <div className="flex-grow w-1/2">
                    <LabelElement id="fs" label="Sampling rate *" />
                    <NumberInputElement
                        id={"fs"}
                        name={"fs"}
                        className={"input-xs w-full"}
                        value={newTraceOptions.fs}
                        onChange={(e) => setNewTraceOptions({...newTraceOptions, fs: e.target.value})}
                    />
                </div>
                <div className="flex-grow w-1/2">
                    
                </div>
            </div>
            <HRLine />
            <div className="flex flex-row items-center justify-center gap-2 mt-4">
                <input ref={uploadDataInputRef} onChange={(e) => handleFileSelection2(e, "ADD-TRACE")} name="file" id="file" type="file" hidden />
                <Button 
                    size="extra-small"
                    outline={true}
                    variant="neutral"
                    toolTipText="Upload trace data"
                    onClick={handleDataUpload}
                >
                    <FiUpload />
                    Upload data
                </Button>
            </div>
            <p className="text-xs text-center">supported file types: xlsx, csv, txt</p>
        </div>
    )
}

function TraceInfoMenu({ setActivatedMenuIndex, traces, setTraces, ind, trace }) {

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
                <LabelElement id="component" label="Component" />
                <TextInputElement
                    id={"component"}
                    name={"component"}
                    value={trace.stats.component}
                    onChange={(e) => handleInputChange(trace.trace_id, "component", e.target.value)}
                    placeholder={"e.g. E"}
                    className={"input-sm"}
                />
            </div>
            <p className="text-sm text-center my-1">Elements with "*" are readonly</p>
        </div>
    )
}

function MainMenu({ traces, setLoading, setError, setSuccess, handleFileUpload }) {
    
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
                onClick={() => handleDownloadFile("json", traces.map(tr => ({"component": tr.stats.component, "data": tr.ydata})), traces[0].stats.record_name + "_data")}
                disabled={traces.length===0} 
                toolTipText="Download the data values of the traces in a json file format"
            >
                Download Data samples
                <MdOutlineFileDownload />
            </Button>
        </>
    )
}

function Graphs({ traces, setTraces }) {

    const [activatedMenuIndex, setActivatedMenuIndex] = useState(null)

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
                        {
                            activatedMenuIndex === ind && (
                                <TraceInfoMenu 
                                    activatedMenuIndex = {activatedMenuIndex}
                                    setActivatedMenuIndex = {setActivatedMenuIndex}
                                    traces = {traces} 
                                    setTraces = {setTraces}
                                    ind = {ind}
                                    trace = {tr}
                                />
                            )
                        }
                        <LineGraph 
                            xData={[tr["xdata"]]} 
                            yData={[tr["ydata"]]} 
                            height="220px"
                            legendTitle={[`Component: ${tr["stats"]["component"]}`]}
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
    const [activatedNewTraceMenu, setActivatedNewTraceMenu] = useState(false)
    const [newTraceOptions, setNewTraceOptions] = useState({
        skiprows: 0,
        column: 1,
        station: "",
        component: "",
        startdate: "1970-01-01",
        starttime: "00:00:00",
        fs: 2
    })
    const uploadFileInputRef = useRef();
    
    async function handleFileSelection(e, endpoint) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        
        const traces = await fetchRequest({
            endpoint: fastapiEndpoints[endpoint],
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "POST",
            data: formData,
            successMessage: "The file has been succesfully uploaded!"
        });
        setTraces(traces);
    }

    async function handleFileSelection2(e, endpoint) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        Object.keys(newTraceOptions).forEach((key) => {
            formData.append(key, newTraceOptions[key]);
        });
      
        const traceDict = await fetchRequest({
            endpoint: fastapiEndpoints[endpoint],
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "POST",
            data: formData,
            successMessage: "The file has been succesfully uploaded!"
        });
        setTraces([...traces, traceDict]);
    }

    function handleFileUpload(e) {
        e.preventDefault();
        uploadFileInputRef.current.click();
    }


    return (
        <>
            {
                error.length !==0 && <Message setError={setError} setSuccess={setSuccess} type="error" text={error} />
            }
            {
                success && <Message setError={setError} setSuccess={setSuccess} type="success" text={success} />
            }
            <input ref={uploadFileInputRef} name="file" type="file" onChange={(e) => handleFileSelection(e, "UPLOAD-SEISMIC-FILE")} hidden />
            <div className="h-screen min-h-96">
                <div className="border rounded-t-lg bg-base-100 p-3 flex flex-row items-center justify-start">
                    <MainMenu 
                        traces={traces} 
                        setTraces={setTraces} 
                        setLoading={setLoading} 
                        setError={setError} 
                        setSuccess={setSuccess} 
                        handleFileUpload={handleFileUpload} 
                    />
                </div>
                <div className="border h-2/3 overflow-y-scroll p-4 relative">
                    {
                        traces.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
                                <h1 className="text-4xl">Upload a seismic file</h1>
                                <Paragraph className="text-lg">Start by uploading a seismic file to interact with the tool</Paragraph>
                                <Button 
                                    onClick={handleFileUpload}
                                    toolTipText="Upload a seismic file"
                                    loading={loading}
                                >
                                    <FiUpload />
                                    Upload file
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <Button
                                        onClick={() => setActivatedNewTraceMenu(!activatedNewTraceMenu)}
                                        size="extra-small"
                                        variant="ghost"
                                        toolTipText="Upload a seismic file"
                                    >
                                        Add trace +
                                    </Button>
                                    {
                                        activatedNewTraceMenu && (
                                            <NewTraceMenu
                                                setActivatedNewTraceMenu={setActivatedNewTraceMenu}
                                                newTraceOptions={newTraceOptions}
                                                setNewTraceOptions={setNewTraceOptions}
                                                handleFileSelection2={handleFileSelection2}
                                            />
                                        )
                                    }
                                </div>
                                <Graphs 
                                    traces={traces} 
                                    setTraces={setTraces}
                                />
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}
