// js responsive breakpoints for match media
const lgUp = '(min-width: 992px)';

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

jQuery(document).ready(function($) {
   
});
