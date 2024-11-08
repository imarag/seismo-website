import React from 'react'

export default function Fourier() {
  return (
    <div>Fourier</div>
  )
}

// {% extends 'base-interactive-tools.html' %}

// {% block tool_title_description %}
// Compute the Fourier Spectra between a window on the waveform
// {% endblock %}

// {% block tool_user_guide %}
// <p>
//     Analyze the Fourier Spectra within a specified seismic record window. Begin by
//     uploading a seismic data file. Then, utilize the <i>signal left side</i> slider and
//     the <i>window length</i> slider to manipulate the position and length of the signal
//     window (highlighted in red). This will allow you to precisely define the
//     section for which you want to compute the Fourier Spectra. For added functionality,
//     you can use the <kbd>add+</kbd> button to compute the Fourier Spectra for
//     a noise window (indicated in blue). By adjusting the <i>Noise window right side</i>
//     slider, you can align the right side of the noise window with the signal
//     window. These two windows will share the same duration or length. To calculate the Fourier
//     spectra for the entire time series, simply click the <kbd>apply</kbd> button,
//     to make the length of the signal window cover all the time series.
// </p>
// <p>
//     Once you're prepared, select the <kbd>Compute Fourier</kbd> button to initiate the computation of the Fourier
//     Spectra at the bottom.
//     Optionally, check the <i>Compute HVSR</i> checkbox to calculate the HVSR curve in addition to the
//     Fourier Spectra. Make sure to select the vertical component of your records to appropriately compute the HVSR curve.
//     The resulting Fourier Spectra and the HVSR curve will be accessible
//     under the <i>Fourier</i> and the <i>HVSR</i> tab at the top, respectively. There, you can opt to
//     download either the graphical representation or the data in ASCII format.
// </p>
// <p>
//     According to the Fourier Spectra calculation you can check the script used <a target="_blank"
//         href="{{ url_for('static', filename='static-files/fourier_spectra_calculation_script.txt') }}">here</a>
// </p>
// <p>
//     According to the HVSR curve, when there are two horizontal components, it is determined by dividing the average
//     horizontal Fourier Spectra by the Fourier
//     Spectra from the vertical component. This average horizontal spectra is computed as the square root of half the sum
//     of the squares of the two horizontal
//     Fourier spectra, i.e., <code>sqrt((hor1^2 + hor2^2) / 2)</code>. When there's one horizontal component and one
//     vertical component, the HVSR curve is simply the result
//     of dividing the horizontal Fourier spectra by the vertical spectra.
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
//     <div class="text-bg-dark rounded p-5 mt-5">
//         <div class="mb-4">
//             <button class="btn btn-outline-info" id="upload-file-button">Upload file</button>
//             <input type="file" id="upload-file-input" value="upload-file-input" name="upload-file-input"
//                 style="display: none;">
//         </div>
//         <ul class="nav nav-tabs" id="myTab" role="tablist">
//             <li class="nav-item" role="presentation">
//                 <button class="nav-link active" id="time-series-tab" data-bs-toggle="tab"
//                     data-bs-target="#time-series-tab-pane" type="button" role="tab" aria-controls="time-series-tab-pane"
//                     aria-selected="true">Time Series</button>
//             </li>
//             <li class="nav-item" role="presentation">
//                 <button class="nav-link" id="fourier-tab" data-bs-toggle="tab" data-bs-target="#fourier-tab-pane"
//                     type="button" role="tab" aria-controls="fourier-tab-pane" aria-selected="false"
//                     disabled>Fourier</button>
//             </li>
//             <li class="nav-item" role="presentation">
//                 <button class="nav-link" id="hvsr-tab" data-bs-toggle="tab" data-bs-target="#hvsr-tab-pane"
//                     type="button" role="tab" aria-controls="hvsr-tab-pane" aria-selected="false" disabled>HVSR</button>
//             </li>
//         </ul>
//         <div class="tab-content" id="graphs-area-fourier">
//             <div class="tab-pane fade show active" id="time-series-tab-pane" role="tabpanel"
//                 aria-labelledby="time-series-tab" tabindex="0">
//                 <div class="row justify-content-center align-items-center"
//                     id="fourier-spectra-start-by-upload-container">
//                     <div class="col text-center">
//                         <p class="fs-3">Start by <button class="btn btn-outline-info"
//                                 id="upload-another-file-button">uploading</button> a seismic data file</p>
//                         <input type="file" id="upload-another-file-input" value="upload-another-file-input"
//                             name="upload-another-file-input" style="display: none;">
//                     </div>
//                 </div>
//                 <div id="time-series-graph">

