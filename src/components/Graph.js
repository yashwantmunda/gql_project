import { Box } from '@mui/material';
import React from 'react'
import Plot from 'react-plotly.js';

export default function Graph({xdata,ydata}) {
    const sumY = ydata.reduce((a,c) => a + c,0);
    const yPercentValue = ydata.map(d => d*100/sumY);
    return (
        <Box sx={{overflow:'auto'}}>
            <Plot
                data={[
                
                {type: 'bar', x: [...xdata], y: [...ydata]},
                ]}
                layout={{ height: 500, title: 'Bar plot of available jobs'}}
                config={{responsive: true,'displayModeBar': false}}
                useResizeHandler={true}
                style={{width: "100%"}}
            />
            <Box sx={{m:'40px 0'}}/>
            <Plot
                data={[
                {
                    type: 'pie',
                    values: [...yPercentValue],
                    labels: [...xdata],
                    hole: .3,
                },
                ]}
                layout={{ height: 600, title: 'Pie plot of available job',legend: {"orientation": "h"},
                annotations: [{
                    showarrow: false,
                    text:'JOBS'
                }
                    
                ]}}
                useResizeHandler={true}
                config={{responsive: true,'displayModeBar': false}}
                style={{width: "100%"}}
            />
        </Box>
    )
}
