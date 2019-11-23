(async ({ worker, delay }) => {
  var animatableLogo = document.querySelector('#animatableLogo')

  animatableLogo.addEventListener('start', function (event) {
    event.detail.style.display = 'flex'
  })

  const animateLogo = async (event) => {
    animatableLogo.removeEventListener('finish', animateLogo)
    await delay(300)
    animatableLogo.animation = 'pulse'
    await delay(1400)
    animatableLogo.addEventListener('finish', ({ detail }) => {
      detail.style.display = 'none'
    })
    animatableLogo.animation = 'zoomOut'
  }
  animatableLogo.addEventListener('finish', animateLogo)

  function detectWokerEvent (e) {
    if (e.data === 'logoStart') {
      animatableLogo.autoPlay = true
      worker.removeEventListener('message', detectWokerEvent)
    }
  }
  worker.addEventListener('message', detectWokerEvent)
})(window)
