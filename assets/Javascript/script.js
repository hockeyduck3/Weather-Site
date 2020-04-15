// Variables needed
var cityVal;
var queryURL;
var quickURL;
var prevSearches = [];
var errorMes = $('.error, .defaultError');
var name;
var prev = '';
var whichSearch = 'firstSearch';
var format;
var timeForm;
var unit;
var unitTemp;
var unitSpeed;

// Trigger the load function
load();

// When the search button is clicked
$('.searchBtn, .searchBtn2').click(function (event) {
    if ($(event.target).hasClass('searchBtn2')) {
        // Set the var of which to 'navSearch'
        whichSearch = 'navSearch';
    }

    // Trigger searchbar function
    grabCityVal();
});

// When the navbar search is clicked on then the user's previous choices will fade in
$('.searchBar2').click(function () {
    // This if statement will check and see if the user has made any previous searches
    if (JSON.parse(localStorage.getItem('prevSearches')) !== null) {
        // If they have then show them their previous searches
        $('.prevDiv').slideDown('slow');
    }
})

// When the user clicks on uviInfo trigger the uviInfoToggle
$('.uviInfo').click(uviInfoToggle)

// This function will check and see if the user clicked anywhere on the body of the webpage
$(document.body).click(function (event) {
    // If the user clicked the navbar search or the search button then do any empty return. This way the previous searches won't fade in then fade out immediately.
    if ($(event.target).hasClass('searchBar2')) {
        return;
    } else if ($(event.target).hasClass('searchBtn2')) {
        return;
    }
    
    // If the user didn't click on the navbar search, then have previous choices slide up to go way.
    else {
        $('.prevDiv').slideUp('fast');
    }
})

// This function will check and see if the user clicked the 'Enter' key
$('.firstSearch, .navSearch, .defaultLocation').on('keydown', function (event) {
    // Check and see if the user hit enter on the welcome page search bar
    if ($(event.target).hasClass('searchBar')) {
        // If the 'Enter' key is clicked then run the grabCityVal function
        if (event.keyCode === 13) {
            // Trigger grabCityVal function
            grabCityVal();
        }
        // If the 'Enter' key was not clicked then remove any errors on the screen
        else {
            errorRemove();
        }
    } 

    // Check and see if the user typed in the defaultLocation text
    else if ($(event.target).hasClass('defaultLocation')) {
        // If they didd then remove any error
        errorRemove();
    }

    // If neither of the two if statements above don't run, then the user was typing in the navbar search
    else {
        //If the 'Enter' key is clicked then run the searchBar function
        if (event.keyCode === 13) {
            // Set the var of whichSearch to 'navSearch'
            whichSearch = 'navSearch';

            // Run the grabCityVal function
            grabCityVal()
        }

        // If the 'Enter' key was not clicked then remove any errors on the screen
        else {
            errorRemove();
        }
    }
})

// This adds a click event to both the Previous choice row and the possible choice row.
$('.choiceRow, .possibleRow').on('click', function (event) {
    // Check and if the click target was a button
    if ($(event.target).is(':button')) {
        // Set the variable text to the text of the button that was clicked
        var text = $(event.target).text()

        // Set the variable whichSearch to navSearch since the first search bar will no longer be in use
        whichSearch = 'navSearch';

        // Set the cityVal to the text of which ever button was clicked, set the queryURL, then trigger the searchCity function.
        cityVal = text;
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        searchCity();
    }
})

