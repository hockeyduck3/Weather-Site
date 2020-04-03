$('.dateTime').text(moment().format('llll'))

setInterval(function() {
    $('.dateTime').text(moment().format('llll'))
}, 1000)

var cityVal;
var queryURL;

$('.searchBtn').click(function() {
    cityVal = $('.searchBar').val();
    queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=imperial&APPID=f6526fa7bca044387db97f2d4ab0e83b`;

    searchCity();
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
        console.log(error);
    })
}