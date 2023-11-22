(()=>{

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

  let excelUploadInput = document.querySelector("#excel-upload-input");
  let csvUploadInput = document.querySelector("#csv-upload-input");
  let txtUploadInput = document.querySelector("#txt-upload-input");

  // get the seismic parameters widgets
  let seismicParamsButton = document.querySelector("#submit-seismic-params-button");
  let stationNameInput = document.querySelector("#station-input");
  let dateInput = document.querySelector("#date-input");
  let timeInput = document.querySelector("#time-input");
  let samplingFrequencyRadio = document.querySelector("#fs-radio");
  let firstComponentSelect = document.querySelector("#compo1");
  let secondComponentSelect = document.querySelector("#compo2");
  let thirdComponentSelect = document.querySelector("#compo3");
  let parameterValue = document.querySelector("#parameter-value");

  // get the spinenr divs 
  fileParsingSpinnerDiv = document.querySelector("#file-parsing-spinner-div");
  seismicParametersSpinnerDiv = document.querySelector("#seismic-parameters-spinner-div");

  let totalTraces;

  // display none to the spinners
  fileParsingSpinnerDiv.style.display = 'none';
  seismicParametersSpinnerDiv.style.display = 'none';





  // when clicked open the file input
  document.querySelector("#excel-upload-button").addEventListener('click', () => {
    excelUploadInput.click()
  })
  document.querySelector("#csv-upload-button").addEventListener('click', () => {
    csvUploadInput.click()
  })
  document.querySelector("#txt-upload-button").addEventListener('click', () => {
    txtUploadInput.click()
  })

  // when the change event happends, open the browse window
  excelUploadInput.addEventListener('change', (ev) => {
    handleFileUpload(ev, "excel");
  });
  csvUploadInput.addEventListener('change', (ev) => {
    handleFileUpload(ev, "csv");
  });
  txtUploadInput.addEventListener('change', (ev) => {
    handleFileUpload(ev, "txt");
  });

  seismicParamsButton.addEventListener("click", submitSeismicParameters);

  function handleFileUpload(event, which) {

    // get the files
    let files = event.target.files;

    // if no file is uploaded return
    if (files.length === 0) {
      return;
    }
    
    // get the uploaded file
    uploaded_file = files[0];

    // activate the spinner
    fileParsingSpinnerDiv.style.display = 'block';

    // create the form data to upload to the POST
    const formData = new FormData();

    // insert the user selected 
    formData.append('file', uploaded_file);
    formData.append('format', which);
    formData.append('rows-to-read', document.querySelector(`#${which}-rows-to-read`).value);
    formData.append('skip-rows', document.querySelector(`#${which}-skiprows`).value);
    formData.append('has-headers', document.querySelector(`#${which}-has-headers`).checked);
    formData.append('columns-to-read', document.querySelector(`#${which}-columns-to-read`).value);

    if (which === 'txt'){
      formData.append('delimiter', document.querySelector('#txt-delimiter').value);
    }

    fetch('/file-to-mseed/read-file', {
      method: 'POST',
      body: formData
    })
    // when i read the file with pandas i convert it to html table with pandas
    // and the response that i return is text. The html is text.
      .then(response => { 
        // if not ok deactivate the spinner and show the modal message
        if (!response.ok) {
            // deactivate spinner
            fileParsingSpinnerDiv.style.display = 'none';

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
      .then(data => { // the data is a dictionary in this form: {'table-html': table_html, 'file-name-uploaded': file_path, "number_of_traces": len(df.columns) }

        // deactivate the spinner
        fileParsingSpinnerDiv.style.display = 'none';
        
        // get the table html
        let tableHTML = data['table-html'];
        
        // define the total traces that the user inserted 2 or 3
        totalTraces = data["number_of_traces"];

        // this is the header that will say that this is the first 5 rows of your file
        let headerTopHTML = `
          <p class="text-center text-secondary fs-3">First five (5) rows of your file</p>
          <hr>
        `;

        // i change the inner html of the table container to be the header and the table
        document.querySelector("#table-container-preview").innerHTML = headerTopHTML + tableHTML ;
        
        // set the upload input value to null so that the user
        // can select the same file
        excelUploadInput.value = null;
        csvUploadInput.value = null;
        txtUploadInput.value = null;

        // if the user inserted 2 traces then disable the second select widget at the components at the seismic parameters and put its dfault value to be "not-selected"
        if (data["number_of_traces"] === 2){
          thirdComponentSelect.disabled = true; 
          thirdComponentSelect.style.backgroundColor = 'grey';
          thirdComponentSelect.value = "not-selected";
        }
        else {
          thirdComponentSelect.disabled = false;
          thirdComponentSelect.style.backgroundColor = 'white';
        }

        // actiate the modal message for a succesful computation
        document.querySelector("#modal-message").textContent = 'The file has been successfully uploaded. Examine the initial five rows at the table below, to ensure that the reading is accurate. If your file does not have any headers, ignore the bold numbers at the columns and the rows. Focus on verifying the table values. If everything appears correct, proceed to complete the seismic parameter entries at the end.';
        document.querySelector("#modal-title").textContent = 'Succesful calculation!';
        document.querySelector("#modal-header").style.backgroundColor = "green";
        document.querySelector("#modal-button-triger").click();

        seismicParamsButton.disabled = false;
        

      })
      .catch(error => { 
        console.error('Error:', error);
      })
      
  }



  function submitSeismicParameters(){
    // activate the spinner
    seismicParametersSpinnerDiv.style.display = 'block';

    queryURL = `/file-to-mseed/convert-file-to-mseed?station=${stationNameInput.value}&date=${dateInput.value}&time=${timeInput.value}&fs-radio=${samplingFrequencyRadio.checked}&parameter-value=${parameterValue.value}&total-traces=${totalTraces}&compo1=${firstComponentSelect.value}&compo2=${secondComponentSelect.value}&compo3=${thirdComponentSelect.value}`;

    fetch(queryURL)
      // when i read the file with pandas i convert it to html table with pandas
      // and the response that i return is text. The html is text.
      .then(response => { 
        // if not ok deactivate the spinner and show the modal message
        if (!response.ok) {
            // deactivate spinner
            seismicParametersSpinnerDiv.style.display = 'none';
        
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
        return response.blob()
      })
      .then(blobData => {
        // deactivate spinner
        seismicParametersSpinnerDiv.style.display = 'none';

        // Get the desired filename and file path from the JSON response
        const blobURL = URL.createObjectURL(blobData);

        // Create a temporary link to initiate the download
        const link = document.createElement('a');
        link.href = blobURL;

        // Set the desired filename for the download
        link.download = "stream-record.mseed"
        link.click();
        
    })
      .catch(error => { 
        console.error('Error:', error);
      })
  }

})();