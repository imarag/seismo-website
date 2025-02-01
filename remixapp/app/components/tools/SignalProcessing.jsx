import Button from "@/components/ui/Button"
import LineGraph from "@/components/ui/LineGraph"
import Spinner from "@/components/ui/Spinner"
import Container from "@/components/ui/Container"
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

function UploadButon({ outline=false, loading=false, handleFileUpload=null }) {
    return (
        <>
            <Button onClick={handleFileUpload} variance="ghost" outline={outline} loading={loading}>
                <FiUpload />
                Upload file
            </Button>
        </>
    )
}

function MenuButton({ onClick }) {
    return (
        <button className="btn btn-sm btn-secondary block w-full mt-4" onClick={onClick}>apply</button>
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
        <>
            <div className="flex flex-row items-center justify-center">
                <div className="grow-0 border-r">
                    <UploadButon loading={loading} handleFileUpload={handleFileUpload} />
                </div>
                <div className="grow">
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
                            <MenuButton onClick={handleTaperApply} />
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
                            <MenuButton onClick={handleTrimApply} />
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
                            <MenuButton onClick={handleDetrendApply} />
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
                            <MenuButton onClick={handleFilterApply} />
                        </div>
                    </MenuDropdown>
                </div>
            </div>
        </>
    )
}

function Graphs({ traces, fourierData, loading, handleFileUpload }) {
    return (
        <>
            {
                traces.length === 0 ? (
                    <div className="flex flex-row justify-center items-center h-5/6">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <p className="font-semibold text-xl">Upload a seismic file</p>
                            <UploadButon outline={true} handleFileUpload={handleFileUpload} />
                            <Spinner visible={loading}/>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-row justify-center items-center">
                            <div className="grow-7 bg-blue-500 h-20">
                                {/* {
                                    traces.map((tr, ind) => (
                                        <div key={tr.trace_id}>
                                            <LineGraph
                                                xData={traces.length !== 0 ? [tr["xdata"]] : []}
                                                yData={traces.length !== 0 ? [tr["ydata"]] : []}
                                                graphTitle=""
                                                showLegend={false}
                                            />
                                        </div>
                                    ))
                                } */}
                            </div>
                            <div className="grow-1 bg-red-500 h-10">
                                {/* {
                                    fourierData.map((tr, ind) => (
                                        <div key={tr.trace_id}>
                                            <LineGraph
                                                xData={[tr["fas_freqs"]]}
                                                yData={[tr["fas_amps"]]}
                                                graphTitle=""
                                                scale="log"
                                                showLegend={false}
                                                legendTitle={tr.component}
                                            />
                                        </div>
                                    ))
                                } */}
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default function SignalProcessingPage() {
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false)
    const [traces, setTraces] = useState([]);
    const [fourierData, setFourierData] = useState([])
    const [backupTraces, setBackupTraces] = useState([])
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

    return (
        <div>
            {/* {
                error && <Message type="error" text={error} />
            }
            {
                success && <Message type="success" text={success} />
            }
            <input ref={inputRef} name="file" type="file" onChange={handleFileSelection} hidden />
            <div className="flex flex-col justify-center items-stretch border">
                <div className="border">
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
                <div>
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
                                            <Button variance="error" size="small" onClick={handleRemoveProcesses}>
                                                remove all
                                                <IoMdClose />
                                            </Button>
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    
                    </div>
                </div>
                <div>
                    <Graphs 
                        traces={traces} 
                        fourierData={fourierData}
                        loading={loading} 
                        handleFileUpload={handleFileUpload}
                    />
                </div>
                
            </div>
            <div className="flex flex-row items-center justify-center bg-slate-500">
                    <div className="h-20 flex-grow bg-blue-500">dsrgs</div>
                    <div className="h-20 flex-grow bg-red-500">dsf</div>
                </div> */}
        </div>
    )
}