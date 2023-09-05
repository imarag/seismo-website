

let point1LatInput = document.querySelector("#point1-lat-input");
let point1LonInput = document.querySelector("#point1-lon-input");
let point2LatInput = document.querySelector("#point2-lat-input");
let point2LonInput = document.querySelector("#point2-lon-input");
let resultsContainer = document.querySelector("#results-container");
let computeButton = document.querySelector("#compute-button");
let clearButton = document.querySelector("#clear-button");


clearButton.addEventListener("click", () => {
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

            let resultRow = document.createElement("div")
            resultRow.className = "row justify-content-center align-items-center"

            let resultColumn1 = document.createElement("div")
            resultColumn1.className = "col-6 text-center"
            resultColumn1.innerHTML = `<p class="text-center text-muted fs-4">${data['points']}</p>`

            let resultColumn2 = document.createElement("div")
            resultColumn2.className = "col-6 text-center"
            resultColumn2.innerHTML = `<p class="text-center text-muted fs-4">${data['result']}</p>`

            let horizontalLine = document.createElement("hr")
            horizontalLine.className = "w-75 mx-auto"

            resultRow.appendChild(resultColumn1)
            resultRow.appendChild(resultColumn2)

            resultsContainer.appendChild(resultRow)
        

            

        })
        .catch(error => {
          // Handle any errors during the upload process
          console.error('Error uploading MSeed file:', error);
        });
}

