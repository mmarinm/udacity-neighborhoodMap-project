var menu = $('#menu');
var menubtn = $('#menu-btn');
var menuimg = $('#menu-img');



menubtn.click(function(event) {
    /* Act on the event */
    $(menu).addClass('hide');
});

menuimg.click(function(event) {
    /* Act on the event */
    $(menu).removeClass('hide');
});