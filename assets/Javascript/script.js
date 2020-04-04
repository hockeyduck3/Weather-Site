// Variables needed
var cityVal;
var queryURL;
var prevSearches = [];
var errorMes = $('.error');
var name;

// Trigger the load function
load();

// When the search button is clicked
$('.searchBtn').click(function() {
    // Grab the value from the search bar and trim the whitespaces off of it
    cityVal = $('.searchBar').val().trim();

    // cityVal is empty
    if (cityVal === '') {
        // Display this error message
        errorMes.text('Field cannot be empty').slideDown('600');
    }

    // If cityVal is not empty, then this will check and see if there is both a city name and a zipcode in the search bar.
    else if (cityVal.match(/[a-z]/) && cityVal.match(/[0-9]/)) {
        // If there is both a city name and a zip code, then this error message will display.
        errorMes.text('Please only search for a city or zip').slideDown('600');
    }

    // If neither error messages are displayed, then this will check and see if cityVal is a city. 
    else if (cityVal.match(/[a-z]/)) {
        // If it is, then the queryURL will search by city name
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Then trigger the searchCity function
        searchCity();
    }

    // This will check and see if cityVal is a zip code 
    else if (cityVal.match(/[0-9]/)) {
        // If it is, then the querURL will search by zip code instead
        queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Then trigger the searchCity function
        searchCity();
    }

    // If cityVal's value is just special characters for example
    else {
        // Then this error message will display
        errorMes.text('Text cannot be read').slideDown('600');
    }  
})

// This function will remove any error message if it's displayed
$('.firstSearch').on('keypress', function() {
    errorMes.slideUp('600');
})

// Search city function
function searchCity() {
    // Make an ajax request to openweather api
    $.ajax({
        url: queryURL,
        method: 'GET'
        // If the request was a success then this function will run
    }).then(function(response) {
        // Console log the response
        console.log(response);

        // Set the var 'name' to the openweather api name
        name = response.name;

        // Change the card title to name
        $('.cityName').text(name);
        
        //Hide the welcome screen 
        $('.greetingText, .firstSearch, .previousChoices, .choiceRow').hide();

        // Fade in the results
        $('.card').fadeIn('slow');

        // Remove the class of hide from the searchbar in the nav
        $('.navSearch').removeClass('hide');

        // Trigger addToList function
        addToList();

        // If the ajax request fails
    }).catch(function(error) {
        // Conosole log the error
        console.log(error)

        // Display what the error was to the user
        errorMes.text(`Error ${error.responseJSON.cod}: ${error.responseJSON.message}`).slideDown('600')
    })
}

// Load function
function load() {
    // Set the date and time text to the current date and time via moment.js
    $('.dateTime').text(moment().format('llll'))

    // This interval will make sure that the date and time is always up to date
    setInterval(function() {
        $('.dateTime').text(moment().format('llll'))
    }, 1000)

    // This if statement will check and see if the user has not done any previous searches
    if (JSON.parse(localStorage.getItem('prevSearches')) === null) {
        // If the above if statement is true then the prevSearches array will be set to this default list
        prevSearches = ['Salt Lake City', 'Tampa Bay', 'San Francisco', 'Houston'];

        // The text of previous searches will be set to 'Possible choices' 
        $('.previousChoices').text('Possible choices');

        // Then this function will go in and create buttons based on the prevSearches array
        $(prevSearches).each(function(e) {
            // This will also add a property of type="button" and add the classes 'btn btn-secondary cityBtn' to each button
            var button = $('<button>').text(prevSearches[e]).prop('type', 'button').addClass('btn btn-secondary cityBtn');

            // Append the newly made buttons to .choiceRow
            $('.choiceRow').append(button);
        })
    } 

    //If the user has made previous searches 
    else {
        // The prevSearchs array will be set to the saved array in the user's local storage
        prevSearches = JSON.parse(localStorage.getItem('prevSearches'));

        // Then this function will make buttons based off of the users
        $(prevSearches).each(function(e) {
            // Add a property of type="button" and add the classes 'btn btn-secondary cityBtn' to each button
            var button = $('<button>').text(prevSearches[e]).prop('type', 'button').addClass('btn btn-secondary cityBtn');
            
            // Then appened the newly made button to .choiceRow
            $('.choiceRow').append(button);
        })
    }
}

// Function for saving user's previous searches
function addToList() {
    // This will check and see if the user has made any previous searches
    if (JSON.parse(localStorage.getItem('prevSearches')) === null) {
        // If the user has not made any previous searches

        // prevSearches will be set to an empty array
        prevSearches = [];

        // Then the user's latest search will be added to the prevSearches arrray
        prevSearches.push(name);

        // Then set the item into the user's local storage using JSON's stringify method
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    } 
    /* If the user had made previous searches before then this else if statement will check and see if the latest search is already saved in the list. 
    if it is already saved then nothing will happen. This is to prevent the same city from showing up more than once on the previous searches list. */
    else if (prevSearches.indexOf(name) === -1) {
        // If the city is not on the list, then this if statement will check and see if the prevSearches array is at 4 or more than 4.
        if (prevSearches.length >= 4) {
            // If it is, then this will pop out the last item in the array
            prevSearches.pop();

            // Then set the latest search to the front of the array
            prevSearches.unshift(name);
        } 

        // If prevSearches is less than 4
        else {
            // Then just add the latest search to the front of the array
            prevSearches.unshift(name);
        }

        // Then after all of that is done, save prevSearches to the local storage using JSON stringify
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }
}