var bootState = {
  preload: function () {
    this.game.load.image('loading', '../assets/loading.png')
        this.game.load.image('loadingborder', '../assets/loadingborder.png')
    },
  create: function () {
    this.stage.disableVisibilityChange = true
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.scale.minWidth = 480
        this.scale.minHeight = 260
        this.scale.maxWidth = 790//1024;
        this.scale.maxHeight = 395//768;
        this.scale.pageAlignHorizontally = true
        this.scale.pageAlignVertically = true
        if (!this.game.device.desktop) {
      // this.scale.hasResized.add(this.gameResized, this);
      this.scale.forceOrientation(true, false)
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this)
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this)
        }
    this.scale.updateLayout(true)
        this.game.state.start('load')
    },
  enterIncorrectOrientation: function () {
    document.getElementById('rotate').style.display = 'block'
        document.getElementById('game').style.display = 'none'
        this.game.paused = true
    },
  leaveIncorrectOrientation: function () {
    document.getElementById('game').style.display = 'block'
        document.getElementById('rotate').style.display = 'none'
        this.game.paused = false
    }
}

WebFontConfig = {
  google: {
    families: ['Press+Start+2P']
  }
}
var loadState = {
  preload: function () {
    this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js')
        this.labelloading = this.game.add.text(this.game.world.centerX + 0.5,
      this.game.world.centerY - 15 + 0.5,
      'cargando...',
      { font: '30px Arial', fill: '#fff' })
        this.labelloading.anchor.setTo(0.5, 0.5)
        this.preloadingborder = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 15, 'loadingborder')
        this.preloadingborder.x -= this.preloadingborder.width / 2
        this.preloading = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 19, 'loading')
        this.preloading.x -= this.preloading.width / 2
        this.game.load.setPreloadSprite(this.preloading, 0)
        //LETRAS DE http://arcade.photonstorm.com/        
        //Samurai Shodown 2 (SNK)
        this.game.load.image('title', 'assets/title.png')
        this.game.load.image('logo', '../assets/nicholls.png')
        this.game.load.spritesheet('player', 'assets/player.png', 72, 72)
        this.game.load.image('shuriken', 'assets/shuriken.png')
        this.game.load.image('shurikenInput', 'assets/shurikenInput.jpg')
        this.game.load.image('enemy', 'assets/enemy.png')
        this.game.load.image('cloud', 'assets/cloud.png')
        this.game.load.image('coin', 'assets/coin.png')
        this.game.load.image('pixel', 'assets/pixel.png')
        this.game.load.spritesheet('boom', 'assets/explode.png', 128, 128)
        
        this.game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22)
        this.game.load.spritesheet('tileset', 'assets/tileset.png', 32, 32)
        this.game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON)
        
        //Menu
        this.game.load.image('menu', 'assets/menu.jpg')
        this.game.load.spritesheet('nave', 'assets/nave.png', 32, 30)
        this.game.load.spritesheet('rana', 'assets/rana.png', 20, 18)
        this.game.load.image('play', 'assets/play.png')
        //Guardians (Banpresto)
        this.game.load.image('bubble', 'assets/bubble.png')
        this.game.load.image('message', 'assets/message.png')
        
        //Play
        this.game.load.image('background1', 'assets/background1.jpg')
        
        this.game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3'])
        this.game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3'])
        this.game.load.audio('music', ['assets/music.ogg', 'assets/music.mp3'])
        this.game.load.audio('menu', ['assets/NinjaDev.ogg', 'assets/NinjaDev.mp3'])
    },
  create: function () {
    this.game.world.removeAll()
        self.game.stage.backgroundColor = '#ffffff'
        //Una imagen es un sprite ligero que no necesita animaciones ni manejo de física
        var logo = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'logo')
        logo.anchor.setTo(0.5, 0.5)
        logo.alpha = 0
        this.game.add.tween(logo).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None).start().onComplete.add(function () {
      this.game.add.tween(logo).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None).start().onComplete.add(function () {
        this.game.state.start('menu')
            })
        })
    }
}
