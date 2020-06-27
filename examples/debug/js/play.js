var playState = {
    create: function () {
        var self = this;
		self.game.stage.backgroundColor = '#42C0FB';
		
		self.cursor = self.game.input.keyboard.createCursorKeys();
        //Phaser captura las teclas y no se envía el evento al navegador        
        self.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);
        
        // Create the tilemap 
        self.map = self.game.add.tilemap('map');
        // Add the tileset to the map 
        self.map.addTilesetImage('tileset');
        self.map.setCollision([4, 5, 8, 9, 47, 99, 101, 102, 106, 109, 110, 186, 199, 211]);
        //self.map.setCollisionBetween(0, 800);
        //self.map.setCollisionByExclusion([16,29,39,88,89,90,91,92,93,177,178,198,200,201,210,226]);
        // Create the layer, by specifying the name of the Tiled layer 
        self.layer = self.map.createLayer('level1');
        // Set the world size to match the size of the layer 
        self.layer.resizeWorld();
        self.layer.debug = true; 
        
        //Inspeccionar los tiles del tileset
        self.marker = this.game.add.graphics();
		self.marker.lineStyle(2, 0x000000, 1);
		self.marker.drawRect(0, 0, 32, 32);
	},
    update: function(){
        var self = this;
        //Obtener el tile que se le dio click del tileset
        self.marker.x =  self.layer.getTileX(self.game.input.activePointer.worldX) * 32;
		self.marker.y =  self.layer.getTileY(self.game.input.activePointer.worldY) * 32;
		if (self.game.input.mousePointer.isDown){
			var currentTile = self.map.getTile(self.layer.getTileX(self.marker.x), self.layer.getTileY(self.marker.y), 'level1');
			console.log("Phaser.Tile Object");
			console.log(currentTile);
		}
    }
}