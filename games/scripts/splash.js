(async ({ worker, delay }) => {
  var animatableSplash = document.querySelector('#animatableSplash')

  const animateLogo = async (event) => {
    animatableSplash.removeEventListener('finish', animateLogo)
    await delay(300)
    worker.postMessage('splashEnd')
    animatableSplash.remove()
  }
  animatableSplash.addEventListener('finish', animateLogo)

  function detectWokerEvent (e) {
    if (e.data === 'logoStart') {
      animatableSplash.keyFrames = [
        { offset: 0, transform: 'translateY(0)', opacity: 1 },
        { offset: 1, transform: 'translateY(-100vh)', opacity: 1 }
      ]
      animatableSplash.autoPlay = true
      worker.removeEventListener('message', detectWokerEvent)
    }
  }
  worker.addEventListener('message', detectWokerEvent)
})(window)
