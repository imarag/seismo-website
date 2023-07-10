
let removePWaveButton = document.querySelector("#remove-p-wave-button");
let removeSWaveButton = document.querySelector("#remove-s-wave-button");
let PWaveRadio = document.querySelector("#p-wave-radio");
let SWaveRadio = document.querySelector("#s-wave-radio");
let filtersDropdown = document.querySelector("#filters-dropdown");
let leftFilterEntry = document.querySelector("#left-filter-input");
let rightFilterEntry = document.querySelector("#right-filter-input");
let uploadFileInput = document.querySelector('#upload-file-input');
let saveArrivals = document.querySelector("#save-arrivals-button");
let spinnerDiv = document.querySelector("#spinner-div");

let verticalLinesList;
let annotationsList;
let annotationsText = ['P', 'S'];
let PSArrivalValues;
let wavesPicked;
let layout;
let config;

let listDisabled = [
    PWaveRadio, SWaveRadio, saveArrivals, leftFilterEntry, rightFilterEntry, filtersDropdown
];

document.querySelector("#upload-file-button").addEventListener('click', function() {
    uploadFileInput.click();
});

uploadFileInput.addEventListener('change', (ev) => {
    const fileInput = ev.target;
    const files = fileInput.files;

    if (files.length === 0) {
        return
    }

    const mseedFile = files[0];

    // create the formData
    let formData = new FormData();

    // Append the MSeed file to the FormData object
    formData.append('file', mseedFile);

    // activate the spinner
    spinnerDiv.style.display = 'block';

    fetch('/pick-arrivals/upload-mseed-file', {
        method: 'POST',
        body: formData
      })
        .then(response => { 
            // clear the Input with type "file" so that the user can re-load the same file
            uploadFileInput.value = null;

            if (!response.ok) {
                return response.json().then(errorMessage => {
                    document.querySelector("#modal-message").textContent = errorMessage['error_message'];
                    document.querySelector("#modal-title").textContent = 'An error has occured!'
                    document.querySelector("#model-button-triger").click()
                    throw new Error(errorMessage);
                })
              }
              return response.json()
        })
        .then(mseedData => {
            // deactivate spinner
            spinnerDiv.style.display = 'none';
            // here i change the value of this dummy paragraph so that i save the filename path
            // because i don't want to recompute the datetime.now()
            let convertedMseedData = prepareTracesList(mseedData);
            initializeParameters();
            createNewPlot(convertedMseedData);
            uploadFileInput.value = null;
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



saveArrivals.addEventListener('click', function() {
    if (!PSArrivalValues['P'] && !PSArrivalValues['S']) {
        alert("You must select at least one arrival to use this option!");
    }
    else {
        let text = `The arrivals saved are: P --> ${PSArrivalValues['P']} and S --> ${PSArrivalValues['S']}`
        alert(text);
    }
})


removePWaveButton.addEventListener('click', () => {
    
    removePWaveButton.disabled = true;
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
    removeSWaveButton.disabled = true;
    
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


function prepareTracesList(mseedDataObject) {
    let xData;
    let yData;
    let tracesList = [];
    let metr = 1;

    for (tr in mseedDataObject) {
        // in the server i also return the mseed file path. I dont want to use this here
        if (tr === 'file-location-path') {
            continue
        }
        console.log(mseedDataObject, tr);
        tracesList.push(
            { 
                x: mseedDataObject[tr]['xdata'], 
                y: mseedDataObject[tr]['ydata'], 
                type: 'scatter', 
                mode: 'lines', 
                name: `Channel: ${mseedDataObject[tr]['stats']['channel']}` , 
                xaxis:`x${metr}`, 
                yaxis: `y${metr}`,
                line: {color: '#367AFA'}
            }
    );
        metr += 1;
    };
    return tracesList;
}



function applyFilterPost(filterValue) {
    spinnerDiv.style.display = 'block';
    fetch(`/pick-arrivals/apply-filter?filter=${filterValue}`)
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorMessage => {
                document.querySelector("#modal-message").textContent = errorMessage['error_message'];
                document.querySelector("#modal-title").textContent = 'An error has occured!'
                document.querySelector("#model-button-triger").click();
                spinnerDiv.style.display = 'none';
                throw new Error(errorMessage);
            })
          }
        return response.json()
        
    })
    .then(mseedData => {
            spinnerDiv.style.display = 'none';
            let convertedMseedData = prepareTracesList(mseedData);
            createNewPlot(convertedMseedData);
        })
    .catch(error => {
            console.error('Error:', error);
        });
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
                currentSelectedWave = 'P';
            }
            else {
                currentSelectedWave = 'S';
            }

            if (currentSelectedWave === 'P') {
                PWaveRadio.disabled = true;
                wavesPicked.push('P');
                PSArrivalValues['P'] = xClick;
            }
            else {
                SWaveRadio.disabled = true;
                wavesPicked.push('S');
                PSArrivalValues['S'] = xClick;
            }

            if (wavesPicked.length === 2) {
                PWaveRadio.disabled = true;
                SWaveRadio.disabled = true; 
            }

            
            for (let i=0; i<tracesList.length; i++) {
                const yValues = tracesList[i]["y"].map(value => Number(value));
                const yMin = Math.min(...yValues);
                const yMax = Math.max(...yValues);
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
                    line: {color: 'black', width: 4}
                });
            
            annotationsList.push(
                {
                    x: xClick-2,
                    y: yMax/1.5,
                    xref: `x${i+1}`,
                    yref: `y${i+1}`,
                    text: currentSelectedWave,
                    which: currentSelectedWave,
                    showarrow: false,
                    font: {color: 'red', size: 40}
                });
            }


            Plotly.relayout('picking-graph-container', {
            shapes: verticalLinesList, annotations: annotationsList
            }, config)

            if (currentSelectedWave == 'P') {
                currentSelectedWave = 'S';
                removePWaveButton.disabled = false;
            }
            else {
                currentSelectedWave = 'P';
                removeSWaveButton.disabled = false;
            }

        });
    })
}

