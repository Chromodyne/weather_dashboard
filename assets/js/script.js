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

    console.log(searchTerm);
    grabFromAPI(searchTerm);

}

//This function is called when the user clicks one of the city preset buttons.
function initiatePresetSearch() {
    
    let searchTerm;

    grabFromAPI(searchTerm);

}

function grabFromAPI(cityName) {

    //This is my API key for Openweather.
    let key = "fcce58844e534ec514a18075dfac20f5";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`).then(
    (resp) => {return resp.json() }).then(
         (data) => { 
            console.log(data);
            populateBoxes(data) });

    fetch

}

function populateBoxes(data) {

    //By default the API returns units Kelvin which needs to be converted to
    //degrees Fahrenheit.
    let currentTemp = data.main.temp;
    let convertedTemp = convertToFahrenheit(currentTemp);

    //By default the API returns meters/second which needs to be converted to
    //miles per hour.
    let windSpeed = data.wind.speed;
    let convertedWindSpeed = convertToMPH(windSpeed);

    let humidity = data.main.humidity;

    //TODO: Look into this. It may not be available in the free version of the API.
    let uvIndex;

    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `Temp: ${currentTemp}℉`;
    document.getElementById("wind-speed").textContent = `Wind: ${windSpeed} MPH`;
    document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;

}