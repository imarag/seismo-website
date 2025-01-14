export const serverUrl = "http://127.0.0.1:8000"

export const fastapiEndpoints = {
    "CALCULATE-DISTANCE": `${serverUrl}/utilities/calculate-distance`,
    "UPLOAD-SEISMIC-FILE": `${serverUrl}/utilities/upload-seismic-file`,
    "UPLOAD-DATA-FILE": `${serverUrl}/utilities/upload-data-file`,
    "DOWNLOAD-SEISMIC-FILE": `${serverUrl}/utilities/download-seismic-file`,
    "DOWNLOAD-TEST-FILE": `${serverUrl}/utilities/download-test-file`,
    "SAVE-ARRIVALS": `${serverUrl}/utilities/save-arrivals`,
    "CONVERT-TO-MSEED": `${serverUrl}/utilities/convert-to-mseed`,   
    "TRIM-WAVEFORM": `${serverUrl}/signal-processing/trim`,
    "TAPER-WAVEFORM": `${serverUrl}/signal-processing/taper`,
    "DETREND-WAVEFORM": `${serverUrl}/signal-processing/detrend`,
    "APPLY-FILTER": `${serverUrl}/signal-processing/filter`,
    "COMPUTE-FOURIER": `${serverUrl}/signal-processing/compute-fourier`,
    "ADD-TRACE": `${serverUrl}/handle-seismic-traces/add-trace`,
    "UPDATE-TRACE": `${serverUrl}/handle-seismic-traces/update-trace`,
    "DELETE-TRACE": `${serverUrl}/handle-seismic-traces/delete-trace`,   
}

export const navLinks = [
    {label: "Home", href: "/"},
    {label: "Articles", href: "/articles"},
    {label: "Tools", href: "/tools"},
    {label: "Donate", href: "/donation"},
    {label: "Contact", href: "/contact"},
]

export const filterOptions = [
    { label: "initial", value: "initial" },
    { label: "1-2", value: "1-2" },
    { label: "1-3", value: "1-3" },
    { label: "1-5", value: "1-5" },
    { label: "1-10", value: "1-10" },
    { label: "0.1-10", value: "0.1-10" }
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

export const taperTypes = [
    { value: "cosine", label: "Cosine taper" },
    { value: "barthann", label: "Bartlett-Hann" },
    { value: "bartlett", label: "Bartlett" },
    { value: "blackman", label: "Blackman" },
    { value: "blackmanharris", label: "Blackman-Harris" },
    { value: "bohman", label: "Bohman" },
    { value: "boxcar", label: "Boxcar" },
    { value: "chebwin", label: "Dolph-Chebyshev" },
    { value: "flattop", label: "Flat top" },
    { value: "gaussian", label: "Gaussian std" },
    { value: "general_gaussian", label: "Gen. Gaussian" },
    { value: "hamming", label: "Hamming" },
    { value: "hann", label: "Hann" },
    { value: "kaiser", label: "Kaiser" },
    { value: "nuttall", label: "Nuttall" },
    { value: "parzen", label: "Parzen" },
    { value: "slepian", label: "Slepian" },
    { value: "triang", label: "Triangular" },
]

export const taperSides = [
    { value: "left", label: "left" },
    { value: "both", label: "both" },
    { value: "right", label: "right" },
]

export const detrendTypes = [
    { value: "linear", label: "linear" },
    { value: "constant", label: "constant" },
    { value: "simple", label: "simple" }
]