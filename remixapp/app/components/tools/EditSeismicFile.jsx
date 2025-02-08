
import { useState } from "react";

import LineGraph from "@/components/ui/LineGraph"
import Spinner from "@/components/ui/Spinner";
import Section from "@/components/ui/Section";
import { PrimaryButton, GhostButton } from "@/components/ui/ButtonComponents";
// import UploadFileButton from "@/components/ui/UploadFileButton";
// import StartingUploadFile from "@/components/ui/StartingUploadFile";
import Message from "@/components/ui/Message";
import { NumberInputElement, TextInputElement, DateInputElement, TimeInputElement, LabelElement } from "@/components/ui/UIElements";

import { fastapiEndpoints } from "@/utils/static";
import fetchRequest from "@/utils/functions/fetchRequest";
import { downloadURI } from "@/utils/functions";

import { MdOutlineFileDownload, MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";
import { CiUndo } from "react-icons/ci";

export default function EditSeismicFile() {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([]);
    const [activatedMenuIndex, setActivatedMenuIndex] = useState(null)

    async function handleDownloadFile(fileType, data, downloadName) {
        const blobData = await fetchRequest({
            endpoint: fastapiEndpoints["DOWNLOAD-FILE"],
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "POST",
            data: {data: data, file_type: fileType},
            returnType: "blob",
        });

        const url = window.URL.createObjectURL(blobData);
        downloadURI(url, downloadName + "." + fileType)
    }


    function handleOptionsMenuButtonClick(ind) {
        if (activatedMenuIndex === ind) {
            setActivatedMenuIndex(null)
        }
        else {
            setActivatedMenuIndex(ind)
        }
    }

    function handleDeleteTrace(traceId) {
        const newTraces = traces.filter(tr => tr.trace_id !== traceId)
        setTraces(newTraces)
    }

    function handleInputChange(traceId, parameter, value) {
        let newTraces = traces.map((tr, i) => {
            if (tr.trace_id === traceId) {
                let newTrace = {...tr, stats: {...tr.stats, [parameter]: value}}
                return newTrace
            } else {
                return tr
            }
        })
       setTraces(newTraces)
    }
    
    
    return (
        <Section>
            {
                error && <Message type="error" text={error} />
            }
            {
                success && <Message type="success" text={success} />
            }
            {/* {traces.length === 0 && (
                <StartingUploadFile 
                    setTraces={setTraces} 
                    setBackupTraces={setBackupTraces} 
                    setError={setError} 
                    setSuccess={setSuccess} 
                    setLoading={setLoading} 
                />
            )} */}
            {
                traces.length !== 0 && (
                <>
                    <div>
                        <div className="flex flex-row items-center justify-start gap-1">
                            {/* <UploadFileButton 
                                setTraces={setTraces} 
                                setBackupTraces={setBackupTraces}
                                setLoading={setLoading} 
                                buttonClass="btn-ghost" 
                                setError={setError}
                                setSuccess={setSuccess} 
                            /> */}
                            <GhostButton 
                                onClick={() => setTraces(backupTraces)}  
                            >
                                Restore initial
                                <CiUndo />
                            </GhostButton>
                        </div>
                        <hr />
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                        <GhostButton 
                            onClick={() => handleDownloadFile("mseed", traces, traces[0].stats.record_name + "_download")} 
                            variant="neutral"
                            outline={true}
                            size="small"
                        >
                            Download to MSEED
                            <MdOutlineFileDownload />
                        </GhostButton>
                        <GhostButton 
                            onClick={() => handleDownloadFile("json", traces.map(tr => tr.stats), traces[0].stats.record_name + "_header")} 
                            variant="neutral"
                            outline={true}
                            size="small"
                        >
                            Download header
                            <MdOutlineFileDownload />
                        </GhostButton>
                        <GhostButton 
                            onClick={() => handleDownloadFile("json", traces.map(tr => ({"component": tr.stats.channel, "data": tr.ydata})), traces[0].stats.record_name + "_data")}
                            variant="neutral"
                            outline={true}
                            size="small"
                        >
                            Download Data samples
                            <MdOutlineFileDownload />
                        </GhostButton>
                    </div>
                    <Spinner visible={loading} />
                </>
            )}
            <div>
                {
                    traces.map((tr, ind) => (
                        <div key={tr.trace_id}>
                            <div className="flex flex-row justify-end gap-2 relative">
                                <div>
                                    <div className="flex flex-row justify-end gap-2">
                                        <GhostButton 
                                            onClick={() => handleOptionsMenuButtonClick(ind)}
                                            variant="neutral"
                                            size="small"
                                        >
                                            <PiGearLight />
                                        </GhostButton>
                                        <GhostButton 
                                            onClick={() => handleDeleteTrace(tr.trace_id)}
                                            variant="error"
                                            size="small"
                                        >
                                            <MdDeleteOutline />
                                        </GhostButton>
                                    </div>
                                    {
                                        activatedMenuIndex === ind && (
                                            <div className="flex flex-col items-stretch gap-1 absolute top-100 end-0 bg-white border shadow py-3 px-4 rounded z-50">
                                                <div>
                                                    <LabelElement id="station" label="station" />
                                                    <TextInputElement
                                                        id={"station"}
                                                        name={"station"}
                                                        value={tr.stats.station}
                                                        onChange={(e) => handleInputChange(tr.trace_id, "station", e.target.value)}
                                                        placeholder={"e.g. SEIS"}
                                                        className={"input-sm"}
                                                    />
                                                </div>
                                                <div>
                                                    <LabelElement id="date" label="Date" />
                                                    <DateInputElement
                                                        id={"date"}
                                                        name={"date"}
                                                        value={tr.stats.start_date}
                                                        onChange={(e) => handleInputChange(tr.trace_id, "date", e.target.value)}
                                                        className={"input-sm block w-full"}
                                                    />
                                                </div>
                                                <div>
                                                    <LabelElement id="time" label="Time" />
                                                    <TimeInputElement
                                                        id={"time"}
                                                        name={"time"}
                                                        value={tr.stats.start_time}
                                                        onChange={(e) => handleInputChange(tr.trace_id, "time", e.target.value)}
                                                        className={"input-sm block w-full"}
                                                    />
                                                </div>
                                                <div>
                                                    <LabelElement id="fs" label="Sampling rate *" />
                                                    <NumberInputElement
                                                        id={"fs"}
                                                        name={"fs"}
                                                        value={tr.stats.sampling_rate}
                                                        onChange={(e) => handleInputChange(tr.trace_id, "sampling_rate", e.target.value)}
                                                        className={"input-sm"}
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <div>
                                                    <LabelElement id="npts" label="Total sample points *" />
                                                    <NumberInputElement
                                                        id={"npts"}
                                                        name={"npts"}
                                                        value={tr.stats.npts}
                                                        onChange={(e) => handleInputChange(tr.trace_id, "npts", e.target.value)}
                                                        className={"input-sm"}
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <div>
                                                    <LabelElement id="channel" label="Component" />
                                                    <TextInputElement
                                                        id={"channel"}
                                                        name={"channel"}
                                                        value={tr.stats.channel}
                                                        onChange={(e) => handleInputChange(tr.trace_id, "channel", e.target.value)}
                                                        placeholder={"e.g. E"}
                                                        className={"input-sm"}
                                                    />
                                                </div>
                                                <p className="text-sm text-center my-1">Elements with "*" are readonly</p>
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
        </Section>
    )
}
