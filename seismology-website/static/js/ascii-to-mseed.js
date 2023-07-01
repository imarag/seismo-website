
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

let uploadFileButton = document.querySelector("#upload-file-button");
let submitFormFieldset = document.querySelector("#submit-form-fieldset");
let tableContainerPreview = document.querySelector("#table-container-preview");

let delimiterElement = document.querySelector("#delimiter-select");
let rowsToReadElement = document.querySelector("#number-of-rows-to-read-input");
let skipRowsElement = document.querySelector("#skiprows-input");
let hasHeadersElement = document.querySelector("#has-headers-checkbox");
let columnsToReadElement = document.querySelector("#columns-to-read-input");

let modalMessage = document.querySelector("#modal-message");
let modalTitle = document.querySelector("#modal-title");
let modelButtonTriger = document.querySelector("#model-button-triger");

uploadFileButton.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {

  let files = event.target.files;
  let uploaded_file;

  // if no file is uploaded return
  if (files.length === 0) {
    return;
  }
  else {
    uploaded_file = files[0];
  }

  // activate the fieldset
  submitFormFieldset.disabled = false;

  // create the form data to upload to the POST
  const formData = new FormData();
  formData.append('file', uploaded_file);
  formData.append('delimiter', delimiterElement.value);
  formData.append('rows-to-read', rowsToReadElement.value);
  formData.append('skip-rows', skipRowsElement.value);
  formData.append('has-headers', hasHeadersElement.checked);
  formData.append('columns-to-read', columnsToReadElement.value);
  
  // read the file at the server with pandas and show
  // a preview of it 
  fetch('/ascii-to-mseed/read-ascii-file', {
    method: 'POST',
    body: formData
  })
  // when i read the file with pandas i convert it to html table with pandas
  // and the response that i return is text. The html is text.
  .then(response => {
    if (!response.ok) {
      return response.json().then(errorMessage => {
        modalMessage.textContent = errorMessage['error_message'];
        modalTitle.textContent = 'An error has occured!'
        modelButtonTriger.click()
        uploadFileButton.value = null;
        throw new Error(errorMessage);
      })
    }
    return response.text()
  }) 
  .then(data => {
    let headerTop = `
    <p class="text-center text-secondary fs-3">First five (5) rows of the file</p>
    <hr>
    `
    tableContainerPreview.innerHTML = headerTop + data ;

    // set the upload input value to null so that the user
    // can select the same file
    uploadFileButton.value = null;

  })
  .catch(error => {
    console.error('Error:', error);
  })
    

  
}



