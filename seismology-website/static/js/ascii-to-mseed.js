
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
const uploadFileInput = document.querySelector("#upload-file-input");
const uploadFileButton = document.querySelector("#upload-file-button");
const uploadedFileURL = document.querySelector("#uploaded-file-url");

uploadFileButton.addEventListener('click', () => {
  uploadFileInput.click()
})

uploadFileInput.addEventListener('change', handleFileUpload);



function handleFileUpload(event) {

  let files = event.target.files;
  let uploaded_file;

  // if no file is uploaded return
  if (files.length === 0) {
    return;
  }
  else {
    // get the uploaded file
    uploaded_file = files[0];
  }
  uploadedFileURL.textContent = `File name: ${uploaded_file.name}`;
  // activate the second parametes set, fieldset
  document.querySelector("#submit-form-fieldset").disabled = false;

  // create the form data to upload to the POST
  const formData = new FormData();
  formData.append('file', uploaded_file);
  formData.append('delimiter', document.querySelector("#delimiter-select").value);
  formData.append('rows-to-read', document.querySelector("#number-of-rows-to-read-input").value);
  formData.append('skip-rows', document.querySelector("#skiprows-input").value);
  formData.append('has-headers', document.querySelector("#has-headers-checkbox").checked);
  formData.append('columns-to-read', document.querySelector("#columns-to-read-input").value);

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
        document.querySelector("#modal-message").textContent = errorMessage['error_message'];
        document.querySelector("#modal-title").textContent = 'An error has occured!'
        document.querySelector("#model-button-triger").click()
        uploadFileInput.value = null;
        uploadedFileURL.textContent = '';
        throw new Error(errorMessage);
      })
    }
    return response.json()
  }) 
  .then(data => {
    let tableHTML = data['table-html']
    document.querySelector("#ascii-file-name-uploaded").value = data['file-name-uploaded'];
    
    let headerTop = `
    <p class="text-center text-secondary fs-3">First five (5) rows of your file</p>
    <hr>
    `
    document.querySelector("#table-container-preview").innerHTML = headerTop + tableHTML ;
    
    // set the upload input value to null so that the user
    // can select the same file
    uploadFileInput.value = null;

  })
  .catch(error => {
    console.error('Error:', error);
  })
    

  
}



