import ButtonWithIcon from "./ButtonWithIcon"

export default function UploadFile() {

    async function handleFileSelection(e) {
        e.preventDefault();
        setLoading(true);

        let formData = new FormData();
        formData.append('file', e.target.files[0]);

        let endpoint = `${serverUrl}/upload-seismic-file`;
        let options = { method: 'POST', body: formData, credentials: 'include' }

        fetch(endpoint, options)
            .then(jsonData => {
                // Update the state after the successful upload
                setTraces(jsonData);
                setSelectedFile(e.target.files[0].name);
                setSelectedChannel(jsonData[0].stats.channel)
                setInfoMessage("Seismic file upload completed successfully");
                setTimeout(() => setInfoMessage(null), 5000);
            })
            .catch(error => {
                // Handle any errors that occur during the async operation
                console.error('Error occurred during file upload:', error);
                setErrorMessage(error.message || "Error uploading file. Please try again.");
                setTimeout(() => setErrorMessage(null), 5000);
            })
            .finally(() => {
                setLoading(false);
            })

    }

    // this function will be called by the upload file button
    function handleFileUpload(e) {
        e.preventDefault();
        document.querySelector("#upload-seismic-file-input").click()
    }

    return (
        <div>
            <input name="file" type="file" onChange={handleFileSelection} id="upload-seismic-file-input" hidden />
            <ButtonWithIcon text="Upload file" onClick={handleFileUpload}><UploadIcon /></ButtonWithIcon>
        </div>
    )
}
