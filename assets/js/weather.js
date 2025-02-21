const apiKey = "d24e593bc3203bcd0f110266bed1ca87";
const city = "Sorsogon";

// Function to get current weather
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (data.cod !== 200) {
            console.error("Weather API Error:", data.message);
            document.getElementById("temp").innerText = "Error: " + data.message;
            return;
        }
        

        if (data.main) {
            document.getElementById("temp").innerText = `🌡 Temperature: ${data.main.temp}°C`;
            document.getElementById("desc").innerText = `🌥 ${data.weather[0].description}`;
            document.getElementById("humidity").innerText = `💧 Humidity: ${data.main.humidity}%`;
            document.getElementById("wind").innerText = `🌬 Wind: ${data.wind.speed} m/s`;

            // Weather Icon
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            document.getElementById("weather-icon").src = iconUrl;
            document.getElementById("weather-icon").style.display = "block";
        } else {
            document.getElementById("temp").innerText = "Weather data unavailable";
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById("temp").innerText = "Error loading weather data";
    }
}

// Function to get 5-day forecast & plot graph
async function getWeatherForecast() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Forecast Data:", data);
        
        if (data.cod !== "200") {
            console.error("Forecast API Error:", data.message);
            document.getElementById("weatherChartMessage").style.display = "block";
            document.getElementById("weatherChartMessage").textContent = "Error: " + data.message;
            return;
        }
        

        // Check if canvas element exists
        const canvas = document.getElementById("weatherChart");
        if (!canvas) {
            console.warn("Weather chart canvas not found");
            return;
        }

        // Check if we have forecast data
        if (!data.list || data.list.length === 0) {
            document.getElementById("weatherChartMessage").style.display = "block";
            document.getElementById("weatherChartMessage").textContent = "Forecast data not available";
            return;
        }

        let labels = [];
        let tempData = [];

        // Extract temperatures for 5 days (every 24 hours)
        for (let i = 0; i < data.list.length; i += 8) {
            let date = new Date(data.list[i].dt_txt).toLocaleDateString();
            labels.push(date);
            tempData.push(data.list[i].main.temp);
        }

        // Create Chart
        const ctx = document.getElementById("weatherChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Temperature (°C)",
                    data: tempData,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error fetching forecast:", error);
        const message = document.getElementById("weatherChartMessage");
        if (message) {
            message.style.display = "block";
            message.textContent = "Error loading weather data";
        }
    }
}

// Run functions when page loads
document.addEventListener("DOMContentLoaded", () => {
    getWeather();
    getWeatherForecast();
});
