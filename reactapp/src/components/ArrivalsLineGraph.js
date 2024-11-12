import Plot from 'react-plotly.js';

export default function ArrivalsLineGraph({ trace, data, selectedWave, setSelectedWave, arrivals, setArrivals }) {

    const xData = data["xdata"];
    const yData = data["ydata"];

    const yMin = Math.min(...yData);  // Get the minimum value
    const yMax = Math.max(...yData);  // Get the maximum value

    // initialize the layout that will be used by the line graphs
    let layout = {
        autosize: true,
        margin: { t: 20, b: 20, l: 20, r: 20 },
        legend: {x: 0.01, y: 1.2, xanchor: 'left', yanchor: 'top'},
        shapes: arrivals.map(w => (
            {
                type: "line",
                x0: w["arrival"],
                y0: w["ymin"],
                x1: w["arrival"],
                y1: w["ymax"],
                line: {
                    color: "#d4003c",
                    width: 3,
                    dash: 'dot'
                },
            }
        )),
        annotations: arrivals.map(w => (
            {
                x: w["arrival"],
                y: 0,
                xref: 'x',
                yref: 'y',
                text: w["wave"],
                showarrow: false,
                font: {
                    size: 30,
                },
            }
        )),
    }

    const channel = data["stats"]["channel"] ? "Component: " + data["stats"]["channel"] : trace

    return (
        <Plot
            data={[
                {
                    x: xData,
                    y: yData,
                    type: 'line',
                    name: channel,
                    showlegend: true,
                },
            ]}
            layout={layout}
            style={{ width: "100%", height: "210px" }}
            useResizeHandler={true}
            config={{scrollZoom: true}}
            onClick={(e) => {
                
                const point = e.points[0]; 
               
                for (let w of arrivals) {
                    if (w["wave"] === selectedWave && w["arrival"]) {
                        return
                    }
                }
                if (point) {
                    const x = point.x;
                 
                    setSelectedWave(selectedWave === "P" ? "S" : "P")
                    setArrivals((oldarrivals) => ([...oldarrivals, {wave: selectedWave, arrival: x, ymin: yMin, ymax: yMax}]))
                }
            }}
        />
    )
}
