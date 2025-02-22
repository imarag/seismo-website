import Button from "@/components/ui/Button";
import LineGraph from "@/components/ui/LineGraph"
import { NumberInputElement, LabelElement, SelectElement, SliderElement } from "@/components/ui/UIElements";
import { taperTypeOptions, taperSideOptions, detrendTypeOptions } from "@/utils/static"
import { useState, useRef, useEffect } from "react";
import fetchRequest from "@/utils/functions/fetchRequest"
import Message from "@/components/ui/Message"
import { getRandomNumber } from "@/utils/functions"
import { fastapiEndpoints } from "@/utils/static"
import { FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoCut, IoFilter } from "react-icons/io5";
import { BsSoundwave } from "react-icons/bs";
import { MdAlignVerticalCenter, MdArrowDropDown } from "react-icons/md";
import { downloadURI } from "@/utils/functions";

function MenuButton({ onClick, disabled=false }) {
    return (
        <div className="mt-4 flex justify-center">
            <Button onClick={onClick} size="small" disabled={disabled} >apply</Button>
        </div>
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
                <div className="card-body">
                    { children }
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

        setError([])
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
        setError([])
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
        setError([])
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
            <div className="flex flex-row items-center justify-center">
                <div className="grow-0 border-r">
                    <Button 
                        onClick={handleFileUpload} 
                        loading={loading} 
                        variant="ghost"
                        toolTipText="Upload a seismic file"
                    >
                        <FiUpload />
                        Upload file
                    </Button>
                    <Button 
                        loading={loading} 
                        variant="ghost"
                        onClick={() => handleDownloadFile("mseed", traces, traces[0].stats.record_name + "_download")} 
                        disabled={traces.length===0} 
                        toolTipText="Download the processed seismic file into MiniSEED file format"
                    >
                        <FiUpload />
                        Download To MSEED
                    </Button>
                </div>
                <div className="grow">
                    <MenuDropdown icon={<BsSoundwave />}  label="Taper">
                        <div className="flex flex-col items-stretch gap-3">
                            <div className="flex flex-col gap-2">
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
                            <div className="flex flex-col gap-2">
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
                            <div className="flex flex-col gap-2">
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
                            <MenuButton onClick={handleTaperApply} disabled={traces.length === 0} />
                        </div>
                    </MenuDropdown>
                    <MenuDropdown icon={<IoCut />}  label="Trim">
                        <div className="flex flex-col items-stretch gap-3">
                            <div className="flex flex-col gap-2">
                                <LabelElement label="Start time (sec)" id="trim-left-side" />
                                <NumberInputElement 
                                    id="trim-left-side"
                                    name="trim-left-side"
                                    min={0}
                                    max={duration} 
                                    step={0.1} 
                                    className="input-sm block w-full"
                                    value={sigProcOptions["trim-left-side"]} 
                                    onChange={(e) => handleSigProcOptions("trim-left-side", e.target.value, "number")}
                                />
                                <SliderElement 
                                    id="trim-left-side"
                                    name="trim-left-side"
                                    min={0}
                                    max={duration} 
                                    step={0.1}
                                    className="range-xs block w-full"
                                    value={sigProcOptions["trim-left-side"]} 
                                    onChange={(e) => handleSigProcOptions("trim-left-side", e.target.value, "number")}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <LabelElement label="End time (sec)" id="trim-right-side" />
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
                            <MenuButton onClick={handleTrimApply} disabled={traces.length === 0} />
                        </div>
                    </MenuDropdown>
                    <MenuDropdown icon={<MdAlignVerticalCenter />}  label="Detrend">
                        <div className="flex flex-col items-stretch gap-3">
                            <div className="flex flex-col gap-2">
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
                            <MenuButton onClick={handleDetrendApply} disabled={traces.length === 0} />
                        </div>
                    </MenuDropdown>
                    <MenuDropdown icon={<IoFilter />} label="Filter">
                        <div className="flex flex-col items-stretch gap-3">
                            <div className="flex flex-col gap-2">
                                <LabelElement label="Min frequency" id="filter-min" />
                                <NumberInputElement 
                                    id="filter-min"
                                    name="filter-min"
                                    min={0}
                                    max={duration} 
                                    step={0.1}
                                    className="input-sm block w-full"
                                    value={sigProcOptions["filter-min"]} 
                                    onChange={(e) => handleSigProcOptions("filter-min", e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
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
                            <MenuButton onClick={handleFilterApply} disabled={traces.length === 0} />
                        </div>
                    </MenuDropdown>
                </div>
            </div>
        </>
    )
}

function Graphs({ traces, fourierData}) {
    return (
        <>
            {
                traces.map((tr, ind) => (
                    <div key={tr.trace_id} className="h-1/3">
                        <LineGraph
                            xData={traces.length !== 0 ? [tr["xdata"]] : []}
                            yData={traces.length !== 0 ? [tr["ydata"]] : []}
                            graphTitle=""
                            showLegend={false}
                        />
                    </div>
                ))
            }
        </>   
    )
}
        // <div className="flex flex-row justify-center items-center">
        //     <div className="grow-7 bg-blue-500 h-20">
        //         {
        //             traces.map((tr, ind) => (
        //                 <div key={tr.trace_id}>
        //                     <LineGraph
        //                         xData={traces.length !== 0 ? [tr["xdata"]] : []}
        //                         yData={traces.length !== 0 ? [tr["ydata"]] : []}
        //                         graphTitle=""
        //                         showLegend={false}
        //                     />
        //                 </div>
        //             ))
        //         }
        //     </div>
        //     <div className="grow-1 bg-red-500 h-10">
        //         {/* {
        //             fourierData.map((tr, ind) => (
        //                 <div key={tr.trace_id}>
        //                     <LineGraph
        //                         xData={[tr["fas_freqs"]]}
        //                         yData={[tr["fas_amps"]]}
        //                         graphTitle=""
        //                         scale="log"
        //                         showLegend={false}
        //                         legendTitle={tr.component}
        //                     />
        //                 </div>
        //             ))
        //         } */}
        //     </div>
        // </div>
//     )
// }

function ProcessingFilters({appliedProcesses, handleRemoveProcesses}) {
    return (
        <div>
            {
                appliedProcesses.length !== 0 && (
                    <div>
                        <div className="flex flex-row items-center flex-wrap gap-2 my-6">
                            <p>Filters applied:</p>
                            {
                                appliedProcesses.map((process, index) => (
                                    <span key={process.processId} className="badge badge-info">
                                        {index+1}. {process.text}
                                    </span>
                                ))
                            }
                            <span className="ms-5">
                                <Button 
                                    variant="error" 
                                    size="extra-small" 
                                    onClick={handleRemoveProcesses}
                                    toolTipText="Remove all applied filters"
                                >
                                    remove all
                                    <IoMdClose />
                                </Button>
                            </span>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default function SignalProcessingPage() {
    
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false)
    const [traces, setTraces] = useState([]);
    const [fourierData, setFourierData] = useState([])
    const [backupTraces, setBackupTraces] = useState([])
    const inputRef = useRef();
    const [appliedProcesses, setAppliedProcesses] = useState([])

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

    function handleRemoveProcesses() {
        setTraces(backupTraces)
        setAppliedProcesses([])
    }

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
        <div>
            {
                error.length !==0 && <Message setError={setError} setSuccess={setSuccess} type="error" text={error} />
            }
            {
                success && <Message setError={setError} setSuccess={setSuccess} type="success" text={success} />
            }
            <input ref={inputRef} name="file" type="file" onChange={handleFileSelection} hidden />
            <div className="h-screen min-h-96">
                <div className="border rounded-t-lg bg-base-100 p-1">
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
                </div>
                <div className="border h-2/3 overflow-y-scroll p-4 relative">
                    {
                        traces.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
                                <h1 className="font-semibold text-3xl">Upload a seismic file</h1>
                                <p className="text-lg">Start by uploading a seismic file to interact with the tool</p>
                                <Button 
                                    onClick={handleFileUpload} 
                                    loading={loading}
                                    toolTipText="Upload a seismic file"
                                >
                                    <FiUpload />
                                    Upload file
                                </Button>
                            </div>
                        ) : (
                            <>
                                <ProcessingFilters 
                                    appliedProcesses={appliedProcesses}
                                    handleRemoveProcesses={handleRemoveProcesses}
                                />
                                <Graphs 
                                    traces={traces} 
                                    fourierData={fourierData}
                                />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

