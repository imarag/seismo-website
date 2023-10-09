(()=>{

    let point1LatInput = document.querySelector("#point1-lat-input");
    let point1LonInput = document.querySelector("#point1-lon-input");
    let point2LatInput = document.querySelector("#point2-lat-input");
    let point2LonInput = document.querySelector("#point2-lon-input");
    let computeButton = document.querySelector("#compute-button");
    let clearButton = document.querySelector("#clear-button");
    let mapButton = document.querySelector("#map-button");
    let resultSpan = document.querySelector("#result-span");


    clearButton.addEventListener("click", () => {
        point1LatInput.value = "";
        point1LonInput.value = "";
        point2LatInput.value = "";
        point2LonInput.value = "";

        document.querySelector("#lat1").textContent = 'lat1';
        document.querySelector("#lon1").textContent = 'lon1';
        document.querySelector("#lat2").textContent = 'lat2';
        document.querySelector("#lon2").textContent = 'lon2';

        resultSpan.textContent = '';
    })

    computeButton.addEventListener("click", ()=> {
        let queryParametersURL = `/distance-between-points/calculate-distance?point1-lat-input=${point1LatInput.value}&point1-lon-input=${point1LonInput.value}&point2-lat-input=${point2LatInput.value}&point2-lon-input=${point2LonInput.value}`
        calculateDistace(queryParametersURL);
    })

    mapButton.addEventListener("click", ()=> {
        let queryParametersURL = `/distance-between-points/calculate-distance-map?point1-lat-input=${point1LatInput.value}&point1-lon-input=${point1LonInput.value}&point2-lat-input=${point2LatInput.value}&point2-lon-input=${point2LonInput.value}`
        createMap(queryParametersURL);
    })


    function calculateDistace(queryParametersURL){
        fetch(queryParametersURL)
            .then(response => { 
                // if not ok deactivate the spinner and show the modal message
                if (!response.ok) {
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
            .then(data => {
                document.querySelector("#modal-message").textContent = "You have succesfully calculated the distance!";
                document.querySelector("#modal-title").textContent = 'Successful calculation!'
                document.querySelector("#modal-header").style.backgroundColor = "green";
                document.querySelector("#modal-button-triger").click()
            
                document.querySelector("#lat1").textContent = point1LatInput.value;
                document.querySelector("#lon1").textContent = point1LonInput.value;
                document.querySelector("#lat2").textContent = point2LatInput.value;
                document.querySelector("#lon2").textContent = point2LonInput.value;

                resultSpan.textContent = data['result'];
            })
            .catch(error => {
            // Handle any errors during the upload process
            console.error('Error uploading MSeed file:', error);
            });
    }



    function createMap(queryParametersURL){
        fetch(queryParametersURL)
            .then(response => { 
                // if not ok deactivate the spinner and show the modal message
                if (!response.ok) {
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
            .then(blob  => {
                const url = window.URL.createObjectURL(blob);
                // Create a link element and trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.target = "_blank";
                a.click();
            })
            .catch(error => {
            // Handle any errors during the upload process
            console.error('Error uploading MSeed file:', error);
            });
    }
})();