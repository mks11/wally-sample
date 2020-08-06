$(document).ready(function () {

    var $body = $('body');


    $body
        .on('click', '.aw-nav--toggle, .aw-nav--close', function () {
            $('body').toggleClass('nav-open');
        })

    if($('#product-carousel').length>0){
        $('#product-carousel').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          infinite: false,
          asNavFor: '#thumbnailproduct-carousel',
        });
        $('#thumbnailproduct-carousel').slick({
          slidesToShow: 3,
          slidesToScroll: 3,
          asNavFor: '#product-carousel',
          dots: false,
          infinite: false,
        });
        $('#thumbnailproduct-carousel .slick-item').click(function(){
            $('#product-carousel').slick('slickGoTo', $(this).index());
        })
    }

});

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
