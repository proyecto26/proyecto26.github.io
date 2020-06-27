var playState = {
    create: function () {
        var self = this;
        self.game.physics.startSystem(Phaser.Physics.ARCADE);
        //Sin colision con el suelo
        self.game.physics.arcade.checkCollision.down = false;
        self.game.physics.arcade.TILE_BIAS = 50;
        
        self.cursor = self.game.input.keyboard.createCursorKeys();
        //Phaser captura las teclas y no se envía el evento al navegador        
        self.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR
        ]);
        self.wasd = { 
            up: self.game.input.keyboard.addKey(Phaser.Keyboard.W), 
            left: self.game.input.keyboard.addKey(Phaser.Keyboard.A),
            down: self.game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: self.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        
        self.canDoubleJump = true;
        self.canVariableJump = true;
        self.MAX_SPEED = 400;
        self.ACCELERATION = 1000;
        self.DRAG = 1000;
        self.GRAVITY = 2000;
        self.JUMP_SPEED = -650;
        
        self.background = self.game.add.sprite(-100, 0,'background1');
        self.background.fixedToCamera = true;
        self.background.cameraOffset.setTo(-100,0);
        
        self.clouds = self.game.add.group();
		self.clouds.enableBody = true;
		self.clouds.createMultiple(2, 'cloud');
        self.game.time.events.loop(4000, self.newCloud, self);	
        
        self.map = self.game.add.tilemap('map');
        self.map.addTilesetImage('tileset');
        self.map.setCollision([4, 5, 8, 9, 47, 99, 101, 102, 106, 109, 110, 186, 199, 211]);
        self.layer = self.map.createLayer('level1');
        // Set the world size to match the size of the layer 
        self.layer.resizeWorld();
        
        self.movableTiles = self.game.add.group(); 
        self.movableTiles.enableBody = true;
        
        self.player = self.game.add.sprite(20, 20,'player');        
    	self.player.animations.add('walk', [0, 1, 2, 3, 4, 0], 15, true);
        self.player.scale.set(0.5);
        self.player.anchor.setTo(0.5, 0.5);
        self.game.physics.enable(self.player, Phaser.Physics.ARCADE);
        self.player.body.bounce.x = 0.7; 
        self.player.body.bounce.y = 0.2;
        self.player.body.gravity.y = self.GRAVITY;
        self.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10);
        self.player.body.drag.setTo(this.DRAG, 0);        
        
        //Evitar que el sprite salga de pantalla y choque contra los límites del juego
        //Modificado para que no colisione con el suelo del mundo
        self.player.body.collideWorldBounds = true;
        //Cambiar el área de contacto del sprite
        //self.player.body.setSize(self.player.width, self.player.height, 0, 0);        
        //La camara sigue el personaje
        self.game.camera.follow(self.player, Phaser.Camera.FOLLOW_PLATFORMER);
        
        self.coin = self.game.add.sprite(720, 40, 'coin');
        self.game.physics.arcade.enable(self.coin);
        self.coin.anchor.setTo(0.5, 0.5);
        self.coin.scale.setTo(0, 0);
        self.game.add.tween(self.coin.scale).to({x: 1, y: 1}, 300).start();

        localStorage["bestScore"] = localStorage["bestScore"] || 0;
        self.scoreLabel = self.game.add.text(30, 10, 'puntaje: 0 \nmejor puntaje: ' + localStorage["bestScore"], 
                            { font: '18px Arial', fill: 'black' }); 
        self.scoreLabel.fixedToCamera = true;      
        self.score = 0;

        self.enemies = self.game.add.group(); 
        self.enemies.enableBody = true;
        self.enemies.createMultiple(10, 'enemy');
        //Cambia el color, la tinta a todos los enemigos
        self.enemies.setAll('tint', 0xff00ff);
        self.game.time.events.loop(2200, self.newEnemy, self);
        
        self.pixel = self.game.make.bitmapData(5, 5);
	    self.pixel.draw('pixel');
    	self.pixel.update();
        self.emitter = self.game.add.emitter(0, 0, 15);
        self.emitter.makeParticles(self.pixel);
        //Se pueden emitir diferentes partículas
        //self.emitter.makeParticles(['image1', 'image2']);
        self.emitter.setYSpeed(-150, 150);
        self.emitter.setXSpeed(-150, 150);
        self.emitter.gravity = 0;
        self.emitter.minParticleScale = 1.3; 
        self.emitter.maxParticleScale = 2.5;
        self.emitter.minRotation = 10; 
        self.emitter.maxRotation = 100;
        self.emitter.width = 69; 
        self.emitter.height = 42;
        
        self.shurikens = self.game.add.group();
        self.shurikens.enableBody = true;
        self.shurikens.createMultiple(100, 'shuriken');
        self.shurikens.setAll('checkWorldBounds', true);
	    self.shurikens.setAll('outOfBoundsKill', true);
        
        if(!self.game.device.desktop){
            self.shurikenInput = self.game.add.sprite(10, self.game.world.height -30, 'shurikenInput');
            self.shurikenInput.anchor.setTo(0, 1);
            self.shurikenInput.inputEnabled = true;
            self.shurikenInput.fixedToCamera = true;
        }

        self.jumpSound = self.game.add.audio('jump'); 
        self.jumpSound.volume = 0.3;
        self.coinSound = self.game.add.audio('coin'); 
        self.music = self.game.add.audio('music');
        self.music.volume = 0.3;
        self.music.loop = true;
        self.music.play(); 
        
        self.shurikenTime = 0;
    },
    update: function () {
        var self = this;             
        if (!self.player.alive) {  return; }
        if (!self.player.inWorld) { 
            self.playerDie(); 
        }
        //El jugador y los muros colisionan
        self.game.physics.arcade.collide(self.layer, self.player, self.playerCollide, null, self);
        self.game.physics.arcade.collide(self.layer, self.enemies);
        self.game.physics.arcade.collide(self.player, self.movableTiles);
        self.game.physics.arcade.overlap(self.enemies, self.shurikens, self.enemyDie, null, self);
        self.game.physics.arcade.overlap(self.player, self.enemies, self.playerDieEnemy, null, self);
        self.game.physics.arcade.overlap(self.player, self.coin, self.takeCoin, null, self);
        
        self.shurikens.forEachAlive(function(shuriken){
            shuriken.angle += 10;
        }, self);
        
        self.player_movements();
    },
    /*render: function(){
        var self = this;
        self.game.debug.body(self.player);
         self.game.debug.spriteInfo(self.player, 32, 32);
        self.shurikens.forEachAlive(function(shuriken){
            self.game.debug.body(shuriken);
        }, self); 
    },*/
    playerDie: function() {
        this.player.kill();
        this.music.stop();
        //this.deadSound.play(); 
        //this.game.time.events.add(1000, function(){
           this.game.state.start('menu');  
        //}, this);
    },
    playerDieEnemy: function(player, enemy) {
        this.music.stop();
        this.player.kill();
        //this.deadSound.play(); 
        //Se cambia el color de las partículas del emisor
        this.pixel.replaceRGB(230, 0, 60, 255, 0, 0, 0, 255);
        this.emitter.x = this.player.x; 
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        this.game.time.events.add(1000, function(){
           this.game.state.start('menu');  
        }, this);
    },
    leftInputIsActive : function() {
        var shurikenInput = true;
        if(!self.game.device.desktop){
            shurikenInput = !this.shurikenInput.input.pointerDown(this.game.input.activePointer.id)
        }
        var isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.wasd.left.isDown;
        isActive |= (this.game.input.activePointer.isDown &&
            this.game.input.activePointer.x < this.game.width/4 && shurikenInput);
        return isActive;
    },
    rightInputIsActive : function() {
        var isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.wasd.right.isDown;
        isActive |= (this.game.input.activePointer.isDown &&
            this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);
        return isActive;
    },
    upInputIsActive : function(duration) {
        var isActive = this.input.keyboard.justPressed(Phaser.Keyboard.UP, duration) || this.input.keyboard.justPressed(Phaser.Keyboard.W, duration);
        isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) &&
            this.game.input.activePointer.x > this.game.width/4 &&
            this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);
        return isActive;
    },
    spaceInputIsActive : function() {
        var isActive = this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
        return isActive;
    },
    takeCoin: function(player, coin) { 
        this.coinSound.play();
        this.coin.kill();
        this.score += 5;
        if(this.score > parseInt(localStorage["bestScore"])){
            localStorage["bestScore"] = this.score;
        }
        this.scoreLabel.text = 'score: ' + this.score + '\nmejor puntaje: ' + localStorage["bestScore"];
    },
    newEnemy: function() {         
        var enemy = this.enemies.getFirstDead();
        //Solo se pueden obtener la cantidad de enemigos definida
        if (!enemy) { 
            return; 
        }
        //El punto de anclaje es el centro y abajo
        enemy.anchor.setTo(0.5, 1); 
        //Ubicamos al enemigo a la derecha
        enemy.reset(this.game.world.width, 50); 
        enemy.body.gravity.y = 500;
        //randomSign => -1 o 1
        enemy.body.velocity.x = -100 /** Phaser.Math.randomSign()*/; 
        //Permite crear un rebote
        enemy.body.bounce.x = 1; 
        enemy.body.bounce.y = 1; 
        //Se elimina el sprite cuando el enemigo sale del mundo
        enemy.checkWorldBounds = true; 
        enemy.outOfBoundsKill = true;
    },
    newShuriken: function(){
        if (this.game.time.now < this.shurikenTime)
			return;
        //this.shurikenAudio.play('', 0, 0.4, false);
		this.shurikenTime = this.game.time.now + 200;
        var shuriken = this.shurikens.getFirstDead();
        if (!shuriken) { 
            return; 
        }
	    shuriken.anchor.setTo(0.5, 0.5);
	    shuriken.reset(this.player.x + this.player.width/2, this.player.y);
	    shuriken.scale.setTo(0.4);
	    shuriken.body.velocity.x = (this.player.scale.x > 0 ? 600 : -600);
    },
    enemyDie: function(enemy, shuriken){
        //this.game.debug.body(shuriken);
        enemy.kill();
        //Se cambia el color de las partículas del emisor
        this.pixel.replaceRGB(0, 0, 0, 255, 230, 0, 60, 255);
        this.emitter.x = enemy.x; 
        this.emitter.y = enemy.y;
        this.emitter.start(true, 600, null, 15);
    },
    newCloud: function(){
        var cloud = this.clouds.getFirstDead();
		if (!cloud) {
			return;
		}
        cloud.reset(0, 0);
        cloud.fixedToCamera = true;
        cloud.cameraOffset.setTo(this.game.width, this.game.rnd.integerInRange(40, 150));
		cloud.anchor.setTo(0, 0.5);
        this.game.add.tween(cloud.cameraOffset).to({ x: -500 }, 10000, Phaser.Easing.Linear.None).start();
		var scale = (Math.random() * (0.6 - 0.3) + 0.3);
		cloud.scale.setTo(scale);
		cloud.checkWorldBounds = true;
		cloud.outOfBoundsKill = true;
    },
    player_movements: function(){
        var self = this;
        //CONTROLAR EL DOBLE SALTO
        var onTheGround = self.player.body.onFloor();
        if (onTheGround) self.canDoubleJump = true;
        if (self.upInputIsActive(5)) {
            if (self.canDoubleJump) self.canVariableJump = true;
            if (self.canDoubleJump || onTheGround) {
                self.jumpSound.play();
                self.player.body.velocity.y = self.JUMP_SPEED;
                if (!onTheGround) self.canDoubleJump = false;
            }
        }
        if (self.canVariableJump && self.upInputIsActive(150)){
            self.jumpSound.play();
            self.player.body.velocity.y = self.JUMP_SPEED;
        }
        if (!self.upInputIsActive()) {
            self.canVariableJump = false;
        }
        
        //CONTROLAR EL MOVIMIENTO
        if (self.leftInputIsActive()) {
            self.player.body.acceleration.x = -self.ACCELERATION;
            self.player.animations.play('walk');
            self.player.scale.x = -0.5;
        } else if (self.rightInputIsActive()) {
            self.player.body.acceleration.x = self.ACCELERATION;
            self.player.animations.play('walk');
            self.player.scale.x = 0.5;
        } else {
            self.player.body.acceleration.x = 0;
        }
        if(self.spaceInputIsActive()){
            self.player.frame = 6;
            self.newShuriken();
        }
        else if(self.wasd.down.isDown || self.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            self.player.frame = 5;
        }
        else if(self.player.body.velocity.x == 0){
            self.player.animations.stop();
            self.player.frame = 0;
        }        
        if(!self.game.device.desktop && self.shurikenInput.input.pointerDown(self.game.input.activePointer.id)){
            self.player.frame = 6;
            self.newShuriken();
        }
    },
    playerCollide : function(player, tile){
        var self = this;
        if(tile.index == 211){
            self.playerDieEnemy(player);
        }
        if(tile.index == 9 && tile.animated == undefined){
            tile.animated = true; 
            var movableTile = new MovableTile(self.game, 'tileset', tile, self.map);
            self.movableTiles.add(movableTile);
            movableTile.loadTexture('boom', 0);
            movableTile.anchor.setTo(0.5, 0.5);
            movableTile.scale.setTo(0.3, 0.3);
            movableTile.reset(tile.worldX +  + tile.width / 2, tile.worldY + tile.height / 2);
            movableTile.animations.add('boom');
            movableTile.play('boom', 30, false, true);
            self.playerDieEnemy(player);
        }
        if(tile.index == 99 && tile.animated == undefined){
            tile.animated = true; 
            var movableTile = new MovableTile(self.game, 'tileset', tile, self.map);
            self.movableTiles.add(movableTile);
            movableTile.body.immovable = true;
            movableTile.outOfBoundsKill = true;
            self.game.add.tween(movableTile).to( { y: self.game.height + tile.height }, 
                                                 2400, Phaser.Easing.Linear.None)
                                                 .start().onComplete.add(function(){
                movableTile.restartTile();
            });
        }
        if(tile.index == 47 && tile.animated == undefined){
            tile.animated = true; 
            var movableTile = new MovableTile(self.game, 'tileset', tile, self.map);
            self.movableTiles.add(movableTile);
            movableTile.body.velocity.y = 50;
            movableTile.body.immovable = true;
            movableTile.checkWorldBounds = true;
            movableTile.outOfBoundsKill = true;
            movableTile.events.onOutOfBounds.add(function(){
                movableTile.restartTile();
            }, self);
        }
    }
};