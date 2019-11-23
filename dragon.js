(async ({ Phaser, worker }) => {
  const ionPhaser = document.querySelector('ion-phaser-ce')

  ionPhaser.game = {
    width: '100%',
    height: '100%',
    renderer: Phaser.AUTO,
    roundPixels: true,
    alignH: true,
    alignV: true,
    backgroundColor: '#fff',
    scaleMode: Phaser.ScaleManager.RESIZE,
    disableVisibilityChange: true,
    state: {
      preload: function () {
        // this.load.crossOrigin = 'Anonymous'
        this.load.image('dragon', 'img/dragon.png')
        this.load.audio('dragon', ['audio/dragon.ogg', 'audio/dragon.mp3'])
      },
      create: function () {
        var points = []
        var imgCache = this.game.cache.getFrame('dragon')
        var totalPoints = 26
        var length = imgCache.width / totalPoints
        for (var i = 0; i < totalPoints; i++) {
          points.push(new Phaser.Point(i * length, 0))
        }
        this.dragon = this.game.add.rope(-imgCache.width, this.game.world.centerY, 'dragon', null, points)
        this.dragon.aditionalInfo = {
          count: 0,
          direction: 'right',
          roar: true
        }
        this.dragon.updateAnimation = function () {
          this.aditionalInfo.count += 0.1
          for (var i = 0; i < this.points.length; i++) {
            this.points[i].y = Math.sin(i * 0.3 + this.aditionalInfo.count) * 10
          }
        }
        this.dragonRoar = this.add.audio('dragon')
      },
      update: function () {
        this.dragon.x += 8
        if (this.dragon.aditionalInfo.roar &&
          this.dragon.x > this.game.world.centerX - this.dragon.width) {
          this.dragon.aditionalInfo.roar = false
          this.dragonRoar.play()
        }

        if (this.dragon.x > this.game.world.width) {
          worker.postMessage('bootEnd')
          ionPhaser.destroy()
        }
      }
    }
  }

  await window.customElements.whenDefined('ion-phaser-ce')
  ionPhaser.getInstance()
    .then((i) => console.log(i))
    .catch((error) => console.error(error))
})(window)
