export default async function fetchRequest({
    endpoint,
    setError,
    setSuccess,
    setLoading,
    method = 'GET',
    data = null,
    returnType = 'json',
    successMessage = null,
    onError = null
}) {

    const options = {
        method,
        credentials: 'include',
    };


    if (method === 'POST') {
        if (data instanceof FormData) {
            options.body = data;
        } else if (typeof data === 'object') {
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
            setError(errorData["error_message"]);
            setSuccess(null);
            setTimeout(() => {
                setError([]); // Clear error message after 8 seconds
            }, 8000);
            if (onError) {
                onError(); // <-- Run the onError function if provided
            }
            throw new Error(errorData["error_message"].join(", "));
        }

        const result =
            returnType === 'blob' ? await response.blob() :
                returnType === 'text' ? await response.text() :
                    returnType === 'arrayBuffer' ? await response.arrayBuffer() :
                        await response.json();

        if (successMessage) {
            setSuccess(successMessage);
        }
        setError([]);
        setTimeout(() => {
            setSuccess(null);
        }, 8000);


        return result;
    } catch (error) {
        console.error(`Fetch request failed: ${error.message}`);
        if (onError) {
            onError();
        }
        throw error;
    } finally {
        setLoading(false);
    }
}
