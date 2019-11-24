(async ({ worker, delay }) => {
  var splashContent = document.querySelector('#splashContent')
  var homeContent = document.querySelector('#homeContent')

  function initialize () {
    splashContent.remove()
    homeContent.style.display = 'block'

    var components = document.querySelectorAll('#homeContent animatable-component')
    components.forEach(function (component, index) {
      component.animation = 'rotateInUpLeft'
      component.delay = index * 400
      component.duration = 400
      component.autoPlay = true
      component.addEventListener('start', function (event) {
        event.detail.style.opacity = 0
      })
      component.addEventListener('finish', function (event) {
        event.detail.style.opacity = 1
      })
    })
  }

  function detectWokerEvent (e) {
    if (e.data === 'homeStart') {
      worker.removeEventListener('message', detectWokerEvent)
      initialize()
    }
  }
  worker.addEventListener('message', detectWokerEvent)
})(window)
