'use client';
import { useState } from "react";
import LineGraph from "@/components/LineGraph"
import Spinner from "@/components/Spinner";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { fastapiEndpoints } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";
import { MdOutlineFileUpload, MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";

function StatsElement({ label, id, onChange, value, readonly=false,  type="text" }) {
    return (
        <div>
            <label htmlFor={id} className="form-label text-muted mb-1">{label}</label>
            <input 
                type={type}
                className="form-control form-control-sm" 
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
    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([]);
    const [selectedTraceIndex, setSelectedTraceIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [activatedMenuIndex, setActivatedMenuIndex] = useState(null)
    
    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    async function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true);
        
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
    
        fetchRequest({endpoint: fastapiEndpoints["UPLOAD-SEISMIC-FILE"], method: "POST", data: formData})
        .then(jsonData => {
            // Update the state after the successful upload
            setTraces(jsonData);
            setBackupTraces(jsonData);
            setSelectedTraceIndex(0)
            // setInfoMessage("Seismic file upload completed successfully");
            // setTimeout(() => setInfoMessage(null), 5000);
        })
        .catch(error => {
            // setErrorMessage(error.message || "Error uploading file. Please try again.");            
            // setTimeout(() => setErrorMessage(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })
    }
    

    // this function will be called by the upload file button
    function handleFileUpload(e) {
        e.preventDefault();
        document.querySelector("#upload-seismic-file-input").click()
    }

    async function handleDownloadFile() {
        setLoading(true)

        let jsonDataInput = {
            data: traces
        }
        console.log(jsonDataInput)
        fetchRequest({endpoint: fastapiEndpoints["DOWNLOAD-SEISMIC-FILE"], method: "POST", data: jsonDataInput, returnBlob: true})
        .then(blobData => {
            
            console.log("downloaded")
            const url = window.URL.createObjectURL(blobData);
            const a = document.createElement("a");
            a.href = url;
            a.download = "downloaded-seismic-file.mseed";
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            // setErrorMessage(error.message || "Error uploading file. Please try again.");            
            // setTimeout(() => setErrorMessage(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })

    }

    function handleOptionsMenuButtonClick(ind) {
        if (activatedMenuIndex === ind) {
            setActivatedMenuIndex(null)
        }
        else {
            setActivatedMenuIndex(ind)
        }
    }

    async function handleDeleteTrace(traceId) {
        const newTraces = traces.filter(tr => tr.id !== traceId)
        setTraces(newTraces)
    }

    function handleInputChange(traceId, parameter, e) {
        let newTraces = traces.map((tr, i) => {
            if (tr.id === traceId) {
                let newTrace = {...tr, stats: {...tr.stats, [parameter]: e.target.value}}
                return newTrace
            } else {
                return tr
            }
        })
       setTraces(newTraces)
    }
    
    
    return (
        <section>
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            {
                traces.length === 0 && (
                    <>
                        <p className="text-center text-dark fs-3">Start by uploading a seismic file</p>
                        <div className="d-flex flex-row justify-content-center mb-5">
                            <ButtonWithIcon text="Upload file" onClick={handleFileUpload} icon={<MdOutlineFileUpload />} />
                        </div>
                    </>
                )
            }
            <div>
                {
                    traces.length !== 0 && (
                    <>
                        <div className="d-flex flex-row align-items-center gap-2">
                            <ButtonWithIcon text="Upload file" onClick={handleFileUpload} icon={<MdOutlineFileUpload />} />
                        </div>
                        <hr />
                        <div className="d-flex flex-row justify-content-start gap-3">
                            <button className="btn btn-sm btn-outline-dark" onClick={() => setTraces(backupTraces)}>Restore initial file</button>
                            <button className="btn btn-sm btn-outline-dark" onClick={handleDownloadFile}>Download to MSEED</button>
                        </div>
                        {loading && <Spinner />}
                    </>
                )
                }
                {
                    traces.map((tr, ind) => (
                        <div key={tr.id}>
                            <div className="fs-6 mb-0 mt-3 d-flex flex-row justify-content-end gap-2 position-relative">
                                <div>
                                    <button className="btn btn-outline-dark btn-sm me-2" onClick={() => handleOptionsMenuButtonClick(ind)}>
                                        <PiGearLight />
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteTrace(tr.id)}>
                                        <MdDeleteOutline  />
                                    </button>
                                    {
                                        activatedMenuIndex === ind && (
                                            <div className="d-flex flex-column gap-2 position-absolute top-100 end-0 bg-white border shadow py-3 px-4 rounded z-3">
                                                <StatsElement label="Station code" id="station" placeholder="e.g. SEIS" value={traces.length !== 0 ? tr.stats.station : ""} onChange={e => handleInputChange(tr.id, "station", e)} />
                                                <StatsElement label="Date of first data sample" id="date" value={traces.length !== 0 ? tr.stats.date : ""} onChange={e => handleInputChange(tr.id, "date", e)} type="date" />
                                                <StatsElement label="Time of first data sample" id="time" value={traces.length !== 0 ? tr.stats.time : ""} onChange={e => handleInputChange(tr.id, "time", e)} type="time" />
                                                <StatsElement label="Sampling Rate*" id="fs" value={traces.length !== 0 ? tr.stats.sampling_rate : "0"} onChange={e => handleInputChange(tr.id, "sampling_rate", e)} type="number" readonly={true}/>
                                                <StatsElement label="Number of sample points*" id="npts" value={traces.length !== 0 ? tr.stats.npts : "0"} onChange={e => handleInputChange(tr.id, "npts", e)} type="number" readonly={true}/>
                                                <StatsElement label="Channel code" id="channel" value={traces.length !== 0 ? tr.stats.channel : ""} onChange={e => handleInputChange(tr.id, "channel", e)} type="text" />
                                                <p className="fs-6 text-muted my-1">Elements with "*" are readonly</p>
                                                <button className="btn btn-dark btn-sm mt-2" onClick={() => setActivatedMenuIndex(null)}>Close Menu</button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <LineGraph 
                                xData={traces.length !== 0 ? [tr["xdata"]] : []} 
                                yData={traces.length !== 0 ? [tr["ydata"]] : []} 
                                graphTitle="" 
                                showLegend={true} 
                                legendTitle={[`Component: ${tr.stats.channel}`]}
                                height="180px"
                            />
                        </div>
                    ))
                }
            </div>
        </section>
    )
}
