import { useRef, useState } from "react"
import Message from "@/components/ui/Message";
import Button from "@/components/ui/Button";
import { RadioButtonElement, SelectElement, NumberInputElement, LabelElement } from "@/components/ui/UIElements";
import LineGraph from "@/components/ui/LineGraph"
import { FiUpload } from "react-icons/fi";
import { fastapiEndpoints, arrivalsStyles } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";
import { downloadURI } from "@/utils/functions";
import { MdOutlineFileDownload } from "react-icons/md";
import { filterOptions } from "@/utils/static"
import Spinner from "@/components/ui/Spinner"
import { IoMdClose } from "react-icons/io";


function PSElements({ traces, selectedWave, setSelectedWave, handleDeleteWave, formattedArrivals }) {
    return (
        <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row items-center">
                <LabelElement label="P" className="text-lg" />
                <RadioButtonElement 
                    label="P"
                    id="p-wave-radio"
                    name="ps-wave-radio"
                    value="P"
                    checked={selectedWave === "P"}
                    onChange={() => setSelectedWave("P")}
                    disabled={traces.length===0 || formattedArrivals["P"]!==null}
                    className="radio-sm"
                />
            </div>
            <div className="flex flex-row items-center">
                <LabelElement label="S" className="text-lg" />
                <RadioButtonElement 
                    label="S"
                    id="s-wave-radio"
                    name="ps-wave-radio"
                    value="S"
                    checked={selectedWave === "S"}
                    onChange={() => setSelectedWave("S")}
                    disabled={traces.length===0 || formattedArrivals["S"]!==null}
                    className="radio-sm"
                />
            </div>
            {
                formattedArrivals["P"]!==null && (
                    <Button 
                        onClick={(e) => handleDeleteWave("P")} 
                        variant="error"
                        size="extra-small"
                        outline={true}
                    >
                        P
                        <IoMdClose className="size-4"/>
                    </Button> 
                )
            }
            {
                formattedArrivals["S"]!==null && (
                    <Button 
                        onClick={(e) => handleDeleteWave("S")} 
                        variant="error"
                        size="extra-small"
                        outline={true}
                    >
                        S
                        <IoMdClose className="size-4"/>
                    </Button>
                )
            }
        </div>
    )
}

function FiltersDropdown({ traces, selectedFilter, handleDropdownFilterChange }) {
    return (
        <SelectElement 
            id="filters-dropdown"
            name="filters-dropdown"
            value={selectedFilter}
            onChange={handleDropdownFilterChange}
            disabled={traces.length===0}
            optionsList={filterOptions}
            className="select-sm"
        />
    )
}

function FiltersInputs({ traces, manualFilter, setManualFilter, handleEnterKey }) {
    return (
        <div className="flex justify-end align-center gap-3 mt-4">
            <LabelElement text="na" />
            <NumberInputElement 
                id="freq_min" 
                name="freq_min" 
                value={manualFilter["freqMin"]} 
                onKeyDown={handleEnterKey} 
                onChange={(e) => setManualFilter({...manualFilter, freqMin: e.target.value})} 
                placeholder="e.g. 0.1"
                disabled={traces.length===0}
                className="input-sm w-40"
            />
            <NumberInputElement 
                id="freq_max" 
                name="freq_max" 
                value={manualFilter["freqMax"]} 
                onKeyDown={handleEnterKey} 
                onChange={(e) => setManualFilter({...manualFilter, freqMax: e.target.value})} 
                placeholder="e.g. 3"
                disabled={traces.length===0}
                className="input-sm w-40"
            />
        </div>
    )
}


