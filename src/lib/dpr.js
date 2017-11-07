  export default function() {
    var mediaQuery;
    // Fix fake window.devicePixelRatio on mobile Firefox
    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (window.devicePixelRatio !== undefined && !is_firefox) {
      return window.devicePixelRatio;
    } else if (window.matchMedia) {
        mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
              (min--moz-device-pixel-ratio: 1.5),\
              (-o-min-device-pixel-ratio: 3/2),\
              (min-resolution: 1.5dppx)";
      if (window.matchMedia(mediaQuery).matches)
        return 1.5;
        mediaQuery = "(-webkit-min-device-pixel-ratio: 2),\
              (min--moz-device-pixel-ratio: 2),\
              (-o-min-device-pixel-ratio: 2/1),\
              (min-resolution: 2dppx)";
      if (window.matchMedia(mediaQuery).matches)
        return 2;
        mediaQuery = "(-webkit-min-device-pixel-ratio: 0.75),\
              (min--moz-device-pixel-ratio: 0.75),\
              (-o-min-device-pixel-ratio: 3/4),\
              (min-resolution: 0.75dppx)";
      if (window.matchMedia(mediaQuery).matches)
        return 0.7;
    } else
      return 1;
  }