// When the time button or the unit button in the settings modal is clicked
$('.timeBtn, .unitBtn').click(function () {
    // Check and see if the user clicked on either the 12-Hour button or the 24-Hour button
    if ($(this).hasClass('12HourBtn') || $(this).hasClass('24HourBtn')) {
        // Check and see if the user clicked on the 12-hour button
        switch ($(this).hasClass('12HourBtn')) {
            // If they did click on the 12-hour button
            case true:
                // Check and see if the 12-hour button is currently active
                if ($(this).hasClass('active')) {
                    // If it is then do an empty return
                    return;
                } else {
                    // If it's not then take the active class off of 24-hour button and add it to the 12-hour button
                    $('.24HourBtn').removeClass('active');
                    $('.12HourBtn').addClass('active');
                }
                break;
                
            // If the 12-hour button was not seleceted then that means the 24-hour button was selected instead 
            default:
                // Check and see if the 24-hour button has the class of active on it
                if ($(this).hasClass('active')) {
                    // If it does then do an empty return
                    return;
                } else {
                    // If it's not then remove the active class from the 12-hour button and add it to the 24-hour button
                    $('.12HourBtn').removeClass('active');
                    $('.24HourBtn').addClass('active');
                }
        }
    }

    // If neither were picked, then it was one of the unit buttons
    else {
        // Check and see if the imperial button was clicked
        switch ($(this).hasClass('imperialBtn')) {
            // If they did click the imperial button
            case true:
                // Check and see if the imperial button has a class of active on it
                if ($(this).hasClass('active')) {
                    // If it does then do an empty return
                    return;
                } else {
                    // If it does not then remove the class of active off of the metric button and add it to the imperial button
                    $('.metricBtn').removeClass('active');
                    $('.imperialBtn').addClass('active');
                }
                break;
            // If they didn't click on the imperial button then that means the metric button was selected instead
            default:
                // Check and see if the metric button has the active class on it
                if ($(this).hasClass('active')) {
                    // If it does then do an empty return
                    return;
                } else {
                    // If it does not then remove the class of active from the imperial button and add it to the metric button
                    $('.imperialBtn').removeClass('active');
                    $('.metricBtn').addClass('active');
                }
        }
    }
});

