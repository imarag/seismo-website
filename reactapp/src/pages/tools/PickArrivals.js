import { useState } from "react"
import { useOutletContext } from "react-router-dom";
import { SaveIcon, UploadIcon } from "../../SvgIcons"
import { filterOptions, fastapiEndpoints, arrivalsStyles } from "../../static";
import ButtonWithIcon from "../../components/ButtonWithIcon"
import LineGraph from "../../components/LineGraph"
import Spinner from "../../components/Spinner"
import fetchRequest from "../../functions/fetchRequest";


export default function PickArrivals() {
    // get the error and info states defined in the rootlayout to show errors and information
    const { setErrorMessage, setInfoMessage } = useOutletContext();
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

    
    
    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    function handleFileSelection(e) {
        e.preventDefault();
        
        setLoading(true)

        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        
        fetchRequest(fastapiEndpoints["UPLOAD-SEISMIC-FILE"], method="POST", data=formData)
        .then(jsonData => {
            setTraces(jsonData)
            setFilteredTraces(jsonData);
            setArrivals([]);
            setSelectedWave("P");
            setSelectedFilter("initial");
            setManualFilter({"left": "", "right": ""});
            setInfoMessage("Seismic file upload completed successfully");
            setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            setErrorMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })
    }
        
    // this function will be called by the upload file button
    function handleFileUpload() {
        document.querySelector("#upload-seismic-file-input").click()
    }

    // this function will be called by the filters dropdown and also by the manual filters handleEnterKey below
    async function handleFilterChange(freqmin=null, freqmax=null) {
        setLoading(true)
     
        const requestBody = {freqmin: freqmin, freqmax: freqmax, seismic_data: traces}
        
        fetchRequest(fastapiEndpoints["APPLY-FILTER"], method="POST", data=requestBody)
        .then(jsonData => {
            setFilteredTraces(jsonData);
            setInfoMessage("The filter has been succesfully applied");
            setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            setErrorMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
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
        let record = filteredTraces[0]["record-name"];

        let endpoint = fastapiEndpoints["SAVE-ARRIVALS"]
        let queryParams = (PArr && `Parr=${PArr}&`) + (SArr && `Sarr=${SArr}&` + `record=${record}`)

        fetchRequest(`${endpoint}?${queryParams}`, method="GET", returnBlob=true)
        .then(blobData => {
            const downloadUrl = window.URL.createObjectURL(blobData);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "arrivals.txt";
            document.body.appendChild(link);
            link.click();
            setInfoMessage("The filter has been succesfully applied");
            setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            setErrorMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
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
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            {
                filteredTraces.length === 0 && (
                    <>
                        <p className="text-center my-3">Start by uploading a seismic file</p>
                        <div className="text-center">
                            <ButtonWithIcon text="Upload file" onClick={handleFileUpload}><UploadIcon /></ButtonWithIcon>
                        </div>
                        { loading && <Spinner />}
                    </>
                )
            }
            {
                filteredTraces.length !== 0 && (
                    <>
                        <div className="d-flex gap-3">
                            <ButtonWithIcon text="Upload file" onClick={handleFileUpload}><UploadIcon /></ButtonWithIcon>
                            <ButtonWithIcon text="Get arrivals" onClick={handleSaveArrivals} disabled={filteredTraces.length===0 || (!formattedArrivals["P"] && !formattedArrivals["S"])}><SaveIcon /></ButtonWithIcon>
                        </div>
                        { loading && <Spinner />}
                        <div className="d-flex flex-row justify-content-around mt-4 py-4">
                            <div className="d-flex flex-row">
                                <div className="form-check">
                                    <label htmlFor="p-wave-radio" className="form-check-label">P</label>
                                    <input
                                        type="radio"
                                        id="p-wave-radio"
                                        name="ps-wave-radio"
                                        value="P"
                                        checked={selectedWave === "P"}
                                        onChange={() => setSelectedWave("P")}
                                        disabled={filteredTraces.length===0 || formattedArrivals["P"]}
                                        className="form-check-input"
                                    />
                                </div>
                                <div className="form-check ms-2">
                                    <label htmlFor="s-wave-radio" className="form-check-label">S</label>
                                    <input
                                        type="radio"
                                        id="s-wave-radio"
                                        name="ps-wave-radio"
                                        value="S"
                                        checked={selectedWave === "S"}
                                        onChange={() => setSelectedWave("S")}
                                        disabled={filteredTraces.length===0 || formattedArrivals["S"]}
                                        className="form-check-input"
                                    />
                                </div>
                                <div className="d-flex gap-2 ms-4">
                                    <button onClick={(e) => handleDeleteWave("P")} className="btn btn-sm btn-danger" hidden={!formattedArrivals["P"]}>Del. P</button>
                                    <button onClick={(e) => handleDeleteWave("S")} className="btn btn-sm btn-danger" hidden={!formattedArrivals["S"]}>Del. S</button>
                                </div>
                            </div>
                            <select
                                className="form-select"
                                aria-label="dropdown"
                                id="filters-dropdown"
                                value={selectedFilter}
                                onChange={handleDropdownFilterChange}
                                style={{width: "12rem"}}
                                disabled={filteredTraces.length===0}
                            >
                                {
                                    filterOptions.map(el => (
                                        <option key={el.name} value={el.value}>{el.name}</option>
                                    ))
                                }
                            </select>
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
                                            graphTitle={tr["record-name"]}
                                            shapes={shapes}
                                            annotations={annotations}
                                            onGraphClick={onGraphClick}
                                        />
                                    }
                                </div>
                            ))
                                
                            }
                        </div>
                        <div className="d-flex justify-content-end align-items-center gap-3 mt-4">
                            <div className="mb-3">
                                <input onKeyDown={handleEnterKey} value={manualFilter["left"]} 
                                    onChange={(e) => setManualFilter({...manualFilter, left: e.target.value})} 
                                    type="number" 
                                    className="form-control form-control-sm" 
                                    id="left-filter" 
                                    placeholder="e.g 0.1"
                                    disabled={filteredTraces.length===0} 
                                />
                            </div>
                            <div className="mb-3">
                                <input 
                                    onKeyDown={handleEnterKey} 
                                    value={manualFilter["right"]} 
                                    onChange={(e) => setManualFilter({...manualFilter, right: e.target.value})} 
                                    type="number" 
                                    className="form-control form-control-sm" 
                                    id="right-filter" 
                                    placeholder="e.g 5"
                                    disabled={filteredTraces.length===0} 
                                />
                            </div>
                        </div>
                    </>
                    
                )
            }
            
        </section>
    )
}