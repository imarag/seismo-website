import React from 'react'

export default function SignalProcessing() {
  return (
    <div>SignalProcessing</div>
  )
}

// {% extends 'base-interactive-tools.html' %}


// {% block tool_title_description %}
// Manipulate seismic data files
// {% endblock %}


// {% block tool_user_guide %}
// <p>
//     Start by uploading a seismic data file using the <kbd>upload</kbd> option. Choose between the available processing
//     tools to
//     edit your uploaded waveforms. These available tools are described below:
// <ul>
//     <li><a href="https://docs.obspy.org/packages/autogen/obspy.core.trace.Trace.detrend.html"
//             target="_blank">Detrend</a>: Remove the trend variations in a signal using a specific detrend type.
//         Detrending is essential when you want to focus on the fluctuations or patterns in a signal that are not related
//         to the underlying trend. By removing the trend, you can make it easier to analyze the residuals or the noise in
//         the signal, which can provide valuable insights into the underlying processes or phenomena being observed.</li>
//     <li><a href="https://docs.obspy.org/packages/autogen/obspy.core.trace.Trace.taper.html" target="_blank">Taper</a>:
//         Apply a weight function window to a signal to reduce the sharp transitions at the edges of the finite signal
//         segment. The tapering window gradually reduces the amplitude of the signal toward its edges, making it smoother
//         and more compatible with Fourier analysis techniques. This results in more accurate frequency domain
//         representations.</li>
//     <li><a href="https://docs.obspy.org/packages/autogen/obspy.core.stream.Stream.trim.html" target="_blank">Trim</a>:
//         Remove portions of a signal that are considered unwanted or irrelevant for the specific analysis or application.
//         Trimming can be used to focus on a specific segment of a signal, eliminate noise or artifacts, or isolate
//         particular events or features of interest.</li>
// </ul>
// Applying a processing step adds a pill-shaped filter below the top menu. Click to remove. Upon removal, all existing
// filters are reapplied to waveforms, starting from the leftmost filter.
// Every tool contains several options to adjust its functionality. When you are done, download the processed seismic data
// file in a MiniSEED format
// using the <kbd>Save</kbd> option at the top menu.
// </p>
// <p>
//     In case the waveforms get out of the visible area of the graph, use the buttons on the top right corner of the graph
//     to <kbd>pan</kbd> (move) the waveform, or <kbd>zoom</kbd> option to zoom in and our of the graph and the <kbd>reset
//         axes</kbd>
//     option to reset the waveforms to its initial position. In addition, use the left mouse button to select a specific
//     area on the graph and the mouse wheel to zoom in and out of the graph.
// </p>
// <p>
//     <b>Note: There are some times that <kbd>reset axes</kbd> option, does not work. Consider re-uploading the same
//         record again in case this happens.</b>
// </p>
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
//     <div class="px-4 py-2 border-bottom border-dark mb-4 mt-5">
//         <button class="btn btn-light" id="upload-file-button">
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-upload"
//                 viewBox="0 0 16 16">
//                 <path
//                     d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
//                 <path
//                     d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
//             </svg>
//             Upload
//         </button>
//         <a class="btn btn-light" id="save-file-button" href="{{ url_for('BP_signal_processing.download_mseed_file') }}">
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-download"
//                 viewBox="0 0 16 16">
//                 <path
//                     d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
//                 <path
//                     d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
//             </svg>
//             Save
//         </a>
//         <input type="file" id="upload-file-input" name="upload-file-input" style="display: none;">
//     </div>
//     <div class="bg-info px-3 py-2 fs-6 text-dark">
//         <div class="d-block d-lg-none">
//             <div class="row justify-content-center align-items-center text-dark">
//                 <div class="col-4 text-center">
//                     <div class="dropdown">
//                         <button class="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown"
//                             aria-expanded="false">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
//                                 class="bi bi-align-start" viewBox="0 0 16 16">
//                                 <path fill-rule="evenodd"
//                                     d="M1.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z" />
//                                 <path d="M3 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
//                             </svg>
//                             Detrend
//                         </button>
//                         <ul class="dropdown-menu   text-bg-light">
//                             <div class="p-3 text-center">
//                                 <div class="row justify-content-center text-center">
//                                     <div class="col-12">
//                                         <p class="text-center  mb-3  fw-bold">Detrend</p>
//                                         <hr>
//                                         <label for="detrend-type-select-expanding" class="form-label">type</label>
//                                         <select class="form-select" name="detrend-type-select"
//                                             aria-label="Default select example" id="detrend-type-select-expanding">
//                                             <option value="simple" name="simple">simple</option>
//                                             <option value="linear" name="linear">linear</option>
//                                             <option value="constant" name="constant">constant</option>
//                                             <option value="polynomial" name="polynomial">polynomial</option>
//                                             <option value="spline" name="spline">spline</option>
//                                         </select>
//                                         <label for="detrend-order-input-expanding" class="form-label">order</label>
//                                         <input id="detrend-order-input-expanding" name="detrend-order-input-expanding"
//                                             class="form-control form-control-sm" type="number" min="1" max="5" step="1"
//                                             value="1">
//                                         <button class="btn btn-dark mt-3"
//                                             id="detrend-apply-button-expanding">apply</button>
//                                     </div>
//                                 </div>

