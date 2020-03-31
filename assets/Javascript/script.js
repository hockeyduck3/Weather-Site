$('.dateTime').text(moment().format('llll'))

setInterval(function() {
    $('.dateTime').text(moment().format('llll'))
}, 1000)