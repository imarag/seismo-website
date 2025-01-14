'use client';
import { useEffect, useState } from "react"
import { MdOutlineFileUpload } from "react-icons/md";
import { fastapiEndpoints, fourierWindowStyles } from "@/utils/static";
import ButtonWithIcon from "@/components/ButtonWithIcon"
import Spinner from "@/components/Spinner"
import LineGraph from "@/components/LineGraph";
import fetchRequest from "@/utils/functions/fetchRequest";
import { CheckboxElement, NumberInputElement, SliderElement, SelectElement, LabelElement } from "@/components/UIElements";
import UploadFileButton from "@/components/UploadFileButton";
import StartingUploadFile from "@/components/StartingUploadFile";
import ErrorMessage from "@/components/ErrorMessage";

export default function Fourier() {

    const [error, setError] = useState(null)
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

    useEffect(() => {
        setVerticalComponentOptions(traces.map(tr =>({label: tr.stats.channel, value: tr.stats.channel})))
        setSignalLeftSide(10)
        setWindowLength(10)
        setFourierHVSRData([])
        setNoiseRightSide(10)
        setAddNoiseWindow(false)
        setIsComputeHVSRChecked(false)
    }, [traces])


    async function handleComputeFourier(e) {
        e.preventDefault();
        setLoading(true)

        const jsonDataInput = {
            "signal_window_left_side": signalLeftSide,
            "window_length": windowLength,
            "traces": traces,
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
            // setInfoMessage("The Fourier Spectra has been successfully caclulated. Click on the Fourier and the HVSR tabs to observe the spectra");
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
                            setError={setError}
                            buttonClass="btn-ghost" 
                        />
                    </div>
                    <hr className="mt-2 mb-8" />
                        <div role="tablist" className="tabs tabs-lifted">
                            <input type="radio" name="fourier-spectra-tab" role="tab" className="tab" aria-label="Time_Series" defaultChecked />
                            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                                <div className="my-8">
                                    {
                                        traces.map((tr, ind) => (
                                            <div key={tr.id}>
                                                {
                                                    <LineGraph 
                                                        xData={[tr["xdata"]]} 
                                                        yData={[tr["ydata"]]} 
                                                        height="220px"
                                                        legendTitle={`Component: ${tr["stats"]["channel"]}`}
                                                        showGraphTitle={ind === 0}
                                                        graphTitle={""}
                                                        shapes={shapes}
                                                    />
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                                <div id="options-menu" className="mt-4 fs-6">
                                    <div className="my-2 bg-base-200 px-4 py-3 rounded flex flex-col gap-3">
                                        <h1 className="text-lg font-semibold">Set signal window left side (sec)</h1>
                                        <NumberInputElement
                                            label={null}
                                            id="signal-left-side-input"
                                            name="signal-left-side-input"
                                            value={signalLeftSide}
                                            onChange={(e) => setSignalLeftSide(Number(e.target.value))}
                                            disabled={traces.length === 0}
                                            className="w-24 input-sm"
                                        />
                                        <SliderElement
                                            id="signal-window-left-side-slider"
                                            name="signal-window-left-side-slider"
                                            value={signalLeftSide}
                                            min={0}
                                            max={duration}
                                            step={1}
                                            onChange={(e) => setSignalLeftSide(Number(e.target.value))}
                                            disabled={traces.length === 0}
                                            className="range-sm"
                                        />
                                    </div>
                                    <div className="my-2 bg-base-200 px-4 py-3 rounded flex flex-col gap-3">
                                        <h1 className="text-lg font-semibold">Set window length (sec)</h1>
                                        <NumberInputElement
                                            label={null}
                                            id="window-length-input"
                                            name="window-length-input"
                                            value={windowLength}
                                            onChange={(e) => setWindowLength(Number(e.target.value))} 
                                            disabled={traces.length === 0}
                                            className="w-24 input-sm"
                                        />
                                        <SliderElement
                                            id="window-length-slider"
                                            name="window-length-slider"
                                            value={windowLength}
                                            min={0}
                                            max={duration}
                                            step={1}
                                            onChange={(e) => setWindowLength(Number(e.target.value))}
                                            disabled={traces.length === 0}
                                            className="range-sm"
                                        />
                                    </div>
                                    <div className="my-2 bg-base-200 px-4 py-3 rounded flex flex-col gap-3">
                                        <h1 className="text-lg font-semibold">Noise window</h1>
                                        {
                                            addNoiseWindow ? (
                                                <button className="btn btn-sm btn-error self-start" onClick={() => setAddNoiseWindow(false)} disabled={traces.length === 0}>Remove noise window</button>
                                            ) : (
                                                <button className="btn btn-sm btn-primary self-start" onClick={handleAddNoiseWindow} disabled={traces.length === 0}>Add noise window</button>
                                            )
                                        }
                                        {
                                            addNoiseWindow && (
                                                <>
                                                    <h1 className="text-lg font-semibold">Set noise window right side (sec)</h1>
                                                    <NumberInputElement
                                                        label={null}
                                                        id="noise-right-side-input"
                                                        name="noise-right-side-input"
                                                        value={noiseRightSide}
                                                        onChange={(e) => setNoiseRightSide(Number(e.target.value))}
                                                        className="w-24 input-sm"
                                                    />
                                                    <SliderElement
                                                        id="noise-right-side-input"
                                                        name="noise-right-side-input"
                                                        value={noiseRightSide}
                                                        min={0}
                                                        max={duration}
                                                        step={1}
                                                        onChange={(e) => setNoiseRightSide(Number(e.target.value))}
                                                        className="range-sm"
                                                    />
                                                </>
                                            )
                                        }
                                    </div>
                                    <div className="flex flex-row gap-4 items-center justify-center mt-4 mb-3">
                                        <CheckboxElement 
                                            label="Compute HVSR"
                                            id="compute-hvsr-check"
                                            name="compute-hvsr-check"
                                            checked={isComputeHVSRChecked}
                                            onChange={() => setIsComputeHVSRChecked(!isComputeHVSRChecked)} 
                                            disabled={traces.length === 0}
                                        />
                                        <LabelElement label="compute HVSR" id="compute-hvsr-check" />
                                        <SelectElement 
                                            id="vertical-component"
                                            name="vertical-component"
                                            value={selectedVerticalComponent}
                                            onChange={(e) => setSelectedVerticalComponent(e.target.value)}
                                            optionsList={verticalComponentOptions}
                                            disabled={!isComputeHVSRChecked}
                                        />
                                        <LabelElement label="Select vertical component" id="vertical-component" />
                                    </div>
                                    <button 
                                        className="btn btn-lg btn-wide btn-primary p-3 block mx-auto my-10" 
                                        id="computeFourierButton" 
                                        onClick={handleComputeFourier} 
                                        disabled={traces.length === 0}
                                    >
                                        Compute Fourier
                                    </button>
                                    { loading && <Spinner />}
                                </div>
                            </div>
                            <input type="radio" name="fourier-spectra-tab" role="tab" className="tab" aria-label="Fourier_Spectra" disabled={fourierHVSRData.length===0} />
                            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                                {
                                    fourierHVSRData.length !== 0 && (
                                        <>
                                            {
                                                Object.keys(fourierHVSRData["fourier"]).map((tr, ind) => (
                                                    <div key={tr.id}>
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
                            <input type="radio" name="fourier-spectra-tab" role="tab" className="tab" aria-label="HVSR" disabled={!isComputeHVSRChecked | fourierHVSRData.length===0} />
                            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
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


