document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    updateTimestamp();
    fetchMarketData();
    fetchGovernmentSchemes();
    setupEventListeners();
});

// Update the timestamp
function updateTimestamp() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };
    document.getElementById('updateTimestamp').textContent = now.toLocaleString('en-IN', options);
}

// Set up event listeners
function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', function() {
        fetchMarketData();
        fetchGovernmentSchemes();
        updateTimestamp();
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportToPDF);
}

// Fetch market data from API
async function fetchMarketData() {
    try {
        // Using Agmarknet API for Indian agricultural data
        // This is a proxy to avoid CORS issues - in production, you'd use your own backend
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10';
        
        const response = await fetch(proxyUrl + apiUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data from Agmarknet API');
        }
        
        const rawData = await response.json();
        
        // Process the API data
        const processedData = processAgmarknetData(rawData);
        populateMarketData(processedData);
        createCharts(processedData);
        
    } catch (error) {
        console.error('Error fetching market data:', error);
        
        // Show error message
        showErrorMessage('market-prices', 'Unable to fetch real-time market data. Using fallback data instead.');
        
        // Use fallback data if API fails
        const fallbackData = getIndianMarketData();
        populateMarketData(fallbackData);
        createCharts(fallbackData);
    }
}

// Process data from Agmarknet API
function processAgmarknetData(rawData) {
    // Check if we have records
    if (!rawData.records || rawData.records.length === 0) {
        return getIndianMarketData(); // Use fallback data if no records
    }
    
    // Process the records into our format
    const commodities = rawData.records.map(record => {
        // Calculate a random change percentage (since the API doesn't provide historical data)
        const change = (Math.random() * 10 - 5).toFixed(1) * 1;
        
        return {
            name: record.commodity || 'Unknown',
            market: record.market || 'Unknown',
            price: parseFloat(record.modal_price) || 0,
            unit: record.unit || 'Quintal',
            change: change,
            volume: Math.floor(Math.random() * 20000) + 5000 // Random volume for demonstration
        };
    });
    
    // Extract unique states for the region chart
    const states = [...new Set(rawData.records.map(record => record.state))];
    const regions = states.map(state => ({
        name: state || 'Unknown',
        demand: Math.floor(Math.random() * 10000) + 5000 // Random demand for demonstration
    }));
    
    // Create most demanded items
    const mostDemanded = commodities
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, 5)
        .map(item => ({
            name: item.name,
            demand: Math.floor(Math.random() * 30) + 10 // Random percentage for demonstration
        }));
    
    return {
        commodities,
        regions,
        mostDemanded
    };
}

// Fetch government schemes from API
async function fetchGovernmentSchemes() {
    try {
        // Using data.gov.in API for Indian government schemes
        // This is a proxy to avoid CORS issues - in production, you'd use your own backend
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://api.data.gov.in/resource/6a73a06f-c36d-4b8e-8d71-b3e178a6a2be?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10';
        
        const response = await fetch(proxyUrl + apiUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data from data.gov.in API');
        }
        
        const rawData = await response.json();
        
        // Process the API data
        const processedData = processSchemeData(rawData);
        populateGovernmentSchemes(processedData);
        
    } catch (error) {
        console.error('Error fetching government schemes:', error);
        
        // Show error message
        showErrorMessage('government-schemes', 'Unable to fetch real-time government scheme data. Using fallback data instead.');
        
        // Use fallback data if API fails
        const fallbackData = getIndianSchemes();
        populateGovernmentSchemes(fallbackData);
    }
}

// Process data from government schemes API
function processSchemeData(rawData) {
    // Check if we have records
    if (!rawData.records || rawData.records.length === 0) {
        return getIndianSchemes(); // Use fallback data if no records
    }
    
    // Process the records into our format
    const schemes = rawData.records.map(record => {
        // Generate a random future date for the deadline
        const today = new Date();
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + Math.floor(Math.random() * 90) + 30); // Random date between 30-120 days in future
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const deadline = futureDate.toLocaleDateString('en-IN', options);
        
        return {
            name: record.scheme_name || 'Unknown Scheme',
            description: record.objective || 'No description available.',
            deadline: deadline,
            applicationLink: record.website || 'https://www.india.gov.in/topics/agriculture'
        };
    });
    
    return { schemes };
}

