import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

// export const serverUrl = "http://127.0.0.1:8000"
export const serverUrl = "https://seismo-website.onrender.com/"

export const socialMediaInfo = [
    {app: "facebook", url: "https://www.facebook.com/giannis.mar.5/", icon: FaFacebook},
    {app: "instagram", url: "https://www.instagram.com/giannis_mar95/", icon: FaInstagram},
    {app: "linkedin", url: "https://www.linkedin.com/in/ioannis-maragkakis-1ba2851a9/", icon: FaLinkedin},
]

export const fastapiEndpoints = {
    "CALCULATE-DISTANCE": `${serverUrl}/core/calculate-distance`,
    "UPLOAD-SEISMIC-FILE": `${serverUrl}/core/upload-seismic-file`,
    "UPLOAD-DATA-FILE": `${serverUrl}/core/upload-data-file`,
    "DOWNLOAD-SEISMIC-FILE": `${serverUrl}/core/download-seismic-file`,
    "DOWNLOAD-TEST-FILE": `${serverUrl}/core/download-test-file`,
    "DOWNLOAD-FILE": `${serverUrl}/core/download-file`,
    "SAVE-ARRIVALS": `${serverUrl}/core/save-arrivals`,
    "CONVERT-TO-MSEED": `${serverUrl}/core/convert-to-mseed`,   
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
    "DELIMITER-OPTIONS": `${serverUrl}/static-data/get-delimiter-options`,
    "GET-ARTICLES" : `${serverUrl}/static-data/get-articles`, 
    "GET-ARTICLE" : `${serverUrl}/static-data/get-article`, 
}

export const navLinks = [
    {label: "Home", href: "/"},
    {label: "Articles", href: "/articles-search"},
    {label: "Tools", href: "/tools-search"},
    {label: "Donate", href: "/donation"},
    {label: "Contact", href: "/contact"},
]

export const taperTypeOptions = [
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

export const taperSideOptions = [
    { value: "left", label: "left" },
    { value: "right", label: "right" },
    { value: "both", label: "both" },
]

export const detrendTypeOptions = [
    { value: "linear", label: "linear" },
    { value: "constant", label: "constant" },
    { value: "simple", label: "simple" },
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