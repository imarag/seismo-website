export const serverUrl = "http://127.0.0.1:8000"

export const fastapiEndpoints = {
    "CALCULATE-DISTANCE": `${serverUrl}/utilities/calculate-distance`,
    "UPLOAD-SEISMIC-FILE": `${serverUrl}/utilities/upload-seismic-file`,
    "UPLOAD-DATA-FILE": `${serverUrl}/utilities/upload-data-file`,
    "DOWNLOAD-SEISMIC-FILE": `${serverUrl}/utilities/download-seismic-file`,
    "SAVE-ARRIVALS": `${serverUrl}/utilities/save-arrivals`,
    "CONVERT-TO-MSEED": `${serverUrl}/utilities/convert-to-mseed`,   
    "TRIM-WAVEFORM": `${serverUrl}/signal-processing/trim-waveform`,
    "DETREND-WAVEFORM": `${serverUrl}/signal-processing/detrend-waveform`,
    "APPLY-FILTER": `${serverUrl}/signal-processing/apply-filter`,
    "COMPUTE-FOURIER": `${serverUrl}/signal-processing/compute-fourier`,
    "ADD-TRACE": `${serverUrl}/handle-seismic-traces/add-trace`,
    "UPDATE-TRACE": `${serverUrl}/handle-seismic-traces/update-trace`,
    "DELETE-TRACE": `${serverUrl}/handle-seismic-traces/delete-trace`,   
}

export const navLinks = [
    {label: "Home", href: "/"},
    {label: "About", href: "/about"},
    {label: "Articles", href: "/articles"},
    {label: "Tools", href: "/tools"},
    {label: "Donate", href: "/donation"},
    {label: "Contact", href: "/contact"},
]

export const filterOptions = [
    { name: "initial", value: "initial" },
    { name: "1-2", value: "1-2" },
    { name: "1-3", value: "1-3" },
    { name: "1-5", value: "1-5" },
    { name: "1-10", value: "1-10" },
    { name: "0.1-10", value: "0.1-10" }
];

export const arrivalsStyles = {
    line: {
        color: "#d4003c",
        width: 3,
        style: "dot"
    },
    label: {
        size: 30
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