// When the save button is clicked
$('.saveBtn').click(function () {
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

    // Set the variable for the default location to the value of the id defaultLocation and trim the white spaces off of it
    var defaultLocal = $('#defaultLocation').val().trim();

    // Check and see if defaultLocal is not equal to an empty string
    if (defaultLocal !== '') {
        // If it's not empty then check and see if there both letters and numbers in the value
        if (defaultLocal.match(/[a-z]/i) && defaultLocal.match(/[0-9]/)) {
            // If there are then set this text of the error
            $('.defaultError').text('Please only use a city or zip');

            // Slide the error down
            $('.defaultError').slideDown('fast');

            // Then delete the value
            $('#defaultLocation').val('');

        } 
        
        // If it does not contain both letters and numbers, check and see if it only as letters
        else if (defaultLocal.match(/[a-z]/i)) {
            // If true then set the quickURL variable to the link below with the query being defaultLocal
            quickURL = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocal}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
            
            // Run the quickCheck function
            quickCheck();
        } 
        
        // If it does not contain letters, then check and see if it contains numbers
        else if (defaultLocal.match(/[0-9]/)) {
            // If it does have numbers, then set the quickURL to the zip code url and search with the query defaultLocal
            quickURL = `https://api.openweathermap.org/data/2.5/weather?zip=${defaultLocal}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
           
            // Run the quickCheck function
            quickCheck();
        } 

        // If none of the other if statements above run then this will run
        else {
            // Set the text of this error
            $('.defaultError').text('Value cannot be read');

            // Slide the error down
            $('.defaultError').slideDown('fast');
        }
    } 
    
    // If defaultLocal is a blank string then check and see if there already is a default set in user's local storage
    else if (localStorage.getItem('default') !== null) {
        // If there is then remove it from the local storage since, this acts as a way for the user to delete their default search.
        localStorage.removeItem('default');

        // Then reload the page
        location.reload();
    } 
    
    // If none of the above if statements run the reload the page
    else {
        location.reload();
    }
});

/* This function will run a quick ajax search to check and see if ther user's default location settings is a legit location.
This will help to mkae sure that if the user puts in a non-valid location then it won't cause errors when the page reloads. */
function quickCheck() {
    // Run the ajax request
    $.ajax({
        url: quickURL,
        method: 'GET'

       // If the user user's default was accepted as a valid location    
    }).then(function (quickResponse) {
        // Then save the quick response's name as the default location in the user's local storage 
        localStorage.setItem('default', quickResponse.name);

        // Then check and see if if the default location is in the previous searches array
        if (prevSearches.indexOf(localStorage.getItem('default')) !== -1) {
            // If it is the splice it out of the array
            prevSearches.splice(prevSearches.indexOf(localStorage.getItem('default')), 1);

            // And resave the list to the user's local storage
            localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
        } 

        // After the first if state runs, check and see if the last search in the user's local storage is not the same as the default location
        if (localStorage.getItem('lastSearch') !== localStorage.getItem('default')) {
            // If it is not the same, then set the last search in the user's local storage to the front of the previous searches array
            prevSearches.unshift(localStorage.getItem('lastSearch'));

            // Save the previous searches array to the local storage using the JSON stringify method
            localStorage.setItem('prevSearches', JSON.stringify(prevSearches));

            // Then delete the last search from the user's local storage
            localStorage.removeItem('lastSearch');
        }
        
        // Refresh the page so that the changes can take place
        location.reload();

       // If the user's default was not accepted as a valid location 
    }).catch( function (quickError) {
        // Set the default error text to the error in the console
        $('.defaultError').text(`Error ${quickError.responseJSON.cod}: ${quickError.responseJSON.message}`);

        // Quickly show the user the error using the jQuery slide down animation
        $('.defaultError').slideDown('fast');

        // Remove what the user typed in from the default location text
        $('#defaultLocation').val('');
    })
}

// When the cancel button is clicked trigger the cancel function
$('.cancelBtn').click(function () {
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
});

// Load function
function load() {
    // Hide the choices row at the start
    $('.prevDiv').hide();
    $('.previousText').removeClass('hide');

    // Check and see if 'clock' is not in the local storage
    switch (localStorage.getItem('clock') === null) {
        // If true then set 'clock' to 12 in the user's local storage, and set the timeForm variable to 12 and the format varaible to 12-Hour format.
        case true:
            localStorage.setItem('clock', 12);
            timeForm = 12;
            format = 'llll';
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
                    format = "ddd, ll HH:mm";
                    break;

                // If it's set to 12 then format the dateTime text to 12-Hour format
                default:
                    format = 'llll';
            }
    }

    // Set the date and time text to the current date and time via moment.js
    $('.dateTime').text(moment().format(format));

    // This interval will make sure that the date and time is always up to date
    setInterval(function () {
        $('.dateTime').text(moment().format(format));
    }, 1000);

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
            switch (localStorage.getItem('unit') === 'metric') {
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

    // Check and see if the user has set a default location
    if (localStorage.getItem('default') !== null) {
        // If they have then set the value of default location in the settings modal to the value that's saved in the user's local storage
        $('#defaultLocation').val(localStorage.getItem('default'))

        // Then set the city value variable to the value in the local storage
        cityVal = localStorage.getItem('default');

        // Set the queryURL variable
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        
        // Then run the serach city function
        searchCity();
    }

    // This will check and see if the user has made a search recently
    else if (localStorage.getItem('lastSearch') !== null) {
        // if they have then cityVal will be set to their last search item and the page will load
        cityVal = localStorage.getItem('lastSearch');
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        searchCity();
    } else {
        // If they have not made a search or have cleared their storage, then the welcome page will show instead.
        $('.greetingText, .firstSearch, .settingsBtn1').hide();
        $('.greetingText, .firstSearch, .settingsBtn1').removeClass('hide');
        $('.greetingText, .firstSearch, .settingsBtn1').fadeIn('slow');
    }

    // This if statement will load up either the welcome buttons, or the user's previous searches. Depending on if they have made any searches.
    if (JSON.parse(localStorage.getItem('prevSearches')) === null && localStorage.getItem('lastSearch') === null) {
        // Load welcome buttons
        loadButtons1();
    } else {
        // Load previous searches
        loadButons2();
    }

    // Fade in the github link
    $('.beforeFooter').fadeIn('slow');
}

function loadButtons1() {
    // Hide the possible choice and it's header text using jQuery's hide function
    $('.possibleChoices, .possibleRow').hide();

    // Then on the possible choice header text from the class of hide from it
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

    // After everything is done loading, fade everything in.
    $('.possibleChoices, .possibleRow').fadeIn('slow');
}

function loadButons2() {
    // This is to make sure that there is nothing in the div
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
    // The var whichSearch will tell the code whichSearch one to look for

    // If the var whichSearch is set to 'firstSearch'
    if (whichSearch === 'firstSearch') {
        // Grab the value from the search bar and trim the whitespaces off of it
        cityVal = $('.searchBar').val().trim();
    }

    // Otherwise
    else {
        // Grab the value from the nav search bar and trim the whitespaces off of it
        cityVal = $('.searchBar2').val().trim();
        $('.searchBar2').val('');
    }

    // Run the searchBar function
    searchBar();
}

// Function for when either of the searchbars are in use
function searchBar() {
    // cityVal is empty
    if (cityVal === '') {
        // Display this error message
        errorMes.text('Field cannot be empty');

        // Run the display error function
        displayError();
    }

    // If cityVal is not empty, then this will check and see if there are both letters and numbers in the search bar.
    else if (cityVal.match(/[a-z]/i) && cityVal.match(/[0-9]/)) {
        // If there is both a city name and a zip code, then this error message will display.
        errorMes.text('Please only search for a city or zip');

        // Run the display error function
        displayError();
    }

    // If neither error messages are displayed, then this will check and see if cityVal is a city. 
    else if (cityVal.match(/[a-z]/i)) {
        // If it is, then the queryURL will search by city name
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Quickly fade out the previous choice buttons if they're showing
        $('.prevDiv').slideUp('fast');

        // Then trigger the searchCity function
        searchCity();
    }

    // This will check and see if cityVal is a zip code 
    else if (cityVal.match(/[0-9]/)) {
        // If it is, then the queryURL will search by zip code instead
        queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Quickly fade out the previous choice buttons if they're showing
        $('.prevDiv').slideUp('fast');

        // Then trigger the searchCity function
        searchCity();
    }

    // If cityVal's value is just special characters for example
    else {
        // Then this error message will display
        errorMes.text('Text cannot be read');

        // Run the display error function
        displayError();
    }
}

// Search city function
function searchCity() {
    if ($('.row').hasClass('dropup')) {
        uviInfoToggle();
    }

    // Just in case if the error is still on the screen run the errorRemove function
    errorRemove();

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
        }).then(function (oneCallRepsponse) {
            // Log the response
            console.log(oneCallRepsponse);

            var currentUVI = oneCallRepsponse.current.uvi;

            var daily = oneCallRepsponse.daily;

            // Set the text to the UV Index number
            $('.uviInfo, .uviInfo2').text(currentUVI);

            // This if statement will check to see if the UV Index is between 3 and 6, which would be in the yellow zone.
            if (currentUVI >= 3 && currentUVI <= 5.99) {
                // If it is then set the color of the text to black, otherwise it will be hard to read.
                $('.uviInfo, .uviMoreInfo').css('color', 'black');
            } else {
                // If it's not then set the text color to white.
                $('.uviInfo, .uviMoreInfo').css('color', 'white');       
            }

            // If the UV Index is greater or equal to eleven
            if (currentUVI >= 11) {
                // Then set the background color to purple
                $('.uviInfo, .uviMoreInfo').css('background-color', 'purple');

                // Check and see if the user prefers 12-Hour time format
                if (timeForm == 12) {
                    // If the user does, then set the elevenOrHigher text to warn the user to stay inside between 10am and 4pm. 
                    $('.elevenOrHigher').text('Stay inside between the hours of 10am and 4pm.');
                } else {
                    // If the user prefers 24-hour format, then set the elevenOrHigher text to warn the user to stay inside between 10:00 and 16:00.
                    $('.elevenOrHigher').text('Stay inside between the hours of 10:00 and 16:00.');
                }
                
                // Set the text of uviMoreText
                $('.uviMoreText').text('Sunscreen, Sunglasses, a Hat, and Shade are also advised.');

                // And set the burnTime text to 15 minutes or less
                $('.burnTime').text('15 minutes or less.');

            } 
            
            // Or if the current UV Index is between 6 and 10.99
            else if (currentUVI >= 6 && currentUVI <= 10.99) {
                // Make sure elevenOrHigher is empty of text
                $('.elevenOrHigher').empty();

                // Set the text of uviMoreText
                $('.uviMoreText').text('Sunscreen, Sunglasses, a Hat, and Shade are advised.');

                // Then check and see if the current UV Index is greater or equal to 8
                if (currentUVI >= 8) {
                    // If it is then set the background color to red
                    $('.uviInfo, .uviMoreInfo').css('background-color', 'red');

                    // Then set the burnTime text to 20 minutes or less
                    $('.burnTime').text('20 minutes or less.');
                } 

                // If it's not greater or equal to 8
                else {
                    // Set the background color to orange
                    $('.uviInfo, .uviMoreInfo').css('background-color', 'orange');

                    // Then set the burnTime text to 30 minutes or less
                    $('.burnTime').text('30 minutes or less.');
                }

            } 
            
            // Or if the current UV Index is greater or equal to 3
            else if (currentUVI >= 3) {
                // Make sure elevenOrHigher is empty of text 
                $('.elevenOrHigher').empty();

                // Set the background color to yellow
                $('.uviInfo, .uviMoreInfo').css('background-color', 'yellow');

                // Set the text of uviMoreText
                $('.uviMoreText').text('Sunscreen, Sunglasses, and a Hat are advised.');

                // Set the burnTime text to 40 minutes or less
                $('.burnTime').text('40 minutes or less.');
            } 
            
            // Finally if none of the other if statements run
            else {
                // Make sure elevenOrHigher is empty of text
                $('.elevenOrHigher').empty();

                // Set the background color to green
                $('.uviInfo, .uviMoreInfo').css('background-color', 'green');

                // Set the text of uviMoreText
                $('.uviMoreText').text('Sunglasses, and a Hat are advised.');

                // Set the burnTime text to 60 minutes or less
                $('.burnTime').text('60 minutes or less.');
            }

            // This list will be used to grab list 1, 2, 3, 4, 5, then grab specific info from those lists
            var numberList = [1, 2, 3, 4, 5];

            // Instead of running a for loop, run a .each for the 5-day forecast
            $(numberList).each(function (e) {
                // Set the sorce of dateImg0, 1, 2, 3, 4, to the weather icon provided by the OpenWeather api
                $(`.dateImg${e}`).attr('src', `https://openweathermap.org/img/wn/${daily[numberList[e]].weather[0].icon}@2x.png`);

                // unixTime will grab the date text from the response and cut off the time. For example, the final output should look some like '2020-04-04'
                var unixTime = moment.unix(daily[numberList[e]].dt);

                // This variable uses the moment.js to format the above date string and format to look nicer. For example, the final output should look like 'Sat, Apr 4th'
                var dateText = moment(unixTime).format("ddd, MMM Do");

                // Assign the dateText var to date0, 1, 2, 3, 4
                $(`.date${e}`).text(dateText);

                // Assign the temperature for that day to temp0, 1, 2, 3, 4
                $(`.temp${e}`).text(`Temp: ${(daily[numberList[e]].temp.day).toFixed(1)} ${unitTemp}`);
                
                // Assign the humidity for that day to humidity0, 1, 2, 3, 4
                $(`.humidity${e}`).text(`Humidity: ${daily[numberList[e]].humidity}%`);
               
                // // If the user prefers the metric system
                if (unit === 'metric') {
                    // Then this will grab the current wind speed which is in meters per second, and convert it to km/h.
                    $(`.wind${e}`).text(`Wind: ${((daily[numberList[e]].wind_speed) * 3.6).toFixed(1)} ${unitSpeed}`);
                }
                // If the user prefers the imperial system, then the text will just be set to mph.
                else {
                    $(`.wind${e}`).text(`Wind: ${(daily[numberList[e]].wind_speed).toFixed(1)} ${unitSpeed}`);
                }
            })
        })

        // Set the variable name to the city name given by OpenWeather
        name = response.name;

        // Set the variable main to the the main section of the response from OpenWeather
        var main = response.main;

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
        $('.temp').text(`Temperature: ${(main.temp).toFixed(1)} ${unitTemp}`);
        $('.low').text(`Low of: ${(main.temp_min).toFixed(1)} ${unitTemp}`);
        $('.high').text(`High of: ${(main.temp_max).toFixed(1)} ${unitTemp}`);
        $('.cloud').text(`Cloud percentage: ${response.clouds.all}%`);
        $('.humidity').text(`Humidity: ${main.humidity}%`);
        $('.pressure').text(`Pressure: ${main.pressure} hpa`);

        // If the user prefers the metric system
        if (unit === 'metric') {
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

        displayError()
    })
}

