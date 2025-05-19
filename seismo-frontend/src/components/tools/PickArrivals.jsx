import { useRef, useState } from "react";
import Spinner from "../ui/Spinner";
import Message from "../ui/Message";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Select from "../ui/Select";
import LineGraph from "../ui/LineGraph";
import { fastapiEndpoints, arrivalsStyles } from "../../assets/data/static";
import fetchRequest from "../../assets/utils/fetchRequest";
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
    <div className="flex flex-row items-center gap-4">
      <div className="flex flex-row items-center">
        <Label htmlFor="p-wave-radio" label="P" className="text-lg" />
        <Input
          type="radio"
          id="p-wave-radio"
          name="ps-wave-radio"
          value="P"
          checked={selectedWave === "P"}
          onChange={() => setSelectedWave("P")}
          disabled={traces.length === 0 || formattedArrivals["P"] !== null}
          className="radio-sm"
        />
      </div>
      <div className="flex flex-row items-center">
        <Label htmlFor="s-wave-radio" label="S" className="text-lg" />
        <Input
          type="radio"
          id="s-wave-radio"
          name="ps-wave-radio"
          value="S"
          checked={selectedWave === "S"}
          onChange={() => setSelectedWave("S")}
          disabled={traces.length === 0 || formattedArrivals["S"] !== null}
          className="radio-sm"
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

function FiltersDropdown({
  traces,
  selectedFilter,
  handleDropdownFilterChange,
}) {
  return (
    <Select
      id="filters-dropdown"
      name="filters-dropdown"
      value={selectedFilter}
      onChange={handleDropdownFilterChange}
      disabled={traces.length === 0}
      optionsList={filterOptions}
      className="select-sm"
    />
  );
}

function FiltersInputs({
  traces,
  manualFilter,
  setManualFilter,
  handleEnterKey,
}) {
  return (
    <div className="flex justify-end align-center gap-3 mt-4">
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
        className="input-sm w-40"
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
        className="input-sm w-40"
      />
    </div>
  );
}

