import { PrimaryButton, GhostButton } from "@/components/ui/ButtonComponents";
import { ExternalLinkTag } from "@/components/ui/LinkComponents";
import LineGraph from "@/components/ui/LineGraph"
import Spinner from "@/components/ui/Spinner"
import { NumberInputElement, LabelElement, TimeInputElement, DateInputElement, TextInputElement, SelectElement, SliderElement } from "@/components/ui/UIElements";
import { taperTypeOptions, taperSideOptions, detrendTypeOptions } from "@/utils/static"
import { useState, useRef, useEffect } from "react";
import fetchRequest from "@/utils/functions/fetchRequest"
import DropDown from "@/components/ui/DropDown"
import Message from "@/components/ui/Message"
import { getRandomNumber } from "@/utils/functions"
import { fastapiEndpoints } from "@/utils/static"
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoCut, IoFilter } from "react-icons/io5";
import { BsSoundwave } from "react-icons/bs";
import { MdAlignVerticalCenter, MdArrowDropDown } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";
import { downloadURI } from "@/utils/functions";


function MenuButton({ onClick, disabled }) {
    return (
        <PrimaryButton 
            size="small"
            onClick={onClick}
        >
            apply
        </PrimaryButton>
    )
}

function MenuDropdown({ label, icon, children }) {
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-md m-1">
                { icon }
                { label }
                <MdArrowDropDown />
            </div>
            <div tabIndex={0} className="dropdown-content card card-compact bg-white rounded-lg z-[1] w-64 p-2 shadow-lg border">
                <div className="p-4">
                    { children }
                </div>
            </div>
        </div>
    )
}

