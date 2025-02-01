'use client';

import { useEffect, useState } from "react"

import UploadFileButton from "@/components/UploadFileButton";
import StartingUploadFile from "@/components/StartingUploadFile";
import Message from "@/components/Message";
import Section from "@/components/Section";
import Button from "@/components/Button"
import { RadioButtonElement, SelectElement, NumberInputElement, LabelElement } from "@/components/UIElements";
import LineGraph from "@/components/LineGraph"
import Spinner from "@/components/Spinner"

import { fastapiEndpoints, arrivalsStyles } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";
import { downloadURI } from "@/utils/functions";

import { MdOutlineFileDownload } from "react-icons/md";

export default function PickArrivals() {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false);
    const [selectedWave, setSelectedWave] = useState("P");
    const [arrivals, setArrivals] = useState([]);
    const [manualFilter, setManualFilter] = useState({freqMin: 0.1, freqMax: 3})
    const [selectedFilter, setSelectedFilter] = useState("initial")
    const [filterOptions, setFilterOptions] = useState([])

    useEffect(() => {
        const fetchFilterOptions = async () => {

            const jsonData = await fetchRequest({
                endpoint: fastapiEndpoints["FILTER-OPTIONS"],
                setError: setError,
                setSuccess: setSuccess,
                setLoading: setLoading,
                method: "GET",
            });

            setFilterOptions(jsonData); 
        };
    
        fetchFilterOptions();
      }, []); 

    // transform the arrivals list into an object to get easier the arrival values
    // of the P & S waves
    let formattedArrivals = {"P": null, "S": null};
    
    arrivals.forEach(arr => (
        formattedArrivals[arr.wave] = arr.arrival
    ))

    // initialize the data that will be used to create the plots
    const [backupTraces, setBackupTraces] = useState([]);
    const [traces, setTraces] = useState([]);

    // define the shapes to pass into the layout, when a user adds an arrival vertcal line
    let shapes = arrivals.map(arr => (
        {
            type: "line",
            x0: arr["arrival"],
            y0: 0,  
            x1: arr["arrival"],
            y1: 1,
            line: {
                color: arrivalsStyles.line.color,
                width: arrivalsStyles.line.width,
                dash: arrivalsStyles.line.style
            },
            xref: "x",  // X-axis is referenced in data coordinates
            yref: "paper"  // Y-axis is referenced in paper coordinates (0 to 1 range)
        }
    ))
    

    //  set the arrival text (P or S) next to the vertical arrival line
    let annotations =  arrivals.map(arr => (
        {
            x: backupTraces.length !== 0 ? arr["arrival"] - (backupTraces[0]["stats"]["duration"] / 40) : 0,
            y: 0.8,
            xref: "x", 
            yref: "paper", 
            text: arr["wave"],
            showarrow: false,
            font: {
                size: arrivalsStyles.label.size
            },
        }
    ))

    useEffect(() => {
        setTraces(backupTraces);
        setArrivals([]);
        setSelectedWave("P");
        setSelectedFilter("initial");
        setManualFilter({"freqMin": "", "freqMax": ""});
    }, [backupTraces])
    

    async function handleFilterChange(freqMin=null, freqMax=null) {

        const requestBody =  {
            data: backupTraces.map(tr => ({
                trace_id: tr.trace_id,
                values: tr.ydata
            })),
            options: {
                freq_min: freqMin,
                freq_max: freqMax,
                sampling_rate: backupTraces[0].stats.sampling_rate
            }
        }

        const jsonData = await fetchRequest({
            endpoint: fastapiEndpoints["FILTER-WAVEFORM"],
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "POST",
            data: requestBody,
        });
        
        setTraces(
            backupTraces.map(tr => {
                const updatedTrace = jsonData.find(el => el.trace_id === tr.trace_id);
                return {...tr, ydata: updatedTrace.values}
            })
        )
    }

    // this function will be called from the dropdown filter
    function handleDropdownFilterChange(e) {
        setSelectedFilter(e.target.value)
        const dropdownFilterValue = e.target.value;
        
        if (dropdownFilterValue === "initial") {
            setTraces(backupTraces)
        }
        else {
            const parts = dropdownFilterValue.split("-")
            handleFilterChange(parts[0], parts[1])
        }
    }

    // this function will be called from the manual left or right filter on enter key pressed 
    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            handleFilterChange(
                manualFilter["freqMin"] ? manualFilter["freqMin"] : null, 
                manualFilter["freqMax"] ? manualFilter["freqMax"] : null, 
            )
        }
    }

    // this function will be called by the delete P or S buttons
    function handleDeleteWave(wave) {
        setSelectedWave(wave)
        setArrivals(arrivals.filter(arr => arr.wave !== wave))
    }

    // this function will be called by the save arrivals button
    async function handleSaveArrivals() {

        let PArr = formattedArrivals["P"];
        let SArr = formattedArrivals["S"];

        let queryParams = (PArr && `Parr=${PArr}&`) + (SArr && `Sarr=${SArr}`)

        const blobData = await fetchRequest({
            endpoint: fastapiEndpoints["SAVE-ARRIVALS"] + "?" + queryParams,
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "GET",
            returnType: "blob"
        });

        const downloadUrl = window.URL.createObjectURL(blobData);
        downloadURI(downloadUrl, "arrivals.txt") 
    }

    function onGraphClick(e) {    
        const point = e.points[0]; 
        for (let arr of arrivals) {
            if (arr["wave"] === selectedWave && arr["arrival"]) {
                return
            }
        }

        if (point) {
            const x = point.x;
            setSelectedWave(selectedWave === "P" ? "S" : "P")
            setArrivals((oldarrivals) => ([...oldarrivals, {wave: selectedWave, arrival: x}]))
        }
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
                                    setError={setError}
                                    setSuccess={setSuccess}
                                    setLoading={setLoading} 
                                    buttonClass="btn-ghost btn-sm" 
                                />
                                <Button 
                                    onClick={handleSaveArrivals} 
                                    disabled={traces.length===0 || (!formattedArrivals["P"] && !formattedArrivals["S"])} 
                                    variant="ghost"
                                >
                                    <MdOutlineFileDownload />
                                    Download arrivals
                                </Button>
                            </div>
                            <hr className="mt-2 mb-8" />
                            <div className="flex flex-row items-center justify-around mt-3 py-3">
                                <div className="flex flex-row items-center">
                                    <div className="flex flex-row items-center">
                                        <LabelElement label="P" className="mx-1 text-lg" />
                                        <RadioButtonElement 
                                            label="P"
                                            id="p-wave-radio"
                                            name="ps-wave-radio"
                                            value="P"
                                            checked={selectedWave === "P"}
                                            onChange={() => setSelectedWave("P")}
                                            disabled={traces.length===0 || formattedArrivals["P"]}
                                            className="radio-sm"
                                        />
                                    </div>
                                    <div className="flex flex-row items-center mx-5">
                                        <LabelElement label="S" className="mx-1 text-lg" />
                                        <RadioButtonElement 
                                            label="S"
                                            id="s-wave-radio"
                                            name="ps-wave-radio"
                                            value="S"
                                            checked={selectedWave === "S"}
                                            onChange={() => setSelectedWave("S")}
                                            disabled={traces.length===0 || formattedArrivals["S"]}
                                            className="radio-sm"
                                        />
                                    </div>
                                    <div className="flex gap-2 ms-4">
                                        <button onClick={(e) => handleDeleteWave("P")} className="btn btn-sm btn-error" disabled={!formattedArrivals["P"]}>Del. P</button>
                                        <button onClick={(e) => handleDeleteWave("S")} className="btn btn-sm btn-error" disabled={!formattedArrivals["S"]}>Del. S</button>
                                    </div>
                                </div>
                                <SelectElement 
                                    id="filters-dropdown"
                                    name="filters-dropdown"
                                    value={selectedFilter}
                                    onChange={handleDropdownFilterChange}
                                    disabled={traces.length===0}
                                    optionsList={filterOptions}
                                    className="select-sm"
                                />
                            </div>
                            <Spinner visible={loading} />
                            <div className="my-3">
                                {
                                    traces.map((tr, ind) => (
                                        <div key={tr.trace_id}>
                                            {
                                                <LineGraph 
                                                    xData={[tr["xdata"]]} 
                                                    yData={[tr["ydata"]]} 
                                                    height="220px"
                                                    legendTitle={[`Component: ${tr["stats"]["channel"]}`]}
                                                    showGraphTitle={ind === 0}
                                                    graphTitle={""}
                                                    shapes={shapes}
                                                    annotations={annotations}
                                                    onGraphClick={onGraphClick}
                                                />
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="flex justify-end align-center gap-3 mt-4">
                                <div className="mb-3">
                                    <NumberInputElement 
                                        id="freq_min" 
                                        name="freq_min" 
                                        value={manualFilter["freqMin"]} 
                                        onKeyDown={handleEnterKey} 
                                        onChange={(e) => setManualFilter({...manualFilter, freqMin: e.target.value})} 
                                        placeholder="e.g. 0.1"
                                        disabled={traces.length===0}
                                        className="input-sm"
                                    />
                                </div>
                                <div className="mb-3">
                                    <NumberInputElement 
                                        id="freq_max" 
                                        name="freq_max" 
                                        value={manualFilter["freqMax"]} 
                                        onKeyDown={handleEnterKey} 
                                        onChange={(e) => setManualFilter({...manualFilter, freqMax: e.target.value})} 
                                        placeholder="e.g. 3"
                                        disabled={traces.length===0}
                                        className="input-sm"
                                    />
                                </div>
                            </div>
                            <Spinner visible={loading} />
                        </div>
                    </>
                )
            }
        </Section>
    )
}