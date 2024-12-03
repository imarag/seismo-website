(() => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  let excelUploadInput = document.querySelector("#excel-upload-input");
  let csvUploadInput = document.querySelector("#csv-upload-input");
  let txtUploadInput = document.querySelector("#txt-upload-input");

  // get the seismic parameters widgets
  let seismicParamsButton = document.querySelector(
    "#submit-seismic-params-button"
  );
  let stationNameInput = document.querySelector("#station-input");
  let dateInput = document.querySelector("#date-input");
  let timeInput = document.querySelector("#time-input");
  let samplingFrequencyRadio = document.querySelector("#fs-radio");
  let verticalComponent = document.querySelector("#compo1");
  let horizontalComponent1 = document.querySelector("#compo2");
  let horizontalComponent2 = document.querySelector("#compo3");
  let parameterValue = document.querySelector("#parameter-value");

  let twoComponentsCheck = document.querySelector("#two-components-check");

  // get the spinenr divs
  let fileParsingSpinnerDiv = document.querySelector(
    "#file-parsing-spinner-div"
  );
  let seismicParametersSpinnerDiv = document.querySelector(
    "#seismic-parameters-spinner-div"
  );

  // display none to the spinners
  fileParsingSpinnerDiv.style.display = "none";
  seismicParametersSpinnerDiv.style.display = "none";

  // when clicked open the file input
  document
    .querySelector("#excel-upload-button")
    .addEventListener("click", () => {
      excelUploadInput.click();
    });
  document.querySelector("#csv-upload-button").addEventListener("click", () => {
    csvUploadInput.click();
  });
  document.querySelector("#txt-upload-button").addEventListener("click", () => {
    txtUploadInput.click();
  });

  // when the change event happends, open the browse window
  excelUploadInput.addEventListener("change", (ev) => {
    handleFileUpload(ev, "excel");
  });
  csvUploadInput.addEventListener("change", (ev) => {
    handleFileUpload(ev, "csv");
  });
  txtUploadInput.addEventListener("change", (ev) => {
    handleFileUpload(ev, "txt");
  });

  seismicParamsButton.addEventListener("click", () => {
    submitSeismicParameters();
  });

  twoComponentsCheck.addEventListener("change", () => {
    if (twoComponentsCheck.checked) {
      horizontalComponent2.disabled = true;
    } else {
      horizontalComponent2.disabled = false;
    }
  });

  function handleFileUpload(event, which) {
    // get the files
    let files = event.target.files;

    // if no file is uploaded return
    if (files.length === 0) {
      return;
    }

    // get the uploaded file
    uploaded_file = files[0];

    // activate the spinner
    fileParsingSpinnerDiv.style.display = "block";

    excelUploadInput.value = null;
    csvUploadInput.value = null;
    txtUploadInput.value = null;

    // create the form data to upload to the POST
    const formData = new FormData();

    formData.append("file", uploaded_file);
    formData.append("format", which);
    formData.append(
      "has-headers",
      document.querySelector(`#${which}-has-headers`).checked
    );

    if (which === "txt") {
      formData.append(
        "skip-rows",
        document.querySelector(`#${which}-skiprows`).value
      );
      formData.append(
        "delimiter",
        document.querySelector(`#${which}-delimiter`).value
      );
    }

    fetch("/file-to-mseed/upload-file", {
      method: "POST",
      body: formData,
    })
      // when i read the file with pandas i convert it to html table with pandas
      // and the response that i return is text. The html is text.
      .then((response) => {
        // if not ok deactivate the spinner and show the modal message
        if (!response.ok) {
          // deactivate spinner
          fileParsingSpinnerDiv.style.display = "none";

          // get the error json
          return response.json().then((errorMessage) => {
            document.querySelector("#modal-message").textContent =
              errorMessage["error_message"];
            document.querySelector("#modal-title").textContent =
              "An error has occured!";
            document.querySelector("#modal-header").style.backgroundColor =
              "red";
            document.querySelector("#modal-button-triger").click();
            throw new Error(errorMessage);
          });
        }
        // if ok just return the json response
        return response.json();
      })
      .then((data) => {
        // deactivate the spinner
        fileParsingSpinnerDiv.style.display = "none";

        // actiate the modal message for a succesful computation
        document.querySelector("#modal-message").textContent =
          "The file has been successfully uploaded. Proceed to define the seismic parameters of the MiniSEED file, below.";
        document.querySelector("#modal-title").textContent =
          "Succesful file upload!";
        document.querySelector("#modal-header").style.backgroundColor = "green";
        document.querySelector("#modal-button-triger").click();

        seismicParamsButton.disabled = false;

        let allColumns = data["column-names"];

        verticalComponent.innerHTML = "";
        horizontalComponent1.innerHTML = "";
        horizontalComponent2.innerHTML = "";

        for (let i = 0; i < allColumns.length; i++) {
          let columnName = allColumns[i];

          // Create options for each select element
          let newOptionCompo1 = createOption(columnName, columnName);
          verticalComponent.appendChild(newOptionCompo1);

          let newOptionCompo2 = createOption(columnName, columnName);
          horizontalComponent1.appendChild(newOptionCompo2);

          let newOptionCompo3 = createOption(columnName, columnName);
          horizontalComponent2.appendChild(newOptionCompo3);
        }

        verticalComponent.value = "select column";
        horizontalComponent1.value = "select column";
        horizontalComponent2.value = "select column";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function createOption(value, text) {
    let option = document.createElement("option");
    option.value = value;
    option.text = text;
    return option;
  }

  function submitSeismicParameters() {
    // activate the spinner
    seismicParametersSpinnerDiv.style.display = "block";

    queryURL = `/file-to-mseed/convert-file-to-mseed?station=${stationNameInput.value}&date=${dateInput.value}&time=${timeInput.value}&fs-radio=${samplingFrequencyRadio.checked}&parameter-value=${parameterValue.value}&is-two-components=${twoComponentsCheck.checked}&vert-compo=${verticalComponent.value}&hor-compo1=${horizontalComponent1.value}&hor-compo2=${horizontalComponent2.value}`;
    fetch(queryURL)
      // when i read the file with pandas i convert it to html table with pandas
      // and the response that i return is text. The html is text.
      .then((response) => {
        // if not ok deactivate the spinner and show the modal message
        if (!response.ok) {
          // deactivate spinner
          seismicParametersSpinnerDiv.style.display = "none";

          // get the error json
          return response.json().then((errorMessage) => {
            document.querySelector("#modal-message").textContent =
              errorMessage["error_message"];
            document.querySelector("#modal-title").textContent =
              "An error has occured!";
            document.querySelector("#modal-header").style.backgroundColor =
              "red";
            document.querySelector("#modal-button-triger").click();
            throw new Error(errorMessage);
          });
        }
        // if ok just return the json response
        return response.blob();
      })
      .then((blobData) => {
        // deactivate spinner
        seismicParametersSpinnerDiv.style.display = "none";

        // Get the desired filename and file path from the JSON response
        const blobURL = URL.createObjectURL(blobData);

        // Create a temporary link to initiate the download
        const link = document.createElement("a");
        link.href = blobURL;

        // Set the desired filename for the download
        link.download = "stream-record.mseed";
        link.click();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
})();
