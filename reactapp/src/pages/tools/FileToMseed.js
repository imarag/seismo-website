import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import LineGraph from "../../components/LineGraph"
import Spinner from "../../components/Spinner";
import { FiUpload } from "react-icons/fi";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { fastapiEndpoints } from "../../static";
import fetchRequest from "../../functions/fetchRequest";
import Accordion from "../../components/Accordion";
import { InputDate, InputTime, InputText, InputNumber } from "../../components/FormItems";

function UploadButton() {
    return (
        <div className="d-flex flex-row justify-content-center">
            <button type="submit" className="btn btn-dark">Upload</button>
        </div>
    )
}

export default function EditSeismicFile() {
    const { errorMessage, setErrorMessage, infoMessage, setInfoMessage } = useOutletContext();
    const [fileData, setFileData] = useState([])
    const [loading, setLoading] = useState(false)
    const [seismicParameters, setSeismicParameters] = useState({
        startDate: "",
        startTime: "",
        station: "",
        samplingRate: "",
        channelCodes: {}
    })

    const supportedExtensions = ["CSV", "TXT", "DAT", "XLSX"]

    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    async function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true);
        
        let file = e.target.files[0];

        // Extract the file name
        let fileName = file.name;
       
        // Get the file extension
        let fileExtension = fileName.split('.').pop();
        fileExtension = fileExtension.toUpperCase();

        if (!supportedExtensions.includes(fileExtension.toUpperCase())) {
            setErrorMessage(
                `The file type you selected is not supported. Please upload a file with one of the following extensions: ${supportedExtensions.join(", ")}.`
            )
            return
        }
        
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        setErrorMessage(null)
        fetchRequest({endpoint: fastapiEndpoints["UPLOAD-DATA-FILE"], method: "POST", data: formData})
        .then(jsonData => {
            setFileData(jsonData)
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
    function handleFileUpload(e) {
        e.preventDefault();
        document.querySelector("#upload-seismic-file-input").click()
    }

    function handleConvertToMseed() {
        let inputJsonData = {
            ...seismicParameters,
            data: fileData
        }
        fetchRequest({endpoint: fastapiEndpoints["CONVERT-TO-MSEED"], method: "POST", data: inputJsonData, returnBlob: true})
        .then(blobData => {
            const url = window.URL.createObjectURL(blobData);
            const a = document.createElement("a");
            a.href = url;
            a.download = "seismic-file.mseed";
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            setErrorMessage(error.message || "Error uploading file. Please try again.");            
            setTimeout(() => setErrorMessage(null), 5000);
        })
        .finally(() => {
            setLoading(false)
        })
    }
    
    return (
        <section>
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <div>
                <h1 className="text-center display-6 my-5">Upload the data file</h1>
                <div className="d-flex flex-row justify-content-center mb-5">
                    <ButtonWithIcon text="Upload file" onClick={handleFileUpload} icon={<FiUpload />} />
                </div>
                { loading && <Spinner />}
            </div>
            {
                fileData.length !== 0 && (
                    <>
                        <Accordion label="Show Table" show={true}>
                            <>
                                <p>
                                    Sample of the parsed file content. Each column represents a column in the input file. If any column contains header, it has been removed. 
                                    The table shows the first and last 5 rows of each column.
                                </p>
                                <div className="overflow-scroll">
                                    <table className="table fs-6 text-center table-hover overflow-scroll" style={{minWidth: "600px"}}>
                                        <thead>
                                            <tr>
                                                {
                                                    fileData.map((el, ind) => (
                                                        <th scope="col">Column-{ind+1}</th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                fileData[0].slice(0, 5).map((item, indRow) => (
                                                    <tr>
                                                        {
                                                            fileData.map((item, indCol) => (
                                                                <td>{fileData[indCol][indRow]}</td>
                                                            ))
                                                        }
                                                    </tr>
                                                ))
                                            }
                                            <tr>
                                                {
                                                    fileData.map((item, indCol) => (
                                                        <td>...</td>
                                                    ))
                                                }
                                            </tr>
                                            {
                                                fileData[0].slice(-6, -1).map((item, indRow) => (
                                                    <tr>
                                                        {
                                                            fileData.map((item, indCol) => (
                                                                <td>{fileData[indCol][fileData[0].length-5+indRow]}</td>
                                                            ))
                                                        }
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        </Accordion>
                        <Accordion label="Show Graph" show={true}>
                            <>
                                <p>
                                    The y-axis represents the raw seismic amplitude values for the respective trace components that you provided in the text file. 
                                    The x-axis shows incremental numbers starting from 0 and going up to the total number of data points in your file. These incremental numbers represent the index of the data points, not actual time values.
                                </p>
                                {
                                    fileData.map((el, ind) => (
                                        <LineGraph 
                                            xData={[Array.from({ length: el.length }, (_, index) => index)]} 
                                            yData={[el]} 
                                            graphTitle="" 
                                            legendTitle={[`Column-${ind+1}`]}
                                            showLegend={true} 
                                            height="180px"
                                        />
                                    ))
                                }
                            </>
                        </Accordion>
                        <h1 className="text-center display-6 my-5">Set the seismic parameters</h1>
                        <div className="mt-4 mb-2">
                            <h1 className="fs-5 fw-semibold">Date and time of the first data sample</h1>
                            <hr />
                            <div className="d-flex flex-row gap-2">
                                <InputDate 
                                    label="start date" 
                                    id="date" 
                                    name="date" 
                                    value={seismicParameters["startDate"]} 
                                    onChange={(e) => setSeismicParameters({...seismicParameters, startDate: e.target.value})} 
                                />
                                <InputTime 
                                    label="start time" 
                                    id="time" 
                                    name="time" 
                                    value={seismicParameters["startTime"]} 
                                    onChange={(e) => setSeismicParameters({...seismicParameters, startTime: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="mt-4 mb-2">
                            <h1 className="fs-5 fw-semibold">Component codes</h1>
                            <hr />
                            <div className="d-flex flex-row gap-2">
                                {
                                    fileData.map((item, ind) => (
                                        <InputText 
                                            label={`Column ${ind+1}`} 
                                            id={`column-${ind+1}-code`} 
                                            name={`column-${ind+1}-code`} 
                                            value={seismicParameters["channelCodes"][""]} 
                                            onChange={(e) => setSeismicParameters({...seismicParameters, channelCodes: {...seismicParameters.channelCodes, [`column-${ind+1}`]: e.target.value}})} 
                                            placeholder="e.g. E" 
                                        />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="mt-4 mb-2">
                            <h1 className="fs-5 fw-semibold">Station name and sampling rate</h1>
                            <hr />
                            <div className="d-flex flex-row gap-2">
                                <InputText 
                                    label="Station" 
                                    id="station" 
                                    name="station" 
                                    value={seismicParameters["station"]} 
                                    onChange={(e) => setSeismicParameters({...seismicParameters, station: e.target.value})} 
                                    placeholder="e.g. SEIS"
                                />
                                <InputNumber 
                                    label="Sampling rate" 
                                    id="samplingRate" 
                                    name="samplingRate" 
                                    value={seismicParameters["samplingRate"]} 
                                    onChange={(e) => setSeismicParameters({...seismicParameters, samplingRate: e.target.value})} 
                                    placeholder="e.g. 100"
                                />
                            </div>
                        </div>
                        { loading && <Spinner />}
                        <div className="text-center mt-4">
                            <button className="btn btn-lg btn-dark" onClick={handleConvertToMseed}>convert to mseed</button>
                        </div>
                    </>
                )
            }
            
        </section>
    )
}
