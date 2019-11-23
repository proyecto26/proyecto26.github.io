(({ SharedWorker }) => {
  window.worker = new SharedWorker('worker.js')
  window.worker.port.start()

  window.delay = time => new Promise(resolve => setTimeout(() => resolve(), time))
})(window)
