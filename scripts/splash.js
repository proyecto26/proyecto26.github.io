(async ({ worker, delay, sessionStorage }) => {
  var animatableSplash = document.querySelector('#animatableSplash')
  var splashContent = document.querySelector('#splashContent')

  var onSplashEnd = function () {
    sessionStorage.setItem('splashLoaded', true)
    worker.postMessage('splashEnd')
    splashContent.remove()
  }

  animatableSplash.addEventListener('start', function (event) {
    event.detail.style.display = 'flex'
  })

  const animateLogo = async (event) => {
    animatableSplash.removeEventListener('finish', animateLogo)
    await delay(300)
    animatableSplash.animation = 'pulse'
    await delay(1400)
    animatableSplash.addEventListener('finish', ({ detail }) => {
      detail.style.display = 'none'
      onSplashEnd()
    })
    animatableSplash.animation = 'zoomOut'
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
