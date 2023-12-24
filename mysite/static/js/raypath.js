
let uploadFileButton = document.querySelector("#upload-file-button");
let uploadFileInput = document.querySelector("#upload-file-input");
let styleForm = document.querySelector("#style-form");


uploadFileButton.addEventListener('click', function() {
    uploadFileInput.click();
});

uploadFileInput.addEventListener('change', (e) => {
    uploadSeismicFile(e)
})

styleForm.addEventListener('onsubmit', (e) => {
    e.preventDefault()
})



function uploadSeismicFile(ev) {
    // get all the files
    let files = ev.target.files;

    // if empty return
    if (files.length === 0) {
        return;
    }

    // get the first file
    let dataFile = files[0];

    // create the formData
    let formData = new FormData();

    // Append the MSeed file to the FormData object
    formData.append('file', dataFile);

    // clear the Input with type "file" so that the user can re-load the same file (both at the uploadInputFile and the another file)
    uploadFileInput.value = null;

    // fetch to the upload-seimsic-file in flask and do a POST request
    fetch('/raypath/create-map', {
        method: 'POST',
        body: formData
        })
        .then(response => { 
            // if not ok deactivate the spinner and show the modal message
            if (!response.ok) {
                // get the error json
                return response.json()
                    .then(errorMessage => {
                        throw new Error(errorMessage);
                    })
            }
            // if ok just return the json response
            return response.blob()
        })
        .then(imageBlob => {
            let imageUrl = URL.createObjectURL(imageBlob);
            document.getElementById('mapElement').src = imageUrl;
        })
        .catch(error => {
        // Handle any errors during the upload process
        console.error('Error uploading MSeed file:', error);
        });
    }



