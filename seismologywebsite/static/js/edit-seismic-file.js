uploadFileInput = document.querySelector("#upload-file-input");
headerPlotContainer = document.querySelector("#header-plot-container");

stationInput = document.querySelector("#station");
componentsInput = document.querySelector("#components");
dateInput = document.querySelector("#date");
timeInput = document.querySelector("#time");
samplingRateInput = document.querySelector("#sampling-rate");
nptsInput = document.querySelector("#npts");


// get the spinner div 
spinnerDiv = document.querySelector("#spinner-div");

// spinner off
spinnerDiv.style.display = 'none';

// display none to the total container
headerPlotContainer.style.display = 'none';

// initialize the config and layout of the time series graph
let config = {
    scrollZoom: true,
    responsive: true,
    displayModeBar: true,
    modeBarButtons: [['pan2d', 'zoom2d', 'resetScale2d', 'resetViews']]
};

let layout;


// when clicked open the file input
document.querySelector("#upload-file-button").addEventListener('click', () => {
    uploadFileInput.click()
})

// when the change event happends, open the browse window
uploadFileInput.addEventListener('change', uploadSeismicFile);


document.querySelector("#update-header-button").addEventListener('click', updateHeader);

// call this function when the user uploads a file
function uploadSeismicFile(ev) {
    // get all the files
    let files = ev.target.files;

    // if empty return
    if (files.length === 0) {
        return;
    }

    // get the first file
    let seismicFile = files[0];

    // create the formData
    let formData = new FormData();

    // Append the MSeed file to the FormData object
    formData.append('file', seismicFile);

    // activate the spinner
    spinnerDiv.style.display = 'block';

    // clear the Input with type "file" so that the user can re-load the same file 
    uploadFileInput.value = null;

    // fetch to the upload-seimsic-file in flask and do a POST request
    fetch('/edit-seismic-file/upload-seismic-file', {
        method: 'POST',
        body: formData
    })
    .then(response => { 
        // if not ok deactivate the spinner and show the modal message
        if (!response.ok) {
            // deactivate spinner
            spinnerDiv.style.display = 'none';

            // get the error json
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
    .then(seismicData => {
        // deactivate spinner
        spinnerDiv.style.display = 'none';

        // display block to the container that contains the header menu and the graph
        headerPlotContainer.style.display = 'block';
        
        // convert the returned json object to a form that i can use to plot the graph
        let convertedSeismicData = prepareTracesList(seismicData);

        // create the plot
        Plotly.newPlot('time-series-graph', convertedSeismicData, layout, config);

        // get the seismic parameter values returned with json from the serrver
        // and assign them to the seismic parameters widgets
        stationInput.value = seismicData["trace-0"]["stats"]["station"]; 
        dateInput.value = seismicData["trace-0"]["stats"]["date"]; 
        timeInput.value = seismicData["trace-0"]["stats"]["time"];
        samplingRateInput.value = seismicData["trace-0"]["stats"]["sampling_rate"]; 
        nptsInput.value = seismicData["trace-0"]["stats"]["npts"];
        // for the components just loop through the trace objects and add the 
        // components to the "componentsText"
        componentsText = '';
        for (tr in seismicData) {
            let channel = seismicData[tr]["stats"]["channel"];
            componentsText += channel + ",";
        }
        // because i add a comma after the channel, the final component will have 
        // a comma at the end. We don't want it
        componentsInput.value = componentsText.slice(0, -1)
        

    })
    .catch(error => {
        // Handle any errors during the upload process
        console.error('Error uploading MSeed file:', error);
    });
}




function prepareTracesList(seismicDataObject) {
    let xData;
    let yData;
    // append here all the traces in an Object form (check below)
    let tracesList = [];
    let metr = 1;

    // define the colors of the record signals
    let colors = ['black', '#6495ED', '#FF5677', '#DAF7A6', '#FFFFFF', '#DBF3A6']

    for (tr in seismicDataObject) {
        tracesList.push(
            { 
                x: seismicDataObject[tr]['xdata'], 
                y: seismicDataObject[tr]['ydata'], 
                type: 'scatter', 
                mode: 'lines', 
                name: `${seismicDataObject[tr]['stats']['channel']}` , 
                xaxis:`x${metr}`, 
                yaxis: `y${metr}`,
                line: {color: colors[metr-1], width: 1}
            }
        );
        metr += 1;
    };

    layout = {
        title: '',
        margin: {
            l: 40,
            r: 15,
            t: 40,
            b: 40
        },
        grid: {rows: tracesList.length, columns: 1, pattern: 'independent'},
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
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

    return tracesList;
}



function updateHeader() {
    // create the fetch url
    let fetchURL = `/edit-seismic-file/update-header?station=${stationInput.value}&date=${dateInput.value}&time=${timeInput.value}&sampling_rate=${samplingRateInput.value}&npts=${nptsInput.value}&components=${componentsInput.value}`;
    
    // fetch to the upload-seimsic-file in flask and do a POST request
    fetch(fetchURL)
    .then(response => { 
        // if not ok deactivate the spinner and show the modal message
        if (!response.ok) {
            // deactivate spinner
            spinnerDiv.style.display = 'none';

            // get the error json
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
    .then(response => {
        
        document.querySelector("#modal-message").textContent = 'You have succesfully updated the header of the seismic file! Use the "Download File" option to download the seismic file with the new header.';
        document.querySelector("#modal-title").textContent = 'Succesful update'
        document.querySelector("#modal-header").style.backgroundColor = "green";
        document.querySelector("#modal-button-triger").click()
        

    })
    .catch(error => {
        // Handle any errors during the upload process
        console.error('Error uploading MSeed file:', error);
    });
}