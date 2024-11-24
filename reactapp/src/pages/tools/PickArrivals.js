import { useState } from "react"
import { useOutletContext } from "react-router-dom";
import { SaveIcon, UploadIcon } from "../../SvgIcons"
import { filterOptions, serverUrl } from "../../data";
import ButtonWithIcon from "../../components/ButtonWithIcon"
import LineGraph from "../../components/LineGraph"
import Spinner from "../../components/Spinner"
import handleFileUploadFunction from "../../functions/handleFileUploadFunction";


export default function PickArrivals() {
    // get the error and info states defined in the rootlayout to show errors and information
    const { errorMessage, setErrorMessage, infoMessage, setInfoMessage } = useOutletContext();
    // save here the selected wave when the user clicks the P or S radiobuttons
    const [selectedWave, setSelectedWave] = useState("P");
    // save a list of picks in the form: ([{wave: "P", arrival: 45.4, ymin: -65.65, ymax: 43.5}]
    const [arrivals, setArrivals] = useState([]);
    // save here the state of the left and right manual filter
    const [manualFilter, setManualFilter] = useState({left: "", right: ""})
    // save a state to trigger it when we want the spinner to be active
    const [loading, setLoading] = useState(false);
    // save here the selected filter in the select dropdown
    const [selectedFilter, setSelectedFilter] = useState("initial")

    // transform the arribals into an object to get easier the arrivals of the P & S waves
    let formattedArrivals = {"P": null, "S": null};
    arrivals.forEach(arr => (
        formattedArrivals[arr.wave] = arr.arrival
    ))

    let shapes = arrivals.map(w => (
        {
            type: "line",
            x0: w["arrival"],
            y0: w["ymin"],
            x1: w["arrival"],
            y1: w["ymax"],
            line: {
                color: "#d4003c",
                width: 3,
                dash: 'dot'
            },
        }
    ))

    let annotations =  arrivals.map(w => (
        {
            x: w["arrival"],
            y: 0,
            xref: 'x',
            yref: 'y',
            text: w["wave"],
            showarrow: false,
            font: {
                size: 30,
            },
        }
    ))


    // initialize the data that will be used to create the plots
    const [traces, setTraces] = useState([]);


    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    async function handleFileSelection(e) {
        e.preventDefault();
        handleFileUploadFunction({
            endpoint: `${serverUrl}/upload-seismic-file`,
            dataType: "file",
            requestBody: e.target.files[0],
            method: "POST",
            initialCallback: () => setLoading(true),
            successCallback: (data) => {
                setTraces(data);
                setArrivals([]);
                setSelectedWave("P");
                setSelectedFilter("initial");
                setManualFilter({"left": "", "right": ""});
                setInfoMessage("Seismic file upload completed successfully");
                setTimeout(() => setInfoMessage(null), 5000);
            },
            errorCallback: (error) => {
                setErrorMessage(error.message || "Error uploading file. Please try again.");            
                setTimeout(() => setErrorMessage(null), 5000);
            },
            finallyCallback: () => setLoading(false),
        });
    }
        
    // this function will be called by the upload file button
    function handleFileUpload() {
        document.querySelector("#upload-seismic-file-input").click()
    }

    // this function will be called by the filters dropdown and also by the manual filters handleEnterKey below
    async function handleFilterChange(freqmin=null, freqmax=null) {
        handleFileUploadFunction({
            endpoint: `${serverUrl}/arrivals/apply-filter`,
            dataType: "json",
            requestBody: {
                freqmin: freqmin,
                freqmax: freqmax,
                seismic_data: traces
            },
            method: "POST",
            initialCallback: () => setLoading(true),
            successCallback: (data) => {
                setTraces(data);
                setInfoMessage("The filter has been succesfully applied");
                setTimeout(() => setInfoMessage(null), 5000);
            },
            errorCallback: (error) => {
                setErrorMessage(error.message || "Error uploading file. Please try again.");            
                setTimeout(() => setErrorMessage(null), 5000);
            },
            finallyCallback: () => setLoading(false),
        });
    }

    // this function will be called from the dropdown filter
    function handleDropdownFilterChange(e) {
        setSelectedFilter(e.target.value)
        const dropdownFilterValue = e.target.value;
        if (dropdownFilterValue === "initial") {
            handleFilterChange()
        }
        else {
            const parts = dropdownFilterValue.split("-")
            handleFilterChange(parts[0], parts[1])
        }
    }

    // this function will be called from the manual left or right filter on enter key pressed 
    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            handleFilterChange(manualFilter["left"], manualFilter["right"])
        }
    }

    // this function will be called by the delete P or S buttons
    function handleDeleteWave(wave) {
        setSelectedWave(wave)
        setArrivals(arrivals.filter(w => w.wave !== wave))
    }


    // this function will be called by the save arrivals button
    async function handleSaveArrivals() {

        handleFileUploadFunction({
            endpoint: `${serverUrl}/arrivals/save-arrivals?` + (formattedArrivals["P"] && `Parr=${formattedArrivals["P"]}&`) + (formattedArrivals["S"] && `Sarr=${formattedArrivals["S"]}&` + `record=${traces[0]["record-name"]}`),
            returnBlob: true,
            initialCallback: () => setLoading(true),
            successCallback: (data) => {
                const downloadUrl = window.URL.createObjectURL(data);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = "arrivals.txt";
                document.body.appendChild(link);
                link.click();
            },
            errorCallback: (error) => {
                setErrorMessage(error.message || "Error uploading file. Please try again.");            
                setTimeout(() => setErrorMessage(null), 5000);
            },
            finallyCallback: () => setLoading(false),
        });
    }

    function onGraphClick(e) {    
        const point = e.points[0]; 
        const yMin = Math.min(...traces[0].ydata);  // Get the minimum value
        const yMax = Math.max(...traces[0].ydata);
        for (let w of arrivals) {
            if (w["wave"] === selectedWave && w["arrival"]) {
                return
            }
        }

        if (point) {
            const x = point.x;
            setSelectedWave(selectedWave === "P" ? "S" : "P")
            setArrivals((oldarrivals) => ([...oldarrivals, {wave: selectedWave, arrival: x, ymin: yMin, ymax: yMax}]))
        }
    }

    return (
        <section>
            <div className="d-flex gap-3">
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
                <ButtonWithIcon text="Upload file" onClick={handleFileUpload}><UploadIcon /></ButtonWithIcon>
                <ButtonWithIcon text="Get arrivals" onClick={handleSaveArrivals} disabled={traces.length===0 || (!formattedArrivals["P"] && !formattedArrivals["S"])}><SaveIcon /></ButtonWithIcon>
            </div>
            { loading && <Spinner />}
            {
                traces.length !== 0 && (
                    <>
                    
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
                                        disabled={traces.length===0 || formattedArrivals["P"]}
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
                                        disabled={traces.length===0 || formattedArrivals["S"]}
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
                                disabled={traces.length===0}
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
                            traces.map((tr, ind) => (
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
                                    className="form-control" 
                                    id="left-filter" 
                                    placeholder="e.g 0.1"
                                    disabled={traces.length===0} 
                                />
                            </div>
                            <div className="mb-3">
                                <input 
                                    onKeyDown={handleEnterKey} 
                                    value={manualFilter["right"]} 
                                    onChange={(e) => setManualFilter({...manualFilter, right: e.target.value})} 
                                    type="number" 
                                    className="form-control" 
                                    id="right-filter" 
                                    placeholder="e.g 5"
                                    disabled={traces.length===0} 
                                />
                            </div>
                        </div>
                    </>
                    
                )
            }
            
        </section>
    )
}