// export const serverUrl = "http://127.0.0.1:8000/api"
// export const serverUrl = "https://seismo-website.onrender.com"

export const socialMediaInfo = [
    { name: "Facebook", url: "https://www.facebook.com/giannis.mar.5/", icon: "facebook" },
    { name: "Instagram", url: "https://www.instagram.com/giannis_mar95/", icon: "instagram" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/ioannis-maragkakis-1ba2851a9/", icon: "linkedin" },
]

export const fastapiEndpoints = {
    "CALCULATE-DISTANCE": `${serverUrl}/core/calculate-distance`,
    "TRIANGULATE-STATIONS": `${serverUrl}/core/triangulate-stations`,
    "UPLOAD-SEISMIC-FILE": `${serverUrl}/core/upload-seismic-file`,
    "DOWNLOAD-TEST-FILE": `${serverUrl}/core/download-test-file`,
    "DOWNLOAD-FILE": `${serverUrl}/core/download-file`,
    "SAVE-ARRIVALS": `${serverUrl}/core/save-arrivals`,
    "ADD-TRACE": `${serverUrl}/handle-seismic-traces/add-trace`,
    "UPDATE-TRACE-HEADER": `${serverUrl}/handle-seismic-traces/update-trace-header`,
    "TRIM-WAVEFORM": `${serverUrl}/signal-processing/trim`,
    "TAPER-WAVEFORM": `${serverUrl}/signal-processing/taper`,
    "DETREND-WAVEFORM": `${serverUrl}/signal-processing/detrend`,
    "FILTER-WAVEFORM": `${serverUrl}/signal-processing/filter`,
    "COMPUTE-FOURIER": `${serverUrl}/signal-processing/compute-fourier`,
    "COMPUTE-HVSR": `${serverUrl}/signal-processing/compute-hvsr`,
}

export const navLinks = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: "Tools", href: "/tools" },
    { label: "Donate", href: "/donation" },
    { label: "Contact", href: "/contact" },
]

export const filterOptions = [
    { label: "initial", value: "initial" },
    { label: "1-2", value: "1-2" },
    { label: "1-3", value: "1-3" },
    { label: "1-5", value: "1-5" },
    { label: "1-10", value: "1-10" },
    { label: "0.1-10", value: "0.1-10" }
]

export const arrivalsStyles = {
    line: {
        color: "#d4003c",
        width: 3,
        style: "dot"
    },
    label: {
        size: 25,
        color: "#ebebeb",
    }
}

export const fourierWindowStyles = {
    signal: {
        edgeColor: '#1c1d21',
        width: 1,
        fillColor: 'rgba(76, 88, 255, 0.4)'
    },
    noise: {
        edgeColor: '#1c1d21',
        width: 1,
        fillColor: 'rgba(231, 54, 56, 0.4)'
    }
}


const seismicComponents = [
    { label: "Vertical (Z)", value: "Z" },
    { label: "North-South (N)", value: "N" },
    { label: "East-West (E)", value: "E" },
    { label: "Generic Horizontal 1 (X)", value: "X" },
    { label: "Generic Horizontal 2 (Y)", value: "Y" },
    { label: "Radial (R)", value: "R" },
    { label: "Transverse (T)", value: "T" },
    { label: "Alternative Horizontal 1 (1)", value: "1" },
    { label: "Alternative Horizontal 2 (2)", value: "2" },
    { label: "Up (U)", value: "U" },
    { label: "Vertical Alternative (V)", value: "V" },
    { label: "Horizontal (H)", value: "H" }
];

export const addTraceParameters = [
    {
        type: "number",
        label: "Skip rows",
        name: "skip_rows",
        id: "skip_rows",
        category: "file parameters"
    },
    {
        type: "number",
        label: "Select column",
        name: "column_index",
        id: "column_index",
        category: "file parameters"
    },
    {
        type: "text",
        label: "Station",
        name: "station",
        id: "station",
        placeholder: "e.g. SEIS",
        category: "seismic parameters"
    },
    {
        type: "select",
        label: "Component",
        name: "component",
        id: "component",
        optionsList: seismicComponents,
        category: "seismic parameters"
    },
    {
        type: "date",
        label: "Start date",
        name: "start_date",
        id: "start_date",
        category: "seismic parameters"
    },
    {
        type: "time",
        label: "Start time",
        name: "start_time",
        id: "start_time",
        category: "seismic parameters"
    },
    {
        type: "number",
        label: "Sampling rate",
        name: "sampling_rate",
        id: "sampling_rate",
        category: "seismic parameters"
    }
]





