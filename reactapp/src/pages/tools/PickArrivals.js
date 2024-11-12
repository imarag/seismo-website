import { useState } from "react"
import { json, useOutletContext } from "react-router-dom";
import { UploadIcon, SaveIcon } from "../../SvgIcons"
import { filterOptions, serverUrl } from "../../data";
import ButtonWithIcon from "../../components/ButtonWithIcon"
import ArrivalsLineGraph from "../../components/ArrivalsLineGraph"
import Spinner from "../../components/Spinner"


export default function PickArrivals() {
    // get the error and info states defined in the rootlayout to show errors and information
    const { errorMessage, setErrorMessage, infoMessage, setInfoMessage } = useOutletContext();
    // save here the uploaded file name (every component's disable state depends on this value)
    const [selectedFile, setSelectedFile] = useState(null);
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

    // initialize the data that will be used to create the plots
    const [data, setData] = useState({
        "trace-0": { "record-name": "", stats: { "channel": "" }, xdata: [], ydata: [] },
        "trace-1": { "record-name": "", stats: { "channel": "" }, xdata: [], ydata: [] },
        "trace-2": { "record-name": "", stats: { "channel": "" }, xdata: [], ydata: [] }
    });

    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    async function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true);
    
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
    
        try {
            const res = await fetch(
                `${serverUrl}/pick-arrivals/upload-seismic-file`, 
                {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                }
            );
    
            // Check if the response is successful
            if (!res.ok) {
                const errorData = await res.json(); // Parse the response body to get the error message
                throw new Error(errorData.error_message || 'Unknown error occurred');
            }
    
            const jsonData = await res.json();
            
            // Update the state after the successful upload
            setData(jsonData);
            setSelectedFile(e.target.files[0].name);
            setArrivals([]);
            setSelectedWave("P");
            setSelectedFilter("initial");
            setManualFilter({"left": "", "right": ""});
            setInfoMessage("Seismic file upload completed successfully");
            setTimeout(() => setInfoMessage(null), 5000);
    
        } catch (error) {
            // Handle any errors that occur during the async operation
            console.error('Error occurred during file upload:', error);
            setInfoMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            // Always execute this block after the try-catch, regardless of success or failure
            setLoading(false);
        }
    }
    

    // this function will be called by the upload file button
    function handleFileUpload(e) {
        e.preventDefault();
        document.querySelector("#upload-seismic-file-input").click()
    }

    // this function will be called by the filters dropdown and also by the manual filters handleEnterKey below
    async function handleFilterChange(filter) {
        setSelectedFilter(filter)
        setLoading(true)

        try {
            const res = await fetch(`${serverUrl}/pick-arrivals/apply-filter?filter=${filter}`, {credentials: 'include'})
    
            // Check if the response is successful
            if (!res.ok) {
                const errorData = await res.json(); // Parse the response body to get the error message
                throw new Error(errorData.error_message || 'Unknown error occurred');
            }
    
            const jsonData = await res.json();
            
            // Update the state after the successful upload
            setData(jsonData);
    
        } catch (error) {
            // Handle any errors that occur during the async operation
            console.error('Error occurred during file upload:', error);
            setInfoMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            // Always execute this block after the try-catch, regardless of success or failure
            setLoading(false);
        }
    }

    // this function will be called from the manual left or right filter on enter key pressed 
    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            handleFilterChange(`${manualFilter["left"]}-${manualFilter["right"]}`)
        }
    }

    // this function will be called by the delete P or S buttons
    function handleDeleteWave(wave) {
        setSelectedWave(wave)
        setArrivals(arrivals.filter(w => w.wave !== wave))
    }

    // this function will be called by the save arrivals button
    async function handleSaveArrivals() {
        setLoading(true)
        
        try {
            const res = await fetch(`${serverUrl}/pick-arrivals/save-arrivals?Parr=${formattedArrivals["P"]}&Sarr=${formattedArrivals["S"]}`, {credentials: 'include'})
    
            // Check if the response is successful
            if (!res.ok) {
                const errorData = await res.json(); // Parse the response body to get the error message
                throw new Error(errorData.error_message || 'Unknown error occurred');
            }
    
            const blobData = await res.blob();
            const blobURL = URL.createObjectURL(blobData);
            
            // Create a temporary link to initiate the download
            const link = document.createElement('a');
            link.href = blobURL;

            // Set the desired filename for the download
            link.download = "arrivals.txt";
            link.click();

            setInfoMessage("Arrivals downloaded succesfully");
            setTimeout(() => setInfoMessage(null), 5000);
    
        } catch (error) {
            // Handle any errors that occur during the async operation
            console.error('Error occurred during file upload:', error);
            setInfoMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            // Always execute this block after the try-catch, regardless of success or failure
            setLoading(false);
        }

    }

    return (
        <section>
            <div className="d-flex gap-3">
                <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
                <ButtonWithIcon text="Upload file" onClick={handleFileUpload}><UploadIcon /></ButtonWithIcon>
                <ButtonWithIcon text="Get arrivals" onClick={handleSaveArrivals} disabled={!selectedFile || (!formattedArrivals["P"] && !formattedArrivals["S"])}><SaveIcon /></ButtonWithIcon>
            </div>
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
                            disabled={!selectedFile || formattedArrivals["P"]}
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
                            disabled={!selectedFile || formattedArrivals["S"]}
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
                    onChange={(e) => handleFilterChange(e.target.value)}
                    style={{width: "12rem"}}
                    disabled={!selectedFile}
                >
                    {
                        filterOptions.map(el => (
                            <option key={el.name} value={el.value}>{el.name}</option>
                        ))
                    }
                </select>
            </div>
            <Spinner hidden={!loading} />
            <div className="my-8">
                {
                   Object.keys(data).map(tr => (
                    <div key={tr}>
                        {
                            <ArrivalsLineGraph 
                                trace={tr}
                                data={data[tr]} 
                                selectedWave={selectedWave} 
                                setSelectedWave={setSelectedWave} 
                                arrivals={arrivals} 
                                setArrivals={setArrivals}
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
                        disabled={!selectedFile} 
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
                        disabled={!selectedFile} 
                    />
                </div>
            </div>
        </section>
    )
}