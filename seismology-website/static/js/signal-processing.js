

let detrendTypeSelect = document.querySelector("#detrend-type-select");
let detrendTypeSelectExpanding = document.querySelector("#detrend-type-select-expanding");
let detrendApplyButton = document.querySelector("#detrend-apply-button");
let detrendApplyButtonExpanding = document.querySelector("#detrend-apply-button-expanding");

let taperTypeSelect = document.querySelector("#taper-type-select");
let taperTypeSelectExpanding = document.querySelector("#taper-type-select-expanding");
let taperSideSelect = document.querySelector("#taper-side-select");
let taperSideSelectExpanding = document.querySelector("#taper-side-select-expanding");
let taperLengthInput = document.querySelector("#taper-length-input");
let taperLengthInputExpanding = document.querySelector("#taper-length-input-expanding");
let taperApplyButton = document.querySelector("#taper-apply-button");
let taperApplyButtonExpanding = document.querySelector("#taper-apply-button-expanding");

let trimLeftSideInput = document.querySelector("#trim-left-side-input");
let trimLeftSideInputExpanding = document.querySelector("#trim-left-side-input-expanding");
let trimRightSideInput = document.querySelector("#trim-right-side-input");
let trimRightSideInputExpanding = document.querySelector("#trim-right-side-input-expanding");
let trimApplyButton = document.querySelector("#trim-apply-button");
let trimApplyButtonExpanding = document.querySelector("#trim-apply-button-expanding");

let processingPillsContainer = document.querySelector("#processing-pills-container");

let spinnerDiv = document.querySelector("#spinner-div");

let uploadFileInput = document.querySelector("#upload-file-input");
let uploadAnotherFileInput = document.querySelector("#upload-another-file-input");

let uploadFileParagraph = document.querySelector("#upload-file-paragraph");

let allFilterPills = [];
let minXValueTotal;
let maxXValueTotal;
let minYValueTotal;
let maxYValueTotal;
let waveformColors = ['#FFF256', '#6495ED', '#FF5677', '#DAF7A6', '#FFFFFF']
let config;
let layout;

spinnerDiv.style.display = 'none';

// define a list that disables and enables them
let disableEnableElements = [
    detrendTypeSelect, detrendTypeSelectExpanding, detrendApplyButton, detrendApplyButtonExpanding,
    taperTypeSelect, taperTypeSelectExpanding, taperSideSelect, taperSideSelectExpanding,
    taperLengthInput, taperLengthInputExpanding, taperApplyButton, taperApplyButtonExpanding,
    trimLeftSideInput, trimLeftSideInputExpanding, trimRightSideInput, trimRightSideInputExpanding,
    trimApplyButton, trimApplyButtonExpanding
];

for (el of disableEnableElements) {
    el.disabled = true;
}

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


detrendTypeSelect.addEventListener('change', () => {
    detrendTypeSelectExpanding.value = detrendTypeSelect.value;
})

detrendTypeSelectExpanding.addEventListener('change', () => {
    detrendTypeSelect.value = detrendTypeSelectExpanding.value;
})

taperTypeSelect.addEventListener('change', () => {
    taperTypeSelectExpanding.value = taperTypeSelect.value;
})

taperTypeSelectExpanding.addEventListener('change', () => {
    taperTypeSelect.value = taperTypeSelectExpanding.value;
})

taperSideSelect.addEventListener('change', () => {
    taperSideSelectExpanding.value = taperSideSelect.value;
})

taperSideSelectExpanding.addEventListener('change', () => {
    taperSideSelect.value = taperSideSelectExpanding.value;
})

taperLengthInput.addEventListener('change', () => {
    taperLengthInputExpanding.value = taperLengthInput.value;
})

taperLengthInputExpanding.addEventListener('change', () => {
    taperLengthInput.value = taperLengthInputExpanding.value;
})

trimLeftSideInput.addEventListener('change', () => {
    trimLeftSideInputExpanding.value = trimLeftSideInput.value;
})

trimLeftSideInputExpanding.addEventListener('change', () => {
    trimLeftSideInput.value = trimLeftSideInputExpanding.value;
})

trimRightSideInput.addEventListener('change', () => {
    trimRightSideInputExpanding.value = trimRightSideInput.value;
})

trimRightSideInputExpanding.addEventListener('change', () => {
    trimRightSideInput.value = trimRightSideInputExpanding.value;
})

detrendApplyButton.addEventListener("click", applyDetrendFilter)
detrendApplyButtonExpanding.addEventListener("click", applyDetrendFilter)

