let uploadFileInput = document.querySelector("#upload-file-input");
let latStationSelect = document.querySelector("#latstation");
let lonStationSelect = document.querySelector("#lonstation");
let latEarthSelect = document.querySelector("#latearth");
let lonEarthSelect = document.querySelector("#lonearth");
let buttonPlot = document.querySelector("#button-plot");
let buttonUpdateStyles = document.querySelector("#button-update-styles");

document
  .querySelector("#upload-file-button")
  .addEventListener("click", function () {
    uploadFileInput.click();
  });

uploadFileInput.addEventListener("change", (ev) => {
  uploadSeismicFile(ev);
});

buttonPlot.addEventListener("click", () => {
  plotMapData();
});

buttonUpdateStyles.addEventListener("click", () => {
  updateStyles();
});

function uploadSeismicFile(ev) {
  // get all the files
  let files = ev.target.files;

  // if empty return
  if (files.length === 0) {
    return;
  }

  // get the first file
  let inputFile = files[0];

  // create the formData
  let formData = new FormData();

  // Append the MSeed file to the FormData object
  formData.append("file", inputFile);

  // fetch to the upload-seimsic-file in flask and do a POST request
  fetch("/raypaths/upload-file", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // if not ok deactivate the spinner and show the modal message
      if (!response.ok) {
        return response.json().then((errorMessage) => {
          throw new Error(errorMessage);
        });
      }
      // if ok just return the json response
      return response.json();
    })
    .then((jsonData) => {
      let allColumns = jsonData["columnNames"];

      latStationSelect.innerHTML = "";
      lonStationSelect.innerHTML = "";
      latEarthSelect.innerHTML = "";
      lonEarthSelect.innerHTML = "";

      for (let i = 0; i < allColumns.length; i++) {
        let columnName = allColumns[i];

        // Create options for each select element
        let newOptionLatStation = createOption(columnName, columnName);
        latStationSelect.appendChild(newOptionLatStation);

        let newOptionLonStation = createOption(columnName, columnName);
        lonStationSelect.appendChild(newOptionLonStation);

        let newOptionLatEarth = createOption(columnName, columnName);
        latEarthSelect.appendChild(newOptionLatEarth);

        let newOptionLonEarth = createOption(columnName, columnName);
        lonEarthSelect.appendChild(newOptionLonEarth);
      }
    })
    .catch((error) => {
      // Handle any errors during the upload process
      console.error("Error uploading MSeed file:", error);
    });
}

function createOption(value, text) {
  let option = document.createElement("option");
  option.value = value;
  option.text = text;
  return option;
}

function plotMapData() {
  fetch(
    `/raypaths/plot-data?latstation=${latstation.value}&lonstation=${lonstation.value}&latearth=${latearth.value}&lonearth=${lonearth.value}`
  )
    .then((response) => {
      // if not ok deactivate the spinner and show the modal message
      if (!response.ok) {
        return response.json().then((errorMessage) => {
          throw new Error(errorMessage);
        });
      }
      // if ok just return the json response
      return response.json();
    })
    .then((jsonData) => {
      let stationLon = jsonData["station_lon"];
      let stationLat = jsonData["station_lat"];
      let earthquakeLon = jsonData["earthquake_lon"];
      let earthquakeLat = jsonData["earthquake_lat"];

      var data = [
        {
          type: "scattermapbox",
          lat: stationLat,
          lon: stationLon,
          marker: { color: "fuchsia", size: 4 },
        },
        {
          type: "scattermapbox",
          lat: earthquakeLat,
          lon: earthquakeLon,
          marker: { color: "red", size: 4 },
        },
      ];

      var layout = {
        dragmode: "zoom",
        mapbox: {
          style: "open-street-map",
          center: { lat: 38, lon: 25 },
          zoom: 3,
        },
        margin: { r: 0, t: 0, b: 0, l: 0 },
      };

      Plotly.newPlot("graph-area", data, layout);
    })
    .catch((error) => {
      // Handle any errors during the upload process
      console.error("Error uploading MSeed file:", error);
    });
}

function updateStyles() {
  let lineColor = document.querySelector("#line-color");
  let lineWidth = document.querySelector("#line-width");
  let lineOpacity = document.querySelector("#line-opacity");
  let stationMarkerColor = document.querySelector("#station-marker-color");
  let stationMarkerSize = document.querySelector("#station-marker-size");
  let stationMarkerOpacity = document.querySelector("#station-marker-opacity");
  let earthquakeMarkerColor = document.querySelector(
    "#earthquake-marker-color"
  );
  let earthquakeMarkerSize = document.querySelector("#earthquake-marker-size");
  let earthquakeMarkerOpacity = document.querySelector(
    "#earthquake-marker-opacity"
  );
  console.log(
    stationMarkerColor.value,
    stationMarkerSize.value,
    stationMarkerOpacity.value
  );
  fetch("/raypaths/get-data")
    .then((response) => {
      // if not ok deactivate the spinner and show the modal message
      if (!response.ok) {
        return response.json().then((errorMessage) => {
          throw new Error(errorMessage);
        });
      }
      // if ok just return the json response
      return response.json();
    })
    .then((jsonData) => {
      let stationLon = jsonData["station_lon"];
      let stationLat = jsonData["station_lat"];
      let earthquakeLon = jsonData["earthquake_lon"];
      let earthquakeLat = jsonData["earthquake_lat"];
      console.log(stationLon);
      var data = [
        {
          type: "scattermapbox",
          lat: stationLat,
          lon: stationLon,
          marker: {
            color: stationMarkerColor.value,
            size: stationMarkerSize.value,
            opacity: stationMarkerOpacity.value,
            symbol: "circle-stroked",
          },
        },
        {
          type: "scattermapbox",
          lat: earthquakeLat,
          lon: earthquakeLon,
          marker: {
            color: earthquakeMarkerColor.value,
            size: earthquakeMarkerSize.value,
            opacity: earthquakeMarkerOpacity.value,
            symbol: "triangle",
          },
        },
      ];

      var layout = {
        dragmode: "zoom",
        mapbox: {
          style: "open-street-map",
          center: { lat: 38, lon: 25 },
          zoom: 3,
        },
        margin: { r: 0, t: 0, b: 0, l: 0 },
      };

      Plotly.newPlot("graph-area", data, layout);
    })
    .catch((error) => {
      // Handle any errors during the upload process
      console.error("Error uploading MSeed file:", error);
    });
}
