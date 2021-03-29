(({ Worker, Waypoint, sessionStorage }) => {
  window.worker = new Worker('/scripts/worker.js')

  // Check that service workers are supported
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
    })
    
    if ('Notification' in window) {
      Notification.requestPermission(status => {
        // status will either be 'default', 'granted' or 'denied'
        console.log(`Notification permissions have been ${status}`)
      })
    }
  }

  window.delay = time => new Promise(resolve => setTimeout(() => resolve(), time))
})(window)
