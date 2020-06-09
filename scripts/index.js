(({ Worker, Waypoint }) => {
  window.worker = new Worker('/scripts/worker.js')
  
  // Check that service workers are supported
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }

  window.delay = time => new Promise(resolve => setTimeout(() => resolve(), time))
})(window)
