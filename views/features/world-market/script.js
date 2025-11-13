// Market Data API Integration
async function fetchMarketData() {
    try {
        // Show loading state
        document.getElementById('marketDataBody').innerHTML = '<tr><td colspan="5" class="text-center"><div class="loading"></div> Loading market data...</td></tr>';
        
        // Fetch data from Agmarknet API
        const agmarknetData = await fetchAgmarknetData();
        processMarketData(agmarknetData);
    } catch (error) {
        console.error('Error fetching market data:', error);
        document.getElementById('marketDataBody').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading market data. Please try again later.</td></tr>';
    }
}

// Fetch data from Agmarknet API
async function fetchAgmarknetData() {
    try {
        // Get current date in YYYY-MM-DD format
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        
        // Fetch data for major commodities
        const commodities = ['RICE', 'WHEAT', 'POTATO', 'ONION', 'TOMATO'];
        const allData = [];
        
        for (const commodity of commodities) {
            const response = await fetch(`https://agmarknet.gov.in/api/price/today?commodity=${commodity}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.records) {
                    allData.push(...data.records.map(item => ({
                        commodity: item.commodity || commodity,
                        price: parseFloat(item.modal_price) || 0,
                        change: calculateChange(parseFloat(item.modal_price), parseFloat(item.previous_price)),
                        market: item.market || 'N/A',
                        state: item.state || 'N/A',
                        district: item.district || 'N/A'
                    })));
                }
            }
        }
        
        return allData;
    } catch (error) {
        console.error('Error fetching Agmarknet data:', error);
        return [];
    }
}

// Calculate price change percentage
function calculateChange(currentPrice, previousPrice) {
    if (!previousPrice || previousPrice === 0) return 0;
    return ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);
}

function processMarketData(data) {
    if (!data || data.length === 0) {
        document.getElementById('marketDataBody').innerHTML = '<tr><td colspan="5" class="text-center text-warning">No market data available at the moment.</td></tr>';
        return;
    }

    const statePrices = {};
    const trendingItems = {};
    
    data.forEach(item => {
        // Process state-wise prices
        if (!statePrices[item.state]) {
            statePrices[item.state] = {
                total: 0,
                count: 0,
                commodities: new Set()
            };
        }
        statePrices[item.state].total += item.price;
        statePrices[item.state].count += 1;
        statePrices[item.state].commodities.add(item.commodity);

        // Process trending items
        if (!trendingItems[item.commodity]) {
            trendingItems[item.commodity] = {
                price: item.price,
                count: 1,
                states: new Set([item.state])
            };
        } else {
            trendingItems[item.commodity].price += item.price;
            trendingItems[item.commodity].count += 1;
            trendingItems[item.commodity].states.add(item.state);
        }
    });

    // Update charts
    updateStatePriceChart(statePrices);
    updateTrendingItemsChart(trendingItems);
    updateMarketTable(data);
}

function updateStatePriceChart(statePrices) {
    const ctx = document.getElementById('statePriceChart').getContext('2d');
    const labels = Object.keys(statePrices);
    const data = labels.map(state => ({
        state,
        avgPrice: (statePrices[state].total / statePrices[state].count).toFixed(2),
        commodityCount: statePrices[state].commodities.size
    }));

    // Destroy existing chart if it exists
    if (window.statePriceChart) {
        window.statePriceChart.destroy();
    }

    window.statePriceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.state),
            datasets: [{
                label: 'Average Price (₹/kg)',
                data: data.map(d => d.avgPrice),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'State-wise Average Prices'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const state = data[context.dataIndex];
                            return `Commodities: ${state.commodityCount}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price (₹/kg)'
                    }
                }
            }
        }
    });
}

function updateTrendingItemsChart(trendingItems) {
    const ctx = document.getElementById('trendingItemsChart').getContext('2d');
    const items = Object.entries(trendingItems)
        .map(([commodity, data]) => ({
            commodity,
            avgPrice: (data.price / data.count).toFixed(2),
            stateCount: data.states.size
        }))
        .sort((a, b) => b.avgPrice - a.avgPrice)
        .slice(0, 10);

    // Destroy existing chart if it exists
    if (window.trendingItemsChart) {
        window.trendingItemsChart.destroy();
    }

    window.trendingItemsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: items.map(item => item.commodity),
            datasets: [{
                label: 'Price (₹/kg)',
                data: items.map(item => item.avgPrice),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Trending Commodities'
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const item = items[context.dataIndex];
                            return `Available in ${item.stateCount} states`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price (₹/kg)'
                    }
                }
            }
        }
    });
}

function updateMarketTable(data) {
    const tbody = document.getElementById('marketDataBody');
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.commodity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td class="${item.change >= 0 ? 'text-success' : 'text-danger'}">${item.change}%</td>
            <td>${item.market}</td>
            <td>${item.state}</td>
        `;
        tbody.appendChild(row);
    });
}

// Government Schemes API Integration
async function fetchGovernmentSchemes() {
    try {
        const response = await fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=5');
        const data = await response.json();
        updateSchemes(data);
    } catch (error) {
        console.error('Error fetching government schemes:', error);
    }
}

function updateSchemes(data) {
    const container = document.getElementById('schemesContainer');
    container.innerHTML = '';
    
    data.records.forEach(scheme => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${scheme.name}</h5>
                <p class="card-text">${scheme.description}</p>
                <p class="card-text"><small class="text-muted">Last updated: ${scheme.lastUpdated}</small></p>
                <a href="${scheme.applicationLink}" class="btn btn-primary" target="_blank">Apply Now</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// PDF Export Functionality
document.getElementById('exportPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Market Data Report', 14, 15);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    
    // Add table
    doc.autoTable({
        html: '#marketData',
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 }
    });
    
    // Save the PDF
    doc.save('market_data_report.pdf');
});

// Initialize data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchMarketData();
    fetchGovernmentSchemes();
    
    // Refresh data every hour
    setInterval(fetchMarketData, 3600000);
    // Refresh schemes daily
    setInterval(fetchGovernmentSchemes, 86400000);
}); 