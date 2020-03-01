$(document).ready(function() {
    $('.fullbox').css({
        'width': $(window).width(),
        'height': $(window).height()
    });
    $('.fullbox_cont').css({
        'width': $(window).width() - 100
    });

    $(window).resize(function() {
        var $w = $(window);
        var insideBox = 200;
        $('.fullbox').css({
            'width': $w.width(),
            'height': $w.height(),
        });
    });
});