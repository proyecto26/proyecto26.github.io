self.addEventListener('message', e => {
  switch (e.data) {
    case 'bootEnd':
      self.postMessage('logoStart')
      break
    default:
      throw new Error('Unable to process that message')
  }
}, false)
