export default async function fetchRequest(URL, method = 'GET', data = null, returnBlob = false) {
    const options = { method: method, credentials: 'include' };
    console.log(`calling endpoint ${URL}...`)

    if (method === "POST") {
        if (data instanceof FormData) {
            // Handle file input
            options.body = data;
        } else if (typeof data === 'object' && !Array.isArray(data)) {
            // Handle JSON data
            options.headers = {
                'Content-Type': 'application/json',
            };
            options.body = JSON.stringify(data);
        } else {
            throw new Error('Invalid data type: Must be an object or FormData.');
        }
    }

    const response = await fetch(URL, options);
  
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }
    
    return returnBlob ? await response.blob() : await response.json();
  }