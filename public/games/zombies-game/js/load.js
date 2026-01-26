var loadState = {
    preload: function () {
        this.loadingborder = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 15, 'loadingborder');
        this.loadingborder.x -= this.loadingborder.width / 2;
        this.loading = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY + 19, 'loading');
        this.loading.x -= this.loading.width / 2;
        this.game.load.setPreloadSprite(this.loading, 0);
        
        this.game.load.image('bullet', 'assets/bullet.png');
        this.game.load.image('blood', 'assets/blood.png');
        this.game.load.image('title2', 'assets/title2.png');
        this.game.load.image('title', 'assets/title.png');
        this.game.load.image('background', 'assets/background.jpg');
        this.game.load.image('arrow', 'assets/arrow.png');
        this.game.load.image('play', 'assets/play.png');
        this.game.load.spritesheet('player', 'assets/player.png', 80, 90);    
        this.game.load.spritesheet('legs', 'assets/legs.png', 80, 100);
        this.load.atlas('arcade', 'assets/virtualjoystick/arcade-joystick.png', 'assets/virtualjoystick/arcade-joystick.json');
        this.load.atlas('generic', 'assets/virtualjoystick/generic-joystick.png', 'assets/virtualjoystick/generic-joystick.json');
        this.game.load.spritesheet('zombie', 'assets/zombie.png', 128, 128);
        
        this.game.load.audio('shoot', ['audio/shoot.ogg', 'audio/shoot.mp3']);
        this.game.load.audio('music', ['audio/music.ogg', 'audio/music.mp3']);
    },
    create: function () {
        
        //this.eye = new Eye(this.game, 300, 300, 1, 0.31);
        //this.eye.animate();
        this.game.state.start('menu');
    }
};