(async ({ worker, delay }) => {
  var animatableSplash = document.querySelector('#animatableSplash')

  const animateLogo = async (event) => {
    animatableSplash.removeEventListener('finish', animateLogo)
    await delay(300)
    worker.postMessage('splashEnd')
  }
  animatableSplash.addEventListener('finish', animateLogo)

  function detectWokerEvent (e) {
    if (e.data === 'logoStart') {
      animatableSplash.autoPlay = true
      worker.removeEventListener('message', detectWokerEvent)
    }
  }
  worker.addEventListener('message', detectWokerEvent)
})(window)
