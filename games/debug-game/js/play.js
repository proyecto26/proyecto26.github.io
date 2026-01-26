var playState = {
  create: function () {
    this.game.stage.backgroundColor = '#42C0FB'

    this.cursor = this.game.input.keyboard.createCursorKeys()
    // Phaser captura las teclas y no se envía el evento al navegador
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR
    ])

    // Create the tilemap
    this.map = this.game.add.tilemap('map')
    // Add the tileset to the map
    this.map.addTilesetImage('tileset')
    this.map.setCollision([4, 5, 8, 9, 47, 99, 101, 102, 106, 109, 110, 186, 199, 211])
    // this.map.setCollisionBetween(0, 800)
    // this.map.setCollisionByExclusion([16,29,39,88,89,90,91,92,93,177,178,198,200,201,210,226])
    // Create the layer, by specifying the name of the Tiled layer
    this.layer = this.map.createLayer('level1')
    // Set the world size to match the size of the layer
    this.layer.resizeWorld()
    this.layer.debug = true

    // Inspeccionar los tiles del tileset
    this.marker = this.game.add.graphics()
    this.marker.lineStyle(2, 0x000000, 1)
    this.marker.drawRect(0, 0, 32, 32)

    var style = { font: '20px Arial', fill: '#ff0044', align: 'center' }
    this.currentTile = this.game.add.text(20, 20, 'Debug Tilemap', style)
  },
  update: function () {
    // Obtener el tile que se le dio click del tileset
    this.marker.x =
      this.layer.getTileX(this.game.input.activePointer.worldX) * 32
    this.marker.y =
      this.layer.getTileY(this.game.input.activePointer.worldY) * 32
    if (this.game.input.activePointer.isDown) {
      var tile = this.map.getTile(
        this.layer.getTileX(this.marker.x),
        this.layer.getTileY(this.marker.y),
        'level1'
      )
      if (tile) {
        console.log(tile)
        this.currentTile.setText('Current Tile:' + tile.index)
      }
    }
  }
}
