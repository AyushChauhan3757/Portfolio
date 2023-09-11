// Selecting DOM elements and storing them in variables
const container = document.querySelector('.container'); // Main container
const search = document.querySelector('.search-box button'); // Search button
const weatherBox = document.querySelector('.weather-box'); // Weather information container
const weatherDetails = document.querySelector('.weather-details'); // Weather details container
const error404 = document.querySelector('.not-found'); // Error message container

// Adding a click event listener to the search button
search.addEventListener('click', () => {
    // OpenWeatherMap API Key
    const APIKey = process.env.weather_api;
    // Getting the user's input from the search input field
    const city = document.querySelector('.search-box input').value;

    // Check if the city input is empty
    if (city === '') {
        return; // If it's empty, do nothing
    }

    // Fetch weather data from OpenWeatherMap API using the provided city and API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json()) // Parse the response as JSON
        .then(json => {
            // Check if the response code indicates a not found error (404)
            if (json.cod === '404') {
                // Display an error message and hide weather information
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block'; // Show the error message
                error404.classList.add('fadeIn'); // Apply a fade-in animation
                return; // Exit the function
            }

            // Hide the error message if it was previously displayed
            error404.style.display = 'none';
            error404.classList.remove('fadeIn'); // Remove the fade-in animation

            // Selecting DOM elements inside the weather box
            const image = document.querySelector('.weather-box img'); // Weather icon
            const temperature = document.querySelector('.weather-box .temperature'); // Temperature display
            const description = document.querySelector('.weather-box .description'); // Weather description
            const humidity = document.querySelector('.weather-details .humidity span'); // Humidity value
            const wind = document.querySelector('.weather-details .wind span'); // Wind speed value

            // Set the weather icon based on the weather conditions
            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            // Display temperature, description, humidity, and wind speed
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            // Display weather information and apply a fade-in animation
            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');

            // Adjust the container's height to show all weather information
            container.style.height = '590px';
        });
});
