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




