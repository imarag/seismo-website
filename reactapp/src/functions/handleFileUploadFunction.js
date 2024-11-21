
export default function handleFileUploadFunction(endpoint, options) {
    async function fetchData() {
        const res = await fetch(endpoint, options);

        // Check if the response is successful
        if (!res.ok) {
            const errorData = await res.json(); // Parse the response body to get the error message
            throw new Error(errorData.error_message || 'Unknown error occurred');
        }

        return res.json();
    }
    return fetchData()
}