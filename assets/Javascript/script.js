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

load();

// When the search button is clicked
$('.searchBtn, .searchBtn2').click(function (event) {
    if ($(event.target).hasClass('searchBtn2')) {
        whichSearch = 'navSearch';
    }

    grabCityVal();
});

// When the navbar search is clicked on then the user's previous choices will fade in
$('.searchBar2').click(function () {
    if (JSON.parse(localStorage.getItem('prevSearches')) !== null) {
        $('.prevDiv').slideDown('slow');
    }
})

$('.uviInfo').click(uviInfoToggle)

// This function will check and see if the user clicked anywhere on the body of the webpage
$(document.body).click(function (event) {
    if ($(event.target).hasClass('searchBar2') || $(event.target).hasClass('searchBtn2')) {
        return;
    } else {
        $('.prevDiv').slideUp('fast');
    }
})

// This function will check and see if the user clicked the 'Enter' key
$('.firstSearch, .navSearch, .defaultLocation').on('keydown', function (event) {
    if ($(event.target).hasClass('searchBar')) {
        if (event.keyCode === 13) {
            grabCityVal();
        } else {
            errorRemove();
        }
    } 

    // Check and see if the user typed in the defaultLocation text
    else if ($(event.target).hasClass('defaultLocation')) {
        errorRemove();
    }

    // If neither of the two if statements above don't run, then the user was typing in the navbar search
    else {
        if (event.keyCode === 13) {
            whichSearch = 'navSearch';

            grabCityVal()
        } else {
            errorRemove();
        }
    }
})

// This adds a click event to both the Previous choice row and the possible choice row.
$('.choiceRow, .possibleRow').on('click', function (event) {
    if ($(event.target).is(':button')) {
        var text = $(event.target).text()

        whichSearch = 'navSearch';
        cityVal = text;
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        searchCity();
    }
})

