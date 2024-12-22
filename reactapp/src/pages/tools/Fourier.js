import { useState } from "react"
import { useOutletContext } from "react-router-dom";
import { MdOutlineFileUpload } from "react-icons/md";
import { fastapiEndpoints, fourierWindowStyles } from "../../static";
import ButtonWithIcon from "../../components/ButtonWithIcon"
import Spinner from "../../components/Spinner"
import LineGraph from "../../components/LineGraph";
import fetchRequest from "../../functions/fetchRequest";
import { Checkbox, InputNumber, Slider, Dropdown } from "../../components/FormItems";

export default function Fourier() {
    // get the error and info states defined in the rootlayout to show errors and information
    const { setErrorMessage, setInfoMessage } = useOutletContext();
    // initialize the traces that will be used to create the plots
    const [traces, setTraces] = useState([]);
    // set the data that will hold the fourier and hvsr data
    const [fourierHVSRData, setFourierHVSRData] = useState([])
    // save a state to trigger it when we want the spinner to be active
    const [loading, setLoading] = useState(false);
    // save the signal window left side
    const [signalLeftSide, setSignalLeftSide] = useState(10)
    // save here the total window length
    const [windowLength, setWindowLength] = useState(10)
    // save the add a noise window state (true or false)
    const [addNoiseWindow, setAddNoiseWindow] = useState(false)
    // save the noise window right side
    const [noiseRightSide, setNoiseRightSide] = useState(10)
    // save whether the user wants to compute also the HVSR
    const [isComputeHVSRChecked, setIsComputeHVSRChecked] = useState(false)
    // save here the options of the select element of the vertical component
    const [verticalComponentOptions, setVerticalComponentOptions] = useState([])
    // here we save the selected vertical component
    const [selectedVerticalComponent, setSelectedVerticalComponent] = useState("Z")

    // get the duration of the seismic record
    let duration = traces.length !== 0 ? traces[0]["stats"]["duration"] : 0

    // initialize the shapes of the layout
    let shapes = [
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: signalLeftSide,
            y0: 0,
            x1: signalLeftSide + windowLength,
            y1: 1,
            line: {
                color: fourierWindowStyles.signal.edgeColor,
                width: fourierWindowStyles.signal.width
            },
            fillcolor: fourierWindowStyles.signal.fillColor
        }
    ];
    
    // add the noise window reactangle if it is selected
    if (addNoiseWindow) {
        shapes.push(
            {
                type: 'rect',
                xref: 'x',
                yref: 'paper',
                x0: noiseRightSide - windowLength,
                y0: 0,
                x1: noiseRightSide,
                y1: 1,
                line: {
                    color: fourierWindowStyles.noise.edgeColor,
                    width: fourierWindowStyles.noise.width
                },
                fillcolor: fourierWindowStyles.noise.fillColor
            }
        )
    }


    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        
        fetchRequest({endpoint: fastapiEndpoints["UPLOAD-SEISMIC-FILE"], method: "POST", data: formData})
        .then(jsonData => {
            // Update the state after the successful upload
            setTraces(jsonData);
            setVerticalComponentOptions(jsonData.map(tr =>({label: tr.stats.channel, value: tr.stats.channel})))
            setSignalLeftSide(10)
            setWindowLength(10)
            setFourierHVSRData([])
            setNoiseRightSide(10)
            setAddNoiseWindow(false)
            setIsComputeHVSRChecked(false)
            setInfoMessage("Seismic file upload completed successfully");
            setTimeout(() => setInfoMessage(null), 5000);

            // click the time series tab when the user uploads a new file
            document.querySelector("#time-series-tab").click()
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

    

    async function handleComputeFourier(e) {
        e.preventDefault();
        setLoading(true)

        const jsonDataInput = {
            "signal_window_left_side": signalLeftSide,
            "window_length": windowLength,
            "values": traces,
            "compute_hvsr": isComputeHVSRChecked
        } 

        if (noiseRightSide) {
            jsonDataInput["vertical_component"] = selectedVerticalComponent
            jsonDataInput["noise_window_right_side"] = noiseRightSide
        }
        
        fetchRequest({endpoint: fastapiEndpoints["COMPUTE-FOURIER"], method: "POST", data: jsonDataInput})
        .then(jsonData => {
            setFourierHVSRData(jsonData)
            setLoading(false)
            setInfoMessage("The Fourier Spectra has been successfully caclulated. Click on the Fourier and the HVSR tabs to observe the spectra");
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

    // this will run when the user adds the noise window
    function handleAddNoiseWindow(e) {
        setAddNoiseWindow(true)
        setNoiseRightSide(windowLength)
    }
    
    // this will run when the user wants to select the whole time series as the window of the signal
    function handleSetWholeTimeSeries() {
        setSignalLeftSide(0)
        setWindowLength(duration)
    }

    return (
        <section>
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            {
                traces.length === 0 && (
                    <>
                        <p className="text-center my-3">Start by uploading a seismic file</p>
                        <div className="text-center">
                            <ButtonWithIcon text="Upload file" onClick={handleFileUpload} icon={<MdOutlineFileUpload />} />
                        </div>
                        { loading && <Spinner />}
                    </>
                )
            }
            {
                traces.length !== 0 && (
                    <>
                        <div className="d-flex gap-3 my-4">
                            <ButtonWithIcon text="Upload file" onClick={handleFileUpload} icon={<MdOutlineFileUpload />} />
                        </div>
                        { loading && <Spinner />}
                        <ul className="nav nav-tabs" id="calculate-fourier-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="time-series-tab" data-bs-toggle="tab"
                                    data-bs-target="#time-series-tab-pane" type="button" role="tab" aria-controls="time-series-tab-pane"
                                    aria-selected="true">Time Series</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="fourier-tab" data-bs-toggle="tab" data-bs-target="#fourier-tab-pane"
                                    type="button" role="tab" aria-controls="fourier-tab-pane" aria-selected="false"
                                    disabled={fourierHVSRData.length===0}>Fourier</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="hvsr-tab" data-bs-toggle="tab" data-bs-target="#hvsr-tab-pane"
                                    type="button" role="tab" aria-controls="hvsr-tab-pane" aria-selected="false" disabled={!isComputeHVSRChecked | fourierHVSRData.length===0}>HVSR</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="graphs-area-fourier">
                            <div className="tab-pane fade show active" id="time-series-tab-pane" role="tabpanel"
                                aria-labelledby="time-series-tab" tabIndex="0">
                                <div className="my-8">
                                    {
                                        traces.map((tr, ind) => (
                                            <div key={tr.stats.id}>
                                                {
                                                    <LineGraph 
                                                        xData={[tr["xdata"]]} 
                                                        yData={[tr["ydata"]]} 
                                                        height="220px"
                                                        legendTitle={`Component: ${tr["stats"]["channel"]}`}
                                                        showGraphTitle={ind === 0}
                                                        graphTitle={tr["record-name"]}
                                                        shapes={shapes}
                                                    />
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                                <div id="options-menu" className="mt-4 fs-6">
                                    <div className="my-2 bg-info-subtle px-4 py-3 rounded d-flex flex-column gap-1">
                                        <h1 className="fs-6 fw-semibold">Set signal window left side (sec)</h1>
                                        <InputNumber
                                            label={null}
                                            id="signal-left-side-input"
                                            name="signal-left-side-input"
                                            value={signalLeftSide}
                                            onChange={(e) => setSignalLeftSide(Number(e.target.value))}
                                            disabled={traces.length === 0}
                                            style={{ width: "90px" }}
                                            small={true}
                                        />
                                        <Slider
                                            id="signal-window-left-side-slider"
                                            name="signal-window-left-side-slider"
                                            value={signalLeftSide}
                                            min={0}
                                            max={duration}
                                            step={1}
                                            onChange={(e) => setSignalLeftSide(Number(e.target.value))}
                                            disabled={traces.length === 0}
                                            className="d-block w-100"
                                        />
                                    </div>
                                    <div className="my-2 bg-info-subtle px-4 py-3 rounded d-flex flex-column gap-1">
                                        <h1 className="fs-6 fw-semibold">Set window length (sec)</h1>
                                        <InputNumber
                                            label={null}
                                            id="window-length-input"
                                            name="window-length-input"
                                            value={windowLength}
                                            onChange={(e) => setWindowLength(Number(e.target.value))} 
                                            disabled={traces.length === 0}
                                            style={{ width: "90px" }}
                                            small={true}
                                        />
                                        <Slider
                                            id="window-length-slider"
                                            name="window-length-slider"
                                            value={windowLength}
                                            min={0}
                                            max={duration}
                                            step={1}
                                            onChange={(e) => setWindowLength(Number(e.target.value))}
                                            disabled={traces.length === 0}
                                            className="d-block w-100"
                                        />
                                    </div>
                                    <div className="my-2 bg-info-subtle px-4 py-3 rounded d-flex flex-column gap-1">
                                        <h1 className="fs-6 fw-semibold">Add noise window</h1>
                                        {
                                            addNoiseWindow ? (
                                                <button className="btn btn-sm btn-danger align-self-start" onClick={() => setAddNoiseWindow(false)} disabled={traces.length === 0}>Remove noise window</button>
                                            ) : (
                                                <button className="btn btn-sm btn-primary align-self-start" onClick={handleAddNoiseWindow} disabled={traces.length === 0}>Add noise window</button>
                                            )
                                        }
                                        {
                                            addNoiseWindow && (
                                                <>
                                                    <h1 className="fs-6 fw-semibold">Set noise window left side (sec)</h1>
                                                    <InputNumber
                                                        label={null}
                                                        id="noise-right-side-input"
                                                        name="noise-right-side-input"
                                                        value={noiseRightSide}
                                                        onChange={(e) => setNoiseRightSide(Number(e.target.value))}
                                                        style={{ width: "90px" }}
                                                        small={true}
                                                    />
                                                    <Slider
                                                        id="noise-right-side-input"
                                                        name="noise-right-side-input"
                                                        value={noiseRightSide}
                                                        min={0}
                                                        max={duration}
                                                        step={1}
                                                        onChange={(e) => setNoiseRightSide(Number(e.target.value))}
                                                        className="d-block w-100"
                                                    />
                                                </>
                                            )
                                        }
                                    </div>
                                    <div className="d-flex flex-row gap-4 align-items-center justify-content-center mt-4 mb-3">
                                        <Checkbox 
                                            label="Compute HVSR"
                                            id="compute-hvsr-check"
                                            name="compute-hvsr-check"
                                            checked={isComputeHVSRChecked}
                                            onChange={() => setIsComputeHVSRChecked(!isComputeHVSRChecked)} 
                                            disabled={traces.length === 0}
                                        />
                                        <Dropdown 
                                            id="vertical-component"
                                            name="vertical-component"
                                            value={selectedVerticalComponent}
                                            onChange={(e) => setSelectedVerticalComponent(e.target.value)}
                                            codeOptions={verticalComponentOptions}
                                            disabled={!isComputeHVSRChecked}
                                            style={{ width: "80px" }}
                                            small={true}
                                        />
                                        <label htmlFor="vertical-component">Select vertical component</label>
                                    </div>
                                    <div className="row justify-content-center align-items-center mt-2">
                                        <div className="col-auto text-center">
                                            <button className="btn btn-primary p-3" id="computeFourierButton" onClick={handleComputeFourier} disabled={traces.length === 0}>Compute Fourier</button>
                                        </div>
                                    </div>
                                    { loading && <Spinner />}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="fourier-tab-pane" role="tabpanel" aria-labelledby="fourier-tab" tabIndex="1">
                                {
                                    fourierHVSRData.length !== 0 && (
                                        <>
                                            {
                                                Object.keys(fourierHVSRData["fourier"]).map((tr, ind) => (
                                                    <div key={tr}>
                                                        {
                                                            <LineGraph 
                                                                xData={addNoiseWindow ? [fourierHVSRData["fourier"][tr]["signal"]["xdata"], fourierHVSRData["fourier"][tr]["noise"]["xdata"]] : [fourierHVSRData["fourier"][tr]["signal"]["xdata"]]} 
                                                                yData={addNoiseWindow ? [fourierHVSRData["fourier"][tr]["signal"]["ydata"], fourierHVSRData["fourier"][tr]["noise"]["ydata"]] : [fourierHVSRData["fourier"][tr]["signal"]["ydata"]]} 
                                                                scale="log"
                                                                height="220px"
                                                                legendTitle={[`Component: ${fourierHVSRData["fourier"][tr]["signal"]["channel"]} (signal)`, `Component: ${fourierHVSRData["fourier"][tr]["signal"]["channel"]} (noise)`]}
                                                                showGraphTitle={ind === 0}
                                                                graphTitle="Fourier Spectra"
                                                            />
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </div>
                            <div className="tab-pane fade" id="hvsr-tab-pane" role="tabpanel" aria-labelledby="hvsr-tab" tabIndex="2">
                            {
                                    fourierHVSRData.length !== 0 && (
                                        <>
                                            <LineGraph 
                                                xData={[fourierHVSRData["hvsr"]["xdata"]]} 
                                                yData={[fourierHVSRData["hvsr"]["ydata"]]} 
                                                scale="log"
                                                height="400px"
                                                legendTitle="HVSR"
                                                graphTitle="Horizontal To Vertical Fourier Spectra"
                                            />
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )}
        </section>
    )
}