function MainMenu({ traces, setTraces, handleFilterChange, loading, setLoading, setError, setSuccess, handleFileUpload, arrivals, setArrivals, selectedWave, setSelectedWave, backupTraces}) {
    
    const [selectedFilter, setSelectedFilter] = useState("initial");
    let formattedArrivals = {"P": null, "S": null};

    arrivals.forEach(arr => (
        formattedArrivals[arr.wave] = arr.arrival
    ))
   
    let duration = traces.length !== 0 ? traces[0].ydata.length / traces[0].stats.sampling_rate : 0

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

    function handleDeleteWave(wave) {
        setSelectedWave(wave)
        setArrivals(arrivals.filter(arr => arr.wave !== wave))
    }

    return (
        <>
            <div className="flex flex-row items-center justify-center">
                <div className="grow-0 border-r">
                    <Button 
                        onClick={handleFileUpload} 
                        variant="ghost"
                        size="small"
                    >
                        <FiUpload />
                        Upload file
                    </Button>
                    <Button  
                        variant="ghost"
                        size="small"
                        onClick={handleSaveArrivals} 
                        disabled={traces.length===0 || (formattedArrivals["P"]===null && formattedArrivals["S"]===null)} 
                    >
                        <MdOutlineFileDownload />
                        Download arrivals
                    </Button>
                </div>
                <div className="grow flex flex-row justify-around items-center">
                    <PSElements 
                        traces={traces}
                        selectedWave={selectedWave} 
                        setSelectedWave={setSelectedWave} 
                        handleDeleteWave={handleDeleteWave} 
                        formattedArrivals={formattedArrivals}
                    />
                    <FiltersDropdown 
                        traces={traces}
                        selectedFilter={selectedFilter}
                        handleDropdownFilterChange={handleDropdownFilterChange}
                    />
                </div>
            </div>
        </>
    )
}

function Graphs({ traces, arrivals, selectedWave, setArrivals, setSelectedWave, backupTraces }) {

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

    function onGraphClick(e) {    
        const point = e.points[0]; 
        console.log(point)
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
        <>
            {
                traces.map((tr, ind) => (
                    <div key={tr.trace_id} className="h-1/3">
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
                    </div>
                ))
            }
        </>   
    )
}
       

export default function ArrivalsPickingPage() {
    
    const [error, setError] = useState([]);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false)
    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([])
    const [arrivals, setArrivals] = useState([]);
    const inputRef = useRef();
    const [selectedWave, setSelectedWave] = useState("P");
    const [manualFilter, setManualFilter] = useState({freqMin: 1, freqMax: 3})

    // useEffect(() => {
    //     setTraces(backupTraces);
    //     setArrivals([]);
    //     setSelectedWave("P");
    //     setSelectedFilter("initial");
    //     setManualFilter({"freqMin": "", "freqMax": ""});
    // }, [backupTraces])
    
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

    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            handleFilterChange(
                manualFilter["freqMin"] ? manualFilter["freqMin"] : null, 
                manualFilter["freqMax"] ? manualFilter["freqMax"] : null, 
            )
        }
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
                        handleFilterChange={handleFilterChange}
                        loading={loading}
                        setLoading={setLoading} 
                        setError={setError} 
                        setSuccess={setSuccess} 
                        handleFileUpload={handleFileUpload} 
                        arrivals={arrivals}
                        setArrivals={setArrivals}
                        selectedWave={selectedWave}
                        setSelectedWave={setSelectedWave}
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
                                    <Button onClick={handleFileUpload}>
                                        <FiUpload />
                                        Upload file
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Graphs 
                                        traces={traces} 
                                        arrivals={arrivals}
                                        selectedWave={selectedWave}
                                        setArrivals={setArrivals}
                                        setSelectedWave={setSelectedWave}
                                        backupTraces={backupTraces}
                                    />
                                </>
                            )
                        }
                    </>
                </div>
                {
                    traces.length !== 0 && (
                        <div className="flex justify-end items-center">
                            <FiltersInputs 
                                traces={traces} 
                                manualFilter={manualFilter} 
                                setManualFilter={setManualFilter}
                                handleEnterKey={handleEnterKey}
                            />
                        </div>
                    )
                }
            </div>
        </>
    )
}