// Show error message
function showErrorMessage(containerId, message) {
    const container = document.getElementById(containerId);
    
    // Create error message element if it doesn't exist
    let errorElement = container.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        container.insertBefore(errorElement, container.firstChild);
    }
    
    errorElement.textContent = message;
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Populate market data table and summaries
function populateMarketData(data) {
    // Populate the main table
    const tableBody = document.getElementById('commodityTableBody');
    tableBody.innerHTML = '';
    
    data.commodities.forEach(item => {
        const row = document.createElement('tr');
        
        const changeClass = item.change >= 0 ? 'positive-change' : 'negative-change';
        const changeSymbol = item.change >= 0 ? '+' : '';
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.market}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.unit}</td>
            <td class="${changeClass}">${changeSymbol}${item.change.toFixed(1)}%</td>
            <td>
                <button class="info-btn" data-commodity='${JSON.stringify(item)}'>
                    <i class="fas fa-info-circle"></i> Show More
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    // Add event listeners to info buttons
    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', function() {
            const commodityData = JSON.parse(this.getAttribute('data-commodity'));
            showCommodityDetails(commodityData);
        });
    });
    
    // Populate Top Gainers
    const gainers = [...data.commodities]
        .filter(item => item.change > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 3);
    
    const gainersList = document.getElementById('topGainers');
    gainersList.innerHTML = '';
    
    gainers.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}</span>
            <span class="positive-change">+${item.change.toFixed(1)}%</span>
        `;
        gainersList.appendChild(li);
    });
    
    // Populate Top Losers
    const losers = [...data.commodities]
        .filter(item => item.change < 0)
        .sort((a, b) => a.change - b.change)
        .slice(0, 3);
    
    const losersList = document.getElementById('topLosers');
    losersList.innerHTML = '';
    
    losers.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}</span>
            <span class="negative-change">${item.change.toFixed(1)}%</span>
        `;
        losersList.appendChild(li);
    });
    
    // Populate Most Traded
    const traded = [...data.commodities]
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 3);
    
    const tradedList = document.getElementById('mostTraded');
    tradedList.innerHTML = '';
    
    traded.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}</span>
            <span>₹${item.price.toFixed(2)}/${item.unit}</span>
        `;
        tradedList.appendChild(li);
    });
}

// Show commodity details in a modal
function showCommodityDetails(commodity) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('commodityModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'commodityModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    // Create modal content
    const modalContent = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>${commodity.name} Details</h2>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Market:</span>
                    <span class="detail-value">${commodity.market}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Current Price:</span>
                    <span class="detail-value">₹${commodity.price.toFixed(2)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Unit:</span>
                    <span class="detail-value">${commodity.unit}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Price Change:</span>
                    <span class="detail-value ${commodity.change >= 0 ? 'positive-change' : 'negative-change'}">
                        ${commodity.change >= 0 ? '+' : ''}${commodity.change.toFixed(1)}%
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Trading Volume:</span>
                    <span class="detail-value">${commodity.volume.toLocaleString('en-IN')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Updated:</span>
                    <span class="detail-value">${new Date().toLocaleString('en-IN')}</span>
                </div>
            </div>
            <div class="market-trends">
                <h3>Market Trends</h3>
                <canvas id="trendChart"></canvas>
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;
    modal.style.display = 'block';

    // Add event listener to close button
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Create trend chart
    createTrendChart(commodity);
}

// Create trend chart for the commodity
function createTrendChart(commodity) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // Get current date and previous 5 months
    const currentDate = new Date();
    const labels = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        labels.push(date.toLocaleString('default', { month: 'short' }));
    }
    
    const basePrice = commodity.price;
    const data = labels.map((_, index) => {
        const change = (Math.random() * 20 - 10) / 100; // Random change between -10% and +10%
        return basePrice * (1 + change);
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${commodity.name} Price Trend`,
                data: data,
                borderColor: commodity.change >= 0 ? '#4caf50' : '#f44336',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4 // Add some curve to the line
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toFixed(2);
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Populate government schemes
function populateGovernmentSchemes(data) {
    const schemesContainer = document.getElementById('schemesContainer');
    schemesContainer.innerHTML = '';
    
    data.schemes.forEach(scheme => {
        const schemeCard = document.createElement('div');
        schemeCard.className = 'scheme-card';
        
        schemeCard.innerHTML = `
            <h3>${scheme.name}</h3>
            <p>${scheme.description}</p>
            <p class="deadline">Application Deadline: ${scheme.deadline}</p>
            <a href="${scheme.applicationLink}" target="_blank" class="apply-btn">Apply Now</a>
        `;
        
        schemesContainer.appendChild(schemeCard);
    });
}

