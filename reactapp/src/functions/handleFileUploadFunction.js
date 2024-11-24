export default async function handleFileUploadFunction({ 
    endpoint = null, 
    dataType = "json", 
    requestBody = null, 
    returnBlob = false, 
    method = "GET", 
    initialCallback = null,
    successCallback = null, 
    errorCallback = null, 
    finallyCallback = null 
}) {

    if (initialCallback) initialCallback();

    const options = { method, credentials: 'include' };

    if (dataType.toLowerCase() === "json" && requestBody) {
        options.body = JSON.stringify(requestBody);
        options.headers = { 'Content-Type': 'application/json' };

    } else if (dataType.toLowerCase() === "file" && requestBody) {
        const formData = new FormData();
        formData.append('file', requestBody);
        options.body = formData;
    }
    console.log(endpoint, options)
    try {

        const res = await fetch(endpoint, options);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error_message || 'Unknown error occurred');
        }
        
        const returnData = returnBlob ? await res.blob() : await res.json();
        if (successCallback) successCallback(returnData);

    } catch (err) {
        console.error("Fetch error:", err.message);
        if (errorCallback) errorCallback(err.message);

    } finally {
        if (finallyCallback) finallyCallback();
    }
}
