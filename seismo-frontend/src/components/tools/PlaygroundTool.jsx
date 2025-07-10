import { useEffect, useRef, useState } from "react";
import Spinner from "../ui/Spinner";
import Message from "../ui/Message";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ToolTip from "../ui/ToolTip";
import Label from "../ui/Label";
import Symbol from "../ui/Symbol";
import Select from "../ui/Select";
import LineGraph from "../ui/LineGraph";
import SmallScreenToolAlert from "../utils/SmallScreenToolALert";
import { apiRequest } from "../../assets/utils/apiRequest";
import { downloadURI } from "../../assets/utils/utility-functions";
import { fastapiEndpoints, arrivalsStyles } from "../../assets/data/static";
import { filterOptions } from "../../assets/data/static";
import { MdOutlineFileDownload } from "react-icons/md";
import { HiOutlineUpload } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { LuMenu } from "react-icons/lu";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoMdCut } from "react-icons/io";

function AppBar({ showSidebar, setShowSidebar }) {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex-grow-0 flex-shrink-0 border-r border-neutral-500/20">
        <Button
          onClick={(e) => setShowSidebar(!showSidebar)}
          style="ghost"
          size="extra-small"
        >
          <LuMenu />
        </Button>
      </div>
      <div className="flex-grow flex flex-row justify-around items-center gap-4 px-4"></div>
      <ToolTip
        toolTipPosition="top-left"
        toolTipText={`Select the P or S wave radio button to mark the corresponding 
          wave arrival, then click on the graphs to insert the respective arrival. 
          Use the filter dropdown on the right to apply a predefined filter range.`}
      >
        <Symbol IconComponent={BsFillQuestionCircleFill} />
      </ToolTip>
    </div>
  );
}

function Graphs({ traces, backupTraces }) {
  return (
    <div className="flex flex-col items-stretch h-full">
      {traces.map((tr, ind) => (
        <div key={tr.trace_id} className="grow">
          <LineGraph
            xData={[tr["xdata"]]}
            yData={[tr["ydata"]]}
            legendTitle={[`Component: ${tr["stats"]["component"]}`]}
            showGraphTitle={ind === 0}
            graphTitle={""}
          />
        </div>
      ))}
    </div>
  );
}

function MainContent({ traces, backupTraces, loading }) {
  return (
    <>
      <div>{loading && <Spinner />}</div>
      <Graphs traces={traces} backupTraces={backupTraces} />
    </>
  );
}

function SideBarItem({ title, icon, showSidebar, children }) {
  const [showItem, setShowItem] = useState(false);
  return (
    <div>
      <div>
        <div className="flex gap-2 items-center justify-center">
          <span>{icon}</span>
          {showSidebar && <span>{title}</span>}
        </div>
        <Button
          onClick={(e) => setShowItem(!showItem)}
          style="ghost"
          size="extra-small"
        >
          {showItem ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </Button>
      </div>
      {showItem && <div>{children}</div>}
    </div>
  );
}

function SideBar({ showSidebar }) {
  return (
    <div>
      <SideBarItem
        title={"Trim Waveforms"}
        icon={<IoMdCut />}
        showSidebar={showSidebar}
      >
        <Input type="number" id="freq_min" name="freq_min" />
      </SideBarItem>
      <SideBarItem
        title={"Trim Waveforms"}
        icon={<IoMdCut />}
        showSidebar={showSidebar}
      >
        <Input type="number" id="freq_min" name="freq_min" />
      </SideBarItem>
      <SideBarItem
        title={"Trim Waveforms"}
        icon={<IoMdCut />}
        showSidebar={showSidebar}
      >
        <Input type="number" id="freq_min" name="freq_min" />
      </SideBarItem>
    </div>
  );
}

export default function PlaygroundTool() {
  const [showMessage, setShowMessage] = useState({
    message: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const [traces, setTraces] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [backupTraces, setBackupTraces] = useState([]);

  useEffect(() => {
    async function getSampleData() {
      const { resData: tracesList, error } = await apiRequest({
        url: fastapiEndpoints["GET-SAMPLE-TRACES"],
        method: "get",
        setShowMessage: setShowMessage,
        setLoading: setLoading,
        errorMessage:
          "Cannot download the sample waveform data. Please try again later.",
      });
      setTraces(tracesList);
    }
    getSampleData();
  }, []);

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
      <div className="flex flex-col items-stretch h-screen border border-neutral-500/20 rounded-md">
        <div className="flex-grow-0 flex-shrink-0 border-b border-neutral-500/20 p-3">
          <AppBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        </div>
        <div className="flex-grow-1 flex flex-row items-stretch">
          <div
            className={`flex-grow-0 flex-shrink-0 border-r border-neutral-500/20 p-3 ${
              showSidebar && "w-80"
            }`}
          >
            <SideBar showSidebar={showSidebar} />
          </div>
          <div className="flex-grow-1 relative">
            <MainContent
              traces={traces}
              backupTraces={backupTraces}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
