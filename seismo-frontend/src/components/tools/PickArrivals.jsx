import { useRef, useState } from "react";
import Spinner from "../ui/Spinner";
import Message from "../ui/Message";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Select from "../ui/Select";
import LineGraph from "../ui/LineGraph";
import SmallScreenToolAlert from "../utils/SmallScreenToolALert";
import { fastapiEndpoints, arrivalsStyles } from "../../assets/data/static";
import { apiRequest } from "../../assets/utils/apiRequest";
import { downloadURI } from "../../assets/utils/utility-functions";
import { filterOptions } from "../../assets/data/static";
import { MdOutlineFileDownload } from "react-icons/md";
import { HiOutlineUpload } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

function PSElements({
  traces,
  selectedWave,
  setSelectedWave,
  handleDeleteWave,
  formattedArrivals,
}) {
  return (
    <div className="flex flex-row items-center gap-4 text-sm">
      <div className="flex flex-row items-center gap-2">
        <Label htmlFor="p-wave-radio">P</Label>
        <Input
          type="radio"
          id="p-wave-radio"
          name="ps-wave-radio"
          value="P"
          checked={selectedWave === "P"}
          onChange={() => setSelectedWave("P")}
          disabled={
            traces.length === 0 || formattedArrivals["P"] !== null
              ? true
              : false
          }
          size="extra-small"
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label htmlFor="s-wave-radio">S</Label>
        <Input
          type="radio"
          id="s-wave-radio"
          name="ps-wave-radio"
          value="S"
          checked={selectedWave === "S"}
          onChange={() => setSelectedWave("S")}
          disabled={
            traces.length === 0 || formattedArrivals["S"] !== null
              ? true
              : false
          }
          size="extra-small"
        />
      </div>
      {formattedArrivals["P"] !== null && (
        <Button
          onClick={(e) => handleDeleteWave("P")}
          style="error"
          size="extra-small"
          outline={true}
          tooltiptext="Delete the selected P wave arrival"
        >
          P
          <IoMdClose />
        </Button>
      )}
      {formattedArrivals["S"] !== null && (
        <Button
          onClick={(e) => handleDeleteWave("S")}
          style="error"
          size="extra-small"
          outline={true}
          tooltiptext="Delete the selected S wave arrival"
        >
          S
          <IoMdClose />
        </Button>
      )}
    </div>
  );
}

function ManualFilters({ traces, handleFilterChange }) {
  const [manualFilter, setManualFilter] = useState({ freqMin: 1, freqMax: 3 });

  function handleEnterKey(e) {
    if (e.key === "Enter") {
      handleFilterChange(
        manualFilter["freqMin"] ? manualFilter["freqMin"] : null,
        manualFilter["freqMax"] ? manualFilter["freqMax"] : null
      );
    }
  }

  return (
    <div className="flex justify-end align-center gap-2 py-4">
      <Input
        type="number"
        id="freq_min"
        name="freq_min"
        value={manualFilter["freqMin"]}
        onKeyDown={handleEnterKey}
        onChange={(e) =>
          setManualFilter({ ...manualFilter, freqMin: e.target.value })
        }
        placeholder="e.g. 0.1"
        disabled={traces.length === 0}
        size="small"
        className="w-28"
      />
      <Input
        type="number"
        id="freq_max"
        name="freq_max"
        value={manualFilter["freqMax"]}
        onKeyDown={handleEnterKey}
        onChange={(e) =>
          setManualFilter({ ...manualFilter, freqMax: e.target.value })
        }
        placeholder="e.g. 3"
        disabled={traces.length === 0}
        size="small"
        className="w-28"
      />
    </div>
  );
}

function MainMenu({
  traces,
  setTraces,
  handleFilterChange,
  setLoading,
  handleFileUpload,
  arrivals,
  setArrivals,
  selectedWave,
  setSelectedWave,
  backupTraces,
  setShowMessage,
  selectedFilter,
  setSelectedFilter,
  loading,
}) {
  let formattedArrivals = { P: null, S: null };
  arrivals.forEach((arr) => (formattedArrivals[arr.wave] = arr.arrival));

  async function handleSaveArrivals() {
    let PArr = formattedArrivals["P"];
    let SArr = formattedArrivals["S"];
    let queryParams = (PArr ? `Parr=${PArr}&` : "") + (SArr && `Sarr=${SArr}`);
    const { resData, error } = await apiRequest({
      url: fastapiEndpoints["SAVE-ARRIVALS"] + "?" + queryParams,
      method: "get",
      responseType: "blob",
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      successMessage:
        "Arrivals have been downloaded. Please check your 'Downloads' folder.",
      errorMessage: "Cannot download the arrivals. Please try again later.",
    });

    if (error) {
      return;
    }

    const downloadUrl = window.URL.createObjectURL(resData);
    downloadURI(downloadUrl, "arrivals.txt");
  }

  function handleDropdownFilterChange(e) {
    setSelectedFilter(e.target.value);
    const dropdownFilterValue = e.target.value;

    if (dropdownFilterValue === "initial") {
      setTraces(backupTraces);
    } else {
      const parts = dropdownFilterValue.split("-");
      handleFilterChange(parts[0], parts[1]);
    }
  }

  function handleDeleteWave(wave) {
    setSelectedWave(wave);
    setArrivals(arrivals.filter((arr) => arr.wave !== wave));
  }

  return (
    <div className="flex flex-row items-center justify-center border border-neutral-500/20 rounded-t-lg bg-base-100 p-3">
      <div className="flex-grow-0 flex-shrink-0 border-r border-neutral-500/20">
        <Button
          onClick={handleFileUpload}
          disabled={loading}
          style="ghost"
          size="extra-small"
          tooltiptext="Upload a seismic file"
        >
          <HiOutlineUpload />
          Upload file
        </Button>
        <Button
          style="ghost"
          size="extra-small"
          onClick={handleSaveArrivals}
          disabled={
            traces.length === 0 ||
            (formattedArrivals["P"] === null && formattedArrivals["S"] === null)
              ? true
              : ""
          }
          tooltiptext="Download the selected P & S wave arrivals in a txt file"
        >
          <MdOutlineFileDownload />
          Download arrivals
        </Button>
      </div>
      <div className="flex-grow flex flex-row justify-around items-center gap-4 px-4">
        <PSElements
          traces={traces}
          selectedWave={selectedWave}
          setSelectedWave={setSelectedWave}
          handleDeleteWave={handleDeleteWave}
          formattedArrivals={formattedArrivals}
        />
        <Select
          id="filters-dropdown"
          name="filters-dropdown"
          value={selectedFilter}
          onChange={handleDropdownFilterChange}
          disabled={traces.length === 0}
          optionslist={filterOptions}
          size="small"
          className="w-28 lg:w-40"
        />
      </div>
    </div>
  );
}

