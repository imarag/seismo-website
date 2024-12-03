import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import LineGraph from "../../components/LineGraph"
import Spinner from "../../components/Spinner";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { UploadIcon } from "../../SvgIcons";
import { serverUrl } from "../../data";
import fetchRequest from "../../functions/fetchRequest";

function StatsElement({ label, id, onChange, value, readonly=false,  type="text" }) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label text-muted">{ readonly ? label + " *" : label}</label>
            <input 
                type={type}
                className="form-control" 
                id={id} 
                name={id}
                onChange={onChange}
                value={value}
                readOnly={readonly ? "readonly" : ""}
            />
        </div>
    )
}

export default function EditSeismicFile() {
    const { errorMessage, setErrorMessage, infoMessage, setInfoMessage } = useOutletContext();
    const [traces, setTraces] = useState([]);
    const [selectedTraceIndex, setSelectedTraceIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    
    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    async function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true);
        
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        
        let endpoint = `${serverUrl}/upload-seismic-file`;
        let options = {method: 'POST', body: formData, credentials: 'include'}

        fetch(endpoint, options)
        .then(res => res.json())
        .then(jsonData => {
            // Update the state after the successful upload
            setTraces(jsonData);
            setSelectedTraceIndex(0)
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

    function handleInputChange(parameter, e) {
        if (traces.length === 0) {
            return
        }
        let newTraces = traces.map((tr, i) => {
            if (i === selectedTraceIndex) {
                let newTrace = {...tr, stats: {...tr.stats, [parameter]: e.target.value}}
                return newTrace
            } else {
                return tr
            }
        })
       setTraces(newTraces)
    }

    async function handleDeleteTrace() {
        const newTraces = traces.filter((tr, ind) => ind !== selectedTraceIndex)
        setTraces(newTraces)
    }

    async function handleDownloadFile() {
        setLoading(true)
        let endpoint = `${serverUrl}/download-seismic-file`

        let jsonDataInput = {
            data: traces
        }

        let options = {method: 'POST', body: JSON.stringify(jsonDataInput), credentials: 'include', headers: {'Content-Type': 'application/json'}}
        fetch(endpoint, options)
        .then(res => res.blob())
        .then(blobData => {
            const url = window.URL.createObjectURL(blobData);
            const a = document.createElement("a");
            a.href = url;
            a.download = "mseed-file.mseed";
            document.body.appendChild(a);
            a.click();
            a.remove();
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

    
    return (
        <section>
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <div className="d-flex flex-row align-items-center gap-2">
                <ButtonWithIcon text="Upload file" onClick={handleFileUpload}><UploadIcon /></ButtonWithIcon>
                <ButtonWithIcon text="Download updated stream" onClick={handleDownloadFile} disabled={traces.length === 0}><UploadIcon /></ButtonWithIcon>
            </div>
            <hr />
            <p className="text-center">Select a record to check its contents</p>
            <select value={selectedTraceIndex} onChange={(e) => setSelectedTraceIndex(Number(e.target.value))} className="form-select d-block mx-auto" id="select-channel" aria-label="select channel" style={{ width: "200px" }}>
                {
                    traces.map((tr, ind) => (
                        <option key={ind} value={ind}>trace { ind + 1 }</option>
                    ))
                }
            </select>
            <div className="row align-items-stretch justify-content-center gx-4">
                <div className="col-md-4 col-lg-3">
                    <StatsElement label="Station code" id="station" placeholder="e.g. SEIS" value={traces.length !== 0 ? traces[selectedTraceIndex].stats.station : ""} onChange={e => handleInputChange("station", e)} />
                    <StatsElement label="Date of first data sample" id="date" value={traces.length !== 0 ? traces[selectedTraceIndex].stats.date : ""} onChange={e => handleInputChange("date", e)} type="date" />
                    <StatsElement label="Time of first data sample" id="time" value={traces.length !== 0 ? traces[selectedTraceIndex].stats.time : ""} onChange={e => handleInputChange("time", e)} type="time" />
                    <StatsElement label="Sampling Rate" id="fs" value={traces.length !== 0 ? traces[selectedTraceIndex].stats.sampling_rate : "0"} onChange={e => handleInputChange("sampling_rate", e)} type="number" readonly={true}/>
                    <StatsElement label="Number of sample points" id="npts" value={traces.length !== 0 ? traces[selectedTraceIndex].stats.npts : "0"} onChange={e => handleInputChange("npts", e)} type="number" readonly={true}/>
                    <StatsElement label="Channel code" id="channel" value={traces.length !== 0 ? traces[selectedTraceIndex].stats.channel : ""} onChange={e => handleInputChange("channel", e)} type="text" />
                    <p className="fs-6 text-center my-3 fst-italic">The elements with asterisk (*) are readonly</p>
                    {loading && <Spinner />}
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        <button type="button" className="btn btn-danger d-block mx-auto mt-4" onClick={handleDeleteTrace} disabled={traces.length === 0}>Delete trace</button>
                    </div>
                </div>
                <div className="col-md-8 col-lg-9">
                    {
                        <LineGraph 
                            xData={traces.length !== 0 ? [traces[selectedTraceIndex]["xdata"]] : []} 
                            yData={traces.length !== 0 ? [traces[selectedTraceIndex]["ydata"]] : []} 
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
