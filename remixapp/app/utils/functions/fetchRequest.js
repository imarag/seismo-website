export default async function fetchRequest({
    endpoint,
    setError,
    setSuccess,
    setLoading,
    method = 'GET',
    data = null,
    returnType = 'json',
    successMessage = null
}) {

    const options = {
        method,
        credentials: 'include',
    };

    console.log(`Calling endpoint ${endpoint}...`);

    if (method === 'POST') {
        if (data instanceof FormData) {
            options.body = data;
        } else if (typeof data === 'object' && !Array.isArray(data)) {
            options.headers = {
                'Content-Type': 'application/json',
            };
            options.body = JSON.stringify(data);
        } else {
            throw new Error('Invalid data type: Must be an object or FormData.');
        }
    }

    setLoading(true); 

    try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData["error_message"])
            setError(errorData["error_message"] || `Error: ${response.statusText}`);
            setSuccess(null);
            setTimeout(() => {
                setError(null); // Clear error message after 5 seconds
            }, 5000);
            throw new Error(errorData["error_message"] || `Error: ${response.statusText}`);
        }

        const result = 
            returnType === 'blob' ? await response.blob() :
            returnType === 'text' ? await response.text() :
            returnType === 'arrayBuffer' ? await response.arrayBuffer() :
            await response.json();

        if (successMessage) {
            setSuccess(successMessage);
        }
        setError(null); 
        setTimeout(() => {
            setSuccess(null);
        }, 8000);

        return result;
    } catch (error) {
        console.error(`Fetch request failed: ${error.message}`);
        setError(error.message);
        setSuccess(null);
        setTimeout(() => {
            setError(null);
        }, 8000);
        throw error;
    } finally {
        setLoading(false); 
    }
}
