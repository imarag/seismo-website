'use client';

import { useEffect, useState } from "react";

import LineGraph from "@/components/LineGraph"
import { NumberInputElement, LabelElement, SelectElement, SliderElement } from "@/components/UIElements";
import Spinner from "@/components/Spinner";
import UploadFileButton from "@/components/UploadFileButton";
import StartingUploadFile from "@/components/StartingUploadFile";
import Message from "@/components/Message";
import Collapse from "@/components/Collapse"
import Section from "@/components/Section";

import { fastapiEndpoints, fourierWindowStyles } from "@/utils/static";
import { getRandomNumber } from "@/utils/functions"
import fetchRequest from "@/utils/functions/fetchRequest";


import { IoMdClose } from "react-icons/io";
import { IoCut, IoFilter } from "react-icons/io5";
import { BsSoundwave } from "react-icons/bs";
import { MdAlignVerticalCenter, MdArrowDropDown } from "react-icons/md";

function MenuButton({ onClick }) {
    return (
        <button className="btn btn-sm btn-secondary block w-full mt-4" onClick={onClick}>apply</button>
    )
}

function DropDownButton({ label, icon, className, children }) {
    return (
        <div className={`dropdown dropdown-start ${className ? className : ""}`}>
            <div tabIndex={0} role="button" className="btn btn-sm btn-outline  m-1 inline-flex justify-center items-center gap-2">
                <span>{ icon }</span>
                <span>{ label }</span>
                <span>{ <MdArrowDropDown /> }</span>
            </div>
            <ul tabIndex={0} className="dropdown-content p-6 bg-base-100 rounded-box z-[1] w-52 shadow">
                <li>
                    { children }
                </li>
            </ul>
        </div>
    )
}

