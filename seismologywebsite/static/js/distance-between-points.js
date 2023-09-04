

let point1LatInput = document.querySelector("#point1-lon-input");
let point1LonInput = document.querySelector("#point1-lat-input");
let point2LatInput = document.querySelector("#point2-lon-input");
let point2LonInput = document.querySelector("#point2-lat-input");
let resultParagraph = document.querySelector("#result-paragraph");
let computeButton = document.querySelector("#compute-button");
let resetButton = document.querySelector("#reset-button");


resultParagraph.value = "";

resetButton.addEventListener("click", () => {
    point1LatInput.value = "";
    point1LonInput.value = "";
    point2LatInput.value = "";
    point2LonInput.value = "";
})

computeButton.addEventListener("click", ()=> {
    let queryParametersURL = `/calculate-distance?point1-lat-input=${point1LatInput.value}&point1-lon-input=${point1LonInput.value}&point2-lat-input=${point2LatInput.value}&point2-lon-input=${point2LonInput.value}`
    calculateDistace(queryParametersURL);
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
            let resultValue = data['result'];
            console.log(`${resultValue} [km]`);
            resultParagraph.textContent = `${resultValue} [km]`;

            document.querySelector("#modal-message").textContent = 'The distance between the points is shown below';
            document.querySelector("#modal-title").textContent = 'Succesful calculation!'
            document.querySelector("#modal-header").style.backgroundColor = "green";
            document.querySelector("#modal-button-triger").click()

        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
}

