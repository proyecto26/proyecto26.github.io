var loadState = {
    preload: function () {
        this.loadingborder = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 15, 'loadingborder');
        this.loadingborder.x -= this.loadingborder.width / 2;
        this.loading = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 19, 'loading');
        this.loading.x -= this.loading.width / 2;
        this.game.load.setPreloadSprite(this.loading, 0);

        this.game.load.image('shuriken', 'assets/shuriken.png');
        this.game.load.image('ninjadev', 'assets/ninjadev.png');  
        this.game.load.atlas('ninja', 'assets/ninja.png', 'assets/ninja.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        this.game.load.image('dragon', 'assets/dragon.png');
    },
    create: function () {
        this.game.state.start('menu');
    }
};