// When the time button or the unit button in the settings modal is clicked
$('.timeBtn, .unitBtn').click(function () {
    if ($(this).hasClass('12HourBtn') || $(this).hasClass('24HourBtn')) {
        // Check and see if the user clicked on the 12-hour button
        switch ($(this).hasClass('12HourBtn')) {
            case true:
                // Then check and see if the 12-hour button is currently active
                if ($(this).hasClass('active')) {
                    return;
                } else {
                    // If it's not then take the active class off of 24-hour button and add it to the 12-hour button
                    $('.24HourBtn').removeClass('active');
                    $('.12HourBtn').addClass('active');
                }
                break;
                
            // If the 12-hour button was not seleceted then that means the 24-hour button was selected instead 
            default:
                // Check and see if the 24-hour button is active
                if ($(this).hasClass('active')) {
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
            case true:
                // Check and see if the imperial button has a class of active on it
                if ($(this).hasClass('active')) {
                    return;
                } else {
                    // If it does not then remove the class of active off of the metric button and add it to the imperial button
                    $('.metricBtn').removeClass('active');
                    $('.imperialBtn').addClass('active');
                }
                break;

            // If they didn't click on the imperial button then that means the metric button was selected instead
            default:
                // Check and see if the metric button is active
                if ($(this).hasClass('active')) {
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
     if ($('.12HourBtn').hasClass('active')) {
        localStorage.setItem('clock', 12);

    } else {
        localStorage.setItem('clock', 24);
    }

    // If the user chose Imperial
    if ($('.imperialBtn').hasClass('active')) {
        localStorage.setItem('unit', 'imperial');
    } else {
        localStorage.setItem('unit', 'metric');
    }

    var defaultLocal = $('#defaultLocation').val().trim();

    if (defaultLocal !== '') {
        if (defaultLocal.match(/[a-z]/i) && defaultLocal.match(/[0-9]/)) {
            $('.defaultError').text('Please only use a city or zip');

            $('.defaultError').slideDown('fast');

            $('#defaultLocation').val('');
        } else if (defaultLocal.match(/[a-z]/i)) {
            quickURL = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocal}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
            
            quickCheck();
        } else if (defaultLocal.match(/[0-9]/)) {
            quickURL = `https://api.openweathermap.org/data/2.5/weather?zip=${defaultLocal}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
           
            quickCheck();
        } else {
            $('.defaultError').text('Value cannot be read');

            $('.defaultError').slideDown('fast');
        }
    } else if (localStorage.getItem('default') !== null) {
        localStorage.removeItem('default');

        location.reload();
    } else {
        location.reload();
    }
});

/* This function will run a quick ajax search to check and see if ther user's default location settings is a legit location.
This will help to make sure that if the user puts in a non-valid location then it won't cause errors when the page reloads. */
function quickCheck() {
    $.ajax({
        url: quickURL,
        method: 'GET'

    }).then(function (quickResponse) {
        localStorage.setItem('default', quickResponse.name);

        // Check and see if if the default location is in the previous searches array
        if (prevSearches.indexOf(localStorage.getItem('default')) !== -1) {
            // If it is the splice it out of the array
            prevSearches.splice(prevSearches.indexOf(localStorage.getItem('default')), 1);

            // And resave the list to the user's local storage
            localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
        } 

        // Check and see if the user has a last search saved into their local storage
        if (localStorage.getItem('lastSearch') !== null) {
            // If they do, then check and see if the last search in the user's local storage is not the same as the default location
            if (localStorage.getItem('lastSearch') !== localStorage.getItem('default')) {
                prevSearches.unshift(localStorage.getItem('lastSearch'));

                localStorage.setItem('prevSearches', JSON.stringify(prevSearches));

                localStorage.removeItem('lastSearch');
            }
            
            location.reload();

        } else {
            location.reload();
        }

        // In case the location is not accepted
    }).catch( function (quickError) {
        $('.defaultError').text(`Error ${quickError.responseJSON.cod}: ${quickError.responseJSON.message}`);

        $('.defaultError').slideDown('fast');

        $('#defaultLocation').val('');
    })
}

// When the cancel button is clicked
$('.cancelBtn').click(function () {
    switch (localStorage.getItem('clock') === '24') {
        case true:
            $('.12HourBtn').removeClass('active');
            $('.24HourBtn').addClass('active');
            break;

        default:
            $('.24HourBtn').removeClass('active');
            $('.12HourBtn').addClass('active');
    }

    switch (unit === 'metric') {
        case true:
            $('.imperialBtn').removeClass('active');
            $('.metricBtn').addClass('active');
            break;

        default:
            $('.metricBtn').removeClass('active');
            $('.imperialBtn').addClass('active');
    }

    $('#defaultLocation').val(localStorage.getItem('default'))

    errorRemove();
});

function load() {
    $('.prevDiv').hide();
    $('.previousText').removeClass('hide');

    switch (localStorage.getItem('clock') === null) {
        case true:
            localStorage.setItem('clock', 12);
            timeForm = 12;

            // In moment.js 'llll' format looks like 'Thu, Sep 4, 1986 8:30 PM'
            format = 'llll';
            break;

        default:
            timeForm = localStorage.getItem('clock');

            switch (timeForm) {
                case '24':
                    $('.12HourBtn').removeClass('active');
                    $('.24HourBtn').addClass('active');

                    // in moment.js 'ddd, ll, HH:mm' format looks like 'The, Sep 4, 1986 20:30'
                    format = "ddd, ll HH:mm";
                    break;

                default:
                    format = 'llll';
            }
    }

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
                case true:
                    unit = localStorage.getItem('unit');
                    unitTemp = '°C';
                    unitSpeed = 'km/h';
                    $('.imperialBtn').removeClass('active');
                    $('.metricBtn').addClass('active');
                    break;

                default:
                    unit = localStorage.getItem('unit');
                    unitTemp = '°F';
                    unitSpeed = 'm/h';
            }
    }

    // Check and see if the user has set a default location
    if (localStorage.getItem('default') !== null) {
        $('#defaultLocation').val(localStorage.getItem('default'))

        cityVal = localStorage.getItem('default');

        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        searchCity();
    }

    // This will check and see if the user has made a search recently
    else if (localStorage.getItem('lastSearch') !== null) {
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
    if (JSON.parse(localStorage.getItem('prevSearches')) === null && localStorage.getItem('lastSearch') === null && localStorage.getItem('default') === null) {
        // Load welcome buttons
        loadButtons1();
    } else {
        // Load previous searches
        loadButons2();
    }

    // Repo link at the bottom of the page
    $('.beforeFooter').fadeIn('slow');
}

function loadButtons1() {
    $('.possibleChoices, .possibleRow').hide();

    $('.possibleChoices').removeClass('hide');

    prevSearches = ['Salt Lake City', 'Tampa', 'San Francisco', 'Houston'];

    $(prevSearches).each(function (e) {
        var button = $('<button>').text(prevSearches[e]).prop('type', 'button').addClass('btn btn-secondary cityBtn');

        $('.possibleRow').append(button);
    })

    $('.possibleChoices, .possibleRow').fadeIn('slow');
}

function loadButons2() {
    $('.choiceRow').empty();

    prevSearches = JSON.parse(localStorage.getItem('prevSearches'));

    $(prevSearches).each(function (e) {
        var button = $('<button>').text(prevSearches[e]).prop('type', 'button').addClass('btn btn-secondary cityBtn');

        $('.choiceRow').append(button);
    })
}

// This function will grab either the value from the first searchBar or the second one
function grabCityVal() {
    // The var whichSearch will tell the code which search bar to look for

    // If the var whichSearch is set to the first search bar on the welcome screen
    if (whichSearch === 'firstSearch') {
        cityVal = $('.searchBar').val().trim();
    }

    // Otherwise it's the navbar search bar
    else {
        cityVal = $('.searchBar2').val().trim();
        $('.searchBar2').val('');
    }

    searchBar();
}

// Function for when either of the searchbars are in use
function searchBar() {
    if (cityVal === '') {
        errorMes.text('Field cannot be empty');

        displayError();
    }

    // I have this set as and AND statement instead of putting both into one regex because if it's in one regex then it would falsely trigger
    else if (cityVal.match(/[a-z]/i) && cityVal.match(/[0-9]/)) {
        errorMes.text('Please only search for a city or zip');

        displayError();
    } 
    
    // Check and see if the text is using letters, so this way the code knows to look for a city name.
    else if (cityVal.match(/[a-z]/i)) {
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        $('.prevDiv').slideUp('fast');

        searchCity();
    }

    // Check and see if the text is using numbers, if it is then the code will search for a zip code instead.
    else if (cityVal.match(/[0-9]/)) {
        queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${cityVal}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        $('.prevDiv').slideUp('fast');

        searchCity();
    }

    // If cityVal's value is just special characters for example
    else {
        errorMes.text('Text cannot be read');

        displayError();
    }
}

// Search city function
function searchCity() {
    if ($('.row').hasClass('dropup')) {
        uviInfoToggle();
    }

    // Just in case if the error is still on the screen
    errorRemove();

    // Make the ajax request to openweather api
    $.ajax({
        url: queryURL,
        method: 'GET'

    }).then(function (response) {
        // To get the UV Index info from openweather you have to have the locations lat and lon. 
        var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&units=${unit}&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

        // Ajax call for the UV Index info
        $.ajax({
            url: oneCallUrl,
            method: 'GET'
        }).then(function (oneCallRepsponse) {
            var currentUVI = oneCallRepsponse.current.uvi;

            var daily = oneCallRepsponse.daily;

            $('.uviInfo, .uviInfo2').text(currentUVI);

            // This if statement will check to see if the UV Index is between 3 and 6, which would be in the yellow zone.
            if (currentUVI >= 3 && currentUVI <= 5.99) {
                // If it is then set the color of the text to black, otherwise it will be hard to read.
                $('.uviInfo, .uviMoreInfo').css('color', 'black');
            } else {
                // If it's not then set the text color to white.
                $('.uviInfo, .uviMoreInfo').css('color', 'white');       
            }

            if (currentUVI >= 11) {
                $('.uviInfo, .uviMoreInfo').css('background-color', 'purple');

                // Check and see if the user prefers 12-Hour time format
                if (timeForm == 12) {
                    $('.elevenOrHigher').text('Stay inside between the hours of 10am and 4pm.');
                } else {
                    $('.elevenOrHigher').text('Stay inside between the hours of 10:00 and 16:00.');
                }
                
                $('.uviMoreText').text('Sunscreen, Sunglasses, a Hat, and Shade are also advised.');

                $('.burnTime').text('15 minutes or less.');

            } 
            
            else if (currentUVI >= 6 && currentUVI <= 10.99) {
                $('.elevenOrHigher').empty();

                $('.uviMoreText').text('Sunscreen, Sunglasses, a Hat, and Shade are advised.');

                if (currentUVI >= 8) {
                    $('.uviInfo, .uviMoreInfo').css('background-color', 'red');

                    $('.burnTime').text('20 minutes or less.');
                } 

                else {
                    $('.uviInfo, .uviMoreInfo').css('background-color', 'orange');

                    $('.burnTime').text('30 minutes or less.');
                }

            } 
            
            else if (currentUVI >= 3) {
                $('.elevenOrHigher').empty();

                $('.uviInfo, .uviMoreInfo').css('background-color', 'yellow');

                $('.uviMoreText').text('Sunscreen, Sunglasses, and a Hat are advised.');

                $('.burnTime').text('40 minutes or less.');
            } 

            else {
                $('.elevenOrHigher').empty();

                $('.uviInfo, .uviMoreInfo').css('background-color', 'green');

                $('.uviMoreText').text('Sunglasses, and a Hat are advised.');

                $('.burnTime').text('60 minutes or less.');
            }

            // For loop for the 5-day forecast
            for (let i = 0; i < 5; i++) {
                $(`.dateImg${i}`).attr('src', `https://openweathermap.org/img/wn/${daily[i + 1].weather[0].icon}@2x.png`);

                // unixTime will grab the date text from the response and cut off the time. For example, the final output should look some like '2020-04-04'
                var unixTime = moment.unix(daily[i + 1].dt);

                // This variable uses moment.js to format the above date string and format to look nicer. For example, the final output should look like 'Sat, Apr 4th'
                var dateText = moment(unixTime).format("ddd, MMM Do");

                $(`.date${i}`).text(dateText);

                $(`.temp${i}`).text(`Temp: ${(daily[i + 1].temp.day).toFixed(1)} ${unitTemp}`);
                
                $(`.humidity${i}`).text(`Humidity: ${daily[i + 1].humidity}%`);

                if (unit === 'metric') {
                    // Then this will grab the current wind speed which is in meters per second, and convert it to km/h.
                    $(`.wind${i}`).text(`Wind: ${((daily[i + 1].wind_speed) * 3.6).toFixed(1)} ${unitSpeed}`);
                } else {
                    $(`.wind${i}`).text(`Wind: ${(daily[i + 1].wind_speed).toFixed(1)} ${unitSpeed}`);
                }
            }
        })

        name = response.name;

        var main = response.main;

        $('.cityName').text(name);

        //Hide the welcome screen 
        $('.greetingText, .firstSearch, .settingsBtn1, .possibleChoices, .possibleRow').hide();

        // Fade in the results
        $('.card').fadeIn('slow');

        $('.navSearch').removeClass('hide');

        // This variable is grabbing the description text from OpenWeather, and setting the first letter in the string to a capital letter.
        var descText = (response.weather[0].description.charAt(0).toUpperCase() + response.weather[0].description.substr(1).toLowerCase());

        $('.description').text(descText);

        $('.icon').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);

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
        } else {
            $('.wind').text(`Wind Speed: ${(response.wind.speed).toFixed(1)} ${unitSpeed}`);
        }

        addToList();

        // If the ajax request fails
    }).catch(function (error) {
        errorMes.text(`Error ${error.responseJSON.cod}: ${error.responseJSON.message}`);

        displayError()
    })
}

