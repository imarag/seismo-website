import { useRef, useState } from "react";
import LineGraph from "../ui/LineGraph";
import Button from "../ui/Button";
import Message from "../ui/Message";
import Label from "../ui/Label";
import Input from "../ui/Input";
import {
  addTraceParameters,
  traceHeaderParams,
} from "../../assets/data/static";
import { fastapiEndpoints } from "../../assets/data/static";
import { downloadURI } from "../../assets/utils/utility-functions";
import fetchRequest from "../../assets/utils/fetchRequest";
import { MdEdit } from "react-icons/md";
import { LiaUndoAltSolid } from "react-icons/lia";
import { MdOutlineFileDownload, MdDeleteOutline } from "react-icons/md";
import { PiGearLight } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import { HiOutlineUpload } from "react-icons/hi";
import { BsDatabaseDown } from "react-icons/bs";
import { TbFileDownload } from "react-icons/tb";
import { AiOutlineQuestionCircle } from "react-icons/ai";

function NewTraceMenu({
  setActivatedNewTraceMenu,
  newTraceOptions,
  setNewTraceOptions,
  handleFileSelection2,
}) {
  const uploadDataInputRef = useRef();
  const fileOptionsTooltip = `Use these parameters to manage the upload process. 
    The 'skip rows' option allows you to skip a specified number of rows at the beginning of the file (e.g., headers), 
    while the 'select column' option lets you choose a specific column to upload when the file contains multiple columns. 
    If no value is specified for the 'select column', the default is 1.`;

  const seismicHeaderTooltip = `Use these parameters to specify details about the seismic trace 
    header. Include the station code or name, component code, recording start and end time, and the 
    sampling rate in Hz.`;

  function handleDataUpload(e) {
    e.preventDefault();
    uploadDataInputRef.current.click();
  }

  const fileParams = addTraceParameters.filter(
    (obj) => obj.category === "file parameters"
  );
  const seismicParams = addTraceParameters.filter(
    (obj) => obj.category === "seismic parameters"
  );

  return (
    <div className="flex flex-col py-6 px-4 items-stretch gap-1 absolute start-0 bg-base-200 border border-neutral-500/20 shadow rounded z-50 pt-10 w-72">
      <div className="mb-2 z-50">
        <div className="flex items-center justify-between">
          <h2 className="text-start text-sm font-semibold mb-1">
            File parameters
          </h2>
          <span className="tooltip tooltip-right" data-tip={fileOptionsTooltip}>
            <AiOutlineQuestionCircle />
          </span>
        </div>
        <hr className="border-neutral-500/50 my-2 w-full" />
      </div>
      <div className="absolute top-1 end-2">
        <Button
          style="ghost"
          size="small"
          onClick={() => setActivatedNewTraceMenu(false)}
          tooltiptext={`Close the menu.`}
        >
          <IoMdClose />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 items-center">
        {fileParams.map((obj) => (
          <div key={obj.id}>
            <Label htmlFor={obj.id} label={obj.label} />
            <Input
              className={"input-xs w-full"}
              value={newTraceOptions[obj.id]}
              onChange={(e) =>
                setNewTraceOptions({
                  ...newTraceOptions,
                  [obj.id]: e.target.value,
                })
              }
              size="xs"
              {...obj}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 mb-2 z-50">
        <div className="flex items-center justify-between">
          <h2 className="text-start text-sm font-semibold mb-1 ">
            Trace header options
          </h2>
          <span
            className="tooltip tooltip-right"
            data-tip={seismicHeaderTooltip}
          >
            <AiOutlineQuestionCircle />
          </span>
        </div>
        <hr className="border-neutral-500/50 my-2 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-2 items-center">
        {seismicParams.map((obj) => (
          <div key={obj.id}>
            <Label htmlFor={obj.id} label={obj.label} />
            <Input
              className={"input-xs w-full"}
              value={newTraceOptions[obj.id]}
              onChange={(e) =>
                setNewTraceOptions({
                  ...newTraceOptions,
                  [obj.id]: e.target.value,
                })
              }
              size="xs"
              {...obj}
            />
          </div>
        ))}
      </div>
      <hr className="border-neutral-500/50 my-2 w-full" />
      <div className="flex flex-row items-center justify-center gap-2 mt-4">
        <input
          ref={uploadDataInputRef}
          onChange={(e) => handleFileSelection2(e, "ADD-TRACE")}
          name="file"
          id="file"
          type="file"
          hidden
        />
        <Button
          size="extra-small"
          outline={true}
          style="neutral"
          tooltiptext={`Upload trace data`}
          onClick={handleDataUpload}
        >
          <HiOutlineUpload />
          Upload data
        </Button>
      </div>
      <p className="text-xs text-center">
        supported file types: xlsx, csv, txt
      </p>
    </div>
  );
}

function TraceInfoMenu({
  setActivatedMenuIndex,
  traces,
  backupTraces,
  setTraces,
  setBackupTraces,
  setError,
  setSuccess,
  setLoading,
  traceId,
}) {
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
    <form onSubmit={(e) => handleUpdateHeader(e)}>
      <div className="flex flex-col p-4 items-stretch gap-1 absolute top-0 end-0 bg-base-200 border border-neutral-500/20 shadow rounded z-50">
        <div className="absolute top-1 end-2">
          <Button
            style="ghost"
            size="small"
            onClick={() => setActivatedMenuIndex(null)}
            tooltiptext={`Close the menu.`}
            type="button"
          >
            <IoMdClose />
          </Button>
        </div>
        <div className="flex flex-col items-stretch">
          {traceHeaderParams.map((obj) => (
            <>
              <div key={obj.id} className="my-1">
                <Label
                  htmlFor={obj.id}
                  label={obj.label}
                  className=" font-semibold"
                />
                <div className="grid grid-cols-2 items-center">
                  {currentUpdateIndex === obj.id ? (
                    <Input
                      value={trace.stats[obj.id]}
                      onChange={(e) =>
                        handleFormInputChange(
                          trace.trace_id,
                          obj.id,
                          e.target.value
                        )
                      }
                      size="xs"
                      className="w-40"
                      {...obj}
                    />
                  ) : (
                    <p className="text-sm w-40  font-light">
                      {trace.stats[obj.id]}
                    </p>
                  )}
                  {!obj.readOnly &&
                    (currentUpdateIndex === obj.id ? (
                      <Button
                        style="ghost"
                        size="extra-small"
                        onClick={() => setCurrentUpdateIndex(null)}
                      >
                        <LiaUndoAltSolid />
                      </Button>
                    ) : (
                      <Button
                        style="ghost"
                        size="extra-small"
                        onClick={() => setCurrentUpdateIndex(obj.id)}
                        tooltiptext={`Update ${obj.label}`}
                      >
                        <MdEdit />
                      </Button>
                    ))}
                </div>
              </div>
              <hr className="border-neutral-500/50 my-2 w-full" />
            </>
          ))}
        </div>
        <p className="text-sm text-center my-1">
          Elements with &quot;*&quot; are readonly
        </p>
      </div>
    </form>
  );
}

function MainMenu({ traces, handleFileUpload, handleDownloadFile }) {
  return (
    <>
      <Button
        onClick={handleFileUpload}
        style="ghost"
        size="small"
        tooltiptext={`Upload a seismic file`}
      >
        <HiOutlineUpload />
        Upload file
      </Button>
      <Button
        style="ghost"
        size="small"
        onClick={() =>
          handleDownloadFile(
            "mseed",
            traces,
            traces[0].stats.record_name + "_download"
          )
        }
        disabled={traces ? traces.length === 0 : false}
        tooltiptext={`Download the updated traces to MiniSEED file format`}
      >
        Download to MSEED
        <MdOutlineFileDownload />
      </Button>
    </>
  );
}

function Graphs({
  traces,
  backupTraces,
  setTraces,
  setBackupTraces,
  setError,
  setSuccess,
  setLoading,
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
              tooltiptext={`Open the trace header menu. Feel free to update the fields.`}
            >
              <PiGearLight />
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
              tooltiptext={`Download the header information of updated traces in a json format`}
            >
              <TbFileDownload />
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
              tooltiptext={`Download the data values of the traces in a json file format`}
            >
              <BsDatabaseDown />
            </Button>
            <Button
              style="ghost"
              size="small"
              onClick={() => handleDeleteTrace(tr.trace_id)}
              tooltiptext={`Remove trace.`}
              className="text-error"
            >
              <MdDeleteOutline />
            </Button>
          </div>
          {activatedMenuIndex === ind && (
            <TraceInfoMenu
              setActivatedMenuIndex={setActivatedMenuIndex}
              traces={traces}
              backupTraces={backupTraces}
              setTraces={setTraces}
              setBackupTraces={setBackupTraces}
              setError={setError}
              setSuccess={setSuccess}
              setLoading={setLoading}
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

export default function EditSeismicFile() {
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [traces, setTraces] = useState([]);
  const [backupTraces, setBackupTraces] = useState([]);
  const [activatedNewTraceMenu, setActivatedNewTraceMenu] = useState(false);
  const [newTraceOptions, setNewTraceOptions] = useState({
    skip_rows: 0,
    column_index: 1,
    station: "",
    component: "",
    start_date: "1970-01-01",
    start_time: "00:00:00",
    sampling_rate: 2,
  });
  const uploadFileInputRef = useRef();

  async function handleFileSelection(e, endpoint) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const traces = await fetchRequest({
      endpoint: fastapiEndpoints[endpoint],
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

  async function handleFileSelection2(e, endpoint) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    Object.keys(newTraceOptions).forEach((key) => {
      formData.append(key, newTraceOptions[key]);
    });

    const traceDict = await fetchRequest({
      endpoint: fastapiEndpoints[endpoint],
      setError: setError,
      setSuccess: setSuccess,
      setLoading: setLoading,
      method: "POST",
      data: formData,
      successMessage: "The file has been succesfully uploaded!",
    });
    setTraces([traceDict, ...traces]);
    setBackupTraces([traceDict, ...traces]);
  }

  function handleFileUpload(e) {
    e.preventDefault();
    uploadFileInputRef.current.click();
  }

  async function handleDownloadFile(fileType, data, downloadName) {
    const blobData = await fetchRequest({
      endpoint: fastapiEndpoints["DOWNLOAD-FILE"],
      setError: setError,
      setSuccess: setSuccess,
      setLoading: setLoading,
      method: "POST",
      data: { data: data, file_type: fileType },
      returnType: "blob",
    });

    const url = window.URL.createObjectURL(blobData);
    downloadURI(url, downloadName + "." + fileType);
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
        ref={uploadFileInputRef}
        name="file"
        type="file"
        onChange={(e) => handleFileSelection(e, "UPLOAD-SEISMIC-FILE")}
        hidden
      />
      <div className="h-screen min-h-96">
        <div className="border border-neutral-500/20 rounded-t-lg bg-base-200 p-3 flex flex-row items-center justify-start">
          <MainMenu
            traces={traces}
            handleFileUpload={handleFileUpload}
            handleDownloadFile={handleDownloadFile}
          />
        </div>
        <div className="border border-neutral-500/20 h-2/3 overflow-y-scroll p-4 relative">
          {traces.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-4xl">Upload a seismic file</h1>
              <p className="text-lg">
                Start by uploading a seismic file to interact with the tool
              </p>
              <Button
                onClick={handleFileUpload}
                tooltiptext={`Upload a seismic file`}
                loading={loading}
              >
                <HiOutlineUpload />
                Upload file
              </Button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Button
                  onClick={() =>
                    setActivatedNewTraceMenu(!activatedNewTraceMenu)
                  }
                  size="extra-small"
                  style="ghost"
                  tooltiptext={`Upload a seismic file`}
                >
                  Add trace +
                </Button>
                {activatedNewTraceMenu && (
                  <NewTraceMenu
                    setActivatedNewTraceMenu={setActivatedNewTraceMenu}
                    newTraceOptions={newTraceOptions}
                    setNewTraceOptions={setNewTraceOptions}
                    handleFileSelection2={handleFileSelection2}
                  />
                )}
              </div>
              <Graphs
                traces={traces}
                backupTraces={backupTraces}
                setTraces={setTraces}
                setBackupTraces={setBackupTraces}
                setError={setError}
                setSuccess={setSuccess}
                setLoading={setLoading}
                handleDownloadFile={handleDownloadFile}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
