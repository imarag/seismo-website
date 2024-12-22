import Plot from 'react-plotly.js';


export default function LineGraph({ 
    onGraphClick=null,
    xData=[], 
    yData=[], 
    scale="linear", 
    width="100%", 
    height="210px", 
    legendTitle=["Legend"] ,
    showLegend=true,
    showGraphTitle=true,
    graphTitle="My Title",
    shapes=[],
    annotations=[]
}) {
    let defaultLayout = {
        title: {
            text: showGraphTitle ? graphTitle : "", 
            font: {
                family: 'Arial, sans-serif', 
                size: 30,                   
                color: '#21211f'               
            },
            x: 0.5, 
            y: 0.96 
        },
        autosize: true,
        margin: { t: 20, b: 20, l: 20, r: 20 },
        legend: {
            x: 0.01, 
            y: 1.2, 
            xanchor: 'left', 
            yanchor: 'top',
        },
        responsive: true,
        xaxis: {
            type: scale,
        },
        yaxis: {
            type: scale,
        },
        shapes: shapes,
        annotations: annotations
    }
    return (
        <Plot
            data={xData.map((el, ind) => (
                {
                    x: xData[ind],
                    y: yData[ind],
                    type: 'line',
                    showlegend: showLegend,
                    name: legendTitle[ind],
                }
            ))}
            layout={defaultLayout}
            style={{ width: width, height: height }}
            useResizeHandler={true}
            config={{ scrollZoom: true }}
            onClick={onGraphClick}
        />
    )
}
