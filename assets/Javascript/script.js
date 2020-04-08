// Variables needed
var cityVal;
var queryURL;
var fiveDayURL;
var prevSearches = [];
var errorMes = $('.error');
var name;
var which = 'firstSearch';
var timeForm;
var unit;
var unitTemp;
var unitSpeed;

// Trigger the load function
load();

// Hide the choices row at the start
$('.prevDiv').hide();

// When the search button is clicked
$('.searchBtn, .searchBtn2').click(function (event) {
    if ($(event.target).hasClass('searchBtn2')) {
        // Set the var of which to 'navSearch'
        which = 'navSearch';
    }

    // Trigger searchbar function
    grabCityVal();
});

// When the navbar search is clicked on then the user's previous choices will fade in
$('.navSearch').click(function() {
    $('.prevDiv').slideDown('slow');
})

// This function will check and see if the user clicked anywhere on the body of the webpage
$(document.body).click(function(event) {
    // If the user clicked the navbar search then do any empty return. This way the previous searches won't fade in then fade out immediately.
    if ($(event.target).hasClass('searchBar2')) {
        return;
    } 
    // If the user didn't click on the navbar search, then have previous choices slide up to go way.
    else {
        $('.prevDiv').slideUp('fast');
    }
})

// This function will check and see if the user clicked the 'Enter' key
$('.firstSearch, .navSearch').on('keydown', function (event) {

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

            // Run the grabCityVal function
            grabCityVal()
        }

        // If the 'Enter' key was not clicked then remove any errors on the screen
        else {        
            error();
        }
    }
})

// This adds a click event to both the Previous choice row and the possible choice row.
$('.choiceRow, .possibleRow').on('click', function(event) {
    // Check and if the click target was a button
    if ($(event.target).is(':button')) {
        // Set the variable text to the text of the button that was clicked
        var text = $(event.target).text()
        
        // Set the variable which to navSearch since the first search bar will no longer be in use
        which = 'navSearch';

        // Set the cityVal to the text of which ever button was clicked, set the queryURL, then trigger the searchCity function.
        cityVal = text;
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        searchCity();
    }
})

$('.timeBtn, .unitBtn').click(activeBtn);

$('.saveBtn').click(save);
$('.cancelBtn').click(cancel);

// Load function
function load() {
    // Check and see if 'clock' is not in the local storage
    switch (localStorage.getItem('clock') === null) {
        // If true then set 'clock' to 12 in the user's local storage, and set the timeForm variable to 12 and the momentFormat to 12-Hour format.
        case true:
            localStorage.setItem('clock', 12);
            timeForm == 12;
            var momentFormat = moment().format('llll');
            break;

        // If 'clock' is set in the user's local storage
        default:
            // Set the timeForm variable to what it is in the local storage
            timeForm = localStorage.getItem('clock');

            // Then check and see what timeForm is set to
            switch (timeForm) {
                // If it's set to 24 then make the 24-Hour button active in the settings modal
                case '24':
                    $('.12HourBtn').removeClass('active');
                    $('.24HourBtn').addClass('active');

                    // And format the dateTime text to 24-Hour format
                    var momentFormat = moment().format("ddd, ll HH:mm");
                    break;

                // If it's set to 12 then format the dateTime text to 12-Hour format
                default:
                    var momentFormat = moment().format('llll');
            }
    }

    // Set the date and time text to the current date and time via moment.js
    $('.dateTime').text(momentFormat);

    // This interval will make sure that the date and time is always up to date
    setInterval(function () {
        $('.dateTime').text(momentFormat);
    }, 1000);

    // This if statement will load up either the welcome buttons, or the user's previous searches. Depending on if they have made any searches.
    if (JSON.parse(localStorage.getItem('prevSearches')) === null) {
        // Load welcome buttons
        loadButtons1();
    } else {
        // Load previous searches
        loadButons2();
    }

    // Check and see if the user does not have 'unit' set in their localStorage
    switch (localStorage.getItem('unit') === null) {
        case true:
            // Set unit to the local storage and set the unit variables to imperial units
            localStorage.setItem('unit', 'imperial');
            unit = 'imperial';
            unitTemp = '°F';
            unitSpeed = 'm/h';
            break;

        // If the user does have 'unit' saved to their local storage
        default:
            // Check and see if the user prefers metric
            switch (localStorage.getItem('unit') == 'metric') {
                // If true then change the unit variables to metric and makes the metric button active in the settings modal
                case true:
                    unit = localStorage.getItem('unit');
                    unitTemp = '°C';
                    unitSpeed = 'km/h';
                    $('.imperialBtn').removeClass('active');
                    $('.metricBtn').addClass('active');
                    break;
                // If false then change the unit variables to imperial units
                default:
                    unit = localStorage.getItem('unit');
                    unitTemp = '°F';
                    unitSpeed = 'm/h';
            }

    }

    // This will check and see if the user has made a search recently
    if (localStorage.getItem('lastSearch') !== null) {
        // if they have then cityVal will be set to their last search item and the page will load
        cityVal = localStorage.getItem('lastSearch');
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        searchCity();
    } else {
        // If they have not made a search or have cleared their storage, then the welcome page will show instead.
        $('.greetingText, .firstSearch, .settingsBtn1').removeClass('hide');
    }

    $('.beforeFooter').fadeIn('slow');
}

