
import { useEffect, useState } from "react"
// import ToolTip from "@/components/ui/ToolTip";
import Section from "@/components/utils/Section";
import Collapse from "@/components/ui/Collapse"
import Button from "@/components/ui/Button";
import { MdDelete } from "react-icons/md";
import fetchRequest from "@/utils/functions/fetchRequest";
import { fastapiEndpoints } from "@/utils/static";
import { IoInformationCircleOutline } from "react-icons/io5";
import { NumberInputElement, TextInputElement, SelectElement, DateInputElement, TimeInputElement, LabelElement } from "@/components/ui/UIElements";

function StatsItemToolTip({ text }) {
    return (
            <IoInformationCircleOutline className="size-5" />
        // <ToolTip text={text}>
        // </ToolTip>
    )
}


export default function EditSeismicFile() {
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false);
    const [delimiterOptions, setDelimiterOptions] = useState(null)
    const [delimiter, setDelimiter] = useState(",")
    const [skipRows, setSkipRows] = useState(0)
    const defaultTraceObject = {station: "", start_date: "1970-01-01", start_time: "00:00:00", sampling_rate: 100, component: ""};
    const [traces, setTraces] = useState([])
    const [fileData, setFileData] = useState([])

    useEffect(() => {
            const fetchDelimiterOptions = async () => {
                const jsonData = await fetchRequest({
                    endpoint: fastapiEndpoints["DELIMITER-OPTIONS"],
                    setError: setError,
                    setSuccess: setSuccess,
                    setLoading: setLoading,
                    method: "GET",
                });
    
                setDelimiterOptions(jsonData); 
            };
        
            fetchDelimiterOptions();
          }, []); 

    function handleSetTrace(propName, propValue, traceId) {
        const newTraces = traces.map((tr, ind) => {
            if (traceId === ind) {
                return {
                    ...traces[ind],
                    [propName]: propValue
                }
            }
            else {
                return traces[ind]
            }
        })
        setTraces(newTraces)
    }

    function handleDeleteTrace(traceId) {
        const filteredTraces = traces.filter((tr, ind) => ind !== traceId);
        setTraces(filteredTraces)
    }
    
    async function handleDataInput(e) {

        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("delimiter", delimiter)
        formData.append("skiprows", skipRows)

        const jsonData = await fetchRequest({
            endpoint: fastapiEndpoints["UPLOAD-DATA-FILE"],
            setError: setError,
            setSuccess: setSuccess,
            setLoading: setLoading,
            method: "POST",
            data: formData,
            successMessage: "The file has been succesfully uploaded!"
        });
      
        setFileData(jsonData)
    }
    return (
        <>
            <h1 className="text-center text-2xl">Upload a data file</h1>
            <Button variant="secondary" position="center" onClick={() => setTraces([...traces, defaultTraceObject])}>
                Upload Data
            </Button>
            <p className="text-sm text-center">Supported files: .xlsx, .csv, .txt, .dat</p>
            <div className="flex flex-row items-center justify-center gap-3">
                <LabelElement id="skip_rows" label="Skip rows" />
                <NumberInputElement
                    id={"skip_rows"}
                    name={"skip_rows"}
                    value={skipRows}
                    onChange={(e) => setSkipRows(e.target.value)}
                    className={"input-sm w-28"}
                    step={1}
                />
                <StatsItemToolTip text="Skip a number of rows before reading the data from the file. Use it to skip any header or unwanted data" />
            </div>
            <div className="flex flex-row items-center justify-center gap-3">
                <LabelElement id="delimiter" label="Delimiter" />
                <SelectElement
                    id={"delimiter"}
                    name={"delimiter"}
                    optionsList={delimiterOptions}
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    className={"select-sm w-28"}
                    readOnly={true}
                />
                <StatsItemToolTip text="Skip a number of rows before reading the data from the file. Use it to skip any header or unwanted data" />
            </div>
            {
                fileData.length !== 0 && (
                    <table className="table text-center">
                        <thead>
                            <tr>
                                {
                                    Object.keys(fileData[0]).map((tr, ind) => (
                                        <th>Col - {ind+1}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                fileData.slice(0, 3).map((tr, ind) => (
                                    <tr>
                                        {
                                            Object.keys(tr).map(el => (
                                                <td>{tr[el]}</td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                            <tr>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                            </tr>
                            {
                                fileData.slice(-3).map((tr, ind) => (
                                    <tr>
                                        {
                                            Object.keys(tr).map(el => (
                                                <td>{tr[el]}</td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
            }
            <Button variant="secondary" onClick={() => setTraces([...traces, defaultTraceObject])}>
                Add trace +
            </Button>
            {
                traces.map((tr, ind) => (
                    <Collapse label={`trace-${ind+1}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="flex flex-col gap-4">
                                <h1 className="text-center font-semibold">Header</h1>
                                <div className="flex flex-row items-center gap-3">
                                    <LabelElement id="station" label="Station" />
                                    <TextInputElement
                                        id={"station"}
                                        name={"station"}
                                        value={traces[ind]["station"]}
                                        onChange={(e) => handleSetTrace("station", e.target.value, ind)}
                                        placeholder={"e.g. SEIS"}
                                        className={"input-sm"}
                                    />
                                    <StatsItemToolTip text="Station code (e.g. SEIS)" />
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <LabelElement id="date" label="Start date" />
                                    <DateInputElement
                                        id={"date"}
                                        name={"date"}
                                        value={traces[ind]["start_date"]}
                                        onChange={(e) => handleSetTrace("start_date", e.target.value, ind)}
                                        className={"input-sm"}
                                    />
                                    <StatsItemToolTip text="Date of the first data sample" />
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <LabelElement id="time" label="Start Time" />
                                    <TimeInputElement
                                        id={"time"}
                                        name={"time"}
                                        value={traces[ind]["start_time"]}
                                        onChange={(e) => handleSetTrace("start_time", e.target.value, ind)}
                                        className={"input-sm"}
                                    />
                                    <StatsItemToolTip text="Time of the first data sample" />
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <LabelElement id="sampling_rate" label="Sampling rate *" />
                                    <NumberInputElement
                                        id={"sampling_rate"}
                                        name={"sampling_rate"}
                                        value={traces[ind]["sampling_rate"]}
                                        onChange={(e) => handleSetTrace("sampling_rate", e.target.value, ind)}
                                        className={"input-sm"}
                                        readOnly={true}
                                    />
                                    <StatsItemToolTip text="Sampling rate in hertz" />
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <LabelElement id="component" label="Component" />
                                    <TextInputElement
                                        id={"component"}
                                        name={"component"}
                                        value={traces[ind]["component"]}
                                        onChange={(e) => handleSetTrace("component", e.target.value, ind)}
                                        placeholder={"e.g. E"}
                                        className={"input-sm"}
                                    />
                                    <StatsItemToolTip text="Trace component value (e.g. N)" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-center font-semibold">Data</h1>
                                <p className="text-sm">Supported files: .xlsx, .csv, .txt, .dat</p>
                                <div className="flex flex-row items-center gap-3">
                                    <input 
                                        type="file" 
                                        className="file-input file-input-bordered file-input-sm w-full max-w-lg" 
                                        onChange={handleDataInput}
                                    />  
                                    <StatsItemToolTip text="Add an array of data samples" />
                                </div>
                                
                                
                            </div>
                        </div>
                        
                        <Button 
                            variant="error"
                            size="small"
                            position="start"
                            className="mt-8"
                            onClick={() => handleDeleteTrace(ind)}
                        >
                            remove
                            <MdDelete />
                        </Button>
                                    
                    </Collapse>
                ))
            }
        </>
    )
}