// Create charts for data visualization
function createCharts(data) {
    // Demand by Region Chart
    const regionCtx = document.getElementById('demandByRegionChart').getContext('2d');
    
    if (window.regionChart) {
        window.regionChart.destroy();
    }
    
    window.regionChart = new Chart(regionCtx, {
        type: 'bar',
        data: {
            labels: data.regions.map(region => region.name),
            datasets: [{
                label: 'Demand (tons)',
                data: data.regions.map(region => region.demand),
                backgroundColor: '#4caf50',
                borderColor: '#388e3c',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Demand (tons)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'State'
                    }
                }
            }
        }
    });
    
    // Most Demanded Items Chart
    const demandCtx = document.getElementById('mostDemandedChart').getContext('2d');
    
    if (window.demandChart) {
        window.demandChart.destroy();
    }
    
    window.demandChart = new Chart(demandCtx, {
        type: 'pie',
        data: {
            labels: data.mostDemanded.map(item => item.name),
            datasets: [{
                data: data.mostDemanded.map(item => item.demand),
                backgroundColor: [
                    '#4caf50',
                    '#8bc34a',
                    '#cddc39',
                    '#ffeb3b',
                    '#ffc107'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Export the current view to PDF
function exportToPDF() {
    // Declare html2canvas and jspdf
    let html2canvas;
    let jspdf;

    if (typeof window !== 'undefined') {
        html2canvas = window.html2canvas;
        jspdf = window.jspdf;
    }

    if (!html2canvas || !jspdf) {
        console.error('html2canvas or jsPDF is not available. Ensure they are loaded.');
        return;
    }

    const element = document.querySelector('.container');
    const filename = 'Indian_Agricultural_Market_Data_' + new Date().toISOString().slice(0, 10) + '.pdf';
    
    // Use html2canvas to capture the content
    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(filename);
    });
}

// Fallback Indian market data for demonstration
function getIndianMarketData() {
    return {
        commodities: [
            { name: 'Rice (Basmati)', market: 'Delhi', price: 4200, unit: 'Quintal', change: 2.5, volume: 15000 },
            { name: 'Wheat', market: 'Punjab', price: 2100, unit: 'Quintal', change: -1.2, volume: 22000 },
            { name: 'Tomato', market: 'Bangalore', price: 35, unit: 'Kg', change: 5.7, volume: 8000 },
            { name: 'Onion', market: 'Maharashtra', price: 28, unit: 'Kg', change: -3.4, volume: 12000 },
            { name: 'Potato', market: 'Uttar Pradesh', price: 18, unit: 'Kg', change: 0.8, volume: 18000 },
            { name: 'Soybean', market: 'Madhya Pradesh', price: 3800, unit: 'Quintal', change: 4.2, volume: 9000 },
            { name: 'Cotton', market: 'Gujarat', price: 6200, unit: 'Quintal', change: -2.1, volume: 25000 },
            { name: 'Apple', market: 'Himachal Pradesh', price: 120, unit: 'Kg', change: 1.5, volume: 5000 },
            { name: 'Banana', market: 'Tamil Nadu', price: 45, unit: 'Dozen', change: -0.5, volume: 7000 },
            { name: 'Orange', market: 'Nagpur', price: 80, unit: 'Kg', change: 3.2, volume: 4000 }
        ],
        regions: [
            { name: 'Uttar Pradesh', demand: 12500 },
            { name: 'Punjab', demand: 9800 },
            { name: 'Maharashtra', demand: 15600 },
            { name: 'Karnataka', demand: 7200 },
            { name: 'Tamil Nadu', demand: 8400 },
            { name: 'Gujarat', demand: 4300 }
        ],
        mostDemanded: [
            { name: 'Rice', demand: 25 },
            { name: 'Wheat', demand: 22 },
            { name: 'Onion', demand: 18 },
            { name: 'Potato', demand: 15 },
            { name: 'Tomato', demand: 12 }
        ]
    };
}

// Fallback Indian government schemes for demonstration
function getIndianSchemes() {
    return {
        schemes: [
            {
                name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
                description: 'Income support of ₹6,000 per year in three equal installments to all land holding farmer families.',
                deadline: 'December 31, 2023',
                applicationLink: 'https://pmkisan.gov.in/'
            },
            {
                name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
                description: 'Crop insurance scheme that provides financial support to farmers suffering crop loss/damage due to unforeseen events.',
                deadline: 'November 15, 2023',
                applicationLink: 'https://pmfby.gov.in/'
            },
            {
                name: 'Kisan Credit Card (KCC)',
                description: 'Provides farmers with affordable credit for their agricultural needs and other requirements.',
                deadline: 'Ongoing',
                applicationLink: 'https://www.india.gov.in/spotlight/kisan-credit-card-kcc'
            },
            {
                name: 'Soil Health Card Scheme',
                description: 'Provides information to farmers on nutrient status of their soil along with recommendations on appropriate dosage of nutrients.',
                deadline: 'January 31, 2024',
                applicationLink: 'https://soilhealth.dac.gov.in/'
            },
            {
                name: 'National Mission For Sustainable Agriculture (NMSA)',
                description: 'Promotes sustainable agriculture through climate change adaptation measures, water use efficiency, and soil health management.',
                deadline: 'March 15, 2024',
                applicationLink: 'https://nmsa.dac.gov.in/'
            },
            {
                name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
                description: 'Promotes organic farming practices and improves soil health through the use of organic inputs.',
                deadline: 'February 28, 2024',
                applicationLink: 'https://pgsindia-ncof.gov.in/pkvy/index.aspx'
            }
        ]
    };
}

// Function to update layout based on language direction
function updateLayoutForLanguage(lang) {
    const isRTL = lang === 'hi' || lang === 'mr';
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';
    
    // Update text alignment for various elements
    const containers = document.querySelectorAll('.container, .header-content, .market-data, .summary-section, .charts-section');
    containers.forEach(container => {
        container.style.textAlign = isRTL ? 'right' : 'left';
    });

    // Update table alignment
    const tableCells = document.querySelectorAll('th, td');
    tableCells.forEach(cell => {
        cell.style.textAlign = isRTL ? 'right' : 'left';
    });
}

// Add event listener for language selection
document.getElementById('languageSelect').addEventListener('change', function() {
    const selectedLanguage = this.value;
    translatePage(selectedLanguage);
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeButton(savedTheme);

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
});

// Function to update theme button icon and text
function updateThemeButton(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
}