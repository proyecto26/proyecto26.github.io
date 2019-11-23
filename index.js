(({ Worker }) => {
  window.worker = new Worker('worker.js')

  window.delay = time => new Promise(resolve => setTimeout(() => resolve(), time))
})(window)