taperApplyButton.addEventListener("click", applyTaperFilter)
taperApplyButtonExpanding.addEventListener("click", applyTaperFilter)

trimApplyButton.addEventListener("click", applyTrimFilter)
trimApplyButtonExpanding.addEventListener("click", applyTrimFilter)



function applyDetrendFilter() {
      
    fetch(`/signal-processing/apply-processing-detrend?detrend-type-select=${detrendTypeSelect.value}`)
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

            // convert the returned json object to a form that i can use to plot the graph
            let convertedMseedData = prepareTracesList(mseedData);
            
            // initialize some parameters
            initializeParameters();

            // create the plot
            createNewPlot(convertedMseedData);

            addPill(`detrend-${detrendTypeSelect.value}`);
        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
}



function applyTaperFilter() {
      
    fetch(`/signal-processing/apply-processing-taper?taper-length-input=${taperLengthInput.value}&taper-side-select=${taperSideSelect.value}&taper-type-select=${taperTypeSelect.value}`)
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

            // convert the returned json object to a form that i can use to plot the graph
            let convertedMseedData = prepareTracesList(mseedData);
            
            // initialize some parameters
            initializeParameters();

            // create the plot
            createNewPlot(convertedMseedData);

            addPill(`taper-${taperTypeSelect.value}-${taperSideSelect.value}-${taperLengthInput.value}`);
        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
}


function applyTrimFilter() {
      
    fetch(`/signal-processing/apply-processing-trim?trim-left-side-input=${trimLeftSideInput.value}&trim-right-side-input=${trimRightSideInput.value}`)
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

            // convert the returned json object to a form that i can use to plot the graph
            let convertedMseedData = prepareTracesList(mseedData);
            
            // initialize some parameters
            initializeParameters();

            // create the plot
            createNewPlot(convertedMseedData);
           
            addPill(`trim-${trimLeftSideInput.value}-${trimRightSideInput.value}`);
        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
}




function addPill(pillText) {
    let newProcessingPillColumn = document.createElement('div');
    newProcessingPillColumn.className = 'col-auto';
    let newProcessingPillButton = document.createElement('button');
    newProcessingPillButton.addEventListener('click', () => {
        deletePillFilter(newProcessingPillColumn, newProcessingPillButton);
    });
    let newProcessingPillSpan = document.createElement('span');
    newProcessingPillButton.className = 'btn btn-primary fs-6';
    newProcessingPillSpan.className = 'ms-1 text-dark fw-bold';
    newProcessingPillButton.textContent = pillText;
    newProcessingPillSpan.textContent = 'X';
    newProcessingPillButton.appendChild(newProcessingPillSpan)
    processingPillsContainer.appendChild(newProcessingPillColumn);
    newProcessingPillColumn.appendChild(newProcessingPillButton);
    allFilterPills.push(newProcessingPillButton);
}


