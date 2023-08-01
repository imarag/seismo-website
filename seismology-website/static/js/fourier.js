// define all the variables
let uploadFileInput = document.querySelector("#upload-file-input");
let uploadAnotherFileInput = document.querySelector("#upload-another-file-input");
let spinnerDiv = document.querySelector("#spinner-div");

let signalLeftSideBadge = document.querySelector("#signal-left-side-badge");
let windowLengthBadge = document.querySelector("#window-length-badge");
let noiseRightSideBadge = document.querySelector("#noise-right-side-badge");

let windowLengthSlider = document.querySelector("#window-length-slider");
let signalWindowLeftSideSlider = document.querySelector("#signal-window-left-side-slider");
let noiseWindowRightSideSlider = document.querySelector("#noise-window-right-side-slider");

let wholeSignalButton = document.querySelector("#whole-signal-button");

let addNoiseButton = document.querySelector("#add-noise-button");
let removeNoiseButton = document.querySelector("#remove-noise-button");
let noiseSliderDiv = document.querySelector("#noise-slider-div");

let timeSeriesTab = document.querySelector("#time-series-tab");
let fourierTab = document.querySelector("#fourier-tab");
let optionsMenu = document.querySelector("#options-menu");


// display none to some elements
optionsMenu.style.display = 'none';
removeNoiseButton.style.display = 'none';
noiseSliderDiv.style.display = 'none';
fourierTab.disabled = true;
timeSeriesTab.disabled = true;
spinnerDiv.style.display = 'none';

// initialize all the parameters that i will use 
let config;
let layout;
// i save the fourier data list because i will use it later when i want to save the figure
let fourierDataList;
// save here to global variables the total min, max X and Y values
let minXValueTotal;
let maxXValueTotal;
let minYValueTotal;
let maxYValueTotal;
// i want to save to a variable the total traces loaded by the user. It can be 2 or 3
let totalTraces;
let noiseWindowAdded = false;

// add the click event on the upload-file and another-file-upload buttons
document.querySelector("#upload-file-button").addEventListener('click', function() {
    uploadFileInput.click();
});

document.querySelector("#upload-another-file-button").addEventListener('click', function() {
    uploadAnotherFileInput.click();
});

// add the change event listeners to the input elements
uploadFileInput.addEventListener('change', (ev) => {
    uploadMseedFile(ev)
})

uploadAnotherFileInput.addEventListener('change', (ev) => {
    uploadMseedFile(ev)
})

// add the click event on the calculate the Fourier button
document.querySelector("#computeFourierButton").addEventListener('click', calculateFourier);


// when you press the time series tab, display=block for the menu and display=none otherwise
timeSeriesTab.addEventListener('click', () => {
    optionsMenu.style.display = 'block';
})

fourierTab.addEventListener('click', () => {
    optionsMenu.style.display = 'none';
})

