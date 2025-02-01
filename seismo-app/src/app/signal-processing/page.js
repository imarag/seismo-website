'use client';

import { useEffect, useState } from "react";

import LineGraph from "@/components/LineGraph"
import { NumberInputElement, LabelElement, SelectElement, SliderElement } from "@/components/UIElements";
import Spinner from "@/components/Spinner";
import UploadFileButton from "@/components/UploadFileButton";
import StartingUploadFile from "@/components/StartingUploadFile";
import Message from "@/components/Message";
import Collapse from "@/components/Collapse"
import Section from "@/components/Section";

import { fastapiEndpoints, fourierWindowStyles } from "@/utils/static";
import { getRandomNumber } from "@/utils/functions"
import fetchRequest from "@/utils/functions/fetchRequest";


import { IoMdClose } from "react-icons/io";
import { IoCut, IoFilter } from "react-icons/io5";
import { BsSoundwave } from "react-icons/bs";
import { MdAlignVerticalCenter, MdArrowDropDown } from "react-icons/md";

export default function SignalProcessingPage() {

    const [traces, setTraces] = useState([]);
    const [backupTraces, setBackupTraces] = useState([]);
    const [fourierData, setFourierData] = useState([])
    const [HVSRData, setHVSRData] = useState([])
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [appliedProcesses, setAppliedProcesses] = useState([])
    const [verticalComponent, setVerticalComponent] = useState("")
    const [signalProcessingOptions, setSignalProcessingOptions] = useState({
        "detrend-type": "simple",
        "taper-type": "parzen",
        "taper-side": "both",
        "taper-length": 20,
        "trim-left-side": 0,
        "trim-right-side": 0,
        "filter-min": 0,
        "filter-max": 0
    })
    const [taperTypeOptions, setTaperTypeOptions] = useState([])
    const [taperSideOptions, setTaperSideOptions] = useState([])
    const [detrendTypeOptions, setDetrendTypeOptions] = useState([])

    let shapes = [
        {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: signalProcessingOptions["trim-left-side"],
            y0: 0,
            x1: signalProcessingOptions["trim-right-side"],
            y1: 1,
            line: {
                color: fourierWindowStyles.signal.edgeColor,
                width: fourierWindowStyles.signal.width
            },
            fillcolor: fourierWindowStyles.signal.fillColor
        }
    ]


    let duration = traces.length !== 0 ? traces[0].ydata.length / traces[0].stats.sampling_rate : 0

    

    return (
        <Section>
            
            <div>
                {
                    traces.map((tr, ind) => (
                        <div key={tr.trace_id}>
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
                            
               
        </Section>
    )
}