function HeaderInfoMenu({ tr, handleInputChange }) {
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-md m-1">
                <PiGearLight className="size-5 text-neutral" />
            </div>
            <div tabIndex={0} className="dropdown-content card card-compact bg-white rounded-lg z-[1] w-64 p-2 shadow-lg border">
                <div className="p-2">
                    <div className="flex flex-col items-stretch gap-1">
                        <div>
                            <LabelElement id="station" label="Station code" />
                            <TextInputElement
                                id={"station"}
                                name={"station"}
                                value={tr.stats.station}
                                onChange={(e) => handleInputChange(tr.trace_id, "station", e.target.value)}
                                placeholder={"e.g. SEIS"}
                                className={"input-sm"}
                            />
                        </div>
                        <div>
                            <LabelElement id="date" label="Date of the first data sample" />
                            <DateInputElement
                                id={"date"}
                                name={"date"}
                                value={tr.stats.start_date}
                                onChange={(e) => handleInputChange(tr.trace_id, "date", e.target.value)}
                                className={"input-sm block w-full"}
                            />
                        </div>
                        <div>
                            <LabelElement id="time" label="Time of the first data sample" />
                            <TimeInputElement
                                id={"time"}
                                name={"time"}
                                value={tr.stats.start_time}
                                onChange={(e) => handleInputChange(tr.trace_id, "time", e.target.value)}
                                className={"input-sm block w-full"}
                            />
                        </div>
                        <div>
                            <LabelElement id="fs" label="Sampling rate in hertz *" />
                            <NumberInputElement
                                id={"fs"}
                                name={"fs"}
                                value={tr.stats.sampling_rate}
                                onChange={(e) => handleInputChange(tr.trace_id, "sampling_rate", e.target.value)}
                                className={"input-sm"}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            <LabelElement id="npts" label="Number of sample points *" />
                            <NumberInputElement
                                id={"npts"}
                                name={"npts"}
                                value={tr.ydata.length}
                                onChange={(e) => handleInputChange(tr.trace_id, "npts", e.target.value)}
                                className={"input-sm"}
                                readOnly={true}
                            />
                        </div>
                        <div>
                            <LabelElement id="channel" label="Channel code" />
                            <TextInputElement
                                id={"channel"}
                                name={"channel"}
                                value={tr.stats.channel}
                                onChange={(e) => handleInputChange(tr.trace_id, "channel", e.target.value)}
                                placeholder={"e.g. E"}
                                className={"input-sm"}
                            />
                        </div>
                        <p className="text-sm text-center my-1">Elements with "*" are readonly</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


function MainMenu({ traces, setTraces, loading, setLoading, setError, setSuccess, handleFileUpload, appliedProcesses, setAppliedProcesses}) {
    const [sigProcOptions, setSigProcOptions] = useState({
        "detrend-type": "simple",
        "taper-type": "parzen",
        "taper-side": "both",
        "taper-length": 20,
        "trim-left-side": 0,
        "trim-right-side": 0,
        "filter-min": 0,
        "filter-max": 0
    })
 
    let duration = traces.length !== 0 ? traces[0].ydata.length / traces[0].stats.sampling_rate : 0

    async function handleTrimApply() {
        const process = {
            fetchURL: fastapiEndpoints["TRIM-WAVEFORM"],
            text: `trim-${sigProcOptions["trim-left-side"]}-${sigProcOptions["trim-right-side"]}`,
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    trim_start: sigProcOptions["trim-left-side"], 
                    trim_end: sigProcOptions["trim-right-side"]
                }
            },
            processId: getRandomNumber()
        }
        const response = await fetch(
            process.fetchURL, 
            {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
        );

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData["error_message"])
            throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
        }

        const jsonData = await response.json();

        setError(null)
        setTraces(
            traces.map(trace => {
                const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
                return updatedTrace
                    ? { ...trace, ydata: updatedTrace.values }
                    : trace;
            })
        )
        setAppliedProcesses([...appliedProcesses, process])


        setSigProcOptions(
            { ...sigProcOptions, "trim-left-side": 0, "trim-right-side": 0}
        )
    }

    async function handleTaperApply() {
        const process = {
            fetchURL: fastapiEndpoints["TAPER-WAVEFORM"],
            text: `taper-${sigProcOptions["taper-type"]}-${sigProcOptions["taper-side"]}-${sigProcOptions["taper-length"]}`,
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    taper_type: sigProcOptions["taper-type"],
                    taper_side: sigProcOptions["taper-side"],
                    taper_length: sigProcOptions["taper-length"],
                }
            },
            processId: getRandomNumber()
        }

        const response = await fetch(
            process.fetchURL, 
            {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
        );

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData["error_message"])
            throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
        }

        const jsonData = await response.json();
        setError(null)
        setTraces(
            traces.map(trace => {
                const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
                return updatedTrace
                    ? { ...trace, ydata: updatedTrace.values }
                    : trace;
            })
        )
 
        setAppliedProcesses([...appliedProcesses, process])
    }

    async function handleDetrendApply() {
        const process = {
            fetchURL: fastapiEndpoints["DETREND-WAVEFORM"],
            text: `detrend-${sigProcOptions["detrend-type"]}`,
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    detrend_type: sigProcOptions["detrend-type"]
                }
            },
            processId: getRandomNumber()
        }
        const response = await fetch(
            process.fetchURL,
            {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
        );

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData["error_message"])
            throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
        }

        const jsonData = await response.json();
        setError(null)
        setTraces(
            traces.map(trace => {
                const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
                return updatedTrace
                    ? { ...trace, ydata: updatedTrace.values }
                    : trace;
            })
        )
 
        setAppliedProcesses([...appliedProcesses, process])
    }

    function getFilterPill(freqMin, freqMax) {
        if (freqMin === null && freqMax === null) {
            return "no-filter"
        }
        else if (freqMin === null && freqMax !== null) {
            return `lowpass-${freqMax}Hz`
        }
        else if (freqMin !== null && freqMax == null) {
            return `highpass-${freqMin}Hz`
        }
        else {
            return `bandpass-${freqMin}-${freqMax}Hz`
        }
    }

    async function handleFilterApply() {
        const process = {
            fetchURL: fastapiEndpoints["FILTER-WAVEFORM"],
            text: getFilterPill(
                sigProcOptions["filter-min"] ? sigProcOptions["filter-min"] : null,
                sigProcOptions["filter-max"] ? sigProcOptions["filter-max"] : null,
            ),
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    freq_min: sigProcOptions["filter-min"] ? sigProcOptions["filter-min"] : null,
                    freq_max: sigProcOptions["filter-max"] ? sigProcOptions["filter-max"] : null,
                }
            },
            processId: getRandomNumber()
        }

        const jsonData = await fetchRequest({
            endpoint: process.fetchURL,
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            data: process.fetchBody,
            method: "POST",
        });

        setTraces(
            traces.map(trace => {
                const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
                return updatedTrace
                    ? { ...trace, ydata: updatedTrace.values }
                    : trace;
            })
        )
        setAppliedProcesses([...appliedProcesses, process])
    }

    function handleSigProcOptions(processingOption, value, type = "text") {
        const userSelectedValue = type === "text" ? value : Number(value)
        const newProcessingOptions = { ...sigProcOptions, [processingOption]: userSelectedValue }
        setSigProcOptions(newProcessingOptions)
    }

    return (
        <div className="p-2 border-b flex flex-row items-center justify-start">
            <div className="border-r">
                <GhostButton onClick={handleFileUpload} loading={loading}>
                    <FiUpload />
                    Upload file
                </GhostButton>
            </div>
            <div>
                <MenuDropdown icon={<BsSoundwave />}  label="Taper">
                    <div className="flex flex-col items-stretch gap-3">
                        <div>
                            <LabelElement label="Type" id="taper-type" />
                            <SelectElement 
                                id="taper-type"
                                name="taper-type"
                                optionsList={taperTypeOptions}
                                value={sigProcOptions["taper-type"]} 
                                className="select-sm block w-full"
                                onChange={(e) => handleSigProcOptions("taper-type", e.target.value)}
                            />
                        </div>
                        <div>
                            <LabelElement label="Side" id="taper-side" />
                            <SelectElement 
                                id="taper-side"
                                name="taper-side"
                                optionsList={taperSideOptions}
                                value={sigProcOptions["taper-side"]} 
                                className="select-sm block w-full"
                                onChange={(e) => handleSigProcOptions("taper-side", e.target.value)}
                            />
                        </div>
                        <div>
                            <LabelElement label="Length" id="taper-length" />
                            <NumberInputElement 
                                id="taper-length"
                                name="taper-length"
                                min={0}
                                max={100} 
                                step={0.1}
                                className="input-sm block w-full"
                                value={sigProcOptions["taper-length"]} 
                                onChange={(e) => handleSigProcOptions("taper-length", e.target.value, "number")}
                            />
                        </div>
                        <MenuButton disabled={traces.length === 0} onClick={handleTaperApply} />
                    </div>
                </MenuDropdown>
                <MenuDropdown icon={<IoCut />}  label="Trim">
                    <div className="flex flex-col items-stretch gap-3">
                        <div>
                            <LabelElement label="start time [sec]" id="trim-left-side" />
                            <NumberInputElement 
                                id="trim-left-side"
                                name="trim-left-side"
                                min={0}
                                max={duration} 
                                step={0.1}
                                className="input-sm mt-3 block w-full"
                                value={sigProcOptions["trim-left-side"]} 
                                onChange={(e) => handleSigProcOptions("trim-left-side", e.target.value, "number")}
                            />
                            <SliderElement 
                                id="trim-left-side"
                                name="trim-left-side"
                                min={0}
                                max={duration} 
                                step={0.1}
                                className="range-xs mt-3 block w-full"
                                value={sigProcOptions["trim-left-side"]} 
                                onChange={(e) => handleSigProcOptions("trim-left-side", e.target.value, "number")}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <LabelElement label="end time [sec]" id="trim-right-side" />
                            <NumberInputElement 
                                id="trim-right-side"
                                name="trim-right-side"
                                min={0}
                                max={duration} 
                                step={0.1}
                                className="input-sm block w-full"
                                value={sigProcOptions["trim-right-side"]} 
                                onChange={(e) => handleSigProcOptions("trim-right-side", e.target.value, "number")}
                            />
                            <SliderElement 
                                id="trim-right-side"
                                name="trim-right-side"
                                min={0}
                                max={duration} 
                                step={0.1}
                                className="range-xs block w-full"
                                value={sigProcOptions["trim-right-side"]} 
                                onChange={(e) => handleSigProcOptions("trim-right-side", e.target.value, "number")}
                            />
                        </div>
                        <MenuButton disabled={traces.length === 0} onClick={handleTrimApply} />
                    </div>
                </MenuDropdown>
                <MenuDropdown icon={<MdAlignVerticalCenter />}  label="Detrend">
                    <div className="flex flex-col items-stretch gap-3">
                        <div>
                            <LabelElement label="Type" id="detrend-type" />
                            <SelectElement 
                                id="detrend-type"
                                name="detrend-type"
                                optionsList={detrendTypeOptions}
                                className="select-sm block w-full"
                                value={sigProcOptions["detrend-type"]} 
                                onChange={(e) => handleSigProcOptions("detrend-type", e.target.value)}
                            />
                        </div>
                        <MenuButton disabled={traces.length === 0} onClick={handleDetrendApply} />
                    </div>
                </MenuDropdown>
                <MenuDropdown icon={<IoFilter />} label="Filter">
                    <div className="flex flex-col items-stretch gap-3">
                        <div>
                            <LabelElement label="Min frequency" id="filter-min" />
                            <NumberInputElement 
                                id="filter-min"
                                name="filter-min"
                                min={0}
                                max={duration} 
                                step={0.1}
                                className="input-sm mt-3 block w-full"
                                value={sigProcOptions["filter-min"]} 
                                onChange={(e) => handleSigProcOptions("filter-min", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <LabelElement label="Max frequency" id="freq-max" />
                            <NumberInputElement 
                                id="freq-max"
                                name="freq-max"
                                min={0}
                                max={duration} 
                                step={0.1}
                                className="input-sm block w-full"
                                value={sigProcOptions["filter-max"]} 
                                onChange={(e) => handleSigProcOptions("filter-max", e.target.value)}
                            />
                        </div>
                        <p className="text-center text-sm">If zero, it is considered not filled</p>
                        <MenuButton disabled={traces.length === 0} onClick={handleFilterApply} />
                    </div>
                </MenuDropdown>
            </div>
        </div>
    )
}
                      

function Graphs({ traces, setTraces, handleDownloadFile, fourierData, loading, handleFileUpload }) {


    function handleDeleteTrace(traceId) {
        const newTraces = traces.filter(tr => tr.trace_id !== traceId)
        setTraces(newTraces)
    }

    function handleInputChange(traceId, parameter, value) {
        let newTraces = traces.map((tr, i) => {
            if (tr.trace_id === traceId) {
                let newTrace = {...tr, stats: {...tr.stats, [parameter]: value}}
                return newTrace
            } else {
                return tr
            }
        })
       setTraces(newTraces)
    }



    return (
        <>
            <div className="h-full w-full overflow-scroll px-6 py-6">
                {
                    traces.map((tr, ind) => (
                        <div key={tr.trace_id} >
                            <div className="flex flex-row justify-between gap-2 items-center">
                                <div>
                                    <HeaderInfoMenu 
                                        tr={tr} 
                                        handleInputChange={handleInputChange} 
                                    />
                                    <GhostButton 
                                        onClick={() => handleDeleteTrace(tr.trace_id)}
                                        size="small"
                                    >
                                        <MdDeleteOutline className="size-5 text-error" />
                                    </GhostButton>
                                </div>
                                <DropDown label="download" position="end">
                                    {/* <li>
                                        <button 
                                            onClick={() => handleDownloadFile("mseed", tr, tr.stats.record_name + "_download")} 
                                        >
                                            Download to MSEED
                                        </button>
                                    </li> */}
                                    <li>
                                        <button 
                                            onClick={() => handleDownloadFile("json", tr.stats, tr.stats.record_name + "_header")} 
                                        >
                                            Download header
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            onClick={() => handleDownloadFile("json", {"component": tr.stats.channel, "data": tr.ydata}, tr.stats.record_name + "_data")}
                                        >
                                            Download Data samples
                                        </button>
                                    </li>
                                </DropDown>
                            </div>
                            <div className="h-60 flex-shrink-0">
                                <LineGraph
                                    xData={traces.length !== 0 ? [traces[ind]["xdata"]] : []}
                                    yData={traces.length !== 0 ? [traces[ind]["ydata"]] : []}
                                    graphTitle=""
                                    showLegend={false}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}


export default function SignalProcessingTool() {

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false)
    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([])
    const [fourierData, setFourierData] = useState([])
    const [appliedProcesses, setAppliedProcesses] = useState([])
    const inputRef = useRef();

    useEffect(() => {
        async function applyProcesses() {
            setLoading(true);
    
            const fourierBody = {
                traces_data: traces.map(tr => ({trace_id: tr.trace_id, component: tr.stats.channel, values: tr.ydata})),
                sampling_rate: traces.length > 0 ? traces[0].stats.sampling_rate : 100,
            };

            const FourierJsonData = await fetchRequest({
                endpoint: fastapiEndpoints["COMPUTE-FOURIER"],
                setError: setError,
                setSuccess: setSuccess,
                setLoading: setLoading,
                method: "POST",
                data: fourierBody
            });
            setFourierData(FourierJsonData);
        }

        if (traces.length !== 0) {
            applyProcesses();
        }
    
    }, [traces])

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

    function handleRemoveProcesses(process) {
        setTraces(backupTraces)
        setAppliedProcesses([])
    }

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
        <div className="h-full">
            {
                error && <Message type="error" text={error} />
            }
            {
                success && <Message type="success" text={success} />
            }
            <input ref={inputRef} name="file" type="file" onChange={handleFileSelection} hidden />
            <div className="border flex flex-col items-stretch h-full rounded-lg">
                <MainMenu 
                    traces={traces} 
                    setTraces={setTraces} 
                    loading={loading} 
                    setLoading={setLoading} 
                    setError={setError} 
                    setSuccess={setSuccess} 
                    handleFileUpload={handleFileUpload} 
                    appliedProcesses={appliedProcesses} 
                    setAppliedProcesses={setAppliedProcesses}
                />
                <div>
                    {
                        appliedProcesses.length !== 0 && (
                            <div>
                                <div className="flex flex-row items-center flex-wrap gap-2 my-6">
                                    <p>Filters applied:</p>
                                    {
                                        appliedProcesses.map((process, index) => (
                                            <GhostButton key={process.processId} outline={true} size="small">
                                                {index+1}. {process.text}
                                            </GhostButton>
                                        ))
                                    }
                                    <span>
                                        <GhostButton size="small" onClick={handleRemoveProcesses}>
                                            remove all
                                            <IoMdClose />
                                        </GhostButton>
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    traces.length === 0 ? (
                        <div className="flex-grow flex flex-row justify-center items-center">
                            <div className="flex flex-col gap-4 items-center">
                                <h1 className="text-center text-5xl">Upload a seismic file</h1>
                                <p className="text-center">
                                    Check the supported <ExternalLinkTag href="https://docs.obspy.org/packages/autogen/obspy.core.stream.read.html">seismic file formats</ExternalLinkTag> from the Python ObsPy's documentation
                                </p>
                                <PrimaryButton outline={true} onClick={handleFileUpload}>
                                    <FiUpload />
                                    Upload file
                                </PrimaryButton>
                                <Spinner visible={loading}/>
                            </div>
                        </div>
                    ) : (
                        <Graphs 
                            traces={traces} 
                            setTraces={setTraces}
                            fourierData={fourierData}
                            handleFileUpload={handleFileUpload}
                            handleDownloadFile={handleDownloadFile}
                        />
                    )
                }
            </div>
        </div>
    )
}