export const taperProcessingParams = [
    {
        type: "select",
        label: "Type",
        name: "taper-type",
        id: "taper-type",
        optionsList: [
            { label: "cosine", value: "cosine" },
            { label: "barthann", value: "barthann" },
            { label: "bartlett", value: "bartlett" },
            { label: "blackman", value: "blackman" },
            { label: "blackmanharris", value: "blackmanharris" },
            { label: "bohman", value: "bohman" },
            { label: "boxcar", value: "boxcar" },
            { label: "chebwin", value: "chebwin" },
            { label: "flattop", value: "flattop" },
            { label: "gaussian", value: "gaussian" },
            { label: "general_gaussian", value: "general_gaussian" },
            { label: "hamming", value: "hamming" },
            { label: "hann", value: "hann" },
            { label: "kaiser", value: "kaiser" },
            { label: "nuttall", value: "nuttall" },
            { label: "parzen", value: "parzen" },
            { label: "slepian", value: "slepian" },
            { label: "triang", value: "triang" }
        ]
        ,
        readOnly: false
    },
    {
        type: "select",
        label: "Side",
        name: "taper-side",
        id: "taper-side",
        optionsList: [
            { label: "left", value: "left" },
            { label: "right", value: "right" },
            { label: "both", value: "both" }
        ],
        readOnly: false
    },
    {
        type: "number",
        label: "Length",
        name: "taper-length",
        id: "taper-length",
        min: 0,
        max: 100,
        step: 0.1,
        readOnly: false
    },
]

export const trimProcessingParams = [
    {
        type: "number",
        label: "Start time (sec)",
        name: "trim-start",
        id: "trim-start",
        min: 0,
        step: 0.1,
        readOnly: false
    },
    {
        type: "range",
        label: "",
        name: "trim-start",
        id: "trim-start-slider",
        min: 0,
        step: 0.1,
        readOnly: false
    },
    {
        type: "number",
        label: "End time (sec)",
        name: "trim-end",
        id: "trim-end",
        min: 0,
        step: 0.1,
        readOnly: false
    },
    {
        type: "range",
        label: "",
        name: "trim-end",
        id: "trim-end-slider",
        min: 0,
        step: 0.1,
        readOnly: false
    },
]

export const detrendProcessingParams = [
    {
        type: "select",
        label: "Type",
        name: "detrend-type",
        id: "detrend-type",
        optionsList: [
            { label: "simple", value: "simple" },
            { label: "linear", value: "linear" },
            { label: "constant", value: "constant" }
        ],
        readOnly: false
    },
]

export const filterProcessingParams = [
    {
        type: "number",
        label: "Min frequency",
        name: "freq-min",
        id: "freq-min",
        min: 0,
        step: 0.1,
        readOnly: false
    },
    {
        type: "number",
        label: "Max frequency",
        name: "freq-max",
        id: "freq-max",
        min: 0,
        step: 0.1,
        readOnly: false
    },
]


export const traceHeaderParams = [
    {
        type: "text",
        label: "Station",
        name: "station",
        id: "station",
        placeholder: "e.g. SEIS",
        readOnly: false
    },
    {
        type: "date",
        label: "Start date",
        name: "start_date",
        id: "start_date",
        readOnly: false
    },
    {
        type: "time",
        label: "Start time",
        name: "start_time",
        id: "start_time",
        readOnly: false
    },
    {
        type: "text",
        label: "Component",
        name: "component",
        id: "component",
        readOnly: false,
        minLength: "1",
        maxLength: "1"
    },
    {
        type: "number",
        label: "Sampling rate *",
        name: "sampling_rate",
        id: "sampling_rate",
        readOnly: true
    },
    {
        type: "number",
        label: "Total sample points *",
        name: "npts",
        id: "npts",
        readOnly: true
    },
]


export const contactFormElements = [
    {
        type: "text",
        label: "Name",
        name: "user_name",
        id: "user_name",
        placeholder: "e.g. Enter your name",
        required: true,
    },
    {
        type: "email",
        label: "Email Address",
        name: "user_email",
        id: "user_email",
        placeholder: "e.g. Enter your email",
        required: true,
    },
    {
        type: "textarea",
        label: "Feedback",
        name: "message",
        id: "message",
        placeholder: "e.g. Provide your message",
        required: true,
    }
]