//                             </div>
//                         </ul>
//                     </div>
//                 </div>
//                 <div class="col-4 text-center">
//                     <div class="dropdown">
//                         <button class="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown"
//                             aria-expanded="false">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
//                                 class="bi bi-soundwave" viewBox="0 0 16 16">
//                                 <path fill-rule="evenodd"
//                                     d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z" />
//                             </svg>
//                             Taper
//                         </button>
//                         <ul class="dropdown-menu   text-bg-light">
//                             <div class="p-3 text-center">
//                                 <div class="row justify-content-center text-center">
//                                     <div class="col-12">
//                                         <p class="text-center  mb-3  fw-bold">Taper</p>
//                                         <hr>
//                                         <label for="taper-type-select-expanding" class="form-label">type</label>
//                                         <select class="form-select" aria-label="Default select example"
//                                             name="taper-type-select" id="taper-type-select-expanding">
//                                             <option value="cosine" name="cosine">cosine</option>
//                                             <option value="barthann" name="barthann">barthann</option>
//                                             <option value="bartlett" name="bartlett">bartlett</option>
//                                             <option value="blackman" name="blackman">blackman</option>
//                                             <option value="blackmanharris" name="blackmanharris">blackmanharris</option>
//                                             <option value="bohman" name="bohman">bohman</option>
//                                             <option value="boxcar" name="boxcar">boxcar</option>
//                                             <option value="chebwin" name="chebwin">chebwin</option>
//                                             <option value="flattop" name="flattop">flattop</option>
//                                             <option value="gaussian" name="gaussian">gaussian</option>
//                                             <option value="general_gaussian" name="general_gaussian">general_gaussian
//                                             </option>
//                                             <option value="hamming" name="hamming">hamming</option>
//                                             <option value="hann" name="hann">hann</option>
//                                             <option value="kaiser" name="kaiser">kaiser</option>
//                                             <option value="hann" name="hann">hann</option>
//                                             <option value="nuttall" name="nuttall">nuttall</option>
//                                             <option value="parzen" name="parzen">parzen</option>
//                                             <option value="slepian" name="slepian">slepian</option>
//                                             <option value="triang" name="triang">triang</option>
//                                         </select>
//                                         <label for="taper-side-select-expanding" class="form-label">side</label>
//                                         <select class="form-select" aria-label="Default select example"
//                                             name="taper-side-select" id="taper-side-select-expanding">
//                                             <option value="left" name="left">left</option>
//                                             <option value="right" name="right">right</option>
//                                             <option value="both" name="both">both</option>
//                                         </select>
//                                         <label for="taper-length-input-expanding" class="form-label">length (%)</label>
//                                         <input id="taper-length-input-expanding" name="taper-length-input"
//                                             class="form-control form-control-sm" type="number" min="0" max="50" step="1"
//                                             value="30">
//                                         <button class="btn btn-dark  mt-3 "
//                                             id="taper-apply-button-expanding">apply</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </ul>
//                     </div>
//                 </div>
//                 <div class="col-4 text-center">
//                     <div class="dropdown">
//                         <button class="btn btn-info dropdown-toggle" type="button" data-bs-toggle="dropdown"
//                             aria-expanded="false">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
//                                 class="bi bi-scissors" viewBox="0 0 16 16">
//                                 <path
//                                     d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
//                             </svg>
//                             Trim
//                         </button>
//                         <ul class="dropdown-menu text-bg-light">
//                             <div class="p-3 text-center">
//                                 <div class="row justify-content-center text-center">
//                                     <div class="col-12">
//                                         <p class="text-center  mb-3  fw-bold">Trim</p>
//                                         <hr>
//                                         <label for="trim-left-side-input-expanding" class="form-label">left side
//                                         </label>
//                                         <input id="trim-left-side-input-expanding" name="trim-left-side-input"
//                                             class="form-control form-control-sm" type="number" min="0" step="1"
//                                             value="5">
//                                         <label for="trim-right-side-input-expanding" class="form-label">right side
//                                         </label>
//                                         <input id="trim-right-side-input-expanding" name="trim-right-side-input"
//                                             class="form-control form-control-sm" type="number" min="0" step="1"
//                                             value="10">
//                                         <button class="btn btn-dark mt-3"
//                                             id="trim-apply-button-expanding">apply</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div class="d-none d-lg-block">
//             <div class="row justify-content-center align-items-center">
//                 <div class="col-4">
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col text-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
//                                 class="bi bi-align-start" viewBox="0 0 16 16">
//                                 <path fill-rule="evenodd"
//                                     d="M1.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z" />
//                                 <path d="M3 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />
//                             </svg>
//                         </div>
//                         <div class="col text-center">
//                             <span class="fw-bold">Detrend</span>
//                             <a href="https://docs.obspy.org/packages/autogen/obspy.core.trace.Trace.detrend.html"
//                                 target="_blank" class="link-dark">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
//                                     class="bi bi-info-circle-fill" viewBox="0 0 16 16">
//                                     <path
//                                         d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
//                                 </svg>
//                             </a>
//                         </div>
//                     </div>
//                     <hr class="border-bottom border-1 border-dark my-1">
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col-4">
//                             <label for="detrend-type-select" class="form-label">type</label>
//                             <select class="form-select" name="detrend-type-select" aria-label="Default select example"
//                                 id="detrend-type-select" style="height:35px;">
//                                 <option value="simple" name="simple">simple</option>
//                                 <option value="linear" name="linear">linear</option>
//                                 <option value="constant" name="constant">constant</option>
//                                 <option value="polynomial" name="polynomial">polynomial</option>
//                                 <option value="spline" name="spline">spline</option>
//                             </select>
//                         </div>
//                         <div class="col-4">
//                             <label for="detrend-order-input" class="form-label">order</label>
//                             <input id="detrend-order-input" name="detrend-order-input"
//                                 class="form-control form-control-sm" type="number" min="1" max="5" step="1" value="1"
//                                 style="height:35px;">
//                         </div>
//                         <div class="col-4">

//                         </div>
//                     </div>
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col text-center">
//                             <button class="btn btn-dark mt-3" id="detrend-apply-button">apply</button>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="col-4 border-start border-1 border-light border-end">
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col text-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
//                                 class="bi bi-soundwave" viewBox="0 0 16 16">
//                                 <path fill-rule="evenodd"
//                                     d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z" />
//                             </svg>
//                         </div>
//                         <div class="col text-center">
//                             <span class="fw-bold">Taper</span>
//                             <a href="https://docs.obspy.org/packages/autogen/obspy.core.trace.Trace.taper.html"
//                                 target="_blank" class="link-dark">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
//                                     class="bi bi-info-circle-fill" viewBox="0 0 16 16">
//                                     <path
//                                         d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
//                                 </svg>
//                             </a>
//                         </div>
//                     </div>
//                     <hr class="border-bottom border-1 border-dark my-1">
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col-4">
//                             <label for="taper-type-select" class="form-label">type</label>
//                             <select class="form-select" aria-label="Default select example" name="taper-type-select"
//                                 id="taper-type-select" style="height:35px;">
//                                 <option value="cosine" name="cosine">cosine</option>
//                                 <option value="barthann" name="barthann">barthann</option>
//                                 <option value="bartlett" name="bartlett">bartlett</option>
//                                 <option value="blackman" name="blackman">blackman</option>
//                                 <option value="blackmanharris" name="blackmanharris">blackmanharris</option>
//                                 <option value="bohman" name="bohman">bohman</option>
//                                 <option value="boxcar" name="boxcar">boxcar</option>
//                                 <option value="chebwin" name="chebwin">chebwin</option>
//                                 <option value="flattop" name="flattop">flattop</option>
//                                 <option value="gaussian" name="gaussian">gaussian</option>
//                                 <option value="general_gaussian" name="general_gaussian">general_gaussian</option>
//                                 <option value="hamming" name="hamming">hamming</option>
//                                 <option value="hann" name="hann">hann</option>
//                                 <option value="kaiser" name="kaiser">kaiser</option>
//                                 <option value="hann" name="hann">hann</option>
//                                 <option value="nuttall" name="nuttall">nuttall</option>
//                                 <option value="parzen" name="parzen">parzen</option>
//                                 <option value="slepian" name="slepian">slepian</option>
//                                 <option value="triang" name="triang">triang</option>
//                             </select>
//                         </div>
//                         <div class="col-4">
//                             <label for="taper-side-select" class="form-label">side</label>
//                             <select class="form-select" aria-label="Default select example" name="taper-side-select"
//                                 id="taper-side-select" style="height:35px;">
//                                 <option value="left" name="left">left</option>
//                                 <option value="right" name="right">right</option>
//                                 <option value="both" name="both">both</option>
//                             </select>
//                         </div>
//                         <div class="col-4">
//                             <label for="taper-length-input" class="form-label">length (%)</label>
//                             <input id="taper-length-input" name="taper-length-input"
//                                 class="form-control form-control-sm" type="number" min="0" max="50" step="1" value="30"
//                                 style="height:35px;">
//                         </div>
//                     </div>
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col text-center">
//                             <button class="btn btn-dark  mt-3 " id="taper-apply-button">apply</button>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="col-4">
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col text-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
//                                 class="bi bi-scissors" viewBox="0 0 16 16">
//                                 <path
//                                     d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
//                             </svg>
//                         </div>
//                         <div class="col text-center">
//                             <span class="fw-bold">Trim</span>
//                             <a href="https://docs.obspy.org/packages/autogen/obspy.core.stream.Stream.trim.html"
//                                 target="_blank" class="link-dark">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
//                                     class="bi bi-info-circle-fill" viewBox="0 0 16 16">
//                                     <path
//                                         d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
//                                 </svg>
//                             </a>
//                         </div>
//                     </div>
//                     <hr class="border-bottom border-1 border-dark my-1">
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col-4">
//                             <label for="trim-left-side-input" class="form-label">left side </label>
//                             <input id="trim-left-side-input" name="trim-left-side-input"
//                                 class="form-control form-control-sm" type="number" min="0" step="1" value="5"
//                                 style="height:35px;">
//                         </div>
//                         <div class="col-4">
//                             <label for="trim-right-side-input" class="form-label">right side </label>
//                             <input id="trim-right-side-input" name="trim-right-side-input"
//                                 class="form-control form-control-sm" type="number" min="0" step="1" value="10"
//                                 style="height:35px;">
//                         </div>
//                         <div class="col-4">

//                         </div>
//                     </div>
//                     <div class="row justify-content-center align-items-center">
//                         <div class="col text-center">
//                             <button class="btn btn-dark mt-3" id="trim-apply-button">apply</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//     <div class="bg-dark">
//         <div class="row gx-2 justify-content-center" id="processing-pills-container">

//         </div>
//         <div id="spinner-div">
//             <div class="text-center">
//                 <div class="spinner-border my-3  bg-warning" role="status">
//                     <span class="visually-hidden">Loading...</span>
//                 </div>
//             </div>
//         </div>

//         <div class="row justify-content-center align-items-center" id="signal-processing-start-by-upload-container">
//             <div class="col text-center text-light">
//                 <p class="fs-3">Start by <button class="btn btn-outline-info"
//                         id="upload-another-file-button">uploading</button> a seismic file</p>
//                 <input type="file" id="upload-another-file-input" name="upload-file-input" style="display: none;">
//             </div>
//         </div>

//         <div id="time-series-graph">

//         </div>
//     </div>
// </div>
// <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
// <script src="/static/js/signal-processing.js"></script>
// {% endblock %}