var MovableTile = function (game, image, tile, map) {
  Phaser.Sprite.call(this, game, tile.worldX, tile.worldY, image, tile.index - 1)
  this._tile = {}
  this._tile.x = tile.x
  this._tile.y = tile.y
  this._tile.index = tile.index
  this.map = map
  map.removeTile(tile.x, tile.y)
}

MovableTile.prototype = Object.create(Phaser.Sprite.prototype)
MovableTile.prototype.constructor = MovableTile

MovableTile.prototype.restartTile = function () {
  this.map.putTile(this._tile.index, this._tile.x, this._tile.y)
}
