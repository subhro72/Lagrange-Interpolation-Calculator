
// Data from the provided code
const x = [42.5, 43.33, 47.5, 180, 196.67, 200, 245, 250, 302.5, 463.33, 467.5, 553.33, 651.67, 704.17, 756.67, 759.17, 780.83, 1323.33, 1377];
const y = [1.217, 1.345, 1.289, 2.196, 2.215, 2.144, 2.347, 2.062, 2.368, 2.69, 2.695, 2.798, 2.887, 2.867, 3.01, 3.008, 3.034, 3.17, 3.3];

// Function to perform Lagrange Interpolation
function lagrangeInterpolation(x, y, xi) {
    const n = x.length;
    let result = 0.0;
    for (let i = 0; i < n; i++) {
        let term = y[i];
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                term *= (xi - x[j]) / (x[i] - x[j]);
            }
        }
        result += term;
    }
    return result;
}

// Generate multiple points for smooth curve plotting
function generateCurvePoints(x, y, count = 200) {
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    const step = (maxX - minX) / (count - 1);
    
    const xValues = [];
    const yValues = [];
    
    for (let i = 0; i < count; i++) {
        const xi = minX + i * step;
        xValues.push(xi);
        yValues.push(lagrangeInterpolation(x, y, xi));
    }
    
    return { x: xValues, y: yValues };
}

// Function to populate the data table
function populateTable() {
    const tableBody = document.getElementById('table-body');
    
    for (let i = 0; i < x.length; i++) {
        const row = document.createElement('tr');
        
        const indexCell = document.createElement('td');
        indexCell.textContent = i + 1;
        
        const xCell = document.createElement('td');
        xCell.textContent = x[i].toFixed(2);
        
        const yCell = document.createElement('td');
        yCell.textContent = y[i].toFixed(4);
        
        row.appendChild(indexCell);
        row.appendChild(xCell);
        row.appendChild(yCell);
        
        tableBody.appendChild(row);
    }
}

// Function to plot the chart
function plotChart(highlightX = null, highlightY = null) {
    const curvePoints = generateCurvePoints(x, y);
    
    const dataPoints = {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'markers',
        name: 'Data Points',
        marker: {
            size: 8,
            color: '#3c6e71'
        }
    };
    
    const curveLine = {
        x: curvePoints.x,
        y: curvePoints.y,
        type: 'scatter',
        mode: 'lines',
        name: 'Interpolation Curve',
        line: {
            color: '#1a2d40',
            width: 2.5
        }
    };
    
    const data = [dataPoints, curveLine];
    
    // Add highlighted point if provided
    if (highlightX !== null && highlightY !== null) {
        data.push({
            x: [highlightX],
            y: [highlightY],
            type: 'scatter',
            mode: 'markers',
            name: 'Interpolated Value',
            marker: {
                size: 12,
                color: '#d9b08c',
                symbol: 'circle-open',
                line: {
                    width: 3,
                    color: '#d9b08c'
                }
            }
        });
    }
    
    const layout = {
        title: {
            text: 'Light Intensity vs Output Voltage Relationship',
            font: {
                family: 'Segoe UI, sans-serif',
                size: 24,
                color: '#1a2d40'
            }
        },
        xaxis: {
            title: {
                text: 'Light Intensity',
                font: {
                    family: 'Segoe UI, sans-serif',
                    size: 16,
                    color: '#2d3142'
                }
            },
            gridcolor: '#e9ecef',
            zerolinecolor: '#e9ecef',
            tickfont: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#2d3142'
            }
        },
        yaxis: {
            title: {
                text: 'Output Voltage (V)',
                font: {
                    family: 'Segoe UI, sans-serif',
                    size: 16,
                    color: '#2d3142'
                }
            },
            gridcolor: '#e9ecef',
            zerolinecolor: '#e9ecef',
            tickfont: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#2d3142'
            }
        },
        margin: {
            l: 60,
            r: 50,
            b: 60,
            t: 80,
            pad: 4
        },
        hovermode: 'closest',
        showlegend: true,
        legend: {
            x: 0.02,
            y: 0.98,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#e9ecef',
            borderwidth: 1,
            font: {
                family: 'Segoe UI, sans-serif',
                size: 12,
                color: '#2d3142'
            }
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white'
    };
    
    Plotly.newPlot('chart', data, layout, {responsive: true});
}

// Function to handle the calculation button click
function calculateVoltage() {
    const intensityInput = document.getElementById('intensity');
    const resultDiv = document.getElementById('result');
    
    const xi = parseFloat(intensityInput.value);
    
    if (isNaN(xi)) {
        resultDiv.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Please enter a valid number';
        resultDiv.className = 'alert alert-danger';
        return;
    }
    
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    
    if (xi < minX || xi > maxX) {
        resultDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i><strong>Warning:</strong> Value outside data range (${minX.toFixed(2)} - ${maxX.toFixed(2)})<br>
                              Extrapolated Output Voltage at Light Intensity ${xi.toFixed(2)} is approximately ${lagrangeInterpolation(x, y, xi).toFixed(4)} V`;
        resultDiv.className = 'alert alert-warning';
    } else {
        const yi = lagrangeInterpolation(x, y, xi);
        resultDiv.innerHTML = `<i class="fas fa-check-circle me-2"></i>Output Voltage at Light Intensity ${xi.toFixed(2)} is approximately <strong>${yi.toFixed(4)} V</strong>`;
        resultDiv.className = 'alert alert-success';
        
        // Update chart with highlighted point
        plotChart(xi, yi);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    populateTable();
    plotChart();
    
    document.getElementById('calculate').addEventListener('click', calculateVoltage);
    document.getElementById('intensity').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateVoltage();
        }
    });
});
