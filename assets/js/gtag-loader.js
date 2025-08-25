// assets/js/gtag-loader.js
(function () {
  var GA_ID = 'G-Y4785PMVB2';
  // Avoid double initialization
  if (window.__gtag_loaded_for === GA_ID) return;
  window.__gtag_loaded_for = GA_ID;

  // Insert async gtag script
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  // Initialize gtag after script insertion (safe to call immediately)
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);} 
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
