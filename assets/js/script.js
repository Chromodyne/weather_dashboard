//These are the cities available in the JQuery UI autocomplete for the search box.
//Far from an exhaustive list.
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
    "San Diego",
    "Portland",
    "Jacksonville",
    "Tampa",
    "Boston",
    "Topeka",
    "Milwaukee",
    "Minneapolis",
    "Honolulu",
    "Dallas",
    "Augusta",
    "Buffalo",
    "Phoenix",
    "Albuquerque",
    "Houston"
];

//This is the autocomplete functionality for the city search box. Uses JQuery UI.
$( function() { $( "#city-search" ).autocomplete({ source: cityChoices }); });

//Sets up the event listener for the search button and box.
document.getElementById("search-submit").addEventListener("click", () => {
    initiateSearch();
});

//On page load function calls.
addHistoryListeners();
loadPreviousCity();
loadHistoryList();

//Adds event listeners to all the buttons in the history list.
function addHistoryListeners() {
    
    let historyItems = document.querySelectorAll(".history");

    for (let i = 0; i < historyItems.length; i++) {
        historyItems[i].addEventListener("click", passHistory);
    }

}

//Takes the event passed by the history event listeners, gets the text content of the button clicked
//and then passes it to the initiateSearch function.
function passHistory(event) {

    let clickedButton = event.currentTarget.id;

    let text = document.getElementById(clickedButton).textContent;

    initiateSearch(text);

}

//This function performs the searching of the Openweather API.
function initiateSearch(passed) {

    let searchTerm;

    //Check to see if the passed value is null or undefined. If it is, the user has clicked a
    //history button so we need to use the term passed for searching. If not, the user has
    //entered text in the search box and we do not need it.
    if (passed !== null && passed !== undefined) {
        searchTerm = passed;
    } else {
         searchTerm = document.getElementById("city-search").value;
         addToSearchHistory(searchTerm);
    }

    getGeocoding(searchTerm);

}

//The openweather API requires latitude and longitude to get full information, therefore, we must use Geocoding
//to get those coordinates from a city name before making another API request to get the actual weather info.
function getGeocoding(cityName) {

    let key = "fcce58844e534ec514a18075dfac20f5";

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${key}`).then(
        (resp) => {return resp.json(); }).then(
            (data) => {
                grabFromAPI(data, cityName);
            });

}

//This function grabs from Openweather using the OneCall API.
function grabFromAPI(geoData, cityName) {

    //This is my API key for Openweather.
    let key = "fcce58844e534ec514a18075dfac20f5";

    let latitude = geoData[0].lat;
    let longitude = geoData[0].lon;

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${key}`).then(
    (resp) => {return resp.json() }).then(
         (data) => {
            populateBoxes(data, cityName);
            });

}

//This function populates the current day weather box then calls populateForecast to populate those
//boxes with the 5 day forecast.
function populateBoxes(data, cityName) {

    let currentDate = moment().format("MM/DD/YY");

    let currentTemp = data.current.temp;
    let windSpeed = data.current.wind_speed;
    let humidity = data.current.humidity;
    let uvIndex = data.current.uvi;
    let weatherIcon = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;

    document.getElementById("city-name").textContent = `${cityName} (${currentDate})`;
    document.getElementById("main-icon").setAttribute("src", weatherIcon);
    document.getElementById("temperature").textContent = `Temp: ${currentTemp}℉`;
    document.getElementById("wind-speed").textContent = `Wind: ${windSpeed} MPH`;
    document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
    document.getElementById("uv-index").textContent = `${uvIndex}`;
    styleUVIndex();

    saveHistory(cityName);
    populateForecast(data);

}

//This function populates the 5-day forecast boxes.
function populateForecast(data) {

    // Empty array to store api day data.
    let relevantDays = [];
    
    // Iterate through API response for daily forecasts and pull the first five.
    for (let i = 0; i < 5; i++) {
        relevantDays[i] = data.daily[i];
    }

    for(i = 1; i <= 5; i++) {
        let futureDate = new moment().add(i, "days");
        document.getElementById(`day${i}`).textContent = futureDate.format("MM/DD/YYYY");
    }

    for (i = 0; i < 5; i++) {
        let currentIcon = relevantDays[i].weather[0].icon;
        let iconURL = `http://openweathermap.org/img/w/${currentIcon}.png`;
        document.getElementById(`day${i+1}-icon`).setAttribute("src", iconURL);
        document.getElementById(`day${i+1}-temp`).textContent = `Temp: ${relevantDays[i].temp.max}℉`;
        document.getElementById(`day${i+1}-wind`).textContent = `Wind: ${relevantDays[i].wind_speed} MPH`;
        document.getElementById(`day${i+1}-humidity`).textContent = `Humidity: ${relevantDays[i].humidity}%`;
    }
        
}

//Changes the search history when a new search is entered.
function addToSearchHistory(cityName) {

    for (let i = 8; i > 2; i--) {

        document.getElementById(`history-${i}`).textContent = document.getElementById(`history-${i - 1}`).textContent;
        
    }
    
    document.getElementById("history-2").textContent = document.getElementById("history-1").textContent;

    document.getElementById("history-1").textContent = cityName;   

}

//This function saves the previous search result and historical results in localStorage so they can be retrieved.
function saveHistory(cityName) {

    localStorage.setItem("lastCity", cityName);
    for (let i = 1; i <= 8; i++) {
        let historicalItem = document.getElementById(`history-${i}`).textContent;
        localStorage.setItem(`history-${i}`, historicalItem);
    }

}

//This function loads the previously searched result on page load.
function loadPreviousCity() {

    let previousSearch = localStorage.getItem("lastCity");

    //Check if the user has anything stored in localStorage. If so, search for that.
    //If not, pick the first item from the history list.
    if (previousSearch !== null) {
        console.log("Initiating previous search: " + previousSearch);
        initiateSearch(previousSearch);
    } else {
        let defaultCity = document.getElementById("history-1").textContent;
        initiateSearch(defaultCity);
    }

    
}

//This function returns the search history list to where it should be on page load.
function loadHistoryList() {

    for (let i = 1; i <= 8; i++) {

        let historyStuff = localStorage.getItem(`history-${i}`);

        if(historyStuff !== null && historyStuff !== undefined && historyStuff !== "")  {
            let loadedCity = localStorage.getItem(`history-${i}`);
        document.getElementById(`history-${i}`).textContent = loadedCity;
        }
    }

}

//This function colors the UV index item based on the thresholds specificed by the US
//Environmental Protection Agency.
function styleUVIndex() {

    let uvValue = document.getElementById("uv-index").textContent;
    let uvContainer = document.getElementById("uv-index");

    if (uvValue >= 0 && uvValue <= 2) {
        uvContainer.style.backgroundColor = "green";
        uvContainer.style.color = "white";
    } else if (uvValue > 2 && uvValue <= 5) {
        uvContainer.style.backgroundColor = "yellow"
        uvContainer.style.color = "black";
    } else if (uvValue > 5 && uvValue <= 7) {
        uvContainer.style.backgroundColor = "orange";
        uvContainer.style.color = "black";
    } else if (uvValue > 7 && uvValue <= 9) {
        uvContainer.style.backgroundColor = "red";
        uvContainer.style.color = "white";
    } else if (uvValue > 9) {
        uvContainer.style.backgroundColor = "purple";
        uvContainer.style.color = "white";
    }

}