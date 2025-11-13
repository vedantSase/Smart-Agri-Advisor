// District and Tehsil Data
const districts = {
    'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
    'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'],
    // Add more states and districts as needed
};

const tehsils = {
    'Anantapur': ['Anantapur', 'Dharmavaram', 'Guntakal', 'Hindupur', 'Kadiri', 'Penukonda', 'Tadipatri'],
    'Chittoor': ['Chittoor', 'Madanapalle', 'Palamaner', 'Punganur', 'Srikalahasti', 'Tirupati'],
    // Add more tehsils as needed
};

// Initialize dropdowns
document.addEventListener('DOMContentLoaded', () => {
    const districtSelect = document.getElementById('districtSelect');
    const tehsilSelect = document.getElementById('tehsilSelect');

    // Populate districts
    Object.keys(districts).forEach(state => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = state;
        districts[state].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            optgroup.appendChild(option);
        });
        districtSelect.appendChild(optgroup);
    });

    // Handle district selection
    districtSelect.addEventListener('change', () => {
        const selectedDistrict = districtSelect.value;
        tehsilSelect.innerHTML = '<option value="">Select Tehsil</option>';
        
        if (selectedDistrict && tehsils[selectedDistrict]) {
            tehsilSelect.disabled = false;
            tehsils[selectedDistrict].forEach(tehsil => {
                const option = document.createElement('option');
                option.value = tehsil;
                option.textContent = tehsil;
                tehsilSelect.appendChild(option);
            });
        } else {
            tehsilSelect.disabled = true;
        }
    });

    // Handle tehsil selection
    tehsilSelect.addEventListener('change', () => {
        if (tehsilSelect.value) {
            fetchWeatherData(districtSelect.value, tehsilSelect.value);
        }
    });
});

// Weather API Integration
async function fetchWeatherData(district, tehsil) {
    try {
        // Using OpenWeatherMap API (replace with your API key)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${district},IN&appid=YOUR_API_KEY&units=metric`);
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateWeatherDisplay(data) {
    // Update current weather
    const currentWeather = document.getElementById('currentWeather');
    const current = data.list[0];
    
    currentWeather.innerHTML = `
        <div class="weather-info">
            <div class="temperature">${Math.round(current.main.temp)}°C</div>
            <div class="description">${current.weather[0].description}</div>
            <div class="details">
                <div>Humidity: ${current.main.humidity}%</div>
                <div>Wind: ${current.wind.speed} m/s</div>
                <div>Pressure: ${current.main.pressure} hPa</div>
            </div>
        </div>
    `;

    // Update charts
    updateCharts(data);
}

function updateCharts(data) {
    const labels = data.list.map(item => new Date(item.dt * 1000).toLocaleTimeString());
    const temperatures = data.list.map(item => item.main.temp);
    const precipitations = data.list.map(item => item.pop * 100);

    // Temperature Chart
    const tempCtx = document.getElementById('temperatureChart').getContext('2d');
    new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature Forecast'
                }
            }
        }
    });

    // Precipitation Chart
    const precipCtx = document.getElementById('precipitationChart').getContext('2d');
    new Chart(precipCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Precipitation Probability (%)',
                data: precipitations,
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Precipitation Forecast'
                }
            }
        }
    });
} 