export default function SignalProcessing() {

    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([]);
    const [fourierData, setFourierData] = useState([])
    const [HVSRData, setHVSRData] = useState([])
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [appliedProcesses, setAppliedProcesses] = useState([])
    const [verticalComponent, setVerticalComponent] = useState("")
    const [signalProcessingOptions, setSignalProcessingOptions] = useState({
        "detrend-type": "simple",
        "taper-type": "parzen",
        "taper-side": "both",
        "taper-length": 20,
        "trim-left-side": 0,
        "trim-right-side": 0,
        "filter-min": 0,
        "filter-max": 0
    })
    const [taperTypeOptions, setTaperTypeOptions] = useState([])
    const [taperSideOptions, setTaperSideOptions] = useState([])
    const [detrendTypeOptions, setDetrendTypeOptions] = useState([])

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

            const initialVerticalComponent = verticalComponent === null ? traces[0].stats.channel : verticalComponent
            const HVSRBody = {
                fourier_data: FourierJsonData.map((el, ind) => ({
                    // at the beginning verticalComponent is null that is why i have the initialVerticalComponent
                    component: initialVerticalComponent === el.component ? "vertical" : "horizontal", 
                    values: el.fas_amps,
                }))
            }

            const HVSRJsonData = await fetchRequest({
                endpoint: fastapiEndpoints["COMPUTE-HVSR"],
                setError: setError,
                setSuccess: setSuccess,
                setLoading: setLoading,
                method: "POST",
                data: HVSRBody
            });

            setHVSRData(HVSRJsonData);
        }

        if (traces.length !== 0) {
            applyProcesses();
        }

    }, [traces, verticalComponent])
    
    useEffect(() => {
        async function fetchTaperTypeOptions() {
            const jsonData = await fetchRequest({
                endpoint: fastapiEndpoints["TAPER-TYPE-OPTIONS"],
                setError: setError,
                setSuccess: setSuccess,
                setLoading: setLoading,
                method: "GET",
            });
            setTaperTypeOptions(jsonData);
        }    
        fetchTaperTypeOptions();
      }, []);
      
      useEffect(() => {
        async function fetchTaperSideOptions() {
            const jsonData = await fetchRequest({
                endpoint: fastapiEndpoints["TAPER-SIDE-OPTIONS"],
                setError: setError,
                setSuccess: setSuccess,
                setLoading: setLoading,
                method: "GET",
            });
            setTaperSideOptions(jsonData);
        }    
        fetchTaperSideOptions();
      }, []);

      useEffect(() => {
        async function fetchDetrendTypeOptions() {
            const jsonData = await fetchRequest({
                endpoint: fastapiEndpoints["DETREND-TYPE-OPTIONS"],
                setError: setError,
                setSuccess: setSuccess,
                setLoading: setLoading,
                method: "GET",
            });
            setDetrendTypeOptions(jsonData);
        }    
        fetchDetrendTypeOptions();
      }, []);

      useEffect(() => {
        setBackupTraces(backupTraces);
    }, [backupTraces])


    let shapes = [
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: signalProcessingOptions["trim-left-side"],
            y0: 0,
            x1: signalProcessingOptions["trim-right-side"],
            y1: 1,
            line: {
                color: fourierWindowStyles.signal.edgeColor,
                width: fourierWindowStyles.signal.width
            },
            fillcolor: fourierWindowStyles.signal.fillColor
        }
    ]


    let duration = traces.length !== 0 ? traces[0].ydata.length / traces[0].stats.sampling_rate : 0

    

    function handleSignalProcessingOptionsChange(processingOption, value, type = "text") {
        const userSelectedValue = type === "text" ? value : Number(value)
        const newProcessingOptions = { ...signalProcessingOptions, [processingOption]: userSelectedValue }
        setSignalProcessingOptions(newProcessingOptions)
    }

    async function handleTrimApply() {
        const process = {
            fetchURL: fastapiEndpoints["TRIM-WAVEFORM"],
            text: `trim-${signalProcessingOptions["trim-left-side"]}-${signalProcessingOptions["trim-right-side"]}`,
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    trim_start: signalProcessingOptions["trim-left-side"], 
                    trim_end: signalProcessingOptions["trim-right-side"]
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


        setSignalProcessingOptions(
            { ...signalProcessingOptions, "trim-left-side": 0, "trim-right-side": 0}
        )
    }

    async function handleTaperApply() {
        const process = {
            fetchURL: fastapiEndpoints["TAPER-WAVEFORM"],
            text: `taper-${signalProcessingOptions["taper-type"]}-${signalProcessingOptions["taper-side"]}-${signalProcessingOptions["taper-length"]}`,
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    taper_type: signalProcessingOptions["taper-type"],
                    taper_side: signalProcessingOptions["taper-side"],
                    taper_length: signalProcessingOptions["taper-length"],
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
            text: `detrend-${signalProcessingOptions["detrend-type"]}`,
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    detrend_type: signalProcessingOptions["detrend-type"]
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
                signalProcessingOptions["filter-min"] ? signalProcessingOptions["filter-min"] : null,
                signalProcessingOptions["filter-max"] ? signalProcessingOptions["filter-max"] : null,
            ),
            fetchBody: {
                data: traces.map(tr => ({
                    trace_id: tr.trace_id,
                    values: tr.ydata
                })),
                options: {
                    sampling_rate: traces[0].stats.sampling_rate,
                    freq_min: signalProcessingOptions["filter-min"] ? signalProcessingOptions["filter-min"] : null,
                    freq_max: signalProcessingOptions["filter-max"] ? signalProcessingOptions["filter-max"] : null,
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

    function handleRemoveProcesses(process) {
        setTraces(backupTraces)
        setAppliedProcesses([])
    }

    return (
        <Section>
            {
                error && <Message type="error" text={error} />
            }
            {
                success && <Message type="success" text={success} />
            }
            {backupTraces.length === 0 && (
                <StartingUploadFile 
                    setTraces={setTraces} 
                    setSuccess={setSuccess} 
                    setBackupTraces={setBackupTraces} 
                    setError={setError} 
                    setLoading={setLoading} 
                />
            )}
            {
                backupTraces.length !== 0 && (
                    <>
                            <div>
                                <div className="flex flex-row items-center justify-start gap-1">
                                    <UploadFileButton 
                                        setTraces={setTraces} 
                                        setBackupTraces={setBackupTraces}
                                        setLoading={setLoading} 
                                        buttonClass="btn-ghost" 
                                        setError={setError}
                                        setSuccess={setSuccess}
                                    />
                                </div>
                                <hr />
                            </div>
                            <div className="flex flex-row flex-wrap items-center justify-start">
                                <DropDownButton label="Taper" icon={<BsSoundwave />}>
                                    <div className="flex flex-col items-stretch gap-3">
                                        <div>
                                            <LabelElement label="Type" id="taper-type" />
                                            <SelectElement 
                                                id="taper-type"
                                                name="taper-type"
                                                optionsList={taperTypeOptions}
                                                value={signalProcessingOptions["taper-type"]} 
                                                className="select-sm block w-full"
                                                onChange={(e) => handleSignalProcessingOptionsChange("taper-type", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <LabelElement label="Side" id="taper-side" />
                                            <SelectElement 
                                                id="taper-side"
                                                name="taper-side"
                                                optionsList={taperSideOptions}
                                                value={signalProcessingOptions["taper-side"]} 
                                                className="select-sm block w-full"
                                                onChange={(e) => handleSignalProcessingOptionsChange("taper-side", e.target.value)}
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
                                                value={signalProcessingOptions["taper-length"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("taper-length", e.target.value, "number")}
                                            />
                                        </div>
                                        <MenuButton onClick={handleTaperApply} />
                                    </div>
                                </DropDownButton>
                                <DropDownButton label="Trim" icon={<IoCut />}>
                                    <div className="flex flex-col items-stretch gap-3">
                                        <div>
                                            <LabelElement label="Trim left side" id="trim-left-side" />
                                            <NumberInputElement 
                                                id="trim-left-side"
                                                name="trim-left-side"
                                                min={0}
                                                max={duration} 
                                                step={0.1}
                                                className="input-sm mt-3 block w-full"
                                                value={signalProcessingOptions["trim-left-side"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("trim-left-side", e.target.value, "number")}
                                            />

                                            <SliderElement 
                                                id="trim-left-side"
                                                name="trim-left-side"
                                                min={0}
                                                max={duration} 
                                                step={0.1}
                                                className="range-xs mt-3 block w-full"
                                                value={signalProcessingOptions["trim-left-side"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("trim-left-side", e.target.value, "number")}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <LabelElement label="Trim right side" id="trim-right-side" />
                                            <NumberInputElement 
                                                id="trim-right-side"
                                                name="trim-right-side"
                                                min={0}
                                                max={duration} 
                                                step={0.1}
                                                className="input-sm block w-full"
                                                value={signalProcessingOptions["trim-right-side"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("trim-right-side", e.target.value, "number")}
                                            />
                                            <SliderElement 
                                                id="trim-right-side"
                                                name="trim-right-side"
                                                min={0}
                                                max={duration} 
                                                step={0.1}
                                                className="range-xs block w-full"
                                                value={signalProcessingOptions["trim-right-side"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("trim-right-side", e.target.value, "number")}
                                            />
                                        </div>
                                        <MenuButton onClick={handleTrimApply} />
                                    </div>
                                </DropDownButton>
                                <DropDownButton label="Detrend" icon={<MdAlignVerticalCenter />}>
                                    <div className="flex flex-col items-stretch gap-3">
                                        <div>
                                            <LabelElement label="Type" id="detrend-type" />
                                            <SelectElement 
                                                id="detrend-type"
                                                name="detrend-type"
                                                optionsList={detrendTypeOptions}
                                                className="select-sm block w-full"
                                                value={signalProcessingOptions["detrend-type"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("detrend-type", e.target.value)}
                                            />
                                        </div>
                                        <MenuButton onClick={handleDetrendApply} />
                                    </div>
                                </DropDownButton>
                                <DropDownButton label="Filter" icon={<IoFilter />}>
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
                                                value={signalProcessingOptions["filter-min"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("filter-min", e.target.value)}
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
                                                value={signalProcessingOptions["filter-max"]} 
                                                onChange={(e) => handleSignalProcessingOptionsChange("filter-max", e.target.value)}
                                            />
                                        </div>
                                        <p className="text-center text-sm">If zero, it is considered not filled</p>
                                        <MenuButton onClick={handleFilterApply} />
                                    </div>
                                </DropDownButton>
                            </div>
                            <Spinner visible={loading} />
                            <div>
                                <p>Filters applied:</p>
                                <div>
                                    {
                                        appliedProcesses.length !== 0 && (
                                            <div>
                                                <div className="flex flex-row flex-wrap gap-2 my-6">
                                                    {
                                                        appliedProcesses.map((process, index) => (
                                                            <span key={process.text} className="badge badge-info">
                                                                {index+1}. {process.text}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                                <button onClick={handleRemoveProcesses} className="btn btn-xs btn-error">
                                                    remove all filters
                                                    <IoMdClose />
                                                </button>
                                            </div>
                                        )
                                    }
                                    {
                                        appliedProcesses.length === 0 && (
                                            <p className="mt-5">There are not filters applied!</p>
                                        )
                                    }
                                    
                                </div>
                            </div>
                            <div>
                                {
                                    traces.map((tr, ind) => (
                                        <div key={tr.trace_id}>
                                            {
                                                <LineGraph
                                                    xData={traces.length !== 0 ? [tr["xdata"]] : []}
                                                    yData={traces.length !== 0 ? [tr["ydata"]] : []}
                                                    graphTitle=""
                                                    showLegend={false}
                                                    height="220px"
                                                    shapes={shapes}
                                                />
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            <Collapse label="Fourier Spectra">
                                {
                                    fourierData.length !== 0 && (
                                        <div>
                                            {
                                                fourierData.map((tr, ind) => (
                                                    <div key={tr.trace_id}>
                                                        <LineGraph
                                                            xData={[tr["fas_freqs"]]}
                                                            yData={[tr["fas_amps"]]}
                                                            graphTitle=""
                                                            scale="log"
                                                            showLegend={false}
                                                            height="220px"
                                                            legendTitle={tr.component}
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </Collapse>
                            <Collapse label="HVSR">
                                <div>
                                    <LabelElement label="Vertical component" id="vertical-component" />
                                    <SelectElement 
                                        id="vertical-component"
                                        name="vertical-component"
                                        optionsList={traces.map(tr => ({label: tr.stats.channel, value: tr.stats.channel}))}
                                        value={verticalComponent} 
                                        className="select-sm"
                                        onChange={(e) => setVerticalComponent(e.target.value)}
                                    />
                                </div>
                                <LineGraph
                                    xData={[fourierData.length !== 0 ? fourierData[0]["fas_freqs"] : []]}
                                    yData={[HVSRData.length !== 0 ? HVSRData : []]}
                                    graphTitle=""
                                    scale="log"
                                    showLegend={false}
                                    height="220px"
                                />
                            </Collapse>
                    </>
                )
            }
        </Section>
    )
}



    // useEffect(() => {
    //     async function applyProcesses() {
    //         setLoading(true);
    
    //         let allJSONData = [];
    //         for (const process of appliedProcesses) {
    //             const response = await fetch(
    //                 process.fetchURL, 
    //                 {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
    //             );
        
    //             if (!response.ok) {
    //                 const errorData = await response.json();
    //                 setError(errorData["error_message"])
    //                 throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
    //             }
        
    //             const jsonData = response.json();
    //             setError([])

    //             allJSONData = jsonData; // Overwrite with the latest fetch result
    //         }

    //         setTraces(
    //             backupTraces.map((tr) => {
    //                 const updatedTrace = allJSONData.find((el) => el.trace_id === tr.trace_id);
    //                 return updatedTrace
    //                     ? { ...tr, ydata: updatedTrace.values }
    //                     : tr;
    //             })
    //         );  
    //     }
    //     applyProcesses();
    // }, [appliedProcesses])
    
            // const fourierData = await computeFourier(allJSONData);
            // const hvsrData = await computeHVSR(fourierData);

            // // Update states
            // setFourierData(fourierData);
            // setHVSRData(hvsrData);
              
    

            // async function handleTrimApply() {
            //     const process = {
            //         fetchURL: fastapiEndpoints["TRIM-WAVEFORM"],
            //         text: `trim-${signalProcessingOptions["trim-left-side"]}-${signalProcessingOptions["trim-right-side"]}`,
            //         fetchBody: {
            //             data: traces.map(tr => ({
            //                 trace_id: tr.trace_id,
            //                 values: tr.ydata
            //             })),
            //             options: {
            //                 sampling_rate: traces[0].stats.sampling_rate,
            //                 trim_start: signalProcessingOptions["trim-left-side"], 
            //                 trim_end: signalProcessingOptions["trim-right-side"]
            //             }
            //         },
            //         processId: getRandomNumber()
            //     }
            //     const response = await fetch(
            //         process.fetchURL, 
            //         {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
            //     );
        
            //     if (!response.ok) {
            //         const errorData = await response.json();
            //         setError(errorData["error_message"])
            //         throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
            //     }
        
            //     const jsonData = await response.json();
        
            //     setError([])
            //     setTraces(
            //         traces.map(trace => {
            //             const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
            //             return updatedTrace
            //                 ? { ...trace, ydata: updatedTrace.values }
            //                 : trace;
            //         })
            //     )
            //     setAppliedProcesses([...appliedProcesses, process])
        
        
            //     setSignalProcessingOptions(
            //         { ...signalProcessingOptions, "trim-left-side": 0, "trim-right-side": 0}
            //     )
            // }
        
            // async function handleTaperApply() {
            //     const process = {
            //         fetchURL: fastapiEndpoints["TAPER-WAVEFORM"],
            //         text: `taper-${signalProcessingOptions["taper-type"]}-${signalProcessingOptions["taper-side"]}-${signalProcessingOptions["taper-length"]}`,
            //         fetchBody: {
            //             data: traces.map(tr => ({
            //                 trace_id: tr.trace_id,
            //                 values: tr.ydata
            //             })),
            //             options: {
            //                 sampling_rate: traces[0].stats.sampling_rate,
            //                 taper_type: signalProcessingOptions["taper-type"],
            //                 taper_side: signalProcessingOptions["taper-side"],
            //                 taper_length: signalProcessingOptions["taper-length"],
            //             }
            //         },
            //         processId: getRandomNumber()
            //     }
        
            //     const response = await fetch(
            //         process.fetchURL, 
            //         {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
            //     );
        
            //     if (!response.ok) {
            //         const errorData = await response.json();
            //         setError(errorData["error_message"])
            //         throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
            //     }
        
            //     const jsonData = await response.json();
            //     setError([])
            //     setTraces(
            //         traces.map(trace => {
            //             const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
            //             return updatedTrace
            //                 ? { ...trace, ydata: updatedTrace.values }
            //                 : trace;
            //         })
            //     )
         
            //     setAppliedProcesses([...appliedProcesses, process])
            // }
        
            // async function handleDetrendApply() {
            //     const process = {
            //         fetchURL: fastapiEndpoints["DETREND-WAVEFORM"],
            //         text: `detrend-${signalProcessingOptions["detrend-type"]}`,
            //         fetchBody: {
            //             data: traces.map(tr => ({
            //                 trace_id: tr.trace_id,
            //                 values: tr.ydata
            //             })),
            //             options: {
            //                 sampling_rate: traces[0].stats.sampling_rate,
            //                 detrend_type: signalProcessingOptions["detrend-type"]
            //             }
            //         },
            //         processId: getRandomNumber()
            //     }
            //     const response = await fetch(
            //         process.fetchURL,
            //         {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
            //     );
        
            //     if (!response.ok) {
            //         const errorData = await response.json();
            //         setError(errorData["error_message"])
            //         throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
            //     }
        
            //     const jsonData = await response.json();
            //     setError([])
            //     setTraces(
            //         traces.map(trace => {
            //             const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
            //             return updatedTrace
            //                 ? { ...trace, ydata: updatedTrace.values }
            //                 : trace;
            //         })
            //     )
         
            //     setAppliedProcesses([...appliedProcesses, process])
            // }
        
            // function getFilterPill(freqMin, freqMax) {
            //     if (freqMin === null && freqMax === null) {
            //         return "no-filter"
            //     }
            //     else if (freqMin === null && freqMax !== null) {
            //         return `lowpass-${freqMax}Hz`
            //     }
            //     else if (freqMin !== null && freqMax == null) {
            //         return `highpass-${freqMin}Hz`
            //     }
            //     else {
            //         return `bandpass-${freqMin}-${freqMax}Hz`
            //     }
            // }
        
            // async function handleFilterApply() {
            //     const process = {
            //         fetchURL: fastapiEndpoints["FILTER-WAVEFORM"],
            //         text: getFilterPill(
            //             signalProcessingOptions["filter-min"] ? signalProcessingOptions["filter-min"] : null,
            //             signalProcessingOptions["filter-max"] ? signalProcessingOptions["filter-max"] : null,
            //         ),
            //         fetchBody: {
            //             data: traces.map(tr => ({
            //                 trace_id: tr.trace_id,
            //                 values: tr.ydata
            //             })),
            //             options: {
            //                 sampling_rate: traces[0].stats.sampling_rate,
            //                 freq_min: signalProcessingOptions["filter-min"] ? signalProcessingOptions["filter-min"] : null,
            //                 freq_max: signalProcessingOptions["filter-max"] ? signalProcessingOptions["filter-max"] : null,
            //             }
            //         },
            //         processId: getRandomNumber()
                    
            //     }
            //     const response = await fetch(
            //         process.fetchURL, 
            //         {method: "POST", body: JSON.stringify(process.fetchBody), credentials: 'include', headers: {'Content-Type': 'application/json'}}
            //     );
        
            //     if (!response.ok) {
            //         const errorData = await response.json();
            //         setError(errorData["error_message"])
            //         throw new Error(`Error: ${response.status} - ${errorData.message || 'Request failed'}`);
            //     }
        
            //     const jsonData = await response.json();
            //     setError([])
            //     setTraces(
            //         traces.map(trace => {
            //             const updatedTrace = jsonData.find((el) => el.trace_id === trace.trace_id);
            //             return updatedTrace
            //                 ? { ...trace, ydata: updatedTrace.values }
            //                 : trace;
            //         })
            //     )
         
            //     setAppliedProcesses([...appliedProcesses, process])
            // }