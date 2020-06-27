var menuState = {

    create: function () {
        this.game.stage.backgroundColor = '#85D5FF';
        this.cursor = this.game.input.keyboard.createCursorKeys(); 
        //Cambiar el tamaño del mundo
        this.game.world.setBounds(0, 0, this.game.width, this.game.height);
        var background = game.add.tileSprite(0, 0, this.game.width, this.game.height, 'menu');
        
        this.muteButton = this.game.add.button(20, 20, 'mute', function(){
            this.game.sound.mute = ! this.game.sound.mute;
            this.muteButton.frame = localStorage["soundFrame"] = (this.game.sound.mute ? 1 : 0);
        }, this);
        this.muteButton.input.useHandCursor = true;
        localStorage["soundFrame"] = localStorage["soundFrame"] || 0;
        if (this.game.sound.mute || localStorage["soundFrame"] == 1) {
            this.game.sound.mute = true;
            this.muteButton.frame = 1; 
        }
        
        this.naves = self.game.add.group();
		this.naves.enableBody = true;
		this.naves.createMultiple(3, 'nave');
        this.nuevaNave();
        this.game.time.events.loop(5000, this.nuevaNave, this);	
        
        var title = this.game.add.sprite(this.game.world.centerX, -150, 'title');
        title.scale.set(0.7);
        title.anchor.setTo(0.5, 0.5);
        this.game.add.tween(title).to({ y: 40 }, 1000, Phaser.Easing.Bounce.Out).start();
        
        var play = game.add.button(this.game.world.centerX, this.game.world.centerY, 'play', function(){
            this.music.stop();
            this.game.state.start('play');
        }, this);
        play.inputEnabled = true;
        play.input.useHandCursor = true;
        play.anchor.setTo(0.5, 0.5);
        play.scale.set(0.6);
        
        var bubble = self.game.add.sprite(this.game.world.width - 20, this.game.world.centerY-20,'bubble');    
        bubble.scale.set(0.7);
        bubble.anchor.setTo(1, 0);  
        
        var player = self.game.add.sprite(this.game.world.width - 100, this.game.world.height-35,'player');    
        player.scale.set(0.5);
        player.anchor.setTo(1, 0.5);        
        
        this.game.time.events.loop(8000, this.nuevaRana, this);
        
        var message = self.game.add.sprite(140,this.game.world.height - 40,'message');    
        message.scale.set(0.3);
        message.anchor.setTo(0.5, 0.5); 
        this.game.add.tween(message).delay(100)
                                      .to({angle: 4}, 500)
                                      .to({angle: -4}, 500).loop().start();	                  
                                  
        var nameLabel = this.game.add.text(140, 
        this.game.world.height - 40, 'Aprende mientras \n Juegas!', 
        { font: 'bold 10px "Press Start 2P"', fill: '#000000', fontSize: 10, align: 'center' });
        nameLabel.anchor.setTo(0.5, 0.5);
        this.game.add.tween(nameLabel).delay(100)
                                      .to({angle: 4}, 500)
                                      .to({angle: -4}, 500).loop().start();
        
        this.music = this.game.add.audio('menu');
        this.music.loop = true;
        this.music.play(); 
    },
    update: function () {
        
    },
    nuevaNave: function(){
        var nave = this.naves.getFirstDead();
		if (!nave) {
			return;
		}
        nave.reset(this.game.world.width, this.game.rnd.integerInRange(40, 150));
        nave.animations.add('fly', [0, 1], 15, true);
        nave.animations.play('fly');
		nave.anchor.setTo(0, 0.5);
        nave.body.velocity.x = -50;
		nave.checkWorldBounds = true;
		nave.outOfBoundsKill = true;
    },
    nuevaRana: function(){
        var rana = this.game.add.sprite(this.game.world.width, this.game.world.height - 20, 'rana');
        rana.checkWorldBounds = true;
		rana.outOfBoundsKill = true;
        this.game.physics.enable(rana, Phaser.Physics.ARCADE);
        rana.body.velocity.x = -50;
        rana.animations.add('walk', [0, 1], 5, true);
        rana.animations.play('walk');
    }
};