import { useRef, useState } from "react";
import LineGraph from "../ui/LineGraph";
import Button from "../ui/Button";
import Message from "../ui/Message";
import Spinner from "../ui/Spinner";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Symbol from "../ui/Symbol";
import SmallScreenToolAlert from "../utils/SmallScreenToolALert";
import { traceHeaderParams } from "../../assets/data/static";
import { fastapiEndpoints } from "../../assets/data/static";
import ToolTip from "../ui/ToolTip";
import { downloadURI } from "../../assets/utils/utility-functions";
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
import { FaUpload } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

function TraceInfoMenu({
  setShowMessage,
  setActivatedMenuIndex,
  loading,
  traces,
  setTraces,
  setLoading,
  traceId,
}) {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(null);
  // create a new state that will temporarely store the trace stats
  const [updateTraces, setUpdateTraces] = useState(traces);
  const [traceDataFileResult, setTraceDataFileResult] = useState(null);
  const uploadDataSamplesRef = useRef();
  const trace = updateTraces.find((tr) => tr.trace_id === traceId);

  async function handleFormInputChange(curr_trace_id, param, value) {
    let newTraces = updateTraces.map((tr, i) => {
      if (tr.trace_id === curr_trace_id) {
        return { ...tr, stats: { ...tr.stats, [param]: value } };
      } else {
        return tr;
      }
    });
    setUpdateTraces(newTraces);
  }

  async function handleUpdateHeader(traceId) {
    const traceObj = updateTraces.find((tr) => tr.trace_id === traceId);

    const { resData: updatedTraceObj, error } = await apiRequest({
      url: fastapiEndpoints["UPDATE-TRACE"],
      method: "post",
      requestData: traceObj,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      successMessage: "Your header has been updated!",
      errorMessage: "Cannot update the header. Please try again later.",
    });

    if (error) {
      return;
    }

    const updatedTraces = traces.map((tr) => {
      if (tr.trace_id === traceId) {
        return updatedTraceObj;
      } else {
        return tr;
      }
    });
    setTraces(updatedTraces);
    setUpdateTraces(updatedTraces);
  }

  async function handleAddDataSamples(e) {
    setTraceDataFileResult(null);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const { resData: dataSamples, error } = await apiRequest({
      url: fastapiEndpoints["UPLOAD-TRACE-DATA-SAMPLES"],
      method: "post",
      requestData: formData,
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      successMessage: "Your data samples has been uploaded succesfully!",
      errorMessage: "Cannot upload the file. Please try again later.",
    });

    if (error) {
      return;
    }

    let newTraces = updateTraces.map((tr, i) => {
      if (tr.trace_id === traceId) {
        return { ...tr, ydata: dataSamples };
      } else {
        return tr;
      }
    });
    setUpdateTraces(newTraces);
    setTraceDataFileResult(`Sample data uploaded succesfully!`);
  }

  function handleFileUpload(e) {
    e.preventDefault();
    uploadDataSamplesRef.current.click();
  }

  return (
    <div className="pt-8 pb-4 px-4 absolute top-0 end-4 bg-base-200 border border-neutral-500/20 shadow rounded z-50 w-64">
      <Button
        style="ghost"
        size="small"
        onClick={() => setActivatedMenuIndex(null)}
        type="button"
        className="absolute top-1 start-2"
      >
        <Symbol className="size-4" IconComponent={IoMdClose} />
      </Button>
      <div className="text-xs space-y-2 py-2">
        <h3 className="flex items-center justify-between">
          <span className="font-semibold">TRACE HEADER</span>
          <ToolTip
            toolTipPosition="bottom-left"
            toolTipText={`Use the trace header section to view header details of the selected trace. Click the pencil icon next to any editable field to make changes (fields marked with an asterisk * are read-only). Don’t forget to click the 'Update trace' button to save your changes.`}
          >
            <Symbol
              className="size-3"
              IconComponent={BsFillQuestionCircleFill}
            />
          </ToolTip>
        </h3>
        <hr className="border-neutral-500/50 w-full" />
        <div className="max-h-30 bg-base-100 px-2 overflow-y-scroll">
          {traceHeaderParams.map((obj) => (
            <div key={obj.id} className="flex items-center gap-2 my-1">
              <Label htmlFor={obj.id} className="font-semibold">
                {obj.label}:
              </Label>
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
                  size="extra-small"
                />
              ) : (
                <p className="font-light">{trace.stats[obj.id]}</p>
              )}
              {!obj.readOnly &&
                (currentUpdateIndex === obj.id ? (
                  <div>
                    <Button
                      style="ghost"
                      size="extra-small"
                      type="button"
                      className="ms-auto"
                      onClick={() => setCurrentUpdateIndex(null)}
                    >
                      <Symbol IconComponent={LiaUndoAltSolid} />
                    </Button>
                  </div>
                ) : (
                  <div className="ms-auto">
                    <Button
                      style="ghost"
                      size="extra-small"
                      type="button"
                      toolTipText={`modify '${obj.label}'`}
                      toolTipPosition="left-center"
                      onClick={() => setCurrentUpdateIndex(obj.id)}
                    >
                      <Symbol IconComponent={MdEdit} />
                    </Button>
                  </div>
                ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-center">
          Elements with &quot;*&quot; are readonly
        </p>
      </div>
      <div className="text-xs space-y-2">
        <h3 className="flex items-center justify-between">
          <span className="font-semibold">TRACE DATA SAMPLES</span>
          <ToolTip
            toolTipPosition="bottom-left"
            toolTipText={`Use the 'Upload File' option to upload a .csv or .xlsx file with new sample data and replace the current trace data. Don’t forget to click the 'Update trace' button to save your changes.`}
          >
            <Symbol
              className="size-3"
              IconComponent={BsFillQuestionCircleFill}
            />
          </ToolTip>
        </h3>
        <hr className="border-neutral-500/50 w-full" />
        <input
          ref={uploadDataSamplesRef}
          name="file"
          type="file"
          onChange={handleAddDataSamples}
          hidden
        />
        <div className="space-y-2 my-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span>Update trace data</span>
              <ToolTip
                toolTipPosition="bottom-left"
                toolTipText={`Upload a .csv or .xlsx file containing trace data samples (float values) in a single column. If the file has multiple columns, only the first one will be used. Any headers or non-numeric text will be treated as NaN and replaced with zeros.`}
              >
                <Symbol
                  className="size-3"
                  IconComponent={BsFillQuestionCircleFill}
                />
              </ToolTip>
            </div>
            <Button
              type="button"
              style="primary"
              loading={loading}
              outline={true}
              size="extra-small"
              onClick={handleFileUpload}
              className="self-center"
            >
              <Symbol IconComponent={FaUpload} />
              Upload file
            </Button>
          </div>
        </div>
        {traceDataFileResult && (
          <p className="flex justify-center items-center gap-2 bg-base-100 p-4">
            {traceDataFileResult}
            <Symbol
              IconComponent={FaCheckCircle}
              className="text-primary size-5"
            />
          </p>
        )}
      </div>
      <div className="mt-4">
        <Button
          type="button"
          style="primary"
          loading={loading}
          size="extra-small"
          className="w-full block"
          onClick={() => handleUpdateHeader(traceId)}
        >
          Update trace
        </Button>
      </div>
    </div>
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
        loading={loading}
        disabled={traces.length === 0}
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

function TraceGraphOptionMenu({
  trace,
  handleOptionsMenuButtonClick,
  handleDeleteTrace,
  handleDownloadFile,
  currentMenuIndex,
}) {
  return (
    <div className="flex flex-row justify-end items-center gap-2">
      <Button
        style="ghost"
        size="small"
        onClick={() => handleOptionsMenuButtonClick(currentMenuIndex)}
        toolTipText={`Open the trace menu. Feel free to update the trace header and data samples.`}
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
            trace.stats,
            trace.stats.record_name + "_header"
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
              record_name: trace.stats.record_name,
              component: trace.stats.component,
              data: trace.ydata,
            },
            trace.stats.record_name + "_data"
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
        onClick={() => handleDeleteTrace(trace.trace_id)}
        toolTipText={`Remove the current trace`}
        toolTipPosition="bottom-left"
        className="text-error"
      >
        <Symbol IconComponent={MdDeleteOutline} />
      </Button>
    </div>
  );
}

function Graphs({
  setShowMessage,
  setLoading,
  loading,
  traces,
  setTraces,
  handleDownloadFile,
}) {
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
  }

  return (
    <div className="flex-grow overflow-scroll">
      {traces.map((tr, ind) => (
        <div key={tr.trace_id} className="relative">
          <TraceGraphOptionMenu
            trace={tr}
            handleOptionsMenuButtonClick={handleOptionsMenuButtonClick}
            handleDeleteTrace={handleDeleteTrace}
            handleDownloadFile={handleDownloadFile}
            currentMenuIndex={ind}
          />
          {activatedMenuIndex === ind && (
            <TraceInfoMenu
              setShowMessage={setShowMessage}
              setActivatedMenuIndex={setActivatedMenuIndex}
              loading={loading}
              traces={traces}
              setTraces={setTraces}
              setLoading={setLoading}
              traceId={tr.trace_id}
            />
          )}
          <LineGraph
            xData={[tr["xdata"]]}
            yData={[tr["ydata"]]}
            height={150}
            legendTitle={[`Component: ${tr["stats"]["component"]}`]}
            showGraphTitle={ind === 0}
            zoomOnScroll={false}
            graphTitle={""}
          />
        </div>
      ))}
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

function TracesFunctions({ traces, setTraces, setShowMessage, setLoading }) {
  const [showQuickInfo, setShowQuickInfo] = useState(false);

  async function handleAddTrace() {
    const { resData: traceData, error } = await apiRequest({
      url: fastapiEndpoints["GET-DEFAULT-TRACE"],
      method: "get",
      setShowMessage: setShowMessage,
      setLoading: setLoading,
      successMessage:
        "A default trace has been added. Feel free to update its contents.",
      errorMessage: "Cannot add the trace. Please try again later.",
    });

    if (error) {
      return;
    }
    setTraces([traceData, ...traces]);
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <Button style="primary" size="extra-small" onClick={handleAddTrace}>
          Add trace +
        </Button>
        <Button
          style="primary"
          outline={true}
          size="extra-small"
          onClick={() => setShowQuickInfo((prev) => !prev)}
        >
          {showQuickInfo ? "Hide" : "View"} traces info
        </Button>
      </div>
      {showQuickInfo && (
        <div className="text-sm text-base-content/50 space-y-2 my-2 flex-grow-0 flex-shrink-0">
          <div>
            <h2 className="font-semibold">Stream summary:</h2>
            <ul>
              <li>Total traces: {traces.length}</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Traces:</h2>
            <ul className="overflow-auto w-full whitespace-nowrap">
              {traces.map((tr, ind) => (
                <li key={ind} className="px-2">
                  {[
                    `${ind + 1}.${" "}`,
                    `component: ${tr.stats.component}`,
                    `station: ${tr.stats.station}`,
                    `start date: ${tr.stats.start_date}`,
                    `npts: ${tr.stats.npts}`,
                    `sampling rate: ${tr.stats.sampling_rate}`,
                  ].join(" | ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function MainContent({
  loading,
  setLoading,
  setShowMessage,
  handleFileUpload,
  traces,
  handleDownloadFile,
  setTraces,
}) {
  return (
    <div className="border border-neutral-500/20 h-2/3 p-4 flex flex-col relative">
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
          <TracesFunctions
            traces={traces}
            setTraces={setTraces}
            setShowMessage={setShowMessage}
            setLoading={setLoading}
          />
          <Graphs
            setShowMessage={setShowMessage}
            setLoading={setLoading}
            loading={loading}
            traces={traces}
            setTraces={setTraces}
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
    <div className="space-y-8">
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
          handleFileUpload={handleFileUpload}
          loading={loading}
          handleDownloadFile={handleDownloadFile}
        />
        <MainContent
          loading={loading}
          setLoading={setLoading}
          setShowMessage={setShowMessage}
          handleFileUpload={handleFileUpload}
          traces={traces}
          handleDownloadFile={handleDownloadFile}
          setTraces={setTraces}
        />
      </div>
    </div>
  );
}
