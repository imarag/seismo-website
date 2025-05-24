import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import LineGraph from "../ui/LineGraph";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Select from "../ui/Select";
import SmallScreenToolAlert from "../utils/SmallScreenToolALert";
import {
  taperTypeOptions,
  taperSideOptions,
  detrendTypeOptions,
} from "../../assets/data/static";
import Message from "../ui/Message";
import { apiRequest } from "../../assets/utils/apiRequest";
import { downloadURI } from "../../assets/utils/utility-functions";
import { getRandomNumber } from "../../assets/utils/utility-functions";
import { fastapiEndpoints } from "../../assets/data/static";
import { MdAlignVerticalCenter, MdArrowDropDown } from "react-icons/md";
import { HiOutlineUpload } from "react-icons/hi";
import { TbFileDownload } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { IoCut, IoFilter } from "react-icons/io5";
import { BsSoundwave } from "react-icons/bs";

function MenuButton({ onClick, disabled = false }) {
  return (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={onClick}
        size="small"
        style="primary"
        disabled={disabled}
      >
        apply
      </Button>
    </div>
  );
}

function MenuDropdown({ label, icon, children }) {
  return (
    <div className="dropdown ">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-md m-1">
        {icon}
        {label}
        <MdArrowDropDown />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content card card-compact bg-base-100 border border-neutral-500/20 rounded-lg z-[1] w-64 p-2 shadow-lg"
      >
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}

function MainMenu({
  traces,
  setTraces,
  loading,
  setLoading,
  handleFileUpload,
  appliedProcesses,
  setAppliedProcesses,
  setShowMessage,
}) {
  const [sigProcOptions, setSigProcOptions] = useState({
    "detrend-type": "simple",
    "taper-type": "parzen",
    "taper-side": "both",
    "taper-length": 20,
    "trim-left-side": 0,
    "trim-right-side": 0,
    "filter-min": 0,
    "filter-max": 0,
  });

  let duration =
    traces.length !== 0
      ? traces[0].ydata.length / traces[0].stats.sampling_rate
      : 0;

  async function handleTrimApply() {
    const process = {
      fetchURL: fastapiEndpoints["TRIM-WAVEFORM"],
      text: `trim-${sigProcOptions["trim-left-side"]}-${sigProcOptions["trim-right-side"]}`,
      fetchBody: {
        traces: traces,
        options: {
          trim_start: sigProcOptions["trim-left-side"],
          trim_end: sigProcOptions["trim-right-side"],
        },
      },
      processId: getRandomNumber(),
    };
    const { resData: jsonData, error } = await apiRequest({
      url: process.fetchURL,
      method: "post",
      requestData: process.fetchBody,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      errorMessage: "Cannot trim the waveforms. Please try again later.",
    });

    if (error) {
      return;
    }

    setTraces(jsonData);
    setAppliedProcesses([...appliedProcesses, process]);

    setSigProcOptions({
      ...sigProcOptions,
      "trim-left-side": 0,
      "trim-right-side": 0,
    });
  }

  async function handleTaperApply() {
    const process = {
      fetchURL: fastapiEndpoints["TAPER-WAVEFORM"],
      text: `taper-${sigProcOptions["taper-type"]}-${sigProcOptions["taper-side"]}-${sigProcOptions["taper-length"]}`,
      fetchBody: {
        traces: traces,
        options: {
          sampling_rate: traces[0].stats.sampling_rate,
          taper_type: sigProcOptions["taper-type"],
          taper_side: sigProcOptions["taper-side"],
          taper_length: sigProcOptions["taper-length"],
        },
      },
      processId: getRandomNumber(),
    };

    const { resData: jsonData, error } = await apiRequest({
      url: process.fetchURL,
      method: "post",
      requestData: process.fetchBody,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      errorMessage: "Cannot taper the waveforms. Please try again later.",
    });

    if (error) {
      return;
    }

    setTraces(jsonData);

    setAppliedProcesses([...appliedProcesses, process]);
  }

  async function handleDetrendApply() {
    const process = {
      fetchURL: fastapiEndpoints["DETREND-WAVEFORM"],
      text: `detrend-${sigProcOptions["detrend-type"]}`,
      fetchBody: {
        traces: traces,
        options: {
          detrend_type: sigProcOptions["detrend-type"],
        },
      },
      processId: getRandomNumber(),
    };

    const { resData: jsonData, error } = await apiRequest({
      url: process.fetchURL,
      method: "post",
      requestData: process.fetchBody,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      errorMessage: "Cannot detrend the waveform. Please try again later.",
    });

    if (error) {
      return;
    }

    setTraces(jsonData);

    setAppliedProcesses([...appliedProcesses, process]);
  }

  function getFilterPill(freqMin, freqMax) {
    if (freqMin === null && freqMax === null) {
      return "no-filter";
    } else if (freqMin === null && freqMax !== null) {
      return `lowpass-${freqMax}Hz`;
    } else if (freqMin !== null && freqMax == null) {
      return `highpass-${freqMin}Hz`;
    } else {
      return `bandpass-${freqMin}-${freqMax}Hz`;
    }
  }

  async function handleFilterApply() {
    const process = {
      fetchURL: fastapiEndpoints["FILTER-WAVEFORM"],
      text: getFilterPill(
        sigProcOptions["filter-min"] ? sigProcOptions["filter-min"] : null,
        sigProcOptions["filter-max"] ? sigProcOptions["filter-max"] : null
      ),
      fetchBody: {
        traces: traces,
        options: {
          freq_min: sigProcOptions["filter-min"]
            ? sigProcOptions["filter-min"]
            : null,
          freq_max: sigProcOptions["filter-max"]
            ? sigProcOptions["filter-max"]
            : null,
        },
      },
      processId: getRandomNumber(),
    };

    const { resData: jsonData, error } = await apiRequest({
      url: process.fetchURL,
      method: "post",
      requestData: process.fetchBody,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      errorMessage: "Cannot filter the waveforms. Please try again later.",
    });

    if (error) {
      return;
    }

    setTraces(jsonData);
    setAppliedProcesses([...appliedProcesses, process]);
  }

  function handleSigProcOptions(processingOption, value, type = "text") {
    const userSelectedValue = type === "text" ? value : Number(value);
    const newProcessingOptions = {
      ...sigProcOptions,
      [processingOption]: userSelectedValue,
    };
    setSigProcOptions(newProcessingOptions);
  }

  async function handleDownloadFile(fileType, data, downloadName) {
    const { resData: blobData, error } = await apiRequest({
      url: fastapiEndpoints["DOWNLOAD-FILE"],
      method: "post",
      requestData: { data: data, file_type: fileType },
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      errorMessage: "Cannot download the data. Please try again later.",
      responseType: "blob",
    });

    if (error) {
      return;
    }

    const url = window.URL.createObjectURL(blobData);
    downloadURI(url, downloadName + "." + fileType);
  }

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <div className="grow-0 border-r border-neutral-500/20">
          <Button
            onClick={handleFileUpload}
            loading={loading}
            style="ghost"
            tooltiptext="Upload a seismic file"
          >
            <HiOutlineUpload />
            Upload file
          </Button>
          <Button
            loading={loading}
            style="ghost"
            onClick={() =>
              handleDownloadFile(
                "mseed",
                traces,
                traces[0].stats.record_name + "_download"
              )
            }
            disabled={traces.length === 0}
            tooltiptext="Download the processed seismic file into MiniSEED file format"
          >
            <TbFileDownload />
            Download To MSEED
          </Button>
        </div>
        <div className="grow">
          <MenuDropdown icon={<BsSoundwave />} label="Taper">
            <div className="flex flex-col items-stretch gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="taper-type">Type</Label>
                <Select
                  id="taper-type"
                  name="taper-type"
                  optionslist={taperTypeOptions}
                  value={sigProcOptions["taper-type"]}
                  size="sm"
                  onChange={(e) =>
                    handleSigProcOptions("taper-type", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="taper-side">Side</Label>
                <Select
                  id="taper-side"
                  name="taper-side"
                  optionslist={taperSideOptions}
                  value={sigProcOptions["taper-side"]}
                  size="sm"
                  onChange={(e) =>
                    handleSigProcOptions("taper-side", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="taper-length">Length</Label>
                <Input
                  type="number"
                  id="taper-length"
                  name="taper-length"
                  min={0}
                  max={100}
                  step={0.1}
                  size="sm"
                  value={sigProcOptions["taper-length"]}
                  onChange={(e) =>
                    handleSigProcOptions(
                      "taper-length",
                      e.target.value,
                      "number"
                    )
                  }
                />
              </div>
              <MenuButton
                onClick={handleTaperApply}
                disabled={traces.length === 0}
              />
            </div>
          </MenuDropdown>
          <MenuDropdown icon={<IoCut />} label="Trim">
            <div className="flex flex-col items-stretch gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="trim-left-side">Start time (sec)</Label>
                <Input
                  type="number"
                  id="trim-left-side"
                  name="trim-left-side"
                  min={0}
                  max={duration}
                  step={0.1}
                  size="sm"
                  value={sigProcOptions["trim-left-side"]}
                  onChange={(e) =>
                    handleSigProcOptions(
                      "trim-left-side",
                      e.target.value,
                      "number"
                    )
                  }
                />
                <Input
                  type="range"
                  id="trim-left-side"
                  name="trim-left-side"
                  min={0}
                  max={duration}
                  step={0.1}
                  size="xs"
                  value={sigProcOptions["trim-left-side"]}
                  onChange={(e) =>
                    handleSigProcOptions(
                      "trim-left-side",
                      e.target.value,
                      "number"
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="trim-right-side">End time (sec)</Label>
                <Input
                  type="number"
                  id="trim-right-side"
                  name="trim-right-side"
                  min={0}
                  max={duration}
                  step={0.1}
                  size="sm"
                  value={sigProcOptions["trim-right-side"]}
                  onChange={(e) =>
                    handleSigProcOptions(
                      "trim-right-side",
                      e.target.value,
                      "number"
                    )
                  }
                />
                <Input
                  type="range"
                  id="trim-right-side"
                  name="trim-right-side"
                  min={0}
                  max={duration}
                  step={0.1}
                  size="xs"
                  value={sigProcOptions["trim-right-side"]}
                  onChange={(e) =>
                    handleSigProcOptions(
                      "trim-right-side",
                      e.target.value,
                      "number"
                    )
                  }
                />
              </div>
              <MenuButton
                onClick={handleTrimApply}
                disabled={traces.length === 0}
              />
            </div>
          </MenuDropdown>
          <MenuDropdown icon={<MdAlignVerticalCenter />} label="Detrend">
            <div className="flex flex-col items-stretch gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="detrend-type">Type</Label>
                <Select
                  id="detrend-type"
                  name="detrend-type"
                  size="sm"
                  optionslist={detrendTypeOptions}
                  value={sigProcOptions["detrend-type"]}
                  onChange={(e) =>
                    handleSigProcOptions("detrend-type", e.target.value)
                  }
                />
              </div>
              <MenuButton
                onClick={handleDetrendApply}
                disabled={traces.length === 0}
              />
            </div>
          </MenuDropdown>
          <MenuDropdown icon={<IoFilter />} label="Filter">
            <div className="flex flex-col items-stretch gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="filter-min">Min frequency</Label>
                <Input
                  type="number"
                  id="filter-min"
                  name="filter-min"
                  min={0}
                  max={duration}
                  step={0.1}
                  size="sm"
                  value={sigProcOptions["filter-min"]}
                  onChange={(e) =>
                    handleSigProcOptions("filter-min", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="freq-max">Max frequency</Label>
                <Input
                  type="number"
                  id="freq-max"
                  name="freq-max"
                  min={0}
                  max={duration}
                  step={0.1}
                  size="sm"
                  value={sigProcOptions["filter-max"]}
                  onChange={(e) =>
                    handleSigProcOptions("filter-max", e.target.value)
                  }
                />
              </div>
              <MenuButton
                onClick={handleFilterApply}
                disabled={traces.length === 0}
              />
            </div>
          </MenuDropdown>
        </div>
      </div>
    </>
  );
}

function Graphs({ traces, fourierData }) {
  return (
    <>
      {traces.map((tr, ind) => (
        <div key={tr.trace_id} className="h-1/3">
          <LineGraph
            xData={traces.length !== 0 ? [tr["xdata"]] : []}
            yData={traces.length !== 0 ? [tr["ydata"]] : []}
            graphTitle=""
            showLegend={false}
          />
        </div>
      ))}
    </>
  );
}
// <div className="flex flex-row justify-center items-center">
//     <div className="grow-7 bg-blue-500 h-20">
//         {
//             traces.map((tr, ind) => (
//                 <div key={tr.trace_id}>
//                     <LineGraph
//                         xData={traces.length !== 0 ? [tr["xdata"]] : []}
//                         yData={traces.length !== 0 ? [tr["ydata"]] : []}
//                         graphTitle=""
//                         showLegend={false}
//                     />
//                 </div>
//             ))
//         }
//     </div>
//     <div className="grow-1 bg-red-500 h-10">
//         {/* {
//             fourierData.map((tr, ind) => (
//                 <div key={tr.trace_id}>
//                     <LineGraph
//                         xData={[tr["fas_freqs"]]}
//                         yData={[tr["fas_amps"]]}
//                         graphTitle=""
//                         scale="log"
//                         showLegend={false}
//                         legendTitle={tr.component}
//                     />
//                 </div>
//             ))
//         } */}
//     </div>
// </div>
//     )
// }

function ProcessingFilters({ appliedProcesses, handleRemoveProcesses }) {
  return (
    <div>
      {appliedProcesses.length !== 0 && (
        <div>
          <div className="flex flex-row items-center flex-wrap gap-2 my-6">
            <p>Filters applied:</p>
            {appliedProcesses.map((process, index) => (
              <span key={process.processId} className="badge badge-info">
                {index + 1}. {process.text}
              </span>
            ))}
            <span className="ms-5">
              <Button
                style="error"
                size="extra-small"
                onClick={handleRemoveProcesses}
                tooltiptext="Remove all applied filters"
              >
                remove all
                <IoMdClose />
              </Button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignalProcessingPage() {
  const [showMessage, setShowMessage] = useState({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [traces, setTraces] = useState([]);
  const [fourierData, setFourierData] = useState([]);
  const [backupTraces, setBackupTraces] = useState([]);
  const inputRef = useRef();
  const [appliedProcesses, setAppliedProcesses] = useState([]);

  // useEffect(() => {
  //     async function applyProcesses() {
  //         setLoading(true);

  //         const fourierBody = {
  //             traces_data: traces.map(tr => ({trace_id: tr.trace_id, component: tr.stats.channel, values: tr.ydata})),
  //             sampling_rate: traces.length > 0 ? traces[0].stats.sampling_rate : 100,
  //         };

  //         const FourierJsonData = await fetchRequest({
  //             endpoint: fastapiEndpoints["COMPUTE-FOURIER"],
  //             setError: setError,
  //             setSuccess: setSuccess,
  //             setLoading: setLoading,
  //             method: "POST",
  //             data: fourierBody
  //         });

  //         setFourierData(FourierJsonData);
  //     }

  //     if (traces.length !== 0) {
  //         applyProcesses();
  //     }

  // }, [traces])

  function handleRemoveProcesses() {
    setTraces(backupTraces);
    setAppliedProcesses([]);
  }

  async function handleFileSelection(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const { resData: traces, error } = await apiRequest({
      url: fastapiEndpoints["UPLOAD-SEISMIC-FILE"],
      method: "post",
      requestData: formData,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      successMessage: "Your file has been uploaded!",
      errorMessage: "Cannot upload the file. Please try again later.",
    });

    if (error) {
      return;
    }

    setTraces(traces);
    setBackupTraces(traces);
    setAppliedProcesses([]);
  }

  function handleFileUpload(e) {
    e.preventDefault();
    inputRef.current.click();
  }

  return (
    <div>
      {showMessage.message && (
        <Message
          message={showMessage.message}
          type={showMessage.type}
          autoDismiss={5000}
          position="bottom-right"
          onClose={() =>
            setShowMessage({
              type: "",
              message: "",
            })
          }
        />
      )}
      <input
        ref={inputRef}
        name="file"
        type="file"
        onChange={handleFileSelection}
        hidden
      />
      <div className="md:hidden">
        <SmallScreenToolAlert />
      </div>
      <div className="hidden md:block h-screen min-h-96">
        <div className="border border-neutral-500/20 rounded-t-lg bg-base-100 p-1">
          <MainMenu
            traces={traces}
            setTraces={setTraces}
            loading={loading}
            setLoading={setLoading}
            handleFileUpload={handleFileUpload}
            appliedProcesses={appliedProcesses}
            setAppliedProcesses={setAppliedProcesses}
            setShowMessage={setShowMessage}
          />
        </div>
        <div className="border border-neutral-500/20 h-2/3 overflow-y-scroll p-4 relative">
          <>
            <div className="absolute start-1/2 ">{loading && <Spinner />}</div>

            {traces.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="font-semibold text-3xl text-center">
                  Upload a seismic file
                </h1>
                <p className="text-base text-center">
                  Start by uploading a seismic file to interact with the tool
                </p>
                <Button
                  onClick={handleFileUpload}
                  loading={loading}
                  tooltiptext="Upload a seismic file"
                >
                  <HiOutlineUpload />
                  Upload file
                </Button>
              </div>
            ) : (
              <>
                <ProcessingFilters
                  appliedProcesses={appliedProcesses}
                  handleRemoveProcesses={handleRemoveProcesses}
                />
                <Graphs traces={traces} fourierData={fourierData} />
              </>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
