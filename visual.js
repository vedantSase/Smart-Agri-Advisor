// Wheat Visualization
const wheatCtx = document.getElementById('wheatChart').getContext('2d');
new Chart(wheatCtx, {
    type: 'doughnut',
    data: {
        labels: ['Soil Quality', 'Rainfall', 'Temperature'],
        datasets: [{
            data: [30, 40, 30],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
    }
});

// Rice Visualization
const riceCtx = document.getElementById('riceChart').getContext('2d');
new Chart(riceCtx, {
    type: 'doughnut',
    data: {
        labels: ['Humidity', 'Water Supply', 'Soil Quality'],
        datasets: [{
            data: [40, 50, 10],
            backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56'],
        }]
    }
});

// Example Line Chart
const chart1Ctx = document.getElementById('cropDataChart1').getContext('2d');
new Chart(chart1Ctx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
            label: 'Wheat Growth',
            data: [3, 4, 5, 6, 7],
            borderColor: '#FF6384',
            fill: false,
        }]
    }
});

// Example Bar Chart
const chart2Ctx = document.getElementById('cropDataChart2').getContext('2d');
new Chart(chart2Ctx, {
    type: 'bar',
    data: {
        labels: ['Region 1', 'Region 2', 'Region 3', 'Region 4'],
        datasets: [{
            label: 'Rice Production',
            data: [40, 60, 80, 50],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
        }]
    }
});
