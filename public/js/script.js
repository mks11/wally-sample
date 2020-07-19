$(document).ready(function () {

    var access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FzdGF3b3Jrc2Rldi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWE3MjBjM2VmYzE4MmQwM2IxZTcyYzZmIiwiYXVkIjoiYlN0bE1sOXVYZkxYZW5BQ2hkUE9ZQzhITE1uUE9WTkoiLCJpYXQiOjE1MTc0MzQ2NzEsImV4cCI6MjUxNzQzNDY3MH0.7CE4Jn0omNMq3kXRIaVmRCKgQN29SZgTvr8sckQaiG0';

    var $body = $('body'),
        $btnHeroSubmit = $('#btn-hero--submit'),
        $zipInput = $('#zip_input'),
        isInValidZips,
        isInPartners;


    $body
        .on('click', '.aw-nav--toggle, .aw-nav--close', function () {
            $('body').toggleClass('nav-open');
        })
        // .on('click', '.aw-home .btn-get--started', function (e) {
        //     if (!$('body').hasClass('zip-open')) {
        //         e.preventDefault();
        //         $('body').addClass('zip-open');
        //         $btnHeroSubmit.prop('disabled', true);
        //     }
        //     setTimeout(function () {
        //         $zipInput.focus();
        //     }, 500)
        // })
        // .on('click', '.aw-header .btn-get--started, .aw-nav--mobile [href="#nav-hero"]', function (e) {


    // $zipInput
    //     .on('input', function () {
    //         if ($(this).val().length) {
    //             $btnHeroSubmit.prop('disabled', false);
    //         }
    //         else {
    //             $btnHeroSubmit.prop('disabled', true);
    //         }
    //     });

    // $('#zip-form').on('submit', function (e) {

    //     e.preventDefault();

    //     $btnHeroSubmit.addClass('is-loading');

    //     getValidZips($zipInput.val());
    // });

    // function getValidZips(inputZip) {
    //     // eraseCookie('zipCode');
    //     // setCookie('zipCode', inputZip, 1);
    //     $.ajax({
    //         url: 'https://cryptic-inlet-60037.herokuapp.com/api/web/zips',
    //         type: 'GET',
    //         beforeSend: function (xhr) {
    //             xhr.setRequestHeader('Authorization', 'BEARER ' + access_token)
    //         },
    //         success: function (res) {
    //             // response
    //             var zipData = $.parseJSON(res);
    //             console.log(zipData);


    //             $.each(zipData['validZips'], function (key, value) {
    //                 if (inputZip == value) {
    //                     isInValidZips = true;
    //                     return false;
    //                 }
    //             });


    //             $.each(zipData['partnerZips'], function (key, value) {
    //                 if (inputZip == value) {
    //                     isInPartners = true;
    //                     return false;
    //                 }
    //             });

    //             if (!!isInValidZips && !!isInPartners) {
    //                 window.location.href = "non-valid-zip.html";
    //             } else if (!!isInValidZips && !isInPartners) {
    //                 if ('ontouchstart' in window) {
    //                     window.location.href = "letsgetstarted.html";
    //                     return false;
    //                 } else {
    //                     window.location.href = "path1.html";
    //                     return false;
    //                 }
    //             } else {
    //                 window.location.href = "non-valid-zip.html?zip=" + encodeURIComponent(inputZip);
    //             }

    //         },
    //         error: function (err) {
    //             console.log(err);
    //         }
    //     });
    // }

    //new js
    // $('[href="#get-started"]').click(function(e){
    //     e.preventDefault();
    //     $('html, body').stop().animate({
    //       'scrollTop': $('#nav-hero').offset().top
    //     },700);
    // })
    // $(document).bind("ready scroll", function () {
    //     var t = $(document).scrollTop();

    //     if($('#nav-hero').length>0){
    //         if(t>$('#nav-hero').height()){
    //             $('body').removeClass('zip-open');
    //             $('#btn-hero--submit').prop('disabled', false);
    //         }
    //     }
    // })
    // $('#btn-subscribe').click(function(){
    //     var element = $('#subscribe-email')
    //     if(ValidateEmail(element)){
    //         element.removeClass('is-invalid')
    //         $.ajax({
    //             url: 'https://cryptic-inlet-60037.herokuapp.com/api/web/newsletter',
    //             type: 'POST',
    //             data: { email: element.val() },
    //             dataType: 'json',
    //             beforeSend: function (xhr) {
    //                 xhr.setRequestHeader('Authorization', 'BEARER ' + access_token)
    //             },
    //             success: function (res) {
    //                 // response
    //                 console.log('res:' + res)
    //                 $('#btn-subscribe').text('Success')
    //             },
    //             error: function (err) {
    //                 //console.log('err:' + JSON.stringify(err) + "|" + err.responseJSON.message);
    //                 $('#btn-subscribe').text('Please Try Again')
    //             }
    //         });
    //     } else {
    //         element.addClass('is-invalid').focus()
    //     }
    // })
    // function ValidateEmail(element){
    //     var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //     if(element.val().match(mailformat)) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    // var url = new URL(window.location.href);
    // var act = url.searchParams.get("act");
    // if(act=='get-started'){
    //     $('.aw-header .btn-get--started').click()
    // }

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
    console.log("Setting cookie");
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
