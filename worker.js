self.addEventListener('connect', (event) => {
  const port = event.ports[0]

  port.addEventListener('message', e => {
    switch (e.data) {
      case 'bootEnd':
        port.postMessage('logoStart')
        break
      default:
        throw new Error('Unable to process that message')
    }
  }, false)

  port.start()
})
