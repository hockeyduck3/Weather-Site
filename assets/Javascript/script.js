$('.dateTime').text(moment().format('llll'))

setInterval(function() {
    $('.dateTime').text(moment().format('llll'))
}, 1000)

var cityVal;
var queryURL;

var errorMes = $('.error');

$('.searchBtn').click(function() {
    cityVal = $('.searchBar').val().trim();
    if (cityVal === '') {
        errorMes.text('Field cannot be empty').slideDown('600');
    } else if (cityVal.match(/[a-z]/) && cityVal.match(/[0-9]/)) {
        errorMes.text('Please only search for a city or zip').slideDown('600');
    } else if (cityVal.match(/[a-z]/)) {
        queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        searchCity();
    } else if (cityVal.match(/[0-9]/)) {
        queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;
        searchCity();
    } else {
        errorMes.text('Text cannot be read').slideDown('600');
    }

    
})

$('.firstSearch').on('keypress', function() {
    errorMes.slideUp('600');
})

function searchCity() {
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response);

        $('.cityName').text(response.name);
        $('.greetingText, .firstSearch, .previousChoices, .choiceRow').hide();
        $('.card').fadeIn('slow');
        $('.navSearch').removeClass('hide')
    }).catch(function(error) {
        console.log(error)
        errorMes.text(`Error ${error.responseJSON.cod} ${error.responseJSON.message}`).slideDown('600')
    })
}