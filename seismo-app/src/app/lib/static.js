export const serverUrl = "http://127.0.0.1:8000"

export const fastapiEndpoints = {
    "CALCULATE-DISTANCE": `${serverUrl}/utilities/calculate-distance`,
    "UPLOAD-SEISMIC-FILE": `${serverUrl}/utilities/upload-seismic-file`,
    "UPLOAD-DATA-FILE": `${serverUrl}/utilities/upload-data-file`,
    "DOWNLOAD-SEISMIC-FILE": `${serverUrl}/utilities/download-seismic-file`,
    "DOWNLOAD-TEST-FILE": `${serverUrl}/utilities/download-test-file`,
    "DOWNLOAD-FILE": `${serverUrl}/utilities/download-file`,
    "SAVE-ARRIVALS": `${serverUrl}/utilities/save-arrivals`,
    "CONVERT-TO-MSEED": `${serverUrl}/utilities/convert-to-mseed`,   
    "TRIM-WAVEFORM": `${serverUrl}/signal-processing/trim`,
    "TAPER-WAVEFORM": `${serverUrl}/signal-processing/taper`,
    "DETREND-WAVEFORM": `${serverUrl}/signal-processing/detrend`,
    "FILTER-WAVEFORM": `${serverUrl}/signal-processing/filter`,
    "COMPUTE-FOURIER": `${serverUrl}/signal-processing/compute-fourier`,
    "COMPUTE-HVSR": `${serverUrl}/signal-processing/compute-hvsr`,
    "TAPER-TYPE-OPTIONS": `${serverUrl}/static-data/get-taper-type-options`,   
    "TAPER-SIDE-OPTIONS": `${serverUrl}/static-data/get-taper-side-options`,   
    "DETREND-TYPE-OPTIONS": `${serverUrl}/static-data/get-detrend-type-options`,   
    "FILTER-OPTIONS": `${serverUrl}/static-data/get-filter-options`,   
}

export const navLinks = [
    {label: "Home", href: "/"},
    {label: "Articles", href: "/articles"},
    {label: "Tools", href: "/tools"},
    {label: "Donate", href: "/donation"},
    {label: "Contact", href: "/contact"},
]

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