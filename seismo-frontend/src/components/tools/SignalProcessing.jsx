import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import LineGraph from "../ui/LineGraph";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Spinner from "../ui/Spinner";
import Select from "../ui/Select";
import SmallScreenToolAlert from "../utils/SmallScreenToolALert";
import ToolTip from "../ui/ToolTip";
import Symbol from "../ui/Symbol";
import {
  taperProcessingParams,
  trimProcessingParams,
  detrendProcessingParams,
  filterProcessingParams,
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
import { BsFillQuestionCircleFill } from "react-icons/bs";

function MenuButton({ onClick, loading, disabled = false }) {
  return (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={onClick}
        loading={loading}
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
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-md">
        {icon}
        <span className="text-xs">{label}</span>
        <MdArrowDropDown />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content card card-compact bg-base-100 border border-neutral-500/20 rounded-lg w-64 p-2 shadow-lg"
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
    "trim-start": 0,
    "trim-end": 0,
    "freq-min": 0,
    "freq-max": 0,
  });

  let duration =
    traces.length !== 0
      ? traces[0].ydata.length / traces[0].stats.sampling_rate
      : 0;

  async function handleTrimApply() {
    const process = {
      fetchURL: fastapiEndpoints["TRIM-WAVEFORM"],
      text: `trim-${sigProcOptions["trim-start"]}-${sigProcOptions["trim-end"]}`,
      fetchBody: {
        traces: traces,
        options: {
          trim_start: sigProcOptions["trim-start"],
          trim_end: sigProcOptions["trim-end"],
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
      "trim-start": 0,
      "trim-end": 0,
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
        sigProcOptions["freq-min"] ? sigProcOptions["freq-min"] : null,
        sigProcOptions["freq-max"] ? sigProcOptions["freq-max"] : null
      ),
      fetchBody: {
        traces: traces,
        options: {
          freq_min: sigProcOptions["freq-min"]
            ? sigProcOptions["freq-min"]
            : null,
          freq_max: sigProcOptions["freq-max"]
            ? sigProcOptions["freq-max"]
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
    <div className="flex flex-row items-center justify-center border border-neutral-500/20 rounded-t-lg bg-base-100 p-3">
      <div className="grow-0 shrink-0 border-r border-neutral-500/20">
        <Button
          onClick={handleFileUpload}
          style="ghost"
          size="small"
          disabled={loading}
          toolTipText="Upload a seismic file (one of the supported formats in Python Obspy's read function)"
        >
          <Symbol IconComponent={HiOutlineUpload} />
          Upload file
        </Button>
        <Button
          onClick={() =>
            handleDownloadFile(
              "mseed",
              traces,
              traces[0].stats.record_name + "_download"
            )
          }
          style="ghost"
          size="small"
          disabled={traces.length === 0 || loading}
          toolTipText="Download the processed seismic file into MiniSEED file format"
        >
          <TbFileDownload />
          Download To MSEED
        </Button>
      </div>
      <div className="grow flex flex-row items-center">
        <MenuDropdown icon={<BsSoundwave />} label="Taper">
          <div className="flex flex-col items-stretch gap-2">
            {taperProcessingParams.map((el) => {
              return (
                <div key={el.id}>
                  <Label htmlFor={el.id}>{el.label}</Label>
                  {el.type === "select" ? (
                    <Select
                      {...el}
                      optionsList={el.optionsList}
                      size="small"
                      value={sigProcOptions[el.id]}
                      onChange={(e) =>
                        handleSigProcOptions(el.id, e.target.value)
                      }
                      disabled={traces.length === 0}
                    />
                  ) : (
                    <Input
                      {...el}
                      size="small"
                      value={sigProcOptions[el.id]}
                      onChange={(e) =>
                        handleSigProcOptions(el.id, e.target.value)
                      }
                      disabled={traces.length === 0}
                    />
                  )}
                </div>
              );
            })}
            <MenuButton
              onClick={handleTaperApply}
              loading={loading}
              disabled={traces.length === 0}
            />
          </div>
        </MenuDropdown>
        <MenuDropdown icon={<IoCut />} label="Trim">
          <div className="flex flex-col items-stretch gap-2">
            {trimProcessingParams.map((el) => {
              return (
                <div key={el.id}>
                  <Label htmlFor={el.id}>{el.label}</Label>
                  {el.type === "select" ? (
                    <Select
                      {...el}
                      optionsList={el.optionsList}
                      size="small"
                      value={sigProcOptions[el.name]}
                      onChange={(e) =>
                        handleSigProcOptions(el.name, e.target.value)
                      }
                      disabled={traces.length === 0}
                    />
                  ) : (
                    <Input
                      {...el}
                      size="small"
                      value={sigProcOptions[el.name]}
                      max={duration}
                      onChange={(e) =>
                        handleSigProcOptions(el.name, e.target.value, "number")
                      }
                      disabled={traces.length === 0}
                    />
                  )}
                </div>
              );
            })}
            <MenuButton
              onClick={handleTrimApply}
              loading={loading}
              disabled={traces.length === 0}
            />
          </div>
        </MenuDropdown>
        <MenuDropdown icon={<MdAlignVerticalCenter />} label="Detrend">
          <div className="flex flex-col items-stretch gap-2">
            {detrendProcessingParams.map((el) => {
              return (
                <div key={el.id}>
                  <Label htmlFor={el.id}>{el.label}</Label>
                  {el.type === "select" ? (
                    <Select
                      {...el}
                      optionsList={el.optionsList}
                      size="small"
                      value={sigProcOptions[el.id]}
                      onChange={(e) =>
                        handleSigProcOptions(el.id, e.target.value)
                      }
                      disabled={traces.length === 0}
                    />
                  ) : (
                    <Input
                      {...el}
                      size="small"
                      value={sigProcOptions[el.id]}
                      onChange={(e) =>
                        handleSigProcOptions(el.id, e.target.value)
                      }
                      disabled={traces.length === 0}
                    />
                  )}
                </div>
              );
            })}
            <MenuButton
              onClick={handleDetrendApply}
              loading={loading}
              disabled={traces.length === 0}
            />
          </div>
        </MenuDropdown>
        <MenuDropdown icon={<IoFilter />} label="Filter">
          <div className="flex flex-col items-stretch gap-2">
            <ToolTip
              toolTipText={`Fill only the left field to apply a highpass filter, fill only the right field to 
                  apply a lowpass filter, fill both fields to apply a bandpass filter.`}
            >
              <Symbol IconComponent={BsFillQuestionCircleFill} />
            </ToolTip>
            {filterProcessingParams.map((el) => {
              return (
                <div key={el.id}>
                  <Label htmlFor={el.id}>{el.label}</Label>
                  {el.type === "select" ? (
                    <Select
                      {...el}
                      optionsList={el.optionsList}
                      size="small"
                      value={sigProcOptions[el.id]}
                      onChange={(e) =>
                        handleSigProcOptions(el.id, e.target.value)
                      }
                      disabled={traces.length === 0}
                    />
                  ) : (
                    <Input
                      {...el}
                      size="small"
                      value={sigProcOptions[el.id]}
                      onChange={(e) =>
                        handleSigProcOptions(el.id, e.target.value)
                      }
                      disabled={traces.length === 0}
                    />
                  )}
                </div>
              );
            })}
            <MenuButton
              onClick={handleFilterApply}
              loading={loading}
              disabled={traces.length === 0}
            />
          </div>
        </MenuDropdown>
        <ToolTip
          className="ms-auto"
          toolTipText={`Upload a seismic file and apply one of the pre-defined processing options. Feel free to download the processed traces.`}
          toolTipPosition="top-left"
        >
          <Symbol IconComponent={BsFillQuestionCircleFill} />
        </ToolTip>
      </div>
    </div>
  );
}

function Graphs({ traces }) {
  return (
    <>
      {traces.map((tr, ind) => (
        <div key={tr.trace_id}>
          <LineGraph
            xData={traces.length !== 0 ? [tr["xdata"]] : []}
            yData={traces.length !== 0 ? [tr["ydata"]] : []}
            height={150}
            showLegend={false}
            legendTitle={[`Component: ${tr["stats"]["component"]}`]}
            showGraphTitle={ind === 0}
            graphTitle={""}
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
              <span
                key={process.processId}
                className="badge badge-sm badge-info"
              >
                {index + 1}. {process.text}
              </span>
            ))}
            <span className="ms-5">
              <Button
                style="error"
                size="extra-small"
                onClick={handleRemoveProcesses}
                toolTipText="Remove all applied filters"
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

function StartUploadFile({ loading, handleFileUpload }) {
  return (
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
        disabled={loading}
        toolTipText="Upload a seismic file (one of the supported formats in Python Obspy's read function)"
      >
        <Symbol IconComponent={HiOutlineUpload} />
        Upload file
      </Button>
    </div>
  );
}

function MainContent({
  loading,
  handleFileUpload,
  traces,
  backupTraces,
  appliedProcesses,
  handleRemoveProcesses,
}) {
  return (
    <div className="border border-neutral-500/20 h-2/3 overflow-y-scroll p-4 relative">
      {traces.length === 0 ? (
        <StartUploadFile
          loading={loading}
          handleFileUpload={handleFileUpload}
        />
      ) : (
        <>
          <div className="absolute start-1/2 -translate-x-1/2">
            {loading && <Spinner />}
          </div>
          <ProcessingFilters
            appliedProcesses={appliedProcesses}
            handleRemoveProcesses={handleRemoveProcesses}
          />
          <Graphs traces={traces} backupTraces={backupTraces} />
        </>
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
  const [backupTraces, setBackupTraces] = useState([]);
  const uploadFileInputRef = useRef();
  const [appliedProcesses, setAppliedProcesses] = useState([]);

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
    uploadFileInputRef.current.click();
  }

  return (
    <>
      {showMessage.message && (
        <Message
          message={showMessage.message}
          type={showMessage.type}
          onClose={() =>
            setShowMessage({
              type: "",
              message: "",
            })
          }
        />
      )}
      <input
        ref={uploadFileInputRef}
        name="file"
        type="file"
        onChange={handleFileSelection}
        hidden
      />
      <div className="md:hidden">
        <SmallScreenToolAlert />
      </div>
      <div className="hidden md:block h-screen min-h-96">
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
        <MainContent
          loading={loading}
          handleFileUpload={handleFileUpload}
          traces={traces}
          backupTraces={backupTraces}
          appliedProcesses={appliedProcesses}
          handleRemoveProcesses={handleRemoveProcesses}
        />
      </div>
    </>
  );
}