function MainMenu({
  traces,
  setTraces,
  handleFilterChange,
  loading,
  setLoading,
  setError,
  setSuccess,
  handleFileUpload,
  arrivals,
  setArrivals,
  selectedWave,
  setSelectedWave,
  backupTraces,
}) {
  const [selectedFilter, setSelectedFilter] = useState("initial");
  let formattedArrivals = { P: null, S: null };

  arrivals.forEach((arr) => (formattedArrivals[arr.wave] = arr.arrival));

  let duration =
    traces.length !== 0
      ? traces[0].ydata.length / traces[0].stats.sampling_rate
      : 0;

  async function handleSaveArrivals() {
    let PArr = formattedArrivals["P"];
    let SArr = formattedArrivals["S"];

    let queryParams = (PArr && `Parr=${PArr}&`) + (SArr && `Sarr=${SArr}`);

    const blobData = await fetchRequest({
      endpoint: fastapiEndpoints["SAVE-ARRIVALS"] + "?" + queryParams,
      setError: setError,
      setSuccess: setSuccess,
      setLoading: setLoading,
      method: "GET",
      returnType: "blob",
    });

    const downloadUrl = window.URL.createObjectURL(blobData);
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
    <>
      <div className="flex flex-row items-center justify-center">
        <div className="grow-0 border-r border-neutral-500/20">
          <Button
            onClick={handleFileUpload}
            style="ghost"
            size="small"
            tooltiptext="Upload a seismic file"
          >
            <HiOutlineUpload />
            Upload file
          </Button>
          <Button
            style="ghost"
            size="small"
            onClick={handleSaveArrivals}
            disabled={
              traces.length === 0 ||
              (formattedArrivals["P"] === null &&
                formattedArrivals["S"] === null)
            }
            tooltiptext="Download the selected P & S wave arrivals in a txt file"
          >
            <MdOutlineFileDownload />
            Download arrivals
          </Button>
        </div>
        <div className="grow flex flex-row justify-around items-center">
          <PSElements
            traces={traces}
            selectedWave={selectedWave}
            setSelectedWave={setSelectedWave}
            handleDeleteWave={handleDeleteWave}
            formattedArrivals={formattedArrivals}
          />
          <FiltersDropdown
            traces={traces}
            selectedFilter={selectedFilter}
            handleDropdownFilterChange={handleDropdownFilterChange}
          />
        </div>
      </div>
    </>
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

export default function ArrivalsPickingPage() {
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [traces, setTraces] = useState([]);
  const [backupTraces, setBackupTraces] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const inputRef = useRef();
  const [selectedWave, setSelectedWave] = useState("P");
  const [manualFilter, setManualFilter] = useState({ freqMin: 1, freqMax: 3 });

  // useEffect(() => {
  //     setTraces(backupTraces);
  //     setArrivals([]);
  //     setSelectedWave("P");
  //     setSelectedFilter("initial");
  //     setManualFilter({"freqMin": "", "freqMax": ""});
  // }, [backupTraces])

  async function handleFileSelection(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const traces = await fetchRequest({
      endpoint: fastapiEndpoints["UPLOAD-SEISMIC-FILE"],
      setError: setError,
      setSuccess: setSuccess,
      setLoading: setLoading,
      method: "POST",
      data: formData,
      successMessage: "The file has been succesfully uploaded!",
    });

    setTraces(traces);
    setBackupTraces(traces);
  }

  function handleFileUpload(e) {
    e.preventDefault();
    inputRef.current.click();
  }

  async function handleFilterChange(freqMin = null, freqMax = null) {
    const requestBody = {
      data: backupTraces.map((tr) => ({
        trace_id: tr.trace_id,
        values: tr.ydata,
      })),
      options: {
        freq_min: freqMin,
        freq_max: freqMax,
        sampling_rate: backupTraces[0].stats.sampling_rate,
      },
    };

    const jsonData = await fetchRequest({
      endpoint: fastapiEndpoints["FILTER-WAVEFORM"],
      setError: setError,
      setSuccess: setSuccess,
      setLoading: setLoading,
      method: "POST",
      data: requestBody,
    });

    setTraces(
      backupTraces.map((tr) => {
        const updatedTrace = jsonData.find((el) => el.trace_id === tr.trace_id);
        return { ...tr, ydata: updatedTrace.values };
      })
    );
  }

  function handleEnterKey(e) {
    if (e.key === "Enter") {
      handleFilterChange(
        manualFilter["freqMin"] ? manualFilter["freqMin"] : null,
        manualFilter["freqMax"] ? manualFilter["freqMax"] : null
      );
    }
  }

  return (
    <>
      {error.length !== 0 && (
        <Message
          setError={setError}
          setSuccess={setSuccess}
          type="error"
          text={error}
        />
      )}
      {success && (
        <Message
          setError={setError}
          setSuccess={setSuccess}
          type="success"
          text={success}
        />
      )}
      <input
        ref={inputRef}
        name="file"
        type="file"
        onChange={handleFileSelection}
        hidden
      />
      <div className="h-screen min-h-96">
        <div className="border border-neutral-500/20 rounded-t-lg bg-base-100 p-3">
          <MainMenu
            traces={traces}
            setTraces={setTraces}
            handleFilterChange={handleFilterChange}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setSuccess={setSuccess}
            handleFileUpload={handleFileUpload}
            arrivals={arrivals}
            setArrivals={setArrivals}
            selectedWave={selectedWave}
            setSelectedWave={setSelectedWave}
            backupTraces={backupTraces}
          />
        </div>
        <div className="border border-neutral-500/20 h-2/3 overflow-y-scroll p-4 relative">
          <>
            <div className="absolute start-1/2 ">{loading && <Spinner />}</div>
            {traces.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="font-semibold text-3xl">
                  Upload a seismic file
                </h1>
                <p className="text-lg">
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
          </>
        </div>
        {traces.length !== 0 && (
          <div className="flex justify-end items-center">
            <FiltersInputs
              traces={traces}
              manualFilter={manualFilter}
              setManualFilter={setManualFilter}
              handleEnterKey={handleEnterKey}
            />
          </div>
        )}
      </div>
    </>
  );
}
