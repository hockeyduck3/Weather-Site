// Variables needed
var cityVal;
var queryURL;
var fiveDayURL;
var prevSearches = [];
var errorMes = $('.error');
var name;
var which = 'firstSearch';

// Trigger the load function
load();

// When the search button is clicked
$('.searchBtn, .searchBtn2').click(function(event) {
    if ($(event.target).hasClass('searchBtn2')) {
        // Set the var of which to 'navSearch'
        which = 'navSearch';
    }

    // Trigger searchbar function
    grabCityVal();
});

// This function will check and see if the user clicked the 'Enter' key
$('.firstSearch, .navSearch').on('keydown', function(event) {
    
    if ($(event.target).hasClass('searchBar')) {
        // If the 'Enter' key is clicked then run the searchBar function
        if (event.keyCode === 13) {
            // Trigger grabCityVal function
            grabCityVal();
        } 
        // If the 'Enter' key was not clicked then remove any errors on the screen
        else {
            error();  
        }
    } 

    else {
        //If the 'Enter' key is clicked then run the searchBar function
        if (event.keyCode === 13) {
            // Set the var of which to 'navSearch'
            which = 'navSearch';

            grabCityVal()
        }

        // If the 'Enter' key was not clicked then remove any errors on the screen
        else {
            error();  
        }
    }
})

// Function for the city buttons
$('.cityBtn').click(function() {
    // Set the variable which to navSearch since the first search bar will no longer be in use
    which = 'navSearch';

    // Set the cityVal to the text of which ever button clicked it, set the queryURL and fiveDayURL, then trigger the searchCity function.
    cityVal = $(this).text();
    queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
    fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
    searchCity();
})

$('.timeBtn').click(activeBtn)

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
        prevSearches = ['Salt Lake City', 'Tampa', 'San Francisco', 'Houston'];

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

// This function will grab either the value from the first searchBar or the second one
function grabCityVal() {
    // The var which will tell the code which one to look for

    // If the var which is set to 'firstSearch'
    if (which === 'firstSearch') {
        // Grab the value from the search bar and trim the whitespaces off of it
        cityVal = $('.searchBar').val().trim();

    } 

    // Otherwise
    else {
        // Grab the value from the nav search bar and trim the whitespaces off of it
        cityVal = $('.searchBar2').val().trim();
        $('.searchBar2').val('')
    }

    searchBar();
}

// Function for when either of the searchbars are in use
function searchBar() {
    // cityVal is empty
    if (cityVal === '') {
        // Display this error message
        errorMes.text('Field cannot be empty');
        
        if (which == 'firstSearch') {
            $('.mainError').slideDown('600');
        } else {
            $('.error2').slideDown('600');
        }
    }

    // If cityVal is not empty, then this will check and see if there is both a city name and a zipcode in the search bar.
    else if (cityVal.match(/[a-z]/) && cityVal.match(/[0-9]/)) {
        // If there is both a city name and a zip code, then this error message will display.
        errorMes.text('Please only search for a city or zip');

        if (which == 'firstSearch') {
            $('.mainError').slideDown('600');
        } else {
            $('.error2').slideDown('600');
        }
    }

    // If neither error messages are displayed, then this will check and see if cityVal is a city. 
    else if (cityVal.match(/[a-z]/)) {
        // If it is, then the queryURL and fiveDayURL will search by city name
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Then trigger the searchCity function
        searchCity();
    }

    // This will check and see if cityVal is a zip code 
    else if (cityVal.match(/[0-9]/)) {
        // If it is, then the queryURL and fiveDayURL will search by zip code instead
        queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?zip=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Then trigger the searchCity function
        searchCity();
    }

    // If cityVal's value is just special characters for example
    else {
        // Then this error message will display
        errorMes.text('Text cannot be read');

        if (which == 'firstSearch') {
            $('.mainError').slideDown('600');
        } else {
            $('.error2').slideDown('600');
        }
    }  
}

