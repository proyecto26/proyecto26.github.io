(({ Worker, Waypoint }) => {
  window.worker = new Worker('/scripts/worker.js')

  window.delay = time => new Promise(resolve => setTimeout(() => resolve(), time))
})(window)