// call this function when the user uploads a file
function uploadMseedFile(ev) {
    // get all the files
    let files = ev.target.files;
    // if empty return
    if (files.length === 0) {
        return;
    }
    // get the first file
    let mseedFile = files[0];

    // create the formData
    let formData = new FormData();

    // Append the MSeed file to the FormData object
    formData.append('file', mseedFile);

    // activate the spinner
    spinnerDiv.style.display = 'block';

    // clear the Input with type "file" so that the user can re-load the same file
    uploadFileInput.value = null;

    // fetch to the upload-mseed-file in flask and do a POST request
    fetch('/fourier-spectra/upload-mseed-file', {
        method: 'POST',
        body: formData
      })
        .then(response => { 
            // if not ok deactivate the spinner and show the modal message
            if (!response.ok) {
                // deactivate spinner
                spinnerDiv.style.display = 'none';
                return response.json()
                    .then(errorMessage => {
                        document.querySelector("#modal-message").textContent = errorMessage['error_message'];
                        document.querySelector("#modal-title").textContent = 'An error has occured!'
                        document.querySelector("#modal-header").style.backgroundColor = "red";
                        document.querySelector("#modal-button-triger").click()
                        throw new Error(errorMessage);
                    })
              }
            // if ok just return the json response
            return response.json()
        })
        .then(mseedData => {
            // deactivate spinner
            spinnerDiv.style.display = 'none';

            // display none to the initial "start by upload an mseed file" div
            document.querySelector("#fourier-spectra-start-by-upload-container").style.display = "none";

            // display block to the option menu
            optionsMenu.style.display = 'block';

            // rename the dummy paragraph to have the record name
            document.querySelector("#record-name-paragraph").textContent = mseedData["trace-0"]["record-name"];

            // convert the returned json object to a form that i can use to plot the graph
            let convertedMseedData = prepareTracesList(mseedData);
            
            // initialize some parameters
            initializeParameters();

            // create the plot
            createNewPlot(convertedMseedData);
        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
}


function prepareTracesList(mseedDataObject) {
    let xData;
    let yData;
    // append here all the traces in an Object form (check below)
    let tracesList = [];
    let metr = 1;

    // define the colors of the record signals
    let colors = ['#FFF256', '#6495ED', '#FF5677', '#DAF7A6', '#FFFFFF']

    for (tr in mseedDataObject) {
        tracesList.push(
            { 
                x: mseedDataObject[tr]['xdata'], 
                y: mseedDataObject[tr]['ydata'], 
                type: 'scatter', 
                mode: 'lines', 
                name: `${mseedDataObject[tr]['stats']['channel']}` , 
                xaxis:`x${metr}`, 
                yaxis: `y${metr}`,
                line: {color: colors[metr-1], width: 1}
            }
        );
        metr += 1;
    };
    return tracesList;
}



function initializeParameters() {
    
    config = {
        scrollZoom: true,
        responsive: true,
        displayModeBar: true,
        modeBarButtons: [['pan2d', 'zoom2d', 'resetScale2d', 'resetViews', 'toggleSpikelines']]
    };
    
    layout = {
        title: '',
        margin: {
            l: 40,
            r: 15,
            t: 40,
            b: 40
        },
        grid: {rows: 3, columns: 1, pattern: 'independent'},
        plot_bgcolor: '#212529',
        paper_bgcolor: '#212529',
        height: 400,
        shapes: [ ],
        annotations: [],
        legend: {
            orientation: 'h', 
            x: 0.5,           
            y: 1.15,
            xanchor: 'center',
            font: {
            size: 20 // Adjust the font size as desired
            },
        }
    }; 
}


function createNewPlot(tracesList) {
    let subplotIndex = 1;
    totalTraces = tracesList.length;
    // i gather here all the X and Y values to find the min and max to set the limits
    let minMaxXValues = [];
    let minMaxYValues = [];
    for (tr of tracesList) {
        let xArray = tr['x'].map(Number);
        let yArray = tr['y'].map(Number);
        let minXValue = Math.min(...xArray);
        let maxXValue = Math.max(...xArray);
        let minYValue = Math.min(...yArray);
        let maxYValue = Math.max(...yArray);
        minMaxXValues.push(minXValue);
        minMaxXValues.push(maxXValue);
        minMaxYValues.push(minYValue);
        minMaxYValues.push(maxYValue);
    }

    minXValueTotal = Math.min(...minMaxXValues);
    maxXValueTotal = Math.max(...minMaxXValues);
    minYValueTotal = Math.min(...minMaxYValues);
    maxYValueTotal = Math.max(...minMaxYValues);

    // this is how the signal left side and starting window length are gonna be initialized
    let startingSignalLeftSide = maxXValueTotal / 8;
    let startingWindowLength = maxXValueTotal / 10;

    // set the badge
    signalLeftSideBadge.textContent = `${startingSignalLeftSide.toFixed(0)} sec`;
    windowLengthBadge.textContent = `${startingWindowLength.toFixed(0)} sec`;
    
    // create the rectangles (windows)
    for (tr of tracesList) {
        layout.shapes.push(
            {
                type: 'rect',
                x0: startingSignalLeftSide,
                y0: minYValueTotal,
                x1: startingSignalLeftSide + startingWindowLength,
                y1: maxYValueTotal,
                xref:`x${subplotIndex}`, 
                yref: `y${subplotIndex}`,
                fillcolor: "rgba(255, 0, 0, 0.3)",
                line: {
                    color: 'red',
                    width: 2,
                },
                customdata: 'signal'
            }
        );

        subplotIndex += 1;
    }

    
    // set the widgets values
    windowLengthSlider.min = minXValueTotal;
    windowLengthSlider.max = maxXValueTotal;
    windowLengthSlider.step = 1;
    windowLengthSlider.value = startingWindowLength;

    signalWindowLeftSideSlider.min = minXValueTotal;
    signalWindowLeftSideSlider.max = maxXValueTotal;
    signalWindowLeftSideSlider.step = 1;
    signalWindowLeftSideSlider.value = startingSignalLeftSide;
    
    Plotly.newPlot('time-series-graph', tracesList, layout, config);
}




signalWindowLeftSideSlider.addEventListener('input', function() {
    let signalLeftValue = Number(signalWindowLeftSideSlider.value);

    let shapesSignal = layout.shapes.filter(shp => shp.customdata === 'signal');

    for (shp of shapesSignal) {
        shp['x0'] = signalLeftValue;
        shp['x1'] = signalLeftValue + Number(windowLengthSlider.value);
    }
    signalLeftSideBadge.textContent = `${signalLeftValue.toFixed(0)} sec`;
    // signalLeftSideInput.value = signalLeftValue.toFixed(2);


    Plotly.update('time-series-graph', {}, layout);
})


windowLengthSlider.addEventListener('input', function() {
    let signalLeftValue = Number(signalWindowLeftSideSlider.value);
    let windowLengthValue = Number(windowLengthSlider.value);
    windowLengthBadge.textContent = `${windowLengthValue.toFixed(0)} sec`;
    // windowLengthInput.value = windowLengthValue.toFixed(2);
    let shapesSignal = layout.shapes.filter(shp => shp.customdata === 'signal');

    for (shp of shapesSignal) {
        shp['x1'] = signalLeftValue + windowLengthValue;
    }

    if (noiseWindowAdded) {
        let shapesNoise = layout.shapes.filter(shp => shp.customdata === 'noise');
        let noiseRightValue = Number(noiseWindowRightSideSlider.value);
        for (shp of shapesNoise) {
            shp['x0'] = noiseRightValue - windowLengthValue;
        }
    }

    Plotly.update('time-series-graph', {}, layout);
})


wholeSignalButton.addEventListener('click', () => {
    for (shp of layout.shapes) {
        shp['x0'] = minXValueTotal;
        shp['x1'] = maxXValueTotal;
    }
    windowLengthSlider.value = maxXValueTotal - minXValueTotal;
    signalWindowLeftSideSlider.value = minXValueTotal;
    signalLeftSideBadge.textContent = `${minXValueTotal.toFixed(0)} sec`;
    windowLengthBadge.textContent = `${(maxXValueTotal - minXValueTotal).toFixed(0)} sec`;
    Plotly.update('time-series-graph', {}, layout);
})


addNoiseButton.addEventListener('click', () => {
    noiseWindowAdded = true;
    wholeSignalButton.disabled = true;
    addNoiseButton.disabled = true;
    noiseSliderDiv.style.display = "block";
    removeNoiseButton.style.display = 'inline';

    let subplotIndex = 1;
    let windowLengthValue = Number(windowLengthSlider.value);
    for (let i=0; i<totalTraces; i++) {
        layout.shapes.push(
            {
                type: 'rect',
                x0: maxXValueTotal / 8 -  windowLengthValue,
                y0: minYValueTotal,
                x1: maxXValueTotal / 8,
                y1: maxYValueTotal,
                xref:`x${subplotIndex}`, 
                yref: `y${subplotIndex}`,
                fillcolor: "rgba(4, 0, 241, 0.3)",
                line: {
                    color: 'red',
                    width: 2
                },
                customdata: 'noise'
                
            }
        );
        subplotIndex += 1;
    }

    noiseWindowRightSideSlider.min = minXValueTotal;
    noiseWindowRightSideSlider.max = maxXValueTotal;
    noiseWindowRightSideSlider.step = 1;
    noiseWindowRightSideSlider.value = maxXValueTotal / 8;
    noiseRightSideBadge.textContent = `${Number(noiseWindowRightSideSlider.value).toFixed(0)} sec`;

    Plotly.update('time-series-graph', {}, layout);
   
  
})

removeNoiseButton.addEventListener('click', () => {
    noiseWindowAdded = false;
    wholeSignalButton.disabled = false;
    addNoiseButton.disabled = false;
    removeNoiseButton.style.display = 'none';
    noiseSliderDiv.style.display = "none";
    let newLayoutShapes = layout.shapes.filter(shp => shp.customdata != 'noise');
    layout.shapes = newLayoutShapes;
    Plotly.update('time-series-graph', {}, layout);
})


noiseWindowRightSideSlider.addEventListener('input', () => {
    let noiseRightValue = Number(noiseWindowRightSideSlider.value);
    let windowLengthValue = Number(windowLengthSlider.value);
    noiseRightSideBadge.textContent = `${noiseRightValue.toFixed(0)} sec`;

    let shapesNoise= layout.shapes.filter(shp => shp.customdata === 'noise');

    for (shp of shapesNoise) {
        shp['x1'] = noiseRightValue;
        shp['x0'] = noiseRightValue - windowLengthValue;
    }
    Plotly.update('time-series-graph', {}, layout);
})


function downloadFourierOutput(what) {
    // activate the spinner
    spinnerDiv.style.display = 'block';
    fetch(`/fourier-spectra/download?what=${what}`)
        .then(response => { 
            // if not ok deactivate the spinner and show the modal message
            if (!response.ok) {
                // deactivate spinner
                spinnerDiv.style.display = 'none';
              }
            // if ok just return the json response
            return response.blob()
        })
        .then(blobData => {
            
            // deactivate spinner
            spinnerDiv.style.display = 'none';

            // Get the desired filename and file path from the JSON response
            const blobURL = URL.createObjectURL(blobData);

            // Create a temporary link to initiate the download
            const link = document.createElement('a');
            link.href = blobURL;

            // Set the desired filename for the download
            link.download = document.querySelector("#record-name-paragraph").textContent;
            link.click();

        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
}


// downloadDataButton.addEventListener('click', () => {
//     downloadFourierOutput("data")
// });

// downloadGraphButton.addEventListener('click', () => {
//     downloadFourierOutput("graph")
// });



function calculateFourier() {
    // if you click on the compute fourier button, make the fourier spectra tab active so the user can click it and see the result
    fourierTab.disabled = false;
    timeSeriesTab.disabled = false;

    // activate the spinner
    spinnerDiv.style.display = 'block';

    // create the fetch url to handle it on the server
    let fourierFetchURL = `/fourier-spectra/compute-fourier?signal-window-left-side=${signalWindowLeftSideSlider.value}&window-length=${windowLengthSlider.value}&noise-selected=${noiseWindowAdded}&noise-window-right-side=${noiseWindowRightSideSlider.value}`;
    
    fetch(fourierFetchURL)
        .then(response => { 
            // if not ok deactivate the spinner and show the modal message
            if (!response.ok) {
                // deactivate spinner
                spinnerDiv.style.display = 'none';

                return response.json()
                    .then(errorMessage => {
                        document.querySelector("#modal-message").textContent = errorMessage['error_message'];
                        document.querySelector("#modal-title").textContent = 'An error has occured!'
                        document.querySelector("#modal-header").style.backgroundColor = "red";
                        document.querySelector("#modal-button-triger").click()
                        throw new Error(errorMessage);
                    })
            }
            // if ok just return the json response
            return response.json()
        })
        .then(fourierData => {
            // create the fourier graph
            plotFourierData(fourierData)

            // actiate the modal message for a succesful computation
            document.querySelector("#modal-message").textContent = 'The Fourier Spectra has succesfully been calculated. Check the "Fourier Spectra" tab above. ';
            document.querySelector("#modal-title").textContent = 'Succeful calculation!'
            document.querySelector("#modal-header").style.backgroundColor = "green";
            document.querySelector("#modal-button-triger").click()
            
            // deactivate spinner
            spinnerDiv.style.display = 'none';
        })
        .catch(error => {
        // Handle any errors during the upload process
        console.error('Error uploading MSeed file:', error);
        });
}

function plotFourierData(fourierData) {

    fourierDataList = [];
    let metrSignalNoise = 1;
    let colors = ['#5E62FF', '#B9BBFF', '#FFF532', '#FDF89E', '#FE4252', '#FBA3AA']
    let totalTracesFourier = 0;
    let metrColors = 0;

    for (tr in fourierData) {
        let trace_dict = fourierData[tr];
        totalTracesFourier += 1;
        for (signal_noise_key in trace_dict) {
             
            fourierDataList.push(
                { 
                    x: trace_dict[signal_noise_key]['xdata'], 
                    y: trace_dict[signal_noise_key]['ydata'], 
                    type: 'scatter', 
                    mode: 'lines', 
                    name: `${signal_noise_key}, Channel: ${trace_dict[signal_noise_key]['stats']['channel']}` , 
                    xaxis:`x${metrSignalNoise}`, 
                    yaxis: `y${metrSignalNoise}`,
                    line: {color: colors[metrColors], width: 1}
                }
            );
            metrColors +=1;
        }
        metrSignalNoise += 1;
    };

    let configFourier = {
        scrollZoom: true,
        responsive: true,
        displayModeBar: true,
        modeBarButtons: [['pan2d', 'zoom2d', 'resetScale2d', 'resetViews', 'toggleSpikelines']]
    };
    
    layoutFourier = {
        title: '',
        margin: {
            l: 0, // left margin
            r: 0, // right margin
            t: 90, // top margin
            b: 0  // bottom margin
        },
        plot_bgcolor: '#212529',
        paper_bgcolor: '#212529',
        height: 500,
        grid: {rows: 3, columns: 1, pattern: 'independent'},
        shapes: [ ],
        annotations: [],
        legend: {
            orientation: 'h', 
            x: 0.5,           
            y: 1.15,
            xanchor: 'center',
            font: {
            size: 12 // Adjust the font size as desired
            },
        }
    }; 

    for (let ind=1; ind<=totalTracesFourier; ind++) {

        layoutFourier[`xaxis${ind}`] = {
            type: 'log',
            title: 'Frequency (Hz)',
        }

        layoutFourier[`yaxis${ind}`] = {
            type: 'log',
            title: ' ',
        }
    }


    Plotly.newPlot('fourier-graph', fourierDataList, layoutFourier, configFourier);
}