// Search city function
function searchCity() {
    // Just in case if the error is still on the screen run the error function
    error();

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
        $('.greetingText, .firstSearch, .previousChoices, .choiceRow, .settingsBtn1').hide();

        // Fade in the results
        $('.card').fadeIn('slow');

        // Remove the class of hide from the searchbar in the nav
        $('.navSearch').removeClass('hide');

        // This variable is grabbing the description text from OpenWeather, and setting the first letter in the string to a capitol letter.
        var descText = (response.weather[0].description.charAt(0).toUpperCase() + response.weather[0].description.substr(1).toLowerCase());
        // Then setting descText to the text of description
        $('.description').text(descText);

        // Set the src of icon to the icon from OpenWeather
        $('.icon').attr('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
        
        // Set the text of each item to data collected from the OpenWeather api
        $('.temp').text(`Temperature: ${Math.round(response.main.temp)} °F`);
        $('.feels').text(`Feels like: ${Math.round(response.main.feels_like)} °F`);
        $('.low').text(`Low of: ${Math.round(response.main.temp_min)} °F`);
        $('.high').text(`High of: ${Math.round(response.main.temp_max)} °F`);
        $('.cloud').text(`Cloud percentage: ${response.clouds.all}%`);
        $('.humidity').text(`Humidity: ${response.main.humidity}%`);
        $('.wind').text(`Wind Speed: ${(response.wind.speed).toFixed(1)} m/h`);
        $('.pressure').text(`Pressure: ${response.main.pressure} hpa`);

        // Trigger addToList function
        addToList();

        // Ajax request for the 5 day forecast
        $.ajax({
            url: fiveDayURL,
            method: 'GET'
        }).then(function(fiveReponse) {
            // This list will be used to grab list 4, 12, 20, 28, 37, then grab specific info from those lists
            var numberList = [4, 12, 20, 28, 37];

            // Loop through the five day forecast 
            for (var i = 0; i < numberList.length; i++) {
                // Index is set to the index of numberList[i]
                var index = numberList[i];

                // unixTime will grab the date text from the response and cut off the time. For example, the final output should look some like '2020-04-04'
                var unixTime = (fiveReponse.list[index].dt_txt).slice(0, 10);

                // This variable uses the moment.js to format the above date string and format to look nicer. For example, the final output should look like 'Sat, Apr 4th'
                var dateText = moment(unixTime).format("ddd, MMM Do");
                
                // Assign the dateText var to date0, 1, 2, 3, 4
                $(`.date${i}`).text(dateText);

                // Set the sorce of dateImg0, 1, 2, 3, 4, to the weather icon provided by the OpenWeather api
                $(`.dateImg${i}`).attr('src', `http://openweathermap.org/img/wn/${fiveReponse.list[index].weather[0].icon}@2x.png`);

                $(`.temp${i}`).text(`Temp: ${Math.round(fiveReponse.list[index].main.temp)} °F`);
                $(`.wind${i}`).text(`Wind: ${(fiveReponse.list[index].wind.speed).toFixed(1)} m/h`);
                $(`.humidity${i}`).text(`Humidity: ${fiveReponse.list[index].main.humidity}%`);
            }
        })

        // If the ajax request fails
    }).catch(function(error) {
        // Conosole log the error
        console.log(error)

        // Display what the error was to the user
        errorMes.text(`Error ${error.responseJSON.cod}: ${error.responseJSON.message}`);

        if (which == 'firstSearch') {
            $('.mainError').slideDown('600');
        } else {
            $('.error2').slideDown('600');
        }
    })
}

// Function for saving user's previous searches
function addToList() {
    // This will check and see if the user has made any previous searches
    if (JSON.parse(localStorage.getItem('prevSearches')) === null) {
        /*If the user has not made any previous searches
        prevSearches will be set to an empty array */
        prevSearches = [];

        // Then the user's latest search will be added to the prevSearches arrray
        prevSearches.push(name);

        // Then set the item into the user's local storage using JSON's stringify method
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    } 
    
    /* If the user had made previous searches before then this else if statement will check and see if the latest search is already saved in the list. 
    if it is already saved then the bottom else statement will run. This is to prevent the same city from showing up more than once on the previous searches list. */
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

    /* If the user has made a previous searches and the user searches for the same city 
    This else statement will run and make sure that the users latest search is always first in the array*/
    else {
        // This will slice out the city from within the array
        prevSearches.splice(prevSearches.indexOf(name), 1);

        // Then after it slices it, it will re-add the item to the front of the array
        prevSearches.unshift(name);

        // Then save to the local storage using JSON stringify
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }
}

// Setting button functions
function activeBtn() {
    if ($(this).hasClass('12HourBtn')) {
        if ($(this).hasClass('active')) {
            return;
        } else {
            $('.24HourBtn').removeClass('active');
            $('.12HourBtn').addClass('active');
        }
    } else {
        if ($(this).hasClass('active')) {
            return;
        } else {
            $('.12HourBtn').removeClass('active');
            $('.24HourBtn').addClass('active');
        }
    }
}

function error() {
    errorMes.slideUp('600');
}