// Function for saving user's previous searches
function addToList() {
    // If the vairable of prev is equal to an empty string
    if (prev === '') {
        // Set prev to the string of name
        prev = name;
    }

    // This if statement will check and see if the user has made a previous search
    if (localStorage.getItem('lastSearch') !== null) {
        // If they have then prev will be set to the value in the local storage
        prev = localStorage.getItem('lastSearch');
    }

    // If prev is equal to name
    if (prev === name) {
        // Set name to the local storage
        localStorage.setItem('lastSearch', name);

        // Then return
        return;
    } 
    
    // If prev is not equal to name then check and see if the user has not made any previous searches
    else if (JSON.parse(localStorage.getItem('prevSearches')) === null) {
        /*If the user has not made any previous searches
        prevSearches will be set to an empty array */
        prevSearches = [];

        // Then the user's previous search will be added to the prevSearches arrray
        prevSearches.push(prev);

        // Then save prevSearches into the user's local storage using JSON's stringify method
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));

    } 
    
    // If the user has made previous searches then check and see if the user's previous search is already in the list
    else if (prevSearches.indexOf(prev) === -1) {

        // If the previous seach is not on the list, then this if statement will check and see if the prevSearches array length is at 6 or more than 6.
        if (prevSearches.length >= 6) {
            // If it is, then this will check and see if the user's latest search is on the list
            if (prevSearches.indexOf(name) !== -1) {
                // If it is then it gets cut out
                prevSearches.splice(prevSearches.indexOf(name), 1);
            } else {
                // If it's not then the last search in the array will get taken out of the array.
                prevSearches.pop();
            }

            // Then set the latest search to the front of the array
            prevSearches.unshift(prev);
        }

        // If prevSearches is less than 6
        else {
            // Then just add the previous search to the front of the array
            prevSearches.unshift(prev);
        }

        // Then after all of that is done, save prevSearches to the local storage using JSON stringify
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }

    /* If the user has made a previous searches and the user searches for the same city 
    This else statement will run and make sure that the users previous search is always first in the array*/
    else {
        // This will slice out the city from within the array
        prevSearches.splice(prevSearches.indexOf(prev), 1);

        // Then after it slices it, it will re-add the item to the front of the array
        prevSearches.unshift(prev);

        // Then save to the local storage using JSON stringify
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }

    // This last if statement will check if the user's latest search is in the list
    if (prevSearches.indexOf(name) !== -1) {
        // If it is the splice it out of the array
        prevSearches.splice(prevSearches.indexOf(name), 1);

        // And resave the list to the user's local storage
        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }

    // Refresh the buttons
    loadButons2();

    // Save the latest search to the local storage, so that way when the page reloads it'll go back to the user's last search.
    localStorage.setItem('lastSearch', name);

    // Set prev to the user's latest search
    prev = name;
}

// Function for displaying error messages
function displayError() {
    // This if statement will check and see if the user was typing on the welcome search bar
    if (whichSearch === 'firstSearch') {
        // If so then it will display the error underneath that
        $('.mainError').slideDown('600');
    } 
    // Or if it was the navbar search bar
    else {
        // Then it will display the error there
        $('.error2').slideDown('600');
    }
}

// Function for the uviInfo
function uviInfoToggle() {
    // Check and see if row also has a class of dropup on it
    if ($('.row').hasClass('dropup')) {
        // If it does then remove the uviMoreInfo section with a slide up animation
        $('.uviMoreInfo').slideUp('fast');

        // Then remove the class of 'dropup' from the row class
        $('.row').removeClass('dropup');
    } 
    
    // If it does not have a class of dropup on it
    else {
        // Show the user more UV Index info using a slide down animation
        $('.uviMoreInfo').slideDown('slow');

        // And add the class 'dropup' to the class of row
        $('.row').addClass('dropup');
    }
}

// This function will simply make any error message go away using the jQuery slide up animation
function errorRemove() {
    errorMes.slideUp('600');
}
