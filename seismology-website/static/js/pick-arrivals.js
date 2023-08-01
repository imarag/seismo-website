
let uploadFileInput = document.querySelector('#upload-file-input');
let filtersDropdown = document.querySelector("#filters-dropdown");
let leftFilterEntry = document.querySelector("#left-filter-input");
let rightFilterEntry = document.querySelector("#right-filter-input");
let removePWaveButton = document.querySelector("#remove-p-wave-button");
let removeSWaveButton = document.querySelector("#remove-s-wave-button");
let PWaveRadio = document.querySelector("#p-wave-radio");
let SWaveRadio = document.querySelector("#s-wave-radio");
let saveArrivals = document.querySelector("#save-arrivals-button");
let spinnerDiv = document.querySelector("#spinner-div");

let listDisabled = [
    PWaveRadio, SWaveRadio, saveArrivals, 
    leftFilterEntry, rightFilterEntry, filtersDropdown
];

for (el of listDisabled) {
    el.disabled = true;
}

let verticalLinesList;
let annotationsList;   
let wavesPicked;
let PSArrivalValues;

removePWaveButton.style.display = 'none';
removeSWaveButton.style.display = 'none';

document.querySelector("#upload-file-button").addEventListener('click', function() {
    uploadFileInput.click();
});

uploadFileInput.addEventListener('change', (ev) => {
    let files = ev.target.files;

    if (files.length === 0) {
        return;
    }

    let mseedFile = files[0];

    // create the formData
    let formData = new FormData();

    // Append the MSeed file to the FormData object
    formData.append('file', mseedFile);

    // activate the spinner
    spinnerDiv.style.display = 'block';

    // clear the Input with type "file" so that the user can re-load the same file
    uploadFileInput.value = null;

    fetch('/pick-arrivals/upload-mseed-file', {
        method: 'POST',
        body: formData
      })
        .then(response => { 

            if (!response.ok) {
                // deactivate spinner
                spinnerDiv.style.display = 'none';
                return response.json()
                    .then(errorMessage => {
                        document.querySelector("#modal-message").textContent = errorMessage['error_message'];
                        document.querySelector("#modal-title").textContent = 'An error has occured!'
                        document.querySelector("#modal-header").style.backgroundColor = "red";
                        document.querySelector("#model-button-triger").click()
                        throw new Error(errorMessage);
                    })
              }
            
            return response.json()
        })
        .then(mseedData => {
            // deactivate spinner
            spinnerDiv.style.display = 'none';

            // rename the dummy paragraph to have the record name
            document.querySelector("#record-name-paragraph").textContent = mseedData["trace-0"]["record-name"];

            // convert returned json object to a form that i can use to plot the graph
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
})


filtersDropdown.addEventListener('change', () => {
    applyFilterPost(filtersDropdown.value);
})

leftFilterEntry.addEventListener('keydown', (e) => {
    if (e.key == "Enter"){ 
        applyFilterPost(leftFilterEntry.value + '-' + rightFilterEntry.value);
    }
})

rightFilterEntry.addEventListener('keydown', (e) => {
    if (e.key == "Enter"){ 
        applyFilterPost(leftFilterEntry.value + '-' + rightFilterEntry.value);
    }
})


function applyFilterPost(filterValue) {
    // activate the spinner
    spinnerDiv.style.display = 'block';

    fetch(`/pick-arrivals/apply-filter?filter=${filterValue}`)
    .then(response => {
        if (!response.ok) {
            // deactivate the spinner
            spinnerDiv.style.display = 'none';

            return response.json()
                .then(errorMessage => {
                    document.querySelector("#modal-message").textContent = errorMessage['error_message'];
                    document.querySelector("#modal-header").style.backgroundColor = "red";
                    document.querySelector("#modal-title").textContent = 'An error has occured!'
                    document.querySelector("#model-button-triger").click();
                    throw new Error(errorMessage);
                })
        }
        return response.json()
    })
    .then(mseedData => {
        // deactivate the spinner
        spinnerDiv.style.display = 'none';

        // get the mseed and convert them to plot them
        let convertedMseedData = prepareTracesList(mseedData);
        
        // create the plot
        createNewPlot(convertedMseedData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function initializeParameters() {
    verticalLinesList  = [];
    annotationsList = [];   
    wavesPicked = [];
    PSArrivalValues = {P: null, S: null};
    removePWaveButton.style.display = 'none';
    removeSWaveButton.style.display = 'none';
    filtersDropdown.value = 'initial';
    leftFilterEntry.value = '';
    rightFilterEntry.value = '';
    PWaveRadio.checked = true;

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
        shapes: [ ],
        annotations: [],
        legend: {
            font: {
            size: 20 // Adjust the font size as desired
            },
        }
    };

    for (el of listDisabled) {
        el.disabled = false;
    }
}


function prepareTracesList(mseedDataObject) {
    let xData;
    let yData;
    let tracesList = [];
    let metr = 1;
    let colors = ['#3e3efa', '#f5e027', '#77f754'];

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
                line: {color: colors[metr-1]}
            }
    );
        metr += 1;
    };
    return tracesList;
}



function createNewPlot(tracesList) {
    
    Plotly.newPlot('picking-graph-container', tracesList, layout, config).then(function(graph) {

        graph.on('plotly_doubleclick', function() {
            Plotly.d3.event.preventDefault();
        }).on('plotly_click', function(data) {
            const xClick = data.points[0].x;

            if (wavesPicked.length === 2) {
                return;
            }

            let currentSelectedWave;
            if (PWaveRadio.checked){
                PWaveRadio.disabled = true;
                wavesPicked.push('P');
                PSArrivalValues['P'] = xClick;
                removePWaveButton.style.display = 'inline';
                SWaveRadio.checked = true;
                currentSelectedWave = 'P';
            }
            else {
                SWaveRadio.disabled = true;
                wavesPicked.push('S');
                PSArrivalValues['S'] = xClick;
                removeSWaveButton.style.display = 'inline';
                PWaveRadio.checked = true;
                currentSelectedWave = 'S';
            }
            
            for (let i=0; i<tracesList.length; i++) {
                let yValues = tracesList[i]["y"].map(value => Number(value));
                let yMin = Math.min(...yValues);
                let yMax = Math.max(...yValues);


                verticalLinesList.push(
                    {
                        type: 'line',
                        x0: xClick,
                        x1: xClick,
                        y0: yMin,
                        y1: yMax,
                        xref: `x${i+1}`,
                        yref: `y${i+1}`,
                        which: currentSelectedWave,
                        line: {color: 'black', width: 3.3, dash: 'dot'}
                    }
                );
            
            annotationsList.push(
                {
                    x: xClick,
                    y: yMax/1.5,
                    xref: `x${i+1}`,
                    yref: `y${i+1}`,
                    text: currentSelectedWave,
                    which: currentSelectedWave,
                    showarrow: false,
                    font: {
                        color: 'black', 
                        size: 25, 
                    },
                    borderwidth: 0,
                    borderpad: 2,
                    bgcolor: '#3fcafc',
                    opacity: 0.9
                });
            }


            Plotly.relayout('picking-graph-container', {
            shapes: verticalLinesList, annotations: annotationsList
            }, config)

        });
    })
}




removePWaveButton.addEventListener('click', () => {
    
    removePWaveButton.style.display = 'none';
    PWaveRadio.disabled = false;
    PWaveRadio.checked = true;

    PSArrivalValues['P'] = null;
    
    wavesPicked = wavesPicked.filter(item => item !== 'P');

    let newVerticalLinesList = [];
    let newAnnotationsList = [];

    verticalLinesList.forEach(function(item, index){
    if (item.which != 'P') {
        newVerticalLinesList.push(item);
    }
    });
    
    annotationsList.forEach(function(item, index){
    if (item.which != 'P') {
        newAnnotationsList.push(item);
    }
    });

    verticalLinesList = newVerticalLinesList;
    annotationsList = newAnnotationsList;

    Plotly.relayout('picking-graph-container', {
        shapes: verticalLinesList, annotations: annotationsList
    }, config)

});

removeSWaveButton.addEventListener('click', () => {
    removeSWaveButton.style.display = 'none';
    SWaveRadio.disabled = false;
    SWaveRadio.checked = true;
    
    PSArrivalValues['S'] = null;

    wavesPicked = wavesPicked.filter(item => item !== 'S');

    if (wavesPicked.length === 0) {
        PWaveRadio.disabled = false;
        SWaveRadio.disabled = false;
    }

    let newVerticalLinesList = [];
    let newAnnotationsList = [];

    verticalLinesList.forEach(function(item, index){
    if (item.which != 'S') {
        newVerticalLinesList.push(item);
    }
    });
    
    annotationsList.forEach(function(item, index){
    if (item.which != 'S') {
        newAnnotationsList.push(item);
    }
    });

    verticalLinesList = newVerticalLinesList;
    annotationsList = newAnnotationsList;

    Plotly.relayout('picking-graph-container', {
    shapes: verticalLinesList, annotations: annotationsList
    }, config)
});



saveArrivals.addEventListener('click', () => {

    // activate the spinner
    spinnerDiv.style.display = 'block';
    
    fetch(`/pick-arrivals/save-arrivals?Parr=${PSArrivalValues["P"]}&Sarr=${PSArrivalValues["S"]}`)
        .then(response => { 

            if (!response.ok) {
                // deactivate spinner
                spinnerDiv.style.display = 'none';
                return response.json()
                    .then(errorMessage => {
                        document.querySelector("#modal-message").textContent = errorMessage['error_message'];
                        document.querySelector("#modal-header").style.backgroundColor = "red";
                        document.querySelector("#modal-title").textContent = 'An error has occured!'
                        document.querySelector("#model-button-triger").click();
                        throw new Error(errorMessage);
                    })
              }
            
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
            link.download = document.querySelector("#record-name-paragraph").textContent + ".txt";
            link.click();
            
        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
    
})





