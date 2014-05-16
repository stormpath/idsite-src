'use strict';

(function(window) {

  function rewriter(url){
    // put a ? before the first query param expression, doing so will allow
    // angular to nicely consume the values and make them available through
    // the $location.search() api
    var match = url.match(/([^#&?]+=[^#&?]+)/g,'?$1');
    if(match){
      var b = match.join('&').replace(/^\//,'');
      var a = url.replace(b,'');
      a = a.replace(/[&?\/]$/,'');
      return a + '?' + b;
    }else{
      return url;
    }

  }
  window.SpHashRewriter = rewriter;
})(window);