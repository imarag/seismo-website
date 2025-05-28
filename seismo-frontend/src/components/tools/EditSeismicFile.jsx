import { useRef, useState } from "react";
import LineGraph from "../ui/LineGraph";
import Button from "../ui/Button";
import Message from "../ui/Message";
import Spinner from "../ui/Spinner";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Symbol from "../ui/Symbol";
import SmallScreenToolAlert from "../utils/SmallScreenToolALert";
import {
  addTraceParameters,
  traceHeaderParams,
} from "../../assets/data/static";
import { fastapiEndpoints } from "../../assets/data/static";
import ToolTip from "../ui/ToolTip";
import {
  downloadURI,
  getUniqueItems,
} from "../../assets/utils/utility-functions";
import { apiRequest } from "../../assets/utils/apiRequest";
import { MdEdit } from "react-icons/md";
import { LiaUndoAltSolid } from "react-icons/lia";
import { MdOutlineFileDownload, MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import { HiOutlineUpload } from "react-icons/hi";
import { BsDatabaseDown } from "react-icons/bs";
import { TbFileDownload } from "react-icons/tb";
import { BsFillQuestionCircleFill } from "react-icons/bs";

function TraceInfoMenu({ setActivatedMenuIndex, traces, setTraces, traceId }) {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(null);
  async function handleFormInputChange(curr_trace_id, param, value) {
    let newTraces = traces.map((tr, i) => {
      if (tr.trace_id === curr_trace_id) {
        return { ...tr, stats: { ...tr.stats, [param]: value } };
      } else {
        return tr;
      }
    });
    setTraces(newTraces);
  }

  const trace = traces.find((tr) => tr.trace_id === traceId);

  return (
    <form>
      <div className="flex flex-col p-4 items-stretch gap-1 absolute top-0 end-4 bg-base-200 border border-neutral-500/20 shadow rounded z-50 max-h-80 overflow-scroll">
        <div className="absolute top-1 end-2">
          <Button
            style="ghost"
            size="small"
            onClick={() => setActivatedMenuIndex(null)}
            type="button"
          >
            <IoMdClose />
          </Button>
        </div>
        <div className="flex flex-col items-stretch text-xs">
          {traceHeaderParams.map((obj) => (
            <div key={obj.id}>
              <Label htmlFor={obj.id} className="font-semibold">
                {obj.label}
              </Label>
              <div className="flex flex-row justify-between items-center">
                {currentUpdateIndex === obj.id ? (
                  <Input
                    {...obj}
                    value={trace.stats[obj.id]}
                    onChange={(e) =>
                      handleFormInputChange(
                        trace.trace_id,
                        obj.id,
                        e.target.value
                      )
                    }
                    size="small"
                    className="w-40"
                    {...obj}
                  />
                ) : (
                  <p className="w-40 font-light">{trace.stats[obj.id]}</p>
                )}
                {!obj.readOnly &&
                  (currentUpdateIndex === obj.id ? (
                    <Button
                      style="ghost"
                      size="extra-small"
                      type="button"
                      onClick={() => setCurrentUpdateIndex(null)}
                    >
                      <Symbol IconComponent={LiaUndoAltSolid} />
                    </Button>
                  ) : (
                    <Button
                      style="ghost"
                      size="extra-small"
                      type="button"
                      onClick={() => setCurrentUpdateIndex(obj.id)}
                    >
                      <Symbol IconComponent={MdEdit} />
                    </Button>
                  ))}
              </div>
              <hr className="border-neutral-500/50 my-2 w-full" />
            </div>
          ))}
        </div>
        <p className="text-xs text-center my-1">
          Elements with &quot;*&quot; are readonly
        </p>
      </div>
    </form>
  );
}

function MainMenu({ traces, handleFileUpload, loading, handleDownloadFile }) {
  return (
    <div className="flex flex-row items-center justify-start gap-4 border border-neutral-500/20 rounded-t-lg bg-base-100 p-3">
      <Button
        onClick={handleFileUpload}
        disabled={loading}
        style="ghost"
        size="extra-small"
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
        size="extra-small"
        disabled={loading || traces.length === 0}
        toolTipText={`Download the updated traces to MiniSEED file format`}
      >
        <MdOutlineFileDownload />
        Download to MSEED
      </Button>
      <ToolTip
        className="ms-auto"
        toolTipPosition="top-left"
        toolTipText={`Import a seismic file to explore its contents. You can edit the header of each trace, download the data, or delete any trace as needed.`}
      >
        <Symbol IconComponent={BsFillQuestionCircleFill} />
      </ToolTip>
    </div>
  );
}

function Graphs({ traces, setTraces, setBackupTraces, handleDownloadFile }) {
  const [activatedMenuIndex, setActivatedMenuIndex] = useState(null);

  function handleOptionsMenuButtonClick(ind) {
    if (activatedMenuIndex === ind) {
      setActivatedMenuIndex(null);
    } else {
      setActivatedMenuIndex(ind);
    }
  }

  function handleDeleteTrace(traceId) {
    const newTraces = traces.filter((tr) => tr.trace_id !== traceId);
    setTraces(newTraces);
    setBackupTraces(newTraces);
  }

  return (
    <>
      {traces.map((tr, ind) => (
        <div key={tr.trace_id} className="h-1/3 relative">
          <div className="flex flex-row justify-end items-center gap-2">
            <Button
              style="ghost"
              size="small"
              onClick={() => handleOptionsMenuButtonClick(ind)}
              toolTipText={`Open the trace header menu. Feel free to update the fields.`}
              toolTipPosition="bottom-left"
            >
              <Symbol IconComponent={PiGearLight} />
            </Button>
            <Button
              style="ghost"
              size="small"
              onClick={() =>
                handleDownloadFile(
                  "json",
                  tr.stats,
                  tr.stats.record_name + "_header"
                )
              }
              toolTipText={`Download the header information of the current trace in a json format`}
              toolTipPosition="bottom-left"
            >
              <Symbol IconComponent={TbFileDownload} />
            </Button>
            <Button
              style="ghost"
              size="small"
              onClick={() =>
                handleDownloadFile(
                  "json",
                  {
                    record: tr.stats.record_name,
                    component: tr.stats.component,
                    data: tr.ydata,
                  },
                  tr.stats.record_name + "_data"
                )
              }
              toolTipText={`Download the data values of the current trace in a json file format`}
              toolTipPosition="bottom-left"
            >
              <Symbol IconComponent={BsDatabaseDown} />
            </Button>
            <Button
              style="ghost"
              size="small"
              onClick={() => handleDeleteTrace(tr.trace_id)}
              toolTipText={`Remove the current trace`}
              toolTipPosition="bottom-left"
              className="text-error"
            >
              <Symbol IconComponent={MdDeleteOutline} />
            </Button>
          </div>
          {activatedMenuIndex === ind && (
            <TraceInfoMenu
              setActivatedMenuIndex={setActivatedMenuIndex}
              traces={traces}
              setTraces={setTraces}
              traceId={tr.trace_id}
            />
          )}
          <LineGraph
            xData={[tr["xdata"]]}
            yData={[tr["ydata"]]}
            height="220px"
            legendTitle={[`Component: ${tr["stats"]["component"]}`]}
            showGraphTitle={ind === 0}
            graphTitle={""}
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
        toolTipText="Upload a seismic file (one of the supported formats in Python Obspy's read function)"
      >
        <Symbol IconComponent={HiOutlineUpload} />
        Upload file
      </Button>
    </div>
  );
}

function QuickTraceInfo({ traces }) {
  const [showQuickInfo, setShowQuickInfo] = useState(true);

  // total traces
  const totalTraces = traces.length;

  // get unique npts values. If all traces have the same npts return this else return "varying"
  const uniqueNpts = getUniqueItems(traces.map((tr) => tr.stats.npts));
  const nptsInfo = uniqueNpts.length === 1 ? uniqueNpts[0] : "varying";

  // get unique sampling rate values. If all traces have the same fs return this else return "varying"
  const uniqueSamplingRates = getUniqueItems(
    traces.map((tr) => tr.stats.sampling_rate)
  );
  const samplingRateInfo =
    uniqueSamplingRates.length === 1 ? uniqueSamplingRates[0] : "varying";

  // get unique start date values. If all traces have the same start date values return this else return "varying"
  const uniqueStartDates = getUniqueItems(
    traces.map((tr) => `${tr.stats.start_date} ${tr.stats.start_time}`)
  );
  const startDateInfo =
    uniqueStartDates.length === 1 ? uniqueStartDates[0] : "varying";

  // get all component values
  const components = traces.map((tr) => tr.stats.component).join(" ");

  return (
    <div>
      <Button
        style="primary"
        outline
        size="extra-small"
        onClick={() => setShowQuickInfo((prev) => !prev)}
      >
        {showQuickInfo ? "Hide" : "Show"} traces info
      </Button>
      {showQuickInfo && (
        <ul className="mt-4 rounded-md bg-base-200 p-4 text-sm text-base-content/60">
          <li>
            Total traces: <span>{totalTraces}</span>
          </li>
          <li>
            Components: <span>{components}</span>
          </li>
          <li>
            Number of points (npts): <span>{nptsInfo}</span>
          </li>
          <li>
            Start date: <span>{startDateInfo}</span>
          </li>
          <li>
            Sampling rate: <span>{samplingRateInfo}</span>
          </li>
        </ul>
      )}
    </div>
  );
}

function MainContent({
  loading,
  handleFileUpload,
  traces,
  handleDownloadFile,
  setTraces,
  setBackupTraces,
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
          <QuickTraceInfo traces={traces} />
          <Graphs
            traces={traces}
            setTraces={setTraces}
            setBackupTraces={setBackupTraces}
            handleDownloadFile={handleDownloadFile}
          />
        </>
      )}
    </div>
  );
}

export default function EditSeismicFile() {
  const [showMessage, setShowMessage] = useState({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [traces, setTraces] = useState([]);
  const [backupTraces, setBackupTraces] = useState([]);
  const uploadFileInputRef = useRef();

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

    setTraces(tracesList);
    setBackupTraces(tracesList);
  }

  function handleFileUpload(e) {
    e.preventDefault();
    uploadFileInputRef.current.click();
  }

  async function handleDownloadFile(fileType, data, downloadName) {
    const { resData: blobData, error } = await apiRequest({
      url: fastapiEndpoints["DOWNLOAD-FILE"],
      method: "post",
      requestData: { data: data, file_type: fileType },
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      errorMessage: "Cannot download the file. Please try again later.",
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
      {showMessage.message && (
        <Message
          message={showMessage.message}
          type={showMessage.type}
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
          handleFileUpload={handleFileUpload}
          loading={loading}
          handleDownloadFile={handleDownloadFile}
        />
        <MainContent
          loading={loading}
          handleFileUpload={handleFileUpload}
          traces={traces}
          handleDownloadFile={handleDownloadFile}
          setTraces={setTraces}
          setBackupTraces={setBackupTraces}
        />
      </div>
    </>
  );
}
