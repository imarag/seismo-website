(()=>{

    let point1LatInput = document.querySelector("#point1-lat-input");
    let point1LonInput = document.querySelector("#point1-lon-input");
    let point2LatInput = document.querySelector("#point2-lat-input");
    let point2LonInput = document.querySelector("#point2-lon-input");


    document.querySelector("#clear-button").addEventListener("click", () => {
        // empty the coordinate entries
        point1LatInput.value = "";
        point1LonInput.value = "";
        point2LatInput.value = "";
        point2LonInput.value = "";

        // set the default values on the Python script block at the bottom
        document.querySelector("#lat1").textContent = 'lat1';
        document.querySelector("#lon1").textContent = 'lon1';
        document.querySelector("#lat2").textContent = 'lat2';
        document.querySelector("#lon2").textContent = 'lon2';

        // clear also the result
        document.querySelector("#result-span").textContent = '';
    })

    // when the compute button is clicked call the respective function
    document.querySelector("#compute-button").addEventListener("click", ()=> {
        let queryParametersURL = `/distance-between-points/calculate-distance?point1-lat-input=${point1LatInput.value}&point1-lon-input=${point1LonInput.value}&point2-lat-input=${point2LatInput.value}&point2-lon-input=${point2LonInput.value}`
        calculateDistace(queryParametersURL);
    })

    // when the locate button is clicked, call the respective function
    document.querySelector("#map-button").addEventListener("click", ()=> {
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
                // succesful message (modal)
                document.querySelector("#modal-message").textContent = "You have succesfully calculated the distance!";
                document.querySelector("#modal-title").textContent = 'Successful calculation!'
                document.querySelector("#modal-header").style.backgroundColor = "green";
                document.querySelector("#modal-button-triger").click()
                // change the coordinates at the python script sample at the bottom
                document.querySelector("#lat1").textContent = point1LatInput.value;
                document.querySelector("#lon1").textContent = point1LonInput.value;
                document.querySelector("#lat2").textContent = point2LatInput.value;
                document.querySelector("#lon2").textContent = point2LonInput.value;
                // change also the result
                document.querySelector("#result-span").textContent = data['result'];
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
                // this creates the map on the server using python folium and we download it here
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