import { lazy, Suspense } from "react";

const Plot = lazy(async () => {
  let obj = await import("react-plotly.js");
  return typeof obj.default === "function" ? obj : obj.default;
});

export default function LineGraph({
  onGraphClick = null,
  xData = [],
  yData = [],
  scale = "linear",
  width = null,
  height = null,
  legendTitle = ["Legend"],
  showLegend = true,
  showGraphTitle = true,
  graphTitle = "My Title",
  shapes = [],
  annotations = [],
}) {
  let defaultLayout = {
    title: {
      text: showGraphTitle ? graphTitle : "",
      font: {
        family: "Arial, sans-serif",
        size: 30,
        color: "#21211f",
      },
      x: 0.5,
      y: 0.96,
    },

    margin: { t: 20, b: 20, l: 20, r: 20 },
    legend: {
      x: 0.01,
      y: 1.2,
      xanchor: "left",
      yanchor: "top",
    },
    responsive: true,
    paper_bgcolor: "rgba(0,0,0,0)", // Transparent background
    plot_bgcolor: "rgba(0,0,0,0)", // Transparent plot area
    xaxis: {
      type: scale,
      showgrid: false,
      range:
        scale === "log"
          ? [
              Math.log10(Math.min(...xData[0])),
              Math.log10(Math.max(...xData[0])),
            ]
          : "autoscale",
    },
    yaxis: {
      type: scale,
      showgrid: false,
    },
    shapes: shapes,
    annotations: annotations,
  };

  return (
    <Plot
      data={xData.map((el, ind) => ({
        x: xData[ind],
        y: yData[ind],
        type: "line",
        showlegend: showLegend,
        name: legendTitle[ind],
      }))}
      layout={defaultLayout}
      style={{
        width: width ? width : "100%",
        height: height ? height : "100%",
      }}
      useResizeHandler={true}
      config={{ scrollZoom: true }}
      onClick={onGraphClick}
    />
  );
}
