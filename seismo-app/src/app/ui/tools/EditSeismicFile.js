'use client';
import { useEffect, useState } from "react";
import LineGraph from "@/components/LineGraph"
import Spinner from "@/components/Spinner";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import { fastapiEndpoints } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";
import { MdOutlineFileUpload, MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";
import { GoDatabase } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";
import { CiUndo } from "react-icons/ci";
import { NumberInputElement, TextInputElement, DateInputElement, TimeInputElement, LabelElement } from "../UIElements";
import UploadFileButton from "@/components/UploadFileButton";
import StartingUploadFile from "@/components/StartingUploadFile";
import ErrorMessage from "@/components/ErrorMessage";


export default function EditSeismicFile() {
    const [error, setError] = useState(null)
    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([]);
    const [loading, setLoading] = useState(false)
    const [activatedMenuIndex, setActivatedMenuIndex] = useState(null)

    useEffect(() => {
        setBackupTraces(traces);
    }, [traces])

    
    async function handleDownloadFile() {
        setLoading(true)

        let jsonDataInput = {
            data: traces
        }
        
        fetchRequest({endpoint: fastapiEndpoints["DOWNLOAD-SEISMIC-FILE"], method: "POST", data: jsonDataInput, returnBlob: true})
        .then(blobData => {
            
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

    async function handleDownloadData() {
        
    }
    
    async function handleDownloadHeader() {

    }

    function handleInputChange(traceId, parameter, value) {
        let newTraces = traces.map((tr, i) => {
            if (tr.id === traceId) {
                let newTrace = {...tr, stats: {...tr.stats, [parameter]: value}}
                return newTrace
            } else {
                return tr
            }
        })
       setTraces(newTraces)
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
                            buttonClass="btn-ghost" 
                            setError={setError}
                        />
                        <ButtonWithIcon 
                            text="Restore initial" 
                            onClick={() => setTraces(backupTraces)} 
                            icon={<CiUndo />} 
                            className={"btn-ghost"}
                        />
                    </div>
                    <hr className="mt-2 mb-8" />
                    <div className="flex flex-row flex-wrap gap-2 mt-8 mb-2">
                        <ButtonWithIcon 
                            text="Download to MSEED" 
                            onClick={handleDownloadFile} 
                            icon={<MdOutlineFileUpload />} 
                            className={"btn-outline btn-secondary btn-xs"}
                        />
                        <ButtonWithIcon 
                            text="Download data" 
                            onClick={handleDownloadData} 
                            icon={<GoDatabase />} 
                            className={"btn-outline btn-secondary btn-xs"}
                        />
                        <ButtonWithIcon 
                            text="Download header" 
                            onClick={CiBookmark} 
                            icon={<MdOutlineFileUpload />} 
                            className={"btn-outline btn-secondary btn-xs"}
                        />
                    </div>
                    {loading && <Spinner />}
                </>
            )
            }
            {
                traces.map((tr, ind) => (
                    <div key={tr.id}>
                        <div className="mb-0 mt-3 flex flex-row justify-end gap-2 relative">
                            <div>
                                <button className="btn btn-sm btn-info me-2" onClick={() => handleOptionsMenuButtonClick(ind)}>
                                    <PiGearLight />
                                </button>
                                <button className="btn btn-sm btn-error" onClick={() => handleDeleteTrace(tr.id)}>
                                    <MdDeleteOutline  />
                                </button>
                                {
                                    activatedMenuIndex === ind && (
                                        <div className="flex flex-col gap-1 absolute top-100 end-0 bg-white border shadow py-3 px-4 rounded z-50">
                                            <div>
                                                <LabelElement id="station" label="station" />
                                                <TextInputElement
                                                    id={"station"}
                                                    name={"station"}
                                                    value={tr.stats.station}
                                                    onChange={() => handleInputChange(tr.id, "station", e.target.value)}
                                                    placeholder={"e.g. SEIS"}
                                                    className={"input-sm"}
                                                />
                                            </div>
                                            <div>
                                                <LabelElement id="date" label="Date" />
                                                <DateInputElement
                                                    id={"date"}
                                                    name={"date"}
                                                    value={tr.stats.date}
                                                    onChange={() => handleInputChange(tr.id, "date", e.target.value)}
                                                    className={"input-sm"}
                                                />
                                            </div>
                                            <div>
                                                <LabelElement id="time" label="Time" />
                                                <TimeInputElement
                                                    id={"time"}
                                                    name={"time"}
                                                    value={tr.stats.time}
                                                    onChange={() => handleInputChange(tr.id, "time", e.target.value)}
                                                    className={"input-sm"}
                                                />
                                            </div>
                                            <div>
                                                <LabelElement id="fs" label="Sampling rate *" />
                                                <NumberInputElement
                                                    id={"fs"}
                                                    name={"fs"}
                                                    value={tr.stats.sampling_rate}
                                                    onChange={() => handleInputChange(tr.id, "sampling_rate", e.target.value)}
                                                    className={"input-sm"}
                                                    readonly={true}
                                                />
                                            </div>
                                            <div>
                                                <LabelElement id="npts" label="Total sample points *" />
                                                <NumberInputElement
                                                    id={"npts"}
                                                    name={"npts"}
                                                    value={tr.stats.npts}
                                                    onChange={(e) => handleInputChange(tr.id, "npts", e.target.value)}
                                                    className={"input-sm"}
                                                    readonly={true}
                                                />
                                            </div>
                                            <div>
                                                <LabelElement id="channel" label="Component" />
                                                <TextInputElement
                                                    id={"channel"}
                                                    name={"channel"}
                                                    value={tr.stats.channel}
                                                    onChange={() => handleInputChange(tr.id, "channel", e.target.value)}
                                                    placeholder={"e.g. E"}
                                                    className={"input-sm"}
                                                />
                                            </div>
                                            <p className="text-sm text-center my-1">Elements with "*" are readonly</p>
                                            <button className="btn btn-secondary btn-sm btn-block mt-2" onClick={() => setActivatedMenuIndex(null)}>Close Menu</button>
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
        </section>
    )
}
