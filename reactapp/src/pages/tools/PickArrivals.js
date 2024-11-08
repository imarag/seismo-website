import React from 'react'

export default function PickArrivals() {
  return (
    <div>PickArrivals</div>
  )
}

// {% extends 'base-interactive-tools.html' %}

// {% block tool_title_description %}
// Select the P & S wave arrivals
// {% endblock %}


// {% block tool_user_guide %}
// <p>
//     Begin by uploading a seismic data file using the <kbd>Upload</kbd> option. From the top menu, select either the
//     P-wave
//     (<kbd>P</kbd> button) or S-wave (<kbd>S</kbd> button) option, then click anywhere on the waveforms to select the
//     arrival time of the chosen wave. To remove a previously applied arrival time, use the <kbd>del P</kbd> and
//     <kbd>del S</kbd> buttons. Feel free to utilize the filter dropdown in the top menu to apply a pre-defined filter to
//     the waveforms, which can facilitate your picking process. Additionally, you have the option to manually input a
//     filter
//     using the entry boxes located at the bottom right corner. If you input a value only in the left entry box, a
//     highpass
//     filter will be applied with the specified frequency. Similarly, you input a value only in the right entry box, a
//     lowpass filter will be implemented using the specified frequency. If both entry boxes are filled, a bandpass
//     filter will be applied. Once the mouse focus is in the left or right entry box, simply press the <kbd>Enter</kbd>
//     key to
//     confirm your input and apply the manual filters. Lastly, utilize the options located at the top right corner of the
//     plot to zoom in, zoom out, and adjust the position of the waveforms.
// </p>
// <p>Take into account the following:</p>
// <ul>
//     <li>Trace: Represents a single continuous seismic recording with a specific channel (e.g., E, N, or Z). It contains
//         the waveform data and metadata, such as sampling rate, start date, channel information, and more.</li>
//     <li>Stream: A collection of one or more "Trace" objects, representing a continuous sequence of seismic traces
//         recorded over a period of time.</li>
//     <li>The program saves the arrivals as seconds from the start date of the record. It will automatically generate a
//         file with the selected arrival values, naming it based on the start date and station name (e.g.,
//         20150724_095834_KRL1).</li>
//     <li>Due to the above requirements, ensure your seismic data file includes both the start date and the station name
//         for each record. If not, a default start date and station name will be considered as "1970-01-01 00:00:00" and
//         "STATION" respectively.</li>
//     <li>Your seismic data file should contain 2 or 3 traces. The scenario with 2 traces can occur if you have one
//         horizontal and one vertical component record.</li>
//     <li>It's necessary to define either the sampling frequency (fs) or the sample distance (dt) in your seismic data
//         file, with at least one present. This ensures a correct time axis representation while picking the arrivals.
//     </li>
//     <li>Each trace in your seismic data file should have its channel defined. This information is essential for
//         selecting the arrivals on the respective trace.</li>
// </ul>
// <p>If you are not sure about the exact seismic parameters contained inside your file, just try to upload it and a
//     respective error message will be displayed (if any).</p>
// <p>Use the following shortcuts to facilitate the picking:</p>
// <h1 class="fs-3 text-center my-5">Mouse shortcuts</h1>
// <ul>
//     <li><b>Left mouse Button</b>: Hold the left mouse pressed, to select the desired area to view</li>
//     <li><b>Scroll Wheel</b>: Use the scroll wheel to zoom in and out of a specific area in the seismogram</li>
// </ul>
// <h1 class="fs-3 text-center my-5">Upper right menu</h1>
// <ul>
//     <li><b>Pan</b>: Use the <kbd>Pan</kbd> option to move (pan) the figure to all directions</li>
//     <li><b>Zoom-in</b>: Utilize the <kbd>Zoom in</kbd> option to zoom into the seismogram</li>
//     <li><b>Zoom-out</b>: Utilize the <kbd>Zoom out</kbd> option to zoom out of the seismogram</li>
//     <li><b>Reset axis</b>: Select the <kbd>Reset axes</kbd> option to reset the x and y axis, to its initial limits</li>
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
//     <div style="position: relative;">
//         <div class="row bg-dark2 p-3 mt-5">
//             <div class="col">
//                 <button class="btn btn-outline-info me-3" id="upload-file-button">Upload</button>
//                 <input type="file" id="upload-file-input" style="display:none;">
//                 <button class="btn btn-outline-success" id="save-arrivals-button" disabled>Save arrivals</button>
//             </div>
//         </div>
//         <div class="row bg-dark p-2 align-items-center">
//             <div class="col-3 text-center text-end">
//                 <label for="p-wave-radio" class="text-secondary fs-3">P</label>
//                 <input type="radio" id="p-wave-radio" class="me-2" name="ps-wave-radio" checked disabled>
//                 <label for="s-wave-radio" class="text-secondary fs-3">S</label>
//                 <input type="radio" id="s-wave-radio" name="ps-wave-radio" disabled>
//             </div>
//             <div class="col-4 text-start">
//                 <button class="btn btn-danger" id="remove-p-wave-button" disabled>del P</button>
//                 <button class="btn btn-danger" id="remove-s-wave-button" disabled>del S</button>
//             </div>
//             <div class="col-5 col-sm-4 col-md-3 col-lg-3 col-xl-2 text-center">
//                 <select class="form-select" aria-label="filter-dropdown" id="filters-dropdown" disabled>
//                     <option disabled>--select a filter--</option>
//                     <option selected>initial</option>
//                     <option>1-2</option>
//                     <option>1-3</option>
//                     <option>1-5</option>
//                     <option>1-10</option>
//                     <option>0.1-10</option>
//                 </select>
//             </div>
//         </div>
//         <div class="row bg-secondary border-start border-end border-dark border-5">
//             <div class="col-12 text-center" id="picking-graph-container">

//             </div>
//         </div>
//         <div class="row bg-dark mb-5 py-2 justify-content-end">
//             <div class="col-auto">
//                 <input class="rounded form-control-sm" type="text" id="left-filter-input" placeholder="eg. 0.1"
//                     disabled>
//             </div>
//             <div class="col-auto">
//                 <input class="rounded form-control-sm" type="text" id="right-filter-input" placeholder="eg. 1" disabled>
//             </div>
//         </div>
//         <div id="spinner-div" style="position: absolute; top: 50%; left: 50%;">
//             <div class="text-center">
//                 <div class="spinner-border my-3 text-warning" role="status">
//                     <span class="visually-hidden">Loading...</span>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>
// <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
// <script src="/static/js/pick-arrivals.js"></script>
// {% endblock %}