function Graphs({
  traces,
  arrivals,
  selectedWave,
  setArrivals,
  setSelectedWave,
  backupTraces,
}) {
  let annotations = arrivals.map((arr) => ({
    x:
      backupTraces.length !== 0
        ? arr["arrival"] - backupTraces[0]["stats"]["duration"] / 40
        : 0,
    y: 0.8,
    xref: "x",
    yref: "paper",
    text: arr["wave"],
    showarrow: false,
    font: {
      size: arrivalsStyles.label.size,
    },
  }));

  let shapes = arrivals.map((arr) => ({
    type: "line",
    x0: arr["arrival"],
    y0: 0,
    x1: arr["arrival"],
    y1: 1,
    line: {
      color: arrivalsStyles.line.color,
      width: arrivalsStyles.line.width,
      dash: arrivalsStyles.line.style,
    },
    xref: "x", // X-axis is referenced in data coordinates
    yref: "paper", // Y-axis is referenced in paper coordinates (0 to 1 range)
  }));

  function onGraphClick(e) {
    const point = e.points[0];
    for (let arr of arrivals) {
      if (arr["wave"] === selectedWave && arr["arrival"]) {
        return;
      }
    }

    if (point) {
      const x = point.x;
      setSelectedWave(selectedWave === "P" ? "S" : "P");
      setArrivals((oldarrivals) => [
        ...oldarrivals,
        { wave: selectedWave, arrival: x },
      ]);
    }
  }

  return (
    <>
      {traces.map((tr, ind) => (
        <div key={tr.trace_id} className="h-1/3">
          <LineGraph
            xData={[tr["xdata"]]}
            yData={[tr["ydata"]]}
            height="220px"
            legendTitle={[`Component: ${tr["stats"]["component"]}`]}
            showGraphTitle={ind === 0}
            graphTitle={""}
            shapes={shapes}
            annotations={annotations}
            onGraphClick={onGraphClick}
          />
        </div>
      ))}
    </>
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
        tooltiptext="Upload a seismic file"
      >
        <HiOutlineUpload />
        Upload file
      </Button>
    </div>
  );
}

function MainContent({
  loading,
  handleFileUpload,
  traces,
  arrivals,
  selectedWave,
  setSelectedWave,
  setArrivals,
  backupTraces,
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
          <div className="absolute start-1/2 ">{loading && <Spinner />}</div>
          <Graphs
            traces={traces}
            arrivals={arrivals}
            selectedWave={selectedWave}
            setArrivals={setArrivals}
            setSelectedWave={setSelectedWave}
            backupTraces={backupTraces}
          />
        </>
      )}
    </div>
  );
}

export default function ArrivalsPickingPage() {
  const [showMessage, setShowMessage] = useState({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [traces, setTraces] = useState([]);
  const [backupTraces, setBackupTraces] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [selectedWave, setSelectedWave] = useState("P");
  const [selectedFilter, setSelectedFilter] = useState("initial");
  const inputRef = useRef();

  async function handleFileSelection(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const { resData: tracesList, error } = await apiRequest({
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

    setArrivals([]);
    setSelectedWave("P");
    setSelectedFilter("initial");
    setTraces(tracesList);
    setBackupTraces(tracesList);
  }

  function handleFileUpload(e) {
    e.preventDefault();
    inputRef.current.click();
  }

  async function handleFilterChange(freqMin = null, freqMax = null) {
    const requestBody = {
      traces: backupTraces,
      options: {
        freq_min: freqMin,
        freq_max: freqMax,
      },
    };

    const { resData: tracesList, error } = await apiRequest({
      url: fastapiEndpoints["FILTER-WAVEFORM"],
      method: "post",
      requestData: requestBody,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      errorMessage: "Cannot filter the waveforms. Please try again later.",
    });

    if (error) {
      return;
    }

    setTraces(tracesList);
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
        <MainMenu
          traces={traces}
          setTraces={setTraces}
          handleFilterChange={handleFilterChange}
          setLoading={setLoading}
          handleFileUpload={handleFileUpload}
          arrivals={arrivals}
          setArrivals={setArrivals}
          selectedWave={selectedWave}
          setSelectedWave={setSelectedWave}
          backupTraces={backupTraces}
          setShowMessage={setShowMessage}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          loading={loading}
        />
        <MainContent
          loading={loading}
          handleFileUpload={handleFileUpload}
          traces={traces}
          arrivals={arrivals}
          selectedWave={selectedWave}
          setSelectedWave={setSelectedWave}
          setArrivals={setArrivals}
          backupTraces={backupTraces}
        />
        <ManualFilters
          traces={traces}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
}
