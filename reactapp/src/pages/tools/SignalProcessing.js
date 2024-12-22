import ButtonWithIcon from "../../components/ButtonWithIcon"
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { fastapiEndpoints } from "../../static";
import LineGraph from "../../components/LineGraph"
import Spinner from "../../components/Spinner";
import { MdOutlineFileUpload, MdDeleteOutline } from "react-icons/md";
import { BsSoundwave } from "react-icons/bs";
import { IoCut } from "react-icons/io5";
import { CiAlignCenterV } from "react-icons/ci";

function getRandomNumber(num = 6) {
    let randomId = "";
    for (let i = 0; i < num; i++) {
        let randomNumber = Math.round(Math.random() * 10, 1);
        randomId += randomNumber
    }
    return randomId
}

function MenuOptions({ icon, title, onClick, children }) {
    return (
        <div className="px-5 py-3 rounded fs-6 bg-light">
            <div className="position-relative pt-3">
                <div className="d-flex flex-row flex-wrap gap-3">
                    {children}
                </div>
                <div className="mt-4">
                    <button onClick={onClick} className="btn btn-sm btn-dark">apply</button>
                </div>
            </div>
        </div>
    )
}


export default function SignalProcessing() {

    const { errorMessage, setErrorMessage, infoMessage, setInfoMessage } = useOutletContext();
    const [traces, setTraces] = useState([]);
    const [filteredTraces, setFilteredTraces] = useState([]);

    const [signalProcessingOptions, setSignalProcessingOptions] = useState({
        "detrend-type": "simple",
        "detrend-order": 1,
        "taper-type": "parzen",
        "taper-side": "both",
        "taper-length": 20,
        "trim-left-side": 0,
        "trim-right-side": 0,
    })
    const [loading, setLoading] = useState(false)
    const [appliedFilters, setAppliedFilters] = useState([])
    
    useEffect(() => {
        const applyFilters = async () => {
            setLoading(true);
            let newJSONData = traces;

            for (const filt of appliedFilters) {
                const requestBodyJson = {
                    data: newJSONData,
                    ...filt.processOptions
                };
                const options = {
                    method: 'POST',
                    body: JSON.stringify(requestBodyJson),
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

    // this function will be called by the hidden input when using the .click() function in handleFileUpload below
    async function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true);

        let formData = new FormData();
        formData.append('file', e.target.files[0]);

        let endpoint = fastapiEndpoints["UPLOAD-SEISMIC-FILE"]
        let options = { method: 'POST', body: formData, credentials: 'include' }

        fetch(endpoint, options)
            .then(res => res.json())
            .then(jsonData => {
                // Update the state after the successful upload
                setTraces(jsonData);
                setFilteredTraces(jsonData);
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

    function handleSignalProcessingOptionsChange(processingOption, e, type = "text") {
        const userSelectedValue = type === "text" ? e.target.value : Number(e.target.value)
        const newProcessingOptions = { ...signalProcessingOptions, [processingOption]: userSelectedValue }
        setSignalProcessingOptions(newProcessingOptions)
    }

    function handleTrim() {
        const filter = {
            fetchURL: fastapiEndpoints["TRIM-WAVEFORM"],
            text: `trim-${signalProcessingOptions["trim-left-side"]}-${signalProcessingOptions["trim-right-side"]}`,
            processOptions: {
                "trim_left_side": signalProcessingOptions["trim-left-side"],
                "trim_right_side": signalProcessingOptions["trim-right-side"],
            },
            id: getRandomNumber()
        }

        const newFiltersApplied = [...appliedFilters, filter]
        setAppliedFilters(newFiltersApplied)
    }

    function handleTaper() {
        const filter = {
            fetchURL: fastapiEndpoints["TAPER-WAVEFORM"],
            text: `taper-${signalProcessingOptions["taper-type"]}-${signalProcessingOptions["taper-side"]}-${signalProcessingOptions["taper-length"]}`,
            processOptions: {
                "taper_type": signalProcessingOptions["taper-type"],
                "taper_side": signalProcessingOptions["taper-side"],
                "taper_length": signalProcessingOptions["taper-length"],
            },
            id: getRandomNumber()
        }

        const newFiltersApplied = [...appliedFilters, filter]
        setAppliedFilters(newFiltersApplied)
    }

    function handleDetrend() {
        const filter = {
            fetchURL: fastapiEndpoints["DETREND-WAVEFORM"],
            text: `detrend-${signalProcessingOptions["detrend-type"]}-${signalProcessingOptions["detrend-order"]}`,
            processOptions: {
                "detrend_type": signalProcessingOptions["detrend-type"],
                "detrend_order": signalProcessingOptions["detrend-order"],
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
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <div className="d-flex flex-row align-items-center gap-2">
                <ButtonWithIcon text="Upload file" onClick={handleFileUpload} icon={<MdOutlineFileUpload />} />
            </div>
            <hr />
            <ul className="nav nav-tabs bg-light" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link d-flex flex-row align-items-center gap-2 link-dark active" id="trim-tab" data-bs-toggle="tab" data-bs-target="#trim-tab-pane" type="button" role="tab" aria-controls="trim-tab-pane" aria-selected="true">
                        <span>Trim</span>
                        <MdDeleteOutline />
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link d-flex flex-row align-items-center gap-2 link-dark" id="taper-tab" data-bs-toggle="tab" data-bs-target="#taper-tab-pane" type="button" role="tab" aria-controls="taper-tab-pane" aria-selected="false">
                        <span>Taper</span>
                        <CiAlignCenterV />
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link d-flex flex-row align-items-center gap-2 link-dark" id="detrend-tab" data-bs-toggle="tab" data-bs-target="#detrend-tab-pane" type="button" role="tab" aria-controls="detrend-tab-pane" aria-selected="false">
                        <span>Detrend</span>
                        <BsSoundwave />
                    </button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="trim-tab-pane" role="tabpanel" aria-labelledby="trim-tab" tabIndex="0">
                    <MenuOptions icon={<IoCut />} title="Trim" onClick={handleTrim}>
                        <div>
                            <label htmlFor="trim-left-side" className="form-label">left side</label>
                            <input type="number" id="trim-left-side" className="form-control form-control-sm" min="0" max="100" step="1" value={signalProcessingOptions["trim-left-side"]} onChange={(e) => handleSignalProcessingOptionsChange("trim-left-side", e, "number")} />
                        </div>
                        <div>
                            <label htmlFor="trim-right-side" className="form-label">right side</label>
                            <input type="number" id="trim-right-side" className="form-control form-control-sm" min="0" max="100" step="1" value={signalProcessingOptions["trim-right-side"]} onChange={(e) => handleSignalProcessingOptionsChange("trim-right-side", e, "number")} />
                        </div>
                    </MenuOptions>
                </div>
                <div className="tab-pane fade" id="taper-tab-pane" role="tabpanel" aria-labelledby="taper-tab" tabIndex="0">
                    <MenuOptions icon={<BsSoundwave />} title="Taper" onClick={handleTaper}>
                        <div>
                            <label htmlFor="taper-type" className="form-label">type</label>
                            <select className="form-select form-select-sm" id="taper-type" value={signalProcessingOptions["taper-type"]} onChange={(e) => handleSignalProcessingOptionsChange("taper-type", e)}>
                                <option value="cosine">Cosine taper</option>
                                <option value="barthann">Bartlett-Hann</option>
                                <option value="bartlett">Bartlett</option>
                                <option value="blackman">Blackman</option>
                                <option value="blackmanharris">Blackman-Harris</option>
                                <option value="bohman">Bohman</option>
                                <option value="boxcar">Boxcar</option>
                                <option value="chebwin">Dolph-Chebyshev</option>
                                <option value="flattop">Flat top</option>
                                <option value="gaussian">Gaussian std</option>
                                <option value="general_gaussian">Gen. Gaussian</option>
                                <option value="hamming">Hamming</option>
                                <option value="hann">Hann</option>
                                <option value="kaiser">Kaiser</option>
                                <option value="nuttall">Nuttall</option>
                                <option value="parzen">Parzen</option>
                                <option value="slepian">Slepian</option>
                                <option value="triang">Triangular</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="taper-side" className="form-label">side</label>
                            <select className="form-select form-select-sm" id="taper-side" value={signalProcessingOptions["taper-side"]} onChange={(e) => handleSignalProcessingOptionsChange("taper-side", e)}>
                                <option value="left">left</option>
                                <option value="both">both</option>
                                <option value="right">right</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="taper-length" className="form-label">length (%)</label>
                            <input type="number" id="taper-length" className="form-control form-control-sm" min="0" max="100" step="1" value={signalProcessingOptions["taper-length"]} onChange={(e) => handleSignalProcessingOptionsChange("taper-length", e, "number")} />
                        </div>
                    </MenuOptions>
                </div>
                <div className="tab-pane fade" id="detrend-tab-pane" role="tabpanel" aria-labelledby="detrend-tab" tabIndex="0">
                    <MenuOptions icon={<CiAlignCenterV />} title="Detrend" onClick={handleDetrend}>
                        <div>
                            <label htmlFor="detrend-type" className="form-label">type</label>
                            <select className="form-select form-select-sm" id="detrend-type" value={signalProcessingOptions["detrend-type"]} onChange={(e) => handleSignalProcessingOptionsChange("detrend-type", e)}>
                                <option value="simple">simple</option>
                                <option value="linear">linear</option>
                                <option value="constant">constant</option>
                                <option value="polynomial">polynomial</option>
                                <option value="spline">spline</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="detrend-order" className="form-label">order</label>
                            <input type="number" id="detrend-order" className="form-control form-control-sm" min="0" max="5" step="1" value={signalProcessingOptions["detrend-order"]} onChange={(e) => handleSignalProcessingOptionsChange("detrend-order", e, "number")} />
                        </div>
                    </MenuOptions>
                </div>
            </div>

            <div className="d-flex flex-row flex-wrap gap-2">
                {
                    appliedFilters.map(filt => (
                        <button
                            key={filt.id}
                            className="btn btn-warning btn-sm rounded-pill d-flex flex-row align-items-center"
                            onClick={() => handleDeleteFilter(filt)}
                            disabled={loading}
                        >
                            {filt["text"]}
                            <MdDeleteOutline />
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
                                />
                            }
                        </div>
                    ))
                }
            </div>

        </section>
    )
}
