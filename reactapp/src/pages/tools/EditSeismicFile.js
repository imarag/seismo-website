import { useState } from "react";
import LineGraph from "../../components/LineGraph"
import Spinner from "../../components/Spinner";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { UploadIcon } from "../../SvgIcons";
import { useOutletContext } from "react-router-dom";
import handleFileUploadFunction from "../../functions/handleFileUploadFunction";
import { serverUrl } from "../../data";

function StatsElement({ label, id, onChange, value, type="text" }) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label text-muted">{ label }</label>
            <input 
                type={type}
                className="form-control" 
                id={id} 
                name={id}
                onChange={onChange}
                value={value}
            />
        </div>
    )
}

export default function EditSeismicFile() {
    const { errorMessage, setErrorMessage, infoMessage, setInfoMessage } = useOutletContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [traces, setTraces] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState("")
    const [loading, setLoading] = useState(false)

    const selectedTrace = traces.find(tr => tr.stats.channel === selectedChannel)
    console.log(selectedTrace)
    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    async function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true);
        
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        
        let endpoint = `${serverUrl}/upload-seismic-file`;
        let options = {method: 'POST', body: formData, credentials: 'include'}

        handleFileUploadFunction(endpoint, options)
        .then(jsonData => {
            // Update the state after the successful upload
            setTraces(jsonData);
            setSelectedFile(e.target.files[0].name);
            setSelectedChannel(jsonData[0].stats.channel)
            setInfoMessage("Seismic file upload completed successfully");
            setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            // Handle any errors that occur during the async operation
            console.error('Error occurred during file upload:', error);
            setErrorMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
        })
        .finally(() => {
            setLoading(false);
        })

    }
    

    // this function will be called by the upload file button
    function handleFileUpload(e) {
        e.preventDefault();
        document.querySelector("#upload-seismic-file-input").click()
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        setLoading(true);
        
        let formData = new FormData();
        formData.append('file', e.target);
        
        let endpoint = `${serverUrl}/update-seismic-file`;
        let options = {method: 'POST', body: formData, credentials: 'include'}

        fetch(endpoint, options)
        .then(res => {
            // Check if the response is successful
            if (!res.ok) {
                const errorData = res.json(); // Parse the response body to get the error message
                throw new Error(errorData.error_message || 'Unknown error occurred');
            }
            return res.json()
        })
        .then(jsonData => {
            console.log(jsonData)
            // // Update the state after the successful upload
            // setTraces(jsonData);
            // setSelectedFile(e.target.files[0].name);
            // setInfoMessage("Seismic file upload completed successfully");
            // setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            // Handle any errors that occur during the async operation
            console.error('Error occurred during file upload:', error);
            setErrorMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
        })
        .finally(() => {
            // Always execute this block after the try-catch, regardless of success or failure
            setLoading(false);
        })
    }

    function handleInputChange(parameter, e) {
        let newTraces = traces.map((tr, i) => {
            if (tr.stats.channel === selectedChannel) {
                let newTrace = {...tr.stats, [parameter]: e.target.value}
                return newTrace
            } else {
                return tr
            }
        })
       setTraces(newTraces)
    }

    async function handleDeleteTrace() {
        const formData = {
            "channel": selectedChannel
        }
        let endpoint = `${serverUrl}/delete-seismic-trace`;
        let options = {method: 'POST', body: JSON.stringify(formData), credentials: 'include', headers: {'Content-Type': 'application/json'}}

        const res = await fetch(endpoint, options);
        const jsonData = await res.json();
        
        setTraces(jsonData)
        setSelectedChannel(jsonData[0].stats.channel)
    }

    
    return (
        <section>
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <ButtonWithIcon text="Upload file" onClick={handleFileUpload}><UploadIcon /></ButtonWithIcon>
            <div className="row justify-content-center mb-3">
                <div className="col text-center">
                    <p>Select a record to check its contents</p>
                    <select value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)} className="form-select d-block mx-auto" id="select-channel" aria-label="select channel" style={{ width: "200px" }}>
                        {
                            traces.map((tr, ind) => (
                                <option key={tr.stats.channel} value={tr.stats.channel}>{ tr.stats.channel }</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className="row align-items-stretch justify-content-center gx-5">
                <div className="col-lg-3">
                    <form onSubmit={handleFormSubmit}>
                        <StatsElement label="Station code" id="station" placeholder="e.g. SEIS" value={traces.length !== 0 ? selectedTrace.stats.station : ""} onChange={e => handleInputChange("station", e)} />
                        <StatsElement label="Date of first data sample" id="date" value={traces.length !== 0 ? selectedTrace.stats.date : ""} onChange={e => handleInputChange("date", e)} type="date" />
                        <StatsElement label="Time of first data sample" id="time" value={traces.length !== 0 ? selectedTrace.stats.time : ""} onChange={e => handleInputChange("time", e)} type="time" />
                        <StatsElement label="Sampling Rate" id="fs" value={traces.length !== 0 ? selectedTrace.stats.sampling_rate : "0"} onChange={e => handleInputChange("sampling_rate", e)} type="number" />
                        <StatsElement label="Number of sample points" id="npts" value={traces.length !== 0 ? selectedTrace.stats.npts : "0"} onChange={e => handleInputChange("npts", e)} type="number" />
                        <StatsElement label="Channel code" id="channel" value={traces.length !== 0 ? selectedTrace.stats.channel : ""} onChange={e => handleInputChange("channel", e)} type="text" />
                        {loading && <Spinner />}
                        <p>{traces.length}</p>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <button type="submit" className="btn btn-primary d-block mx-auto mt-4">Update trace</button>
                            <button type="button" className="btn btn-danger d-block mx-auto mt-4" onClick={handleDeleteTrace}>Delete trace</button>
                        </div>
                    </form>
                </div>
                <div className="col-lg-9">
                    {
                        <LineGraph 
                        xData={traces.length !== 0 ? [selectedTrace["xdata"]] : []} 
                        yData={traces.length !== 0 ? [selectedTrace["ydata"]] : []} 
                        graphTitle="" 
                        showLegend={false} 
                        height="100%"
                        />
                    }
                </div>
            </div>
        </section>
    )
}
