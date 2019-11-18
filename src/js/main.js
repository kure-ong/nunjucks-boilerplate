// js responsive breakpoints for match media
const lgUp = '(min-width: 992px)';

// Query String Detector, searches query string variable and returns value
function detectQString(qs) {
    if (Modernizr.urlsearchparams) {
        var urlParams = new URLSearchParams(location.search);
        return urlParams.get(qs);
    } else {
        var results = new RegExp('[\?&]' + qs + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return decodeURIComponent(results[1]) || 0;
        }
    }
}

// Scroll to element ID declared in "id" query string key. Change query string key accordingly to your needs.
function scrollToID() {
    if (detectQString('id') != null && detectQString('id') != '') {
        const qstring = detectQString('id');
        console.log('fired')
        $('html, body').animate({
            scrollTop: $('#'+qstring).offset().top - 100
          }, 800, function(){
        });
    }
}

//---
// Document Ready
//---
jQuery(document).ready(function ($) {
    //-- Uncomment to turn on AOS function
    // AOS.init({
    //     easing: 'ease-in-out-quart',
    //     duration: 600,
    //     delay: 100,
    //     anchorPlacement: 'top-bottom'
    // });

});



//---
// Window Loaded
//---
$(window).on('load', function (e) {
    console.log('window.load');
    scrollToID();


});



//---
// Window Resize
//---
$(window).on('resize', function (e) {
    console.log('window.resize');

    //-- Uncomment if AOS function enabled
    // AOS.refresh();

});



//---
// Window Scroll
//---
$(window).on('scroll', function (e) {
    // console.log('window.scroll');


});