function deletePillFilter(elementToDelete, pillButton) {
    
    let pillText = pillButton.textContent;

    allFilterPills = allFilterPills.filter((bt) => bt !== pillButton);

    let allActiveFiltersString = '';
     allFilterPills.forEach((bt) => {
        allActiveFiltersString += bt.textContent.slice(0, -1) + ' ';
    })
    processingPillsContainer.removeChild(elementToDelete);
    spinnerDiv.style.display = 'block';

    fetch(`/signal-processing/delete-applied-filter?filter=${allActiveFiltersString}`)
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

            let convertedMseedData = prepareTracesList(mseedData);

            createNewPlot(convertedMseedData);
        })
        .catch(error => {

            console.error('Error uploading MSeed file:', error);
        }); 

}


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
    fetch('/signal-processing/upload-mseed-file', {
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

            // activate all elements
            for (el of disableEnableElements) {
                el.disabled = false;
            }
            


            // display none to the initial "start by upload an mseed file" div
            document.querySelector("#signal-processing-start-by-upload-container").style.display = "none";

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
        height: 500,
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


    Plotly.newPlot('time-series-graph', tracesList, layout, config);
}




















// // when the user uploads a file what will happen
// uploadInput.addEventListener('change', function(event) {

//     // display the paragraph with the upload buttons, none
//     uploadFileParagraph.style.display = 'none';

//     // get the first file that the user selected
//     const mseedFile = uploadInput.files[0];
    
//     const chunkSize = 1024 * 1024;
//     let offset = 0;

//     // Create a new FormData object
//     const formData = new FormData();

//     // display block for the spinner while the waveform is being fetched and plotted
//     spinnerDiv.style.display = 'block';

//     // append the file that the user uploaded and a string indicating the page that triggered the mseed upload (check the flask server)
//     formData.append('file', mseedFile);
//     formData.append('view-page', 'signal-processing');

//     // now use a post request to upload the file at the server at the URL /upload-mseed-file
//     fetch('/upload-mseed-file', {
//         method: 'POST',
//         body: formData
//       })
//     .then(response => { 
//         if (response.ok) {
//             return response.json();
//         }
//         else {
//             return response.json().then(data => {
//                 // spinner display none if something wrong
//                 spinnerDiv.style.display = 'none';
//                 throw new Error(data['error-message']);
//             })
//         }
//     })
//     .then(mseedData => {
//         // spinner display block if everything ok
//         spinnerDiv.style.display = 'none';
//         // remove disable condition from form elements
//         allForms.forEach(function(form) {
//             let formElements = form.elements;
//             for (var i = 0; i < formElements.length; i++) {
//               formElements[i].disabled = false;
//             }
//         })
//         createNewPlot(mseedData);
//     })
//     .catch(error => {
//         // show the toast message
//         showToastMessage('Error: ' + error);
//         console.error('Error uploading MSeed file:', error);
//     });
// })

// // create a function to show the toast message
// function showToastMessage(message) {
//     var toastElement = document.querySelector('#liveToast');
//     var toastBodyElement = document.querySelector('#toast-body');
//     toastBodyElement.textContent = message;
//     var toast = new bootstrap.Toast(toastElement);
//     toast.show();
// }


// function applyGETRequest(event) {
//     event.preventDefault(); // Prevent the default form submission
//     let pillText;
//     // get the form that triggered the function
//     let formElement = event.target;
//     // get its action url
//     let formActionURL = new URL(formElement.action);
//     // get just the /my-form-url without the server name attached at the start of the url
//     formActionURL = formActionURL.pathname;
    
//     // create a form data object
//     var formData = new FormData(formElement);
//     // create a query string from the form elements
//     var queryString = new URLSearchParams(formData).toString();
//     // activate the spinner
//     spinnerDiv.style.display = 'block';
    
//     if (formActionURL === '/apply-processing-detrend') {
//         pillText = `detrend-${formData.get('detrend-type-select')}`;
//     }
//     else if (formActionURL === '/apply-processing-taper') {
//         pillText = `taper-${formData.get('taper-type-select')}-${formData.get('taper-side-select')}-${formData.get('taper-length-input')}`;
//     }
//     else {
//         pillText = `trim-${formData.get('trim-left-side-input')}-${formData.get('trim-right-side-input')}`;
//     }
//     console.log(pillText);
//     // do a fetch get request
//     fetch(`${formActionURL}?` + queryString)
//     .then(response => { 
//             if (response.ok) {
//                 let responseData = response.json();
//                 return responseData;
//             }
//             else {
//                 return response.json().then(data => {
//                     // spinner display none if something wrong
//                     spinnerDiv.style.display = 'none';
//                     throw new Error(data['error-message']);
//                 })
//             }
//         })

//         .then(mseedData => {
//             // deactivate spinner
//             spinnerDiv.style.display = 'none';
//             let newProcessingPillColumn = document.createElement('div');
//             newProcessingPillColumn.className = 'col-auto';
//             let newProcessingPillButton = document.createElement('button');
//             newProcessingPillButton.addEventListener('click', () => {
//                 deletePillFilter(newProcessingPillColumn, newProcessingPillButton);
//             });
//             let newProcessingPillSpan = document.createElement('span');
//             newProcessingPillButton.className = 'btn btn-primary fs-6';
//             newProcessingPillSpan.className = 'ms-1 text-dark fw-bold';
//             newProcessingPillButton.textContent = pillText;
//             newProcessingPillSpan.textContent = 'X';
//             newProcessingPillButton.appendChild(newProcessingPillSpan)
//             processingPillsContainer.appendChild(newProcessingPillColumn);
//             newProcessingPillColumn.appendChild(newProcessingPillButton);
//             allFilterPills.push(newProcessingPillButton);
//             createNewPlot(mseedData);
//         })
//         .catch(error => {
//             spinnerDiv.style.display = 'none';
//             // show the toast message
//             showToastMessage('Error: ' + error);
//             console.error('Error uploading MSeed file:', error);
//         });       
// }





// function createNewPlot(mseedDataObject) {

//     config = {
//         scrollZoom: true,
//         responsive: true,
//         displayModeBar: true,
//         modeBarButtons: [['pan2d', 'zoom2d', 'resetScale2d', 'resetViews', 'toggleSpikelines']]
//     };
    
//     layout = {
//         title: '',
//         height: 900,
//         grid: {rows: 3, columns: 1, pattern: 'independent'},
//         shapes: [ ],
//         annotations: [],
//         legend: {
//             font: {
//             size: 20 // Adjust the font size as desired
//             },
//         }
//     };

//     let tracesList = [];
//     let metr = 1;
//     for (tr in mseedDataObject) {
//         tracesList.push(
//             { 
//                 x: mseedDataObject[tr]['xdata'], 
//                 y: mseedDataObject[tr]['ydata'], 
//                 type: 'scatter', 
//                 mode: 'lines', 
//                 name: `Channel: ${mseedDataObject[tr]['stats']['channel']}`, 
//                 xaxis:`x${metr}`, 
//                 yaxis: `y${metr}`,
//                 line: {color: waveformColors[metr-1]}
//             }
//     );
//         metr += 1;
//     };

//     Plotly.newPlot('graph', tracesList, layout, config);
// }


















































// detrendButton.addEventListener('click', () => { 
//     processGETRequest(
//         'detrend', {"detrend-type": detrendType.value}
//     ) 
// });
// taperButton.addEventListener('click', () => { 
//     processGETRequest(
//         'taper', {"taper-type": taperType.value, "taper-side": taperSide.value, "taper-length": taperLength.value}
//     ) 
// });
// trimButton.addEventListener('click', () => { 
//     processGETRequest(
//         'trim', {"trim-left-side": trimLeftSide.value, "trim-right-side": trimRightSide.value}
//     ) 
// });



// function processGETRequest(method, methodObject) {
//     console.log(methodObject);
//     let URLFromObject = '';
//     for (item in methodObject) {
//         URLFromObject += `&${item}=${methodObject[item]}`;
//     }
//     console.log(URLFromObject);
//     fetch(`/apply-processing?method=${method}&${URLFromObject}`)
//     .then(response => { 
//         if (response.ok) {
//             return response.json();
//         }
//         else {
//             return response.json().then(data => {
//                 spinnerDiv.style.display = 'none';
//                 alert('Error: ' + data['error-message']);
//                 throw new Error(data['error-message']);
//             })
//         }
//     })
//     .then(mseedData => {
//         spinnerDiv.style.display = 'none';
//         if (mseedData['warning-message']) {
//             alert('Warning: ' + mseedData['warning-message']);
//         }

//         let convertedMseedData = prepareTracesList(mseedData);
//         initializeParameters();
//         createNewPlot(convertedMseedData);
//     })
//     .catch(error => {
//       // Handle any errors during the upload process
//       console.error('Error uploading MSeed file:', error);
//     });
// }






























// function sendPostRequest(postObject) {
//     fetch("/update-stream-json-file", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(postObject)
//         })
//     .then(() => {
//             console.log('JSON file updated successfully');
//             plotData();
//         })
//     .catch(error => {
//             console.error('Error:', error);
//         });
//     }


// function plotData() {
//     fetch("/get-stream-json-file")
//         .then(response => {
//             if (response.ok) {
//                 return response.json();  // Assuming the response is JSON
                
//             } else {
//                 throw new Error('Request failed');
//             }
//         })
//         .then(data => {
        
//             let traces_list = [];
//             let x_time = [];
//             let fs = data["trace-0"]['stats']['sampling_rate'];

//             let N = data["trace-0"]["data"].length;
//             let Delta = N / fs;
//             let dt = 1 / fs;
//             for (let i=0; i<Delta; i=i+dt) {
//                 x_time.push(i);
//             }
//             let metr = 1;
//             for (k in data) {
//                 traces_list.push({ x: x_time, y: data[k]['data'], type: 'scatter', mode: 'lines', name: `Channel: ${data[k]['stats']['channel']}` , xaxis:`x${metr}`, yaxis: `y${metr}`});
//                 metr += 1;
//             }
//             console.log(data);
            
//             var layout = {
//                 title: 'Line Chart Subplots',
//                 grid: { rows: 3, columns: 1, pattern: 'independent' },
//                 height: 900
//                 };

//             Plotly.newPlot('chart', traces_list, layout);

//         })
//         .catch(error => {
//             console.error(error);
//         });
// }