function loadButtons1() {
    // Remove the hide class from the possible choices text
    $('.possibleChoices').removeClass('hide');

    // If the above switch statement is true then the prevSearches array will be set to this default list
    prevSearches = ['Salt Lake City', 'Tampa', 'San Francisco', 'Houston'];

    // Then this function will go in and create buttons based on the prevSearches array
    $(prevSearches).each(function (e) {
        // This will also add a property of type="button" and add the classes 'btn btn-secondary cityBtn' to each button
        var button = $('<button>').text(prevSearches[e]).prop('type', 'button').addClass('btn btn-secondary cityBtn');

        // Append the newly made buttons to .choiceRow
        $('.possibleRow').append(button);
    })
}

function loadButons2() {
    $('.choiceRow').empty();

    // The prevSearchs array will be set to the saved array in the user's local storage
    prevSearches = JSON.parse(localStorage.getItem('prevSearches'));

    // Then this function will make buttons based off of the users
    $(prevSearches).each(function (e) {
        // Add a property of type="button" and add the classes 'btn btn-secondary cityBtn' to each button
        var button = $('<button>').text(prevSearches[e]).prop('type', 'button').addClass('btn btn-secondary cityBtn');

        // Then appened the newly made button to .choiceRow
        $('.choiceRow').append(button);
    })
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
        $('.searchBar2').val('');
    }

    // Quickly fade out the previous choice buttons if they're showing
    $('.prevDiv').slideUp('fast');

    // Run the searchBar function
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
        // If it is, then the queryURL will search by city name
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Then trigger the searchCity function
        searchCity();
    }

    // This will check and see if cityVal is a zip code 
    else if (cityVal.match(/[0-9]/)) {
        // If it is, then the queryURL will search by zip code instead
        queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

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
    }).then(function (response) {
        // Console log the response
        console.log(response);
        
        var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        
        $.ajax({
            url: oneCallUrl,
            method: 'GET'
        }).then(function(oneCallRepsponse) {
            // Log the response
            console.log(oneCallRepsponse);

            // Set the text to the UV Index number
            $('.uviInfo').text(oneCallRepsponse.current.uvi);

            // This if else will run and check where the UV Index is at.

            // If the UVI is greater than or equal to eleven, then set the background to purple and reset the text color to white.
            if (oneCallRepsponse.current.uvi >= 11) {
                $('.uviInfo').css({'background-color': 'purple', 'color': 'white'});
            } 
            
            // If the UVI is greater than or equal to 8, set the background to red and reset the text color to white.
            else if (oneCallRepsponse.current.uvi >= 8) {
                $('.uviInfo').css({'background-color': 'red', 'color': 'white'});
            } 
            
            // If the UVI is greater than or equal to 6, set the background to orange and reset the text color to white.
            else if (oneCallRepsponse.current.uvi >= 6) {
                $('.uviInfo').css({'background-color': 'orange', 'color': 'white'});
            } 
            
            // If the UVI is greater than or equal to 3, set the background to yellow and set the text color to black. This one is special because white text on a yellow background is difficult to read.
            else if (oneCallRepsponse.current.uvi >= 3) {
                $('.uviInfo').css({'background-color': 'yellow', 'color': 'black'});
            } 
            
            // Finally if none of the above run, then set the UVI background to green and reset the text color to white.
            else {
                $('.uviInfo').css({'background-color': 'green', 'color': 'white'});
            }

            // This list will be used to grab list 0, 8, 16, 24, 32, then grab specific info from those lists
            var numberList = [1, 2, 3, 4, 5];

            $(numberList).each(function (e) {
                // Set the sorce of dateImg0, 1, 2, 3, 4, to the weather icon provided by the OpenWeather api
                $(`.dateImg${e}`).attr('src', `https://openweathermap.org/img/wn/${oneCallRepsponse.daily[numberList[e]].weather[0].icon}@2x.png`);

                // unixTime will grab the date text from the response and cut off the time. For example, the final output should look some like '2020-04-04'
                var unixTime = moment.unix(oneCallRepsponse.daily[numberList[e]].dt);

                // This variable uses the moment.js to format the above date string and format to look nicer. For example, the final output should look like 'Sat, Apr 4th'
                var dateText = moment(unixTime).format("ddd, MMM Do");

                // Assign the dateText var to date0, 1, 2, 3, 4
                $(`.date${e}`).text(dateText);

                $(`.temp${e}`).text(`Temp: ${(oneCallRepsponse.daily[numberList[e]].temp.day).toFixed(1)} ${unitTemp}`);

                // // If the user prefers the metric system
                if (unit == 'metric') {
                    // Then this will grab the current wind speed which is in meters per second, and convert it to km/h.
                    $(`.wind${e}`).text(`Wind: ${((oneCallRepsponse.daily[numberList[e]].wind_speed) * 3.6).toFixed(1)} ${unitSpeed}`);
                }
                // If the user prefers the imperial system, then the text will just be set to mph.
                else {
                    $(`.wind${e}`).text(`Wind: ${(oneCallRepsponse.daily[numberList[e]].wind_speed).toFixed(1)} ${unitSpeed}`);
                }
                $(`.humidity${e}`).text(`Humidity: ${oneCallRepsponse.daily[numberList[e]].humidity}%`);
            })
        })
        
        // Set the variable name to the city name given by OpenWeather
        name = response.name;

        // Change the card title the name of the city from the response
        $('.cityName').text(name);

        //Hide the welcome screen 
        $('.greetingText, .firstSearch, .settingsBtn1, .possibleChoices, .possibleRow').hide();

        // Fade in the results
        $('.card').fadeIn('slow');

        // Remove the class of hide from the searchbar in the nav
        $('.navSearch').removeClass('hide');

        // This variable is grabbing the description text from OpenWeather, and setting the first letter in the string to a capitol letter.
        var descText = (response.weather[0].description.charAt(0).toUpperCase() + response.weather[0].description.substr(1).toLowerCase());
        // Then setting descText to the text of description
        $('.description').text(descText);

        // Set the src of icon to the icon from OpenWeather
        $('.icon').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);

        // Set the text of each item to data collected from the OpenWeather api
        $('.temp').text(`Temperature: ${(response.main.temp).toFixed(1)} ${unitTemp}`);
        $('.low').text(`Low of: ${(response.main.temp_min).toFixed(1)} ${unitTemp}`);
        $('.high').text(`High of: ${(response.main.temp_max).toFixed(1)} ${unitTemp}`);
        $('.cloud').text(`Cloud percentage: ${response.clouds.all}%`);
        $('.humidity').text(`Humidity: ${response.main.humidity}%`);
        $('.pressure').text(`Pressure: ${response.main.pressure} hpa`);

        // If the user prefers the metric system
        if (unit == 'metric') {
            // Then this will grab the current wind speed which is in meters per second, and convert it to km/h.
            $('.wind').text(`Wind Speed: ${((response.wind.speed) * 3.6).toFixed(1)} ${unitSpeed}`);
        }
        // If the user prefers the imperial system, then the text will just be set to mph.
        else {
            $('.wind').text(`Wind Speed: ${(response.wind.speed).toFixed(1)} ${unitSpeed}`);
        }

        // Run the addToList function
        addToList();

        // If the ajax request fails
    }).catch(function (error) {
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
    
    // Refresh the buttons
    loadButons2();
    
    // Save the latest search to the local storage, so that way when the page reloads it'll go back to the user's last search.
    localStorage.setItem('lastSearch', name);
}

// Setting button functions
function activeBtn() {
    // Check and see if the user clicked on either the 12-Hour button or the 24-Hour button
    if ($(this).hasClass('12HourBtn') || $(this).hasClass('24HourBtn')) {
        switch ($(this).hasClass('12HourBtn')) {
            case true:
                if ($(this).hasClass('active')) {
                    return;
                } else {
                    $('.24HourBtn').removeClass('active');
                    $('.12HourBtn').addClass('active');
                }
                break;
            default:
                if ($(this).hasClass('active')) {
                    return;
                } else {
                    $('.12HourBtn').removeClass('active');
                    $('.24HourBtn').addClass('active');
                }
        }
    }

    // If neither were picked, then it was one of the unit buttons
    else {
        switch ($(this).hasClass('imperialBtn')) {
            case true:
                if ($(this).hasClass('active')) {
                    return;
                } else {
                    $('.metricBtn').removeClass('active');
                    $('.imperialBtn').addClass('active');
                }
                break;
            default:
                if ($(this).hasClass('active')) {
                    return;
                } else {
                    $('.imperialBtn').removeClass('active');
                    $('.metricBtn').addClass('active');
                }
        }
    }
}

// This function will save the user's setting preferences to their localStorage
function save() {
    // If the user chose 12-Hour time
    if ($('.12HourBtn').hasClass('active')) {
        localStorage.setItem('clock', 12);
    }
    // If the user chose 24-Hour time
    else {
        localStorage.setItem('clock', 24);
    }

    // If the user chose Imperial
    if ($('.imperialBtn').hasClass('active')) {
        localStorage.setItem('unit', 'imperial');
    }
    // If the user chose Metric
    else {
        localStorage.setItem('unit', 'metric');
    }

    // Refresh the page so that the changes can take place
    location.reload();
}

// This function will add the class of 'active' back to the button it was on before the user hit cancel
function cancel() {
    // Check and see if the clock in localStorage is 24
    switch (localStorage.getItem('clock') == '24') {
        // If it is then switch the 24-Hour button to active
        case true:
            $('.12HourBtn').removeClass('active');
            $('.24HourBtn').addClass('active');
            break;

        // It it's not then switch the 12-Hour button to active
        default:
            $('.24HourBtn').removeClass('active');
            $('.12HourBtn').addClass('active');
    }

    // Check and see if unit in localStorage is set to metric
    switch (unit == 'metric') {
        // If it is then switch the Metric button to active
        case true:
            $('.imperialBtn').removeClass('active');
            $('.metricBtn').addClass('active');
            break;

        // If it's not then set the Imperial button to active
        default:
            $('.metricBtn').removeClass('active');
            $('.imperialBtn').addClass('active');
    }
}

// This function will simply make the error message go away
function error() {
    errorMes.slideUp('600');
}