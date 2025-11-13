// Load Google Charts
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(initializeCharts);

let donutChart, demandChart;

// Sample crop data for demonstration
const sampleCropData = {
    "Wheat": {
        yield: 3.5,
        demand: 85,
        market_price: 2500,
        production_cost: 1200
    },
    "Rice": {
        yield: 2.8,
        demand: 92,
        market_price: 2800,
        production_cost: 1500
    },
    "Corn": {
        yield: 3.2,
        demand: 78,
        market_price: 2200,
        production_cost: 1100
    },
    "Soybean": {
        yield: 2.5,
        demand: 65,
        market_price: 3000,
        production_cost: 1300
    },
    "Cotton": {
        yield: 1.8,
        demand: 70,
        market_price: 3500,
        production_cost: 1800
    }
};

function initializeCharts() {
    // Initialize charts with empty data
    drawDonutChart([]);
    drawDemandChart([]);
}

function drawDonutChart(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Crop');
    chartData.addColumn('number', 'Yield');
    chartData.addRows(data);

    const options = {
        title: 'Crop Yield Distribution',
        pieHole: 0.4,
        backgroundColor: 'transparent',
        legend: { position: 'bottom' },
        chartArea: { width: '100%', height: '80%' },
        colors: ['#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f'],
        animation: {
            duration: 1000,
            easing: 'out'
        }
    };

    donutChart = new google.visualization.PieChart(document.getElementById('donutchart'));
    donutChart.draw(chartData, options);
}

function drawDemandChart(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Crop');
    chartData.addColumn('number', 'Market Demand (%)');
    chartData.addColumn('number', 'Market Price (₹/Quintal)');
    chartData.addRows(data);

    const options = {
        title: 'Crop Market Analysis',
        backgroundColor: 'transparent',
        legend: { position: 'bottom' },
        chartArea: { width: '85%', height: '70%' },
        colors: ['#3498db', '#e74c3c'],
        hAxis: {
            title: 'Crop',
            titleTextStyle: { color: '#333', fontSize: 12 },
            textStyle: { color: '#333' },
            gridlines: { color: '#f0f0f0' }
        },
        vAxis: {
            title: 'Value',
            titleTextStyle: { color: '#333', fontSize: 12 },
            textStyle: { color: '#333' },
            gridlines: { color: '#f0f0f0' },
            minValue: 0
        },
        animation: {
            duration: 1000,
            easing: 'out'
        },
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 1 }
        },
        vAxes: {
            0: { title: 'Market Demand (%)' },
            1: { title: 'Market Price (₹/Quintal)' }
        }
    };

    demandChart = new google.visualization.ColumnChart(document.getElementById('demandchart'));
    demandChart.draw(chartData, options);
}

function updateNumericStats(cropData) {
    // Generate random values within realistic ranges
    const totalYield = (Math.random() * 5 + 2).toFixed(1);
    const avgYield = (Math.random() * 3 + 1).toFixed(1);
    const bestCrop = Object.keys(sampleCropData)[Math.floor(Math.random() * Object.keys(sampleCropData).length)];

    document.getElementById('totalYield').textContent = totalYield;
    document.getElementById('avgYield').textContent = avgYield;
    document.getElementById('bestCrop').textContent = bestCrop;
}

// Handle form submission
document.getElementById('cropForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        temperature: document.getElementById('temperature').value,
        humidity: document.getElementById('humidity').value,
        rainfall: document.getElementById('rainfall').value,
        soilType: document.getElementById('soil').value
    };

    // Show loading state
    document.querySelector('button[type="submit"]').disabled = true;
    document.querySelector('button[type="submit"]').textContent = 'Processing...';

    // Simulate API call with timeout
    setTimeout(() => {
        // For demo purposes, we'll use random data
        const recommendedCrop = Object.keys(sampleCropData)[Math.floor(Math.random() * Object.keys(sampleCropData).length)];
        const cropData = sampleCropData[recommendedCrop];

        // Update numeric stats
        updateNumericStats(cropData);

        // Prepare data for donut chart - show all individual crops
        const donutData = Object.entries(sampleCropData).map(([crop, data]) => [
            crop,
            data.yield
        ]);

        // Sort data by yield in descending order
        donutData.sort((a, b) => b[1] - a[1]);

        // Prepare data for demand chart
        const demandData = Object.entries(sampleCropData).map(([crop, data]) => [
            crop,
            data.demand,
            data.market_price
        ]);

        // Update charts
        drawDonutChart(donutData);
        drawDemandChart(demandData);

        // Show results section
        document.querySelector('.visualization-container').style.display = 'grid';

        // Reset button state
        document.querySelector('button[type="submit"]').disabled = false;
        document.querySelector('button[type="submit"]').textContent = 'Get Recommendations';
    }, 1000);
});

// Make charts responsive
window.addEventListener('resize', function () {
    if (donutChart) donutChart.draw();
    if (demandChart) demandChart.draw();
}); 