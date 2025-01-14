'use client';
import { useEffect, useState } from "react"
import { CiSaveDown2 } from "react-icons/ci";
import { filterOptions, fastapiEndpoints, arrivalsStyles } from "@/utils/static";
import ButtonWithIcon from "@/components/ButtonWithIcon"
import fetchRequest from "@/utils/functions/fetchRequest";
import LineGraph from "@/components/LineGraph"
import Spinner from "@/components/Spinner"
import { RadioButtonElement, SelectElement, NumberInputElement, LabelElement } from "@/components/UIElements";
import UploadFileButton from "@/components/UploadFileButton";
import StartingUploadFile from "@/components/StartingUploadFile";
import ErrorMessage from "@/components/ErrorMessage";

export default function PickArrivals() {
    const [error, setError] = useState(null)
    // save here the selected wave when the user clicks the P or S radiobuttons
    const [selectedWave, setSelectedWave] = useState("P");
    // save a list of picks in the form: ([{wave: "P", arrival: 45.4}]
    const [arrivals, setArrivals] = useState([]);
    // save here the state of the left and right manual filter
    const [manualFilter, setManualFilter] = useState({left: 0.1, right: 3})
    // save a state to trigger it when we want the spinner to be active
    const [loading, setLoading] = useState(false);
    // save here the selected filter in the select dropdown
    const [selectedFilter, setSelectedFilter] = useState("initial")

    // transform the arrivals list into an object to get easier the arrival values
    // of the P & S waves
    let formattedArrivals = {"P": null, "S": null};
    
    arrivals.forEach(arr => (
        formattedArrivals[arr.wave] = arr.arrival
    ))

    // initialize the data that will be used to create the plots
    const [traces, setTraces] = useState([]);
    const [filteredTraces, setFilteredTraces] = useState([]);

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
            x: traces.length !== 0 ? arr["arrival"] - (traces[0]["stats"]["duration"] / 40) : 0,
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
        setFilteredTraces(traces);
        setArrivals([]);
        setSelectedWave("P");
        setSelectedFilter("initial");
        setManualFilter({"left": "", "right": ""});
    }, [traces])
    

    // this function will be called by the filters dropdown and also by the manual filters handleEnterKey below
    async function handleFilterChange(freqmin=null, freqmax=null) {
        setLoading(true)
        
        const seismicData = traces.map(tr => (
            {
                values: tr.ydata,
                sampling_rate: tr.stats.sampling_rate,
                left_filter: freqmin,
                right_filter: freqmax
            }
        ))

        const requestBody = {
            seismic_data: seismicData
        }

        fetchRequest({endpoint: fastapiEndpoints["APPLY-FILTER"], method: "POST", data: requestBody})
        .then(jsonData => {
            const newTraces = traces.map((tr, ind) => ({
                ...tr, ydata: jsonData[ind]
            }))

            setFilteredTraces(newTraces);
        })
        .catch(error => {
            setError(error.message)
            setTimeout(() => setError(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })
    }

    // this function will be called from the dropdown filter
    function handleDropdownFilterChange(e) {
        setSelectedFilter(e.target.value)
        const dropdownFilterValue = e.target.value;
        
        if (dropdownFilterValue === "initial") {
            handleFilterChange(null, null)
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
                manualFilter["left"] ? manualFilter["left"] : null, 
                manualFilter["right"] ? manualFilter["right"] : null, 
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
        setLoading(true)

        let PArr = formattedArrivals["P"];
        let SArr = formattedArrivals["S"];

        let endpoint = fastapiEndpoints["SAVE-ARRIVALS"]
        let queryParams = (PArr && `Parr=${PArr}&`) + (SArr && `Sarr=${SArr}`)

        fetchRequest({endpoint: `${endpoint}?${queryParams}`, method: "GET", returnBlob: true})
        .then(blobData => {
            const downloadUrl = window.URL.createObjectURL(blobData);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "arrivals.txt";
            document.body.appendChild(link);
            link.click();
            // setInfoMessage("The filter has been succesfully applied");
            // setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            setError(error.message)
            setTimeout(() => setError(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })
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
        <section>
            {
                error && <ErrorMessage error={error} />
            }
            {traces.length === 0 && (
                <StartingUploadFile setTraces={setTraces} setError={setError} setLoading={setLoading} />
            )}
            {
                traces.length !== 0 && (
                <>
                    <div className="flex flex-row items-center justify-start gap-1">
                        <UploadFileButton 
                            setTraces={setTraces} 
                            setLoading={setLoading} 
                            buttonClass="btn-ghost btn-sm" 
                            setError={setError}
                        />
                        <ButtonWithIcon 
                            text="Get arrivals" 
                            onClick={handleSaveArrivals} 
                            disabled={filteredTraces.length===0 || (!formattedArrivals["P"] && !formattedArrivals["S"])} 
                            icon={<CiSaveDown2 />} 
                            className={"btn-ghost btn-sm"}
                        />
                        </div>
                        <hr className="mt-2 mb-8" />
                        { loading && <Spinner />}
                        <div className="flex flex-row items-center justify-around mt-4 py-4">
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
                                        disabled={filteredTraces.length===0 || formattedArrivals["P"]}
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
                                        disabled={filteredTraces.length===0 || formattedArrivals["S"]}
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
                                disabled={filteredTraces.length===0}
                                optionsList={filterOptions}
                                className="select-sm"
                            />
                        </div>
                        <div className="my-8">
                            {
                            filteredTraces.map((tr, ind) => (
                                <div key={tr.id}>
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
                                    id="left-filter" 
                                    name="left-filter" 
                                    value={manualFilter["left"]} 
                                    onKeyDown={handleEnterKey} 
                                    onChange={(e) => setManualFilter({...manualFilter, left: e.target.value})} 
                                    placeholder="e.g. 0.1"
                                    disabled={filteredTraces.length===0}
                                    className="input-sm"
                                />
                            </div>
                            <div className="mb-3">
                                <NumberInputElement 
                                    id="right-filter" 
                                    name="right-filter" 
                                    value={manualFilter["right"]} 
                                    onKeyDown={handleEnterKey} 
                                    onChange={(e) => setManualFilter({...manualFilter, right: e.target.value})} 
                                    placeholder="e.g. 3"
                                    disabled={filteredTraces.length===0}
                                    className="input-sm"
                                />
                            </div>
                        </div>
                    </>
                    
                )
            }
            
        </section>
    )
}