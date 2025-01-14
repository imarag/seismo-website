'use client';
import { useEffect, useState } from "react";
import LineGraph from "@/components/LineGraph"
import Spinner from "@/components/Spinner";
import { IoMdClose } from "react-icons/io";
import { NumberInputElement, TextInputElement, LabelElement, SelectElement, SliderElement } from "@/components/UIElements";
import UploadFileButton from "@/components/UploadFileButton";
import { fastapiEndpoints, fourierWindowStyles, taperTypes, taperSides, detrendTypes } from "@/utils/static";
import StartingUploadFile from "@/components/StartingUploadFile";
import ErrorMessage from "@/components/ErrorMessage";

function getRandomNumber(num = 6) {
    let randomId = "";
    for (let i = 0; i < num; i++) {
        let randomNumber = Math.round(Math.random() * 10, 1);
        randomId += randomNumber
    }
    return randomId
}

function MenuButton({ onClick }) {
    return (
        <div className="flex flex-row justify-start mt-8">
            <button className="btn btn-sm btn-secondary" onClick={onClick}>apply</button>
        </div>
    )
}

export default function SignalProcessing() {

    const [traces, setTraces] = useState([]);
    const [error, setError] = useState(null)
    const [filteredTraces, setFilteredTraces] = useState([]);
    const [shapes, setShapes] = useState([
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 1,
            line: {
                color: fourierWindowStyles.signal.edgeColor,
                width: fourierWindowStyles.signal.width
            },
            fillcolor: fourierWindowStyles.signal.fillColor
        }
    ])
    const [loading, setLoading] = useState(false)
    const [appliedFilters, setAppliedFilters] = useState([])
    const [signalProcessingOptions, setSignalProcessingOptions] = useState({
        "detrend-type": "simple",
        "taper-type": "parzen",
        "taper-side": "both",
        "taper-length": 20,
        "trim-left-side": 0,
        "trim-right-side": 10,
    })
    

    // get the duration of the seismic record
    let duration = filteredTraces.length !== 0 ? filteredTraces[0]["stats"]["duration"] : 0

    useEffect(() => {
        const applyFilters = async () => {
            setLoading(true);

            for (const filt of appliedFilters) {
                const options = {
                    method: 'POST',
                    body: filt.fetchBody,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                };

                const response = await fetch(filt.fetchURL, options);
                const jsonData = await response.json();
                newJSONData = jsonData;
            }
            setLoading(false)
            setFilteredTraces(newJSONData);
        };
        
            applyFilters();
        
    }, [traces, appliedFilters]);

    useEffect(() => {
        setFilteredTraces(traces);
    }, [traces])

    function handleSignalProcessingOptionsChange(processingOption, value, type = "text") {
        const userSelectedValue = type === "text" ? value : Number(value)
        const newProcessingOptions = { ...signalProcessingOptions, [processingOption]: userSelectedValue }
        setSignalProcessingOptions(newProcessingOptions)
    }

    function handleTrimApply() {
        const filter = {
            fetchURL: fastapiEndpoints["TRIM-WAVEFORM"],
            text: `trim-${shapes[0]["x0"]}-${shapes[0]["x1"]}`,
            fetchBody: {
                seismic_data: traces.map(tr => (
                    {
                        values: tr.ydata,
                        sampling_rate: tr.stats.sampling_rate,
                        left_trim: shapes[0]["x0"],
                        right_trim: shapes[0]["x1"],
                    }
                ))
            },
            id: getRandomNumber()
        }

        const newFiltersApplied = [...appliedFilters, filter]
        setAppliedFilters(newFiltersApplied)
    }

    function handleTaperApply() {
        const filter = {
            fetchURL: fastapiEndpoints["TAPER-WAVEFORM"],
            text: `taper-${signalProcessingOptions["taper-type"]}-${signalProcessingOptions["taper-side"]}-${signalProcessingOptions["taper-length"]}`,
            fetchBody: {
                seismic_data: traces.map(tr => (
                    {
                        values: tr.ydata,
                        sampling_rate: tr.stats.sampling_rate,
                        taper_type: signalProcessingOptions["taper-type"],
                        taper_side: signalProcessingOptions["taper-side"],
                        taper_length: signalProcessingOptions["taper-length"],
                    }
                ))
            },
            id: getRandomNumber()
        }
        const newFiltersApplied = [...appliedFilters, filter]
        setAppliedFilters(newFiltersApplied)
    }

    function handleDetrendApply() {
        const filter = {
            fetchURL: fastapiEndpoints["DETREND-WAVEFORM"],
            text: `detrend-${signalProcessingOptions["detrend-type"]}`,
            fetchBody: {
                seismic_data: traces.map(tr => (
                    {
                        values: tr.ydata,
                        sampling_rate: tr.stats.sampling_rate,
                        detrend_type: signalProcessingOptions["detrend-type"]
                    }
                ))
            },
            id: getRandomNumber()
        }

        const newFiltersApplied = [...appliedFilters, filter]
        setAppliedFilters(newFiltersApplied)
    }

    function handleDeleteFilter(filt) {

        let newAppliedFilters = appliedFilters.filter(f => {
            if (f.id !== filt.id) {
                return f
            }
        })
        setAppliedFilters(newAppliedFilters)
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
                        </div>
                        <hr className="mt-2 mb-8" />
                        <div role="tablist" className="tabs tabs-lifted">
                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Taper" onClick={(e) => setShapes([{...shapes[0], x0: 0, x1: 0}])} defaultChecked />
                            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                                <p className="font-light text-lg mb-4">Apply a tapering algorithm to the waveforms. Select the type of the taper, the side to be tapered as well as the length of the tapering at one end, in seconds</p>
                                <div className="flex flex-row gap-3">
                                    <div>
                                        <LabelElement label="Type" id="taper-type" />
                                        <SelectElement 
                                            id="taper-type"
                                            name="taper-type"
                                            optionsList={taperTypes}
                                            value={signalProcessingOptions["taper-type"]} 
                                            className="select-sm"
                                            onChange={(e) => handleSignalProcessingOptionsChange("taper-type", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <LabelElement label="Side" id="taper-side" />
                                        <SelectElement 
                                            id="taper-side"
                                            name="taper-side"
                                            optionsList={taperSides}
                                            value={signalProcessingOptions["taper-side"]} 
                                            className="select-sm"
                                            onChange={(e) => handleSignalProcessingOptionsChange("taper-side", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <LabelElement label="Length" id="taper-length" />
                                        <NumberInputElement 
                                            id="taper-length"
                                            name="taper-length"
                                            min={0}
                                            max={100} 
                                            step={0.1}
                                            className="input-sm w-32"
                                            value={signalProcessingOptions["taper-length"]} 
                                            onChange={(e) => handleSignalProcessingOptionsChange("taper-length", e.target.value, "number")}
                                        />
                                    </div>
                                </div>
                                <MenuButton onClick={handleTaperApply} />
                            </div>
                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Trim" />
                            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                                <p className="font-light text-lg mb-4">Trim the waveforms utilizing the left and the right window side, sliders</p>
                                <div  className="flex flex-col gap-3 mb-4">
                                    <LabelElement label="Trim left side" id="trim-left-side" />
                                    <NumberInputElement 
                                        id="trim-left-side"
                                        name="trim-left-side"
                                        min={0}
                                        max={duration} 
                                        step={0.1}
                                        className="input-sm w-24"
                                        value={shapes.length !== 0 ? shapes[0]["x0"] : 0} 
                                        onChange={(e) => setShapes([{...shapes[0], x0: Number(e.target.value)}])}
                                    />
                                    <SliderElement 
                                        id="trim-left-side"
                                        name="trim-left-side"
                                        min={0}
                                        max={duration} 
                                        step={0.1}
                                        className="range-xs w-full"
                                        value={shapes.length !== 0 ? shapes[0]["x0"] : 0} 
                                        onChange={(e) => setShapes([{...shapes[0], x0: Number(e.target.value)}])}
                                    />
                                </div>
                                <div  className="flex flex-col gap-3">
                                    <LabelElement label="Trim right side" id="trim-right-side" />
                                    <NumberInputElement 
                                        id="trim-right-side"
                                        name="trim-right-side"
                                        min={0}
                                        max={duration} 
                                        step={0.1}
                                        className="input-sm w-24"
                                        value={shapes.length !== 0 ? shapes[0]["x1"] : 0} 
                                        onChange={(e) => setShapes([{...shapes[0], x1: Number(e.target.value)}])}
                                    />
                                    <SliderElement 
                                        id="trim-right-side"
                                        name="trim-right-side"
                                        min={0}
                                        max={duration} 
                                        step={0.1}
                                        className="range-xs w-full"
                                        value={shapes.length !== 0 ? shapes[0]["x1"] : 0} 
                                        onChange={(e) => setShapes([{...shapes[0], x1: Number(e.target.value)}])}
                                    />
                                </div>
                                <MenuButton onClick={handleTrimApply} />
                            </div>
                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Detrend"  onClick={() => setShapes([{...shapes[0], x0: 0, x1: 0}])} />
                            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                                <p className="font-light text-lg mb-4">Remove a trend from the traces. Utilize the "type" dropdown to select the method to use for detrending </p>
                                <div className="flex flex-row gap-3">
                                    <div>
                                        <LabelElement label="Type" id="detrend-type" />
                                        <SelectElement 
                                            id="detrend-type"
                                            name="detrend-type"
                                            optionsList={detrendTypes}
                                            className="select-sm"
                                            value={signalProcessingOptions["detrend-type"]} 
                                            onChange={(e) => handleSignalProcessingOptionsChange("detrend-type", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <MenuButton onClick={handleDetrendApply} />
                            </div>
                        </div>
                        <div className="flex flex-row flex-wrap gap-2 my-6">
                            {
                                appliedFilters.map(filt => (
                                    <button
                                        key={filt.id}
                                        className="btn btn-error btn-xs rounded-pill flex flex-row items-center"
                                        onClick={() => handleDeleteFilter(filt)}
                                        disabled={loading}
                                    >
                                        {filt["text"]}
                                        <IoMdClose />
                                    </button>
                                ))
                            }
                        </div>
                        {loading && <Spinner />}
                        <div>
                            {
                                filteredTraces.map((tr, ind) => (
                                    <div key={tr.stats.channel}>
                                        {
                                            <LineGraph
                                                xData={traces.length !== 0 ? [tr["xdata"]] : []}
                                                yData={traces.length !== 0 ? [tr["ydata"]] : []}
                                                graphTitle=""
                                                showLegend={false}
                                                height="220px"
                                                shapes={shapes}
                                            />
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </>
                )
            }
        </section>
    )
}