// Function for saving user's previous searches
function addToList() {
    if (prev === '') {
        prev = name;
    }

    // This if statement will check and see if the user has made a previous search
    if (localStorage.getItem('lastSearch') !== null) {
        prev = localStorage.getItem('lastSearch');
    }

    if (prev === name) {
        localStorage.setItem('lastSearch', name);

        return;
    } 
    
    // If prev is not equal to name then check and see if the user has not made any previous searches
    else if (JSON.parse(localStorage.getItem('prevSearches')) === null) {
        prevSearches = [];

        prevSearches.push(prev);

        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));

    } 
    
    // If the user has made previous searches then check and see if the user's previous search is already in the list
    else if (prevSearches.indexOf(prev) === -1) {
        if (prevSearches.length >= 6) {
            // Check and see if the user's latest search is on the list
            if (prevSearches.indexOf(name) !== -1) {
                prevSearches.splice(prevSearches.indexOf(name), 1);
            } 
            
            else {
                prevSearches.pop();
            }

            prevSearches.unshift(prev);
        } else {

            prevSearches.unshift(prev);
        }

        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }

    /* If the user has made a previous searches and the user searches for the same city 
    This else statement will run and make sure that the users previous search is always first in the array*/
    else {
        prevSearches.splice(prevSearches.indexOf(prev), 1);

        prevSearches.unshift(prev);

        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }

    // This last if statement will check if the user's latest search is on the previous searchs list
    // If it is then it will splice it out, because we don't want the users latest search in the previous searches list until it becomes a previous search
    if (prevSearches.indexOf(name) !== -1) {
        prevSearches.splice(prevSearches.indexOf(name), 1);

        localStorage.setItem('prevSearches', JSON.stringify(prevSearches));
    }

    // Refresh the buttons
    loadButons2();

    localStorage.setItem('lastSearch', name);

    prev = name;
}

// Function for displaying error messages
function displayError() {
    // This if statement will check and see if the user was typing on the welcome search bar
    if (whichSearch === 'firstSearch') {
        $('.mainError').slideDown('600');
    } 

    // Or if it was the navbar search bar
    else {
        $('.error2').slideDown('600');
    }
}

// Function for the uviInfo
function uviInfoToggle() {
    if ($('.row').hasClass('dropup')) {

        $('.uviMoreInfo').slideUp('fast');

        $('.row').removeClass('dropup');
    } else {
        $('.uviMoreInfo').slideDown('slow');

        $('.row').addClass('dropup');
    }
}

function errorRemove() {
    errorMes.slideUp('600');
}
