(()=>{

  // i do this for the popover
  let popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  let popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

  // get the upload file input and button
  let uploadFileInput = document.querySelector("#upload-file-input");
  let uploadFileButton = document.querySelector("#upload-file-button");

  let stationNameInput = document.querySelector("#station-input");
  let dateInput = document.querySelector("#date-input");
  let timeInput = document.querySelector("#time-input");
  let samplingFrequencyRadio = document.querySelector("#fs-radio");
  let parameterValue = document.querySelector("#parameter-value");

  // get the  components
  let firstComponentSelect = document.querySelector("#compo1");
  let secondComponentSelect = document.querySelector("#compo2");
  let thirdComponentSelect = document.querySelector("#compo3");

  // get the spinenr div 
  spinnerDiv = document.querySelector("#spinner-div");

  let totalTraces;

  // display none to the spinner
  spinnerDiv.style.display = 'none';





  // when clicked open the file input
  uploadFileButton.addEventListener('click', () => {
    uploadFileInput.click()
  })

  // when the change event happends, open the browse window
  uploadFileInput.addEventListener('change', handleFileUpload);

  document.querySelector("#submit-seismic-params-button").addEventListener("click", submitSeismicParameters);

  function handleFileUpload(event) {

    // get the files
    let files = event.target.files;

    // if no file is uploaded return
    if (files.length === 0) {
      return;
    }
    
    // get the uploaded file
    uploaded_file = files[0];

    // activate the spinner
    spinnerDiv.style.display = 'block';

    // create the form data to upload to the POST
    const formData = new FormData();

    // insert the user selected 
    formData.append('file', uploaded_file);
    formData.append('delimiter', document.querySelector("#delimiter-select").value);
    formData.append('rows-to-read', document.querySelector("#number-of-rows-to-read-input").value);
    formData.append('skip-rows', document.querySelector("#skiprows-input").value);
    formData.append('has-headers', document.querySelector("#has-headers-checkbox").checked);
    formData.append('columns-to-read', document.querySelector("#columns-to-read-input").value);


    fetch('/ascii-to-mseed/read-ascii-file', {
      method: 'POST',
      body: formData
    })
    // when i read the file with pandas i convert it to html table with pandas
    // and the response that i return is text. The html is text.
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
      .then(data => { // the data is a dictionary in this form: {'table-html': table_html, 'file-name-uploaded': file_path, "number_of_traces": len(df.columns) }

        // get the table html
        let tableHTML = data['table-html'];

        // define the total traces that the user inserted 2 or 3
        totalTraces = data["number_of_traces"];

        // deactivate the spinner
        spinnerDiv.style.display = 'none';

        // this is the header that will say that this is the first 5 rows of your file
        let headerTopHTML = `
          <p class="text-center text-secondary fs-3">First five (5) rows of your file</p>
          <hr>
        `;
        // i change the inner html of the table container to be the header and the table
        document.querySelector("#table-container-preview").innerHTML = headerTopHTML + tableHTML ;
        
        // set the upload input value to null so that the user
        // can select the same file
        uploadFileInput.value = null;

        // activate the seismic parameters set fieldset
        document.querySelector("#submit-form-fieldset").disabled = false;

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
        document.querySelector("#modal-message").textContent = 'The ASCII file is uploaded. See below for the first five rows of it to check if is correctly read. Do not worry about bold numbers at the table. Just check the other values. If yes, continue to fill the seismic parameters at the end.';
        document.querySelector("#modal-title").textContent = 'Succeful calculation!';
        document.querySelector("#modal-header").style.backgroundColor = "green";
        document.querySelector("#modal-button-triger").click();
        

      })
      .catch(error => { 
        console.error('Error:', error);
      })
      
  }



  function submitSeismicParameters(){
    // activate the spinner
    spinnerDiv.style.display = 'block';

    queryURL = `/ascii-to-mseed/convert-ascii-to-mseed?station=${stationNameInput.value}&date=${dateInput.value}&time=${timeInput.value}&fs-radio=${samplingFrequencyRadio.checked}&parameter-value=${parameterValue.value}&total-traces=${totalTraces}&compo1=${firstComponentSelect.value}&compo2=${secondComponentSelect.value}&compo3=${thirdComponentSelect.value}`;
    console.log(queryURL);
    fetch(queryURL)
      // when i read the file with pandas i convert it to html table with pandas
      // and the response that i return is text. The html is text.
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
        return response.blob()
      })
      .then(blobData => {
        // deactivate spinner
        spinnerDiv.style.display = 'none';
        console.log('ok');
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