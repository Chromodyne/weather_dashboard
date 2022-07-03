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
                grabFromAPI(data);
            });

}

function grabFromAPI(geoData) {

    //This is my API key for Openweather.
    let key = "fcce58844e534ec514a18075dfac20f5";

    let latitude = geoData[0].lat;
    let longitude = geoData[0].lon;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${key}`).then(
    (resp) => {return resp.json() }).then(
         (data) => { 
            console.log(data);
            });

}

function getUVIndex(data) {

    let latitude = data.city.coord.lat;
    let longitude = data.city.coord.lon;

}

function populateBoxes(data) {

    //getUVIndex(data);

    let currentTemp = data.main.temp;
    let windSpeed = data.wind.speed;
    let humidity = data.main.humidity;

    //TODO: Look into this. It may not be available in the free version of the API.
    let uvIndex;

    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `Temp: ${currentTemp}℉`;
    document.getElementById("wind-speed").textContent = `Wind: ${windSpeed} MPH`;
    document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;

}