// js responsive breakpoints for match media
const lgUp = '(min-width: 992px)';

// Query String Detector, searches query string variable and returns value
function detectQString(qs) {
    if (Modernizr.urlsearchparams) {
      var urlParams = new URLSearchParams(location.search);
      return urlParams.get(qs);
    } else {
      var results = new RegExp('[\?&]' + qs + '=([^&#]*)').exec(window.location.href);
      if (results==null){
          return null;
      }
      else{
          return decodeURIComponent(results[1]) || 0;
      }
    }
}


//---
// Document Ready
//---
jQuery(document).ready(function($) {
   
});



//---
// Window Loaded
//---
$(window).on('load', function(e){
  console.log('window.load');



});



//---
// Window Resize
//---
$(window).on('resize', function(e) {
  console.log('window.resize');



});



//---
// Window Scroll
//---
$(window).on('scroll', function(e) {
  // console.log('window.scroll');
  

});