//                 </div>
//                 <div id="options-menu" class="mt-2 fs-6">
//                     <div class="row g-3 align-items-center justify-content-start">
//                         <div class="col-auto">
//                             <label for="signal-left-side-input" class="col-form-label">Signal window left side</label>
//                         </div>
//                         <div class="col-auto">
//                             <input type="text" maxlength="7" id="signal-left-side-input"
//                                 class="form-control form-control-sm" aria-describedby="signal-left-side-input"
//                                 style="width: 60px">
//                         </div>
//                         <div class="col-auto">
//                             <span>sec</span>
//                         </div>
//                     </div>
//                     <input style="width: 100%" type="range" min="0" max="100" value="50" step="1"
//                         id="signal-window-left-side-slider">
//                     <div class="row g-3 align-items-center justify-content-start">
//                         <div class="col-auto">
//                             <label for="window-length-input" class="col-form-label">Window length</label>
//                         </div>
//                         <div class="col-auto">
//                             <input type="text" maxlength="7" id="window-length-input"
//                                 class="form-control form-control-sm" aria-describedby="window-length-input"
//                                 style="width: 60px">
//                         </div>
//                         <div class="col-auto">
//                             <span>sec</span>
//                         </div>
//                     </div>
//                     <input style="width: 100%" type="range" min="0" max="100" value="50" step="1"
//                         id="window-length-slider">

//                     <div class="row justify-content-start align-items-center  mt-2">
//                         <div class="col-5">
//                             <p>Use the whole time series as the window</p>
//                         </div>
//                         <div class="col-5">
//                             <button id="whole-signal-button" class="btn btn-success">apply</button>
//                         </div>
//                     </div>

//                     <div class="row justify-content-start align-items-center mt-3">
//                         <div class="col-5">
//                             <p>Add a noise window</p>
//                         </div>
//                         <div class="col-5">
//                             <button id="add-noise-button" class="btn btn-success">Add+</button>
//                             <button id="remove-noise-button" class="btn btn-danger">Remove</button>
//                         </div>
//                     </div>

//                     <div id="noise-slider-div">
//                         <div class="row g-3 align-items-center justify-content-start">
//                             <div class="col-auto">
//                                 <label for="noise-right-side-input" class="col-form-label">Noise window right
//                                     side</label>
//                             </div>
//                             <div class="col-auto">
//                                 <input type="text" maxlength="7" id="noise-right-side-input"
//                                     class="form-control form-control-sm" aria-describedby="noise-right-side-input"
//                                     style="width: 60px">
//                             </div>
//                             <div class="col-auto">
//                                 <span>sec</span>
//                             </div>
//                         </div>
//                         <input style="width: 100%" type="range" min="0" max="100" value="50" step="1"
//                             id="noise-window-right-side-slider">
//                     </div>

//                     <div class="row justify-content-center align-items-center mt-5">
//                         <div class="col-auto text-center">
//                             <button class="btn btn-primary p-3" id="computeFourierButton">Compute Fourier</button>
//                         </div>
//                     </div>
//                     <div class="row justify-content-center align-items-center mt-3">
//                         <div class="col-auto text-center">
//                             <div class="form-check">
//                                 <div>
//                                     <input class="form-check-input" type="checkbox" value=""
//                                         id="calculate-hvsr-checkbox" checked>
//                                     <label class="form-check-label" for="calculate-hvsr-checkbox">
//                                         Compute HVSR
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="col-auto text-center">
//                             <span>Vertical component: </span>
//                             <select name="vertical-component-select" id="vertical-component-select" style="width:80px">
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class="tab-pane fade" id="fourier-tab-pane" role="tabpanel" aria-labelledby="fourier-tab" tabindex="1">
//                 <div class="row justify-content-center align-items-center">
//                     <div class="col-12 col-lg-8 text-center">
//                         <div id="fourier-graph">

//                         </div>
//                     </div>
//                     <div class="col-12 col-lg-4 text-center">
//                         <p class="display-6">Download:</p>
//                         <a href="{{ url_for('BP_fourier_spectra.download', what_output='graph-fourier') }}"
//                             class="btn btn-lg btn-primary d-inline">Graph</a>
//                         <a href="{{ url_for('BP_fourier_spectra.download', what_output='data-fourier') }}"
//                             class="btn btn-lg btn-danger d-inline">Data</a>
//                     </div>
//                 </div>
//             </div>
//             <div class="tab-pane fade" id="hvsr-tab-pane" role="tabpanel" aria-labelledby="hvsr-tab" tabindex="2">
//                 <div class="row justify-content-center align-items-center">
//                     <div class="col-12 col-lg-8 text-center">
//                         <div id="hvsr-graph">

//                         </div>
//                     </div>
//                     <div class="col-12 col-lg-4 text-center">
//                         <p class="display-6">Download:</p>
//                         <a href="{{ url_for('BP_fourier_spectra.download', what_output='graph-hvsr') }}"
//                             class="btn btn-lg btn-primary d-inline">Graph</a>
//                         <a href="{{ url_for('BP_fourier_spectra.download', what_output='data-hvsr') }}"
//                             class="btn btn-lg btn-danger d-inline">Data</a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div class="text-center  bg-red text-red mt-3" id="spinner-div">
//             <div class="spinner-border spinner-border-xl text-warning" role="status">
//                 <span class="visually-hidden">Loading...</span>
//             </div>
//         </div>
//     </div>
// </div>
// <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
// <script src="/static/js/fourier.js"></script>
// {% endblock %}