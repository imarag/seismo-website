import { lazy, Suspense } from "react";

const Plot = lazy(() =>
  import("react-plotly.js").then((mod) =>
    typeof mod.default === "function" ? mod : { default: mod.default }
  )
);

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
  zoomOnScroll = true,
}) {
  const hasData = xData.length > 0 && yData.length > 0;
  let layout = {
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
    autosize: true,
    xaxis: {
      type: scale,
      showgrid: false,
      range:
        scale === "log" && hasData
          ? [
              Math.log10(Math.max(1e-10, Math.min(...xData[0]))),
              Math.log10(Math.max(...xData[0])),
            ]
          : undefined,
    },
    yaxis: {
      type: scale,
      showgrid: false,
    },
    showlegend: showLegend,
    shapes,
    annotations,
    responsive: true,
    paper_bgcolor: "rgba(0,0,0,0)", // Transparent background
    plot_bgcolor: "rgba(0,0,0,0)", // Transparent plot area
  };

  const config = {
    responsive: true,
    scrollZoom: zoomOnScroll,
    displaylogo: false,
  };

  const data = yData.map((y, i) => ({
    x: xData[i],
    y: y,
    type: "scatter",
    mode: "lines",
    name: legendTitle[i] || `Trace ${i + 1}`,
  }));

  return (
    <Suspense fallback={<div>Loading graph...</div>}>
      <Plot
        style={{ width: "100%", height: "100%" }}
        data={data}
        layout={layout}
        config={config}
        onClick={onGraphClick}
      />
    </Suspense>
  );
}
