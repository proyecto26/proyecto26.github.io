var bootState = {
    preload: function () {        
        this.game.load.image('loading', '../assets/loading.png');
        this.game.load.image('loadingborder', '../assets/loadingborder.png');
    },
    create: function () {
		this.game.state.start('load');
	}
};

var loadState = {
    preload: function () {
        this.labelloading = this.game.add.text(this.game.world.centerX + 0.5,
                                     this.game.world.centerY - 15 + 0.5,
                                     'cargando...',
                                     { font: '30px Arial', fill: '#fff' });
        this.labelloading.anchor.setTo(0.5, 0.5);
        this.preloadingborder = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 15, 'loadingborder');
        this.preloadingborder.x -= this.preloadingborder.width / 2;
        this.preloading = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 19, 'loading');
        this.preloading.x -= this.preloading.width / 2;
        this.game.load.setPreloadSprite(this.preloading, 0);
        
        this.game.load.spritesheet('tileset', 'assets/tileset.png', 32, 32);
        this.game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    },
    create: function () {
        this.game.state.start('play');
    }
};

