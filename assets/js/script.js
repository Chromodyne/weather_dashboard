//These are the cities available in the JQuery UI autocomplete for the search box.
let cityChoices = [
    "Atlanta",
    "Austin",
    "Chicago",
    "Las Vegas",
    "San Francisco",
    "New York",
    "Seattle",
    "Denver",
    "Orlando",
    "Los Angeles",
    "New Orleans",
    "San Diego"
];

//This is the autocomplete functionality for the city search box.
$( function() { $( "#city-search" ).autocomplete({ source: cityChoices }); });

//Sets up the event listener for the search button and box.
document.getElementById("search-submit").addEventListener("click", initiateSearch);

//This function performs the searching of the Openweather API.
function initiateSearch() {

    let searchTerm = document.getElementById("city-search").value;

    getGeocoding(searchTerm);
    // grabFromAPI(searchTerm);

}

//The openweather API requires latitude and longitude to get full information, therefore, we must use Geocoding
//to get those coordinates from a city name before making another API request to get the actual weather info.
function getGeocoding(cityName) {

    let key = "fcce58844e534ec514a18075dfac20f5";

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${key}`).then(
        (resp) => {return resp.json(); }).then(
            (data) => {
                console.log(data);
                grabFromAPI(data, cityName);
            });

}

function grabFromAPI(geoData, cityName) {

    //This is my API key for Openweather.
    let key = "fcce58844e534ec514a18075dfac20f5";

    let latitude = geoData[0].lat;
    let longitude = geoData[0].lon;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${key}`).then(
    (resp) => {return resp.json() }).then(
         (data) => {
            console.log(data);
            populateBoxes(data, cityName);
            });

}

function populateBoxes(data, cityName) {

    let currentTemp = data.current.temp;
    let windSpeed = data.current.wind_speed;
    let humidity = data.current.humidity;
    let uvIndex = data.current.uvi;
    let weatherIcon = data.current.weather[0].icon;

    document.getElementById("city-name").textContent = `${cityName} ${weatherIcon}`;
    document.getElementById("temperature").textContent = `Temp: ${currentTemp}℉`;
    document.getElementById("wind-speed").textContent = `Wind: ${windSpeed} MPH`;
    document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
    document.getElementById("uv-index").textContent = `UV Index: ${uvIndex}`;

    populateForecast(data);

}

//This function populates the 5-day forecast boxes.
function populateForecast(data) {

    let relevantDays = [];
    
    for (let i = 0; i < 5; i++) {
        relevantDays[i] = data.daily[i];
    }

    console.log(relevantDays);

    for(i = 1; i <= 5; i++) {
        let futureDate = new moment().add(i, "days");
        document.getElementById(`day${i}`).textContent = futureDate.format("MM/DD/YYYY");
    }

    for (i = 0; i < 5; i++) {
        //let currentIcon = 
        //document.getElementById(`day${i+1}-icon`).textContent = `Temp: ${relevantDays[i].temp.max}℉`;
        document.getElementById(`day${i+1}-temp`).textContent = `Temp: ${relevantDays[i].temp.max}℉`;
        document.getElementById(`day${i+1}-wind`).textContent = `Wind: ${relevantDays[i].wind_speed} MPH`;
        document.getElementById(`day${i+1}-humidity`).textContent = `Humidity: ${relevantDays[i].humidity}%`;
    }
        
}

