(async ({ worker, delay, Waypoint, alert }) => {
  var splashContent = document.querySelector('#splashContent')
  var homeContent = document.querySelector('#homeContent')
  var animatableComponents = homeContent.querySelectorAll('animatable-component')

  function initialize () {
    splashContent.remove()
    homeContent.style.display = 'block'
    var innerScroll = homeContent.shadowRoot.querySelector('.inner-scroll')

    animatableComponents.forEach(function (component, index) {
      var element = component.querySelector(':first-child')
      component.delay = index * 200
      component.autoPlay = true
      component.waypoint = new Waypoint({
        context: innerScroll,
        offset: '26%',
        element: element,
        handler: function (direction) {
          if (component.classList.contains('projects')) {
            if (direction === 'down') {
              component.duration = 400
              component.animation = 'pulse'
            } else {
              component.duration = 800
              component.animation = 'bounce'
            }
          }
          component.delay = 100
          component.finish()
          component.play()
        }
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
