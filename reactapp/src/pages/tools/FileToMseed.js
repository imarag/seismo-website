import { useState } from "react"
import ButtonWithIcon from "../../components/ButtonWithIcon"
import { UploadIcon } from "../../SvgIcons"

function FileContainer({ type, setSelectedFileType, icon }) {
    return (
        <div>
            <h1 className="text-center">{ type }</h1>
            <button className="btn btn-light" onClick={() => setSelectedFileType(type)}></button>
        </div>
    )
}

function FileBody({ title, active, children }) {
    return (
        <>
            {
                active && (
                    <div>
                        <h1 className="text-center fs-4 my-3">{ title }</h1>
                        <input name="file" type="file"  id="upload-seismic-file-input" hidden />
                        <div className="d-flex flex-row align-items-center gap-2">
                            <ButtonWithIcon text="Upload file" ><UploadIcon /></ButtonWithIcon>
                        </div>
                        <div>
                            { children }
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default function FileToMSEED() {
    const [selectedFileType, setSelectedFileType] = useState("xlsx")
    return (
        <section>
            <div className="d-flex flex-row justify-content-center">
                <FileContainer type="xlsx" setSelectedFileType={setSelectedFileType} />
                <FileContainer type="csv" setSelectedFileType={setSelectedFileType} />
                <FileContainer type="txt" setSelectedFileType={setSelectedFileType} />
            </div>
            <div>
                <FileBody title="Excel" active={selectedFileType === "xlsx"}>

                </FileBody>
                <FileBody title="CSV" active={selectedFileType === "csv"}>

                </FileBody>
                <FileBody title="TXT/Dat" active={selectedFileType === "txt"}>
                </FileBody>
            </div>
        </section>
    )
}


// {% extends 'base-interactive-tools.html' %}

// {% block tool_title_description %}
// Convert input files to the seismic MiniSEED format
// {% endblock %}

// {% block tool_user_guide %}
// <p class="text-start">
//     If you have a file that you would like to use with the available tools, this is a convenient
//     conversion tool that allows you to convert data defined in various file formats into the MSEED file format.
//     This tool supports the formats: <kbd>.xlsx</kbd>, <kbd>.xls</kbd>, <kbd>.csv</kbd>, <kbd>.txt</kbd>,
//     <kbd>.dat</kbd>.
//     Start by selecting the appropriate format of your file by clicking on the respective icon, fill in the available
//     file parsing parameters if any (delimiter, has headers, etc.)
//     and load your data file.
//     Then continue with the second set of parameters that are related to the sampling process of converting analog
//     signals
//     to digital form (sampling frequency, station name, etc.). Lastly, convert your loaded file to mseed.
// </p>
// <p>Take into account the following about the file parameters:<br></p>
// <ul>
//     <li>In case of uploading a TXT or DAT file, be careful of the <kbd>delimiter</kbd>. Select the <kbd>delimiter</kbd>
//         of your columns correctly in order for the program to run. Use the "space" option if your columns are separated
//         by one or more
//         blanks or spaces. </li>
//     <li>Utilize the <kbd>skiprows</kbd> entry if you want to skip some rows at the beginning of your file (in case of a
//         .txt/.dat file). If you skip more rows than the total rows of your file, the final table will be empty and it
//         will give you an error!</li>
//     <li>If you file contain headers check the <kbd>has headers</kbd> option. If you deselect it, it will automatically
//         add column names starting with "col" and ending in a number ranging from 1 till the total columns number. In
//         case of the .txt/.dat file formats, the <kbd>skiprows</kbd> option is applied first and then the <kbd>has
//             headers</kbd> option.</li>
//     <li>If your .txt or .dat file contain some header information at the first rows and you don't skip those lines, it
//         may give you an error.</li>
// </ul>
// <p>Take into account the following about the seismic parameters:<br></p>
// <ul>
//     <li>The <kbd>starting date</kbd> is optional. If no date is selected, a default value of "1970-01-01" will be
//         applied. However, it is recommended to select a date especially in case you intend to use this file to select
//         the P & S wave arrivals.</li>
//     <li>As with the <kbd>starting date</kbd>, the <kbd>starting time</kbd> is also optional but recommended. The default
//         value is "00:00:00".</li>
//     <li>The <kbd>station name</kbd> is optional. It should contain three to six letters from a-z or A-Z, and/or numbers
//         from 0-9!</li>
//     <li>At the <kbd>components</kbd> option you must select the columns of your input file that correspond to each of
//         the components. In case you just have two components (one vertical and one horizontal), check the <kbd>my file
//             has 2 components</kbd> option. If you provide the same column name for two or more components, it will give
//         you an error.</li>
//     <li>As soon as you upload your file succesfully, the program will automatically populate the component dropdowns
//         with values, the file column names.</li>
//     <li>Lastly, you must insert the sampling frequency in Hertz or the sample distance in seconds for the correct x-axis
//         representation.</li>
// </ul>
// {% endblock %}


// {% block tool_body %}
// <p class="text-center text-secondary d-block d-sm-none my-5">
//     Sorry, but it seems like you're accessing our tool from a mobile device. Currently, our tool is optimized for
//     desktop use to
//     provide the best user experience. For the optimal experience, please switch to a desktop or laptop computer. We
//     appreciate
//     your understanding and apologize for any inconvenience.
// </p>
// <div class="d-none d-sm-block">
//     <div>
//         <p class="display-4 text-info text-center my-5">
//             1. Upload The Data File
//         </p>
//         <div class="accordion" id="file-types">
//             <div class="row justify-content-center align-items-center mb-4">
//                 <div class="col-4 col-md-3 col-lg-2 text-center">
//                     <div class="accordion-item">
//                         <h2 class="accordion-header">
//                             <button class="accordion-button" type="button" data-bs-toggle="collapse"
//                                 data-bs-target="#excel-button" aria-expanded="true" aria-controls="excel-button">
//                                 <div class="text-center">
//                                     <img src="{{ url_for('static', filename='img/excel-icon.png') }}" alt="excel icon"
//                                         class="img-fluid">
//                                 </div>
//                             </button>
//                         </h2>
//                     </div>
//                 </div>
//                 <div class="col-4 col-md-3 col-lg-2 text-center">
//                     <div class="accordion-item">
//                         <h2 class="accordion-header">
//                             <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
//                                 data-bs-target="#csv-button" aria-expanded="false" aria-controls="csv-button">
//                                 <div class="text-center">
//                                     <img src="{{ url_for('static', filename='img/csv-icon.png') }}" alt="excel icon"
//                                         class="img-fluid">
//                                 </div>
//                             </button>
//                         </h2>
//                     </div>
//                 </div>
//                 <div class="col-4 col-md-3 col-lg-2 text-center">
//                     <div class="accordion-item">
//                         <h2 class="accordion-header">
//                             <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
//                                 data-bs-target="#txt-button" aria-expanded="false" aria-controls="txt-button">
//                                 <div class="text-center">
//                                     <img src="{{ url_for('static', filename='img/txt-dat-icon.png') }}" alt="excel icon"
//                                         class="img-fluid">
//                                 </div>
//                             </button>
//                         </h2>
//                     </div>
//                 </div>
//             </div>
//             <div class="row justify-content-center align-items-center fs-5">
//                 <div class="col-12 col-md-10 col-lg-8 bg-dark rounded p-4">
//                     <div class="text-center  bg-red text-red mt-3" id="file-parsing-spinner-div">
//                         <div class="spinner-border spinner-border-xl text-warning" role="status">
//                             <span class="visually-hidden">Loading...</span>
//                         </div>
//                     </div>
//                     <div id="excel-button" class="accordion-collapse collapse show" data-bs-parent="#file-types">
//                         <div class="accordion-body">
//                             <p class="text-center fs-3 text-secondary">
//                                 Upload An Excel File
//                             </p>
//                             <div class="w-50 mx-auto">
//                                 <div class="text-center mt-5 mb-4">
//                                     <input class="form-control d-none" type="file" name="file" id="excel-upload-input"
//                                         accept=".xlsx, .xls">
//                                     <button class="btn btn-info" id="excel-upload-button">Upload</button>
//                                 </div>
//                                 <div class="text-center">
//                                     <input class="form-check-input" type="checkbox" id="excel-has-headers" checked>
//                                     <label class="form-check-label text-center text-md-start text-secondary"
//                                         for="excel-has-headers">
//                                         has headers
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div id="csv-button" class="accordion-collapse collapse" data-bs-parent="#file-types">
//                         <div class="accordion-body">
//                             <p class="text-center fs-3 text-secondary">
//                                 Upload A CSV File
//                             </p>
//                             <div class="w-50 mx-auto">
//                                 <div class="text-center mt-5 mb-4">
//                                     <input class="form-control d-none" type="file" name="file" id="csv-upload-input"
//                                         accept=".csv">
//                                     <button class="btn btn-info" id="csv-upload-button">Upload</button>
//                                 </div>
//                                 <div class="text-center">
//                                     <input class="form-check-input" type="checkbox" id="csv-has-headers" checked>
//                                     <label class="form-check-label text-center text-md-start text-secondary"
//                                         for="csv-has-headers">
//                                         has headers
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div id="txt-button" class="accordion-collapse collapse" data-bs-parent="#file-types">
//                         <div class="accordion-body">
//                             <p class="text-center fs-3 text-secondary">
//                                 Upload A TXT/DAT File
//                             </p>
//                             <div class="w-50 mx-auto">
//                                 <label for="txt-delimiter" class="form-label text-center text-md-start text-secondary">
//                                     <button type="button" class="btn btn-warning ms-2 btn-sm text-dark"
//                                         data-bs-toggle="tooltip" data-bs-placement="right"
//                                         data-bs-custom-class="custom-tooltip" data-bs-title="Use this option to define the delimiter of the columns. Use the <space> option for a
//                                             single or multiple spaces (or blanks) between the columns">
//                                         ?
//                                     </button>
//                                     Delimiter
//                                 </label>
//                                 <select id="txt-delimiter" name="txt-delimiter" class="form-select mb-3"
//                                     aria-label="Default select">
//                                     <option value="," name="comma" selected>Comma (,)</option>
//                                     <option value=";" name="semicolon">Semicolon (;)</option>
//                                     <option value="|" name="pipe">Pipe (|)</option>
//                                     <option value=":" name="colon">Colon (:)</option>
//                                     <option value="\s+" name="space">Space</option>
//                                 </select>
//                                 <label for="txt-skiprows" class="form-label text-center text-md-start text-secondary">
//                                     <button type="button" class="btn btn-warning ms-2 btn-sm text-dark"
//                                         data-bs-toggle="tooltip" data-bs-placement="right"
//                                         data-bs-custom-class="custom-tooltip" data-bs-title="Skip a specified number of initial rows before reading the file. Useful when
//                                             there's unwanted information in the file's beginning. Default is zero and leaving it empty is
//                                             also treated as zero. Exceeding total file rows results in an error. The <skiprows> option is applied first,
//                                             followed by the <has headers> option.">
//                                         ?
//                                     </button>
//                                     Skiprows
//                                 </label>
//                                 <input type="number" class="form-control" id="txt-skiprows">
//                                 <div class="text-start my-3">
//                                     <input class="form-check-input" type="checkbox" id="txt-has-headers" checked>
//                                     <label class="form-check-label text-center text-md-start text-secondary"
//                                         for="txt-has-headers">
//                                         has headers
//                                     </label>
//                                 </div>
//                                 <div class="text-center mt-5 mb-4">
//                                     <input class="form-control d-none" type="file" name="file" id="txt-upload-input"
//                                         accept=".txt, .dat">
//                                     <button class="btn btn-info" id="txt-upload-button">Upload</button>
//                                 </div>

//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     <div>
//         <p class="display-4 text-info text-center my-5">
//             2. Set The Seismic Parameters
//         </p>
//         <div class="accordion my-5" id="seismic-parameters">
//             <div class="row justify-content-center align-items-center mb-4">
//                 <div class="col-4 col-md-3 col-lg-2 text-center">
//                     <div class="accordion-item">
//                         <h2 class="accordion-header">
//                             <button class="accordion-button" type="button" data-bs-toggle="collapse"
//                                 data-bs-target="#seismic-parameters-inputs" aria-expanded="false"
//                                 aria-controls="seismic-parameters-inputs">
//                                 <div class="text-center">
//                                     <img src="{{ url_for('static', filename='img/miniseed-icon.png') }}"
//                                         alt="excel icon" class="img-fluid">
//                                 </div>
//                             </button>
//                         </h2>
//                     </div>
//                 </div>
//             </div>
//             <div class="row justify-content-center align-items-center fs-5">
//                 <div class="col-12 col-md-10 col-lg-8 bg-dark rounded p-4">
//                     <div id="seismic-parameters-inputs" class="accordion-collapse collapse show"
//                         data-bs-parent="#seismic-parameters">
//                         <div class="accordion-body">
//                             <div class="text-center  bg-red text-red mt-3" id="seismic-parameters-spinner-div">
//                                 <div class="spinner-border spinner-border-xl text-warning" role="status">
//                                     <span class="visually-hidden">Loading...</span>
//                                 </div>
//                             </div>
//                             <p class="text-center fs-3 text-secondary">
//                                 Seismic Parameters Options
//                             </p>
//                             <div class="row justify-content-center align-items-center mt-3">
//                                 <div class="col-6">
//                                     <label for="date" class="text-secondary form-label text-start">
//                                         <button type="button" class="btn btn-warning ms-2 btn-sm text-dark "
//                                             data-bs-toggle="tooltip" data-bs-placement="right"
//                                             data-bs-custom-class="custom-tooltip" data-bs-title="Insert the recorded date of the seismic record. If you don't specify a value, the default value
//                                                 '1970-01-01' is going to be used.">
//                                             ?
//                                         </button>
//                                         Start Date
//                                     </label>
//                                 </div>
//                                 <div class="col-6">
//                                     <label for="time" class="text-secondary form-label text-start">
//                                         <button type="button" class="btn btn-warning ms-2 btn-sm text-dark"
//                                             data-bs-toggle="tooltip" data-bs-placement="right"
//                                             data-bs-custom-class="custom-tooltip" data-bs-title="Insert the recorded time of the seismic record. If you don't specify a value, the default value
//                                                 '00:00:00' is going to be used.">
//                                             ?
//                                         </button>
//                                         Start Time
//                                     </label>
//                                 </div>
//                             </div>
//                             <div class="row justify-content-center align-items-center mb-3">
//                                 <div class="col">
//                                     <input type="date" class="form-control" id="date-input" name="date-input">
//                                 </div>
//                                 <div class="col">
//                                     <input type="time" class="form-control" id="time-input" name="time-input">
//                                 </div>
//                             </div>
//                             <div class="row justify-content-start mt-3">
//                                 <div class="col-7 col-md-6">
//                                     <label for="station-input" class="text-secondary text-start">
//                                         <button type="button" class="btn btn-warning ms-2 btn-sm text-dark"
//                                             data-bs-toggle="tooltip" data-bs-placement="right"
//                                             data-bs-custom-class="custom-tooltip"
//                                             data-bs-title="Insert the station name. If empty, 'STA' will be filled in as a default name.">
//                                             ?
//                                         </button>
//                                         Station Name
//                                     </label>
//                                     <input type="text" class="form-control mt-2" id="station-input" name="station-input"
//                                         placeholder="e.g. SEIS" regex="^[A-Za-z0-9]{3,6}$">
//                                 </div>
//                             </div>
//                             <div class="row justify-content-start mt-3">
//                                 <div class="col-6">
//                                     <label for="station-input" class="text-secondary text-start">
//                                         <button type="button" class="btn btn-warning ms-2 btn-sm text-dark"
//                                             data-bs-toggle="tooltip" data-bs-placement="right"
//                                             data-bs-custom-class="custom-tooltip"
//                                             data-bs-title="Fill in the column names that correspond to each component. Check the 'my file has 2 components' option in case have one vertical and just one horizontal component. You cannot fill the same column name for two or more components.">
//                                             ?
//                                         </button>
//                                         Components*
//                                     </label>
//                                 </div>
//                                 <div class="col-6">
//                                     <div class="text-start ">
//                                         <input class="form-check-input" type="checkbox" id="two-components-check">
//                                         <label class="form-check-label text-center text-md-start text-secondary"
//                                             for="two-components-check">
//                                             my file has 2 components
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="row justify-content-center mt-1 mb-3">
//                                 <div class="col text-center">
//                                     <label class="form-check-label text-center text-secondary mb-1 mt-1" for="compo1">
//                                         Vertical
//                                     </label>
//                                     <select class="form-select" aria-label="component 1" id="compo1" name="compo1">
//                                         <option value="not-selected" selected>select column</option>
//                                     </select>
//                                 </div>
//                                 <div class="col text-center">
//                                     <label class="form-check-label text-center text-secondary mb-1 mt-1" for="compo2">
//                                         Horizontal 1
//                                     </label>
//                                     <select class="form-select" aria-label="component 2" id="compo2" name="compo2">
//                                         <option value="not-selected" selected>select column</option>
//                                     </select>
//                                 </div>
//                                 <div class="col text-center">
//                                     <label class="form-check-label text-center text-secondary mb-1 mt-1" for="compo3">
//                                         Horizontal 2
//                                     </label>
//                                     <select class="form-select" aria-label="component 3" id="compo3" name="compo3">
//                                         <option value="not-selected" selected>select column</option>
//                                     </select>
//                                 </div>
//                             </div>
//                             <label for="parameter-value" class="text-secondary mt-3">
//                                 <button type="button" class="btn btn-warning ms-2 btn-sm text-dark"
//                                     data-bs-toggle="tooltip" data-bs-placement="right"
//                                     data-bs-custom-class="custom-tooltip" data-bs-title="Select one of the two parameters: sampling frequency fs (Hz) or sample distance dt (sec) and insert
//                                         a value for it. You cannot leave this empty!">
//                                     ?
//                                 </button>
//                                 Sampling Parameters*
//                             </label><br>
//                             <div class="row justify-content-center align-items-center my-3">
//                                 <div class="col">
//                                     <div class="btn-group w-100" role="group"
//                                         aria-label="Basic radio toggle button group">
//                                         <input type="radio" class="btn-check" name="btnradio" id="fs-radio"
//                                             autocomplete="off" checked>
//                                         <label class="btn btn-outline-primary" for="fs-radio">fs (Hz)</label>
//                                         <input type="radio" class="btn-check" name="btnradio" id="dt-radio"
//                                             autocomplete="off">
//                                         <label class="btn btn-outline-primary" for="dt-radio">dt (sec)</label>
//                                     </div>
//                                 </div>
//                                 <div class="col">
//                                     <input type="number" class="form-control" style="width:100%" id="parameter-value"
//                                         name="parameter-value" required>
//                                 </div>
//                             </div>
//                             <p class="text-center fs-6 text-secondary my-5">The fields denoted by an asterisc (*) must
//                                 be filled in </p>

//                             <p class="fs-5 text-start text-secondary my-5">For more information about these options
//                                 click <a target="_blank"
//                                     href="https://docs.obspy.org/packages/autogen/obspy.core.trace.Stats.html"
//                                     class="text-center link-info">here</a></p>
//                             <div class="col-12 my-5 text-center">
//                                 <button class="btn btn-success btn-lg" id="submit-seismic-params-button"
//                                     disabled>convert to mseed</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
// <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
// <script src="/static/js/file-to-mseed.js"></script>
// {% endblock %}