/* global Phaser */
var menuState = {
	create: function() {
		this.game.stage.backgroundColor = '#FFF';
		
		this.MAX_SPEED = 600;
		this.ACCELERATION = 1000;
		this.DRAG = 1000;
		this.GRAVITY = 2000;
		this.JUMP_SPEED = -650;
		this.jumping = false;
		this.attackTime = 0;
		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.physics.arcade.gravity.y = this.GRAVITY;
		//Pixel Art
		this.game.renderer.renderSession.roundPixels = true;
		
		this.cursor = this.game.input.keyboard.createCursorKeys();     
		this.game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.SPACEBAR
		]);
		this.wasd = { 
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W), 
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
		};
		
		this.logo = this.game.add.image(this.game.world.centerX, 0, 'ninjadev');
		this.logo.anchor.x = 0.5;
		
		this.ninja = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ninja');
		this.ninja.anchor.setTo(0.5, 1);
		this.ninja.frame = 2;
		this.ninja.pivot.set(0.5);
		this.ninja.scale.set(0.5);
		this.game.physics.enable(this.ninja, Phaser.Physics.ARCADE);
		this.game.camera.follow(this.ninja, Phaser.Camera.FOLLOW_PLATFORMER);
		
		this.ninja.body.gravity.y = this.GRAVITY;		
		this.ninja.body.collideWorldBounds = true;
		this.ninja.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10);
		this.ninja.body.drag.setTo(this.DRAG, 0);
		this.ninja.body.bounce.x = 0.7; 
		this.ninja.body.bounce.y = 0.2;		
		
		this.ninja.animations.add('walk', [4, 5], 10, true);
		this.ninja.animations.add('attack', [12, 13], 3, true);
		this.ninja.animations.add('dead', [10, 11, 8, 9, 0], 1);

		// Simulate Ninja dead
		this.game.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(this.onNinjaDead, this);
		
		this.shurikens = this.game.add.group();
		this.shurikens.enableBody = true;
		this.shurikens.createMultiple(100, 'shuriken');
		this.shurikens.setAll('checkWorldBounds', true);
		this.shurikens.setAll('outOfBoundsKill', true);
		
		var dragonCache = this.game.cache.getFrame('dragon');
		var count = 0;
		var length = dragonCache.width / 20;
		var points = [];
		for (var i = 0; i < 20; i++) {
			points.push(new Phaser.Point(i * length, 0));
		}
		this.dragon = this.game.add.rope(this.game.world.centerX - dragonCache.width / 2, 100, 'dragon', null, points);
		this.dragon.pivot.set(0.5);
		this.dragon.scale.set(0.3);
		this.dragon.updateAnimation = function() {
			count += 0.1;
			for (var i = 0; i < this.points.length; i++) {
				this.points[i].y = Math.sin(i * 0.4  + count) * 20;
			}
		};
	},
	update: function() {
		if (!this.ninja.alive) return;
		
		this.shurikens.forEachAlive(function(shuriken){
			shuriken.angle += 10;
		});
		
		this.ninjaControl();
	},
	ninjaControl: function() {
		var prevFrame = this.ninja.frame;
		var onTheGround = this.ninja.body.onFloor();
		var animateNinja = false;
		
		if (onTheGround) {
			this.jumps = 2;
			this.jumping = false;
		}
	
		if (this.jumps > 0 && this.input.keyboard.downDuration(Phaser.Keyboard.UP, 150)) {
			this.ninja.frame = 6;
			this.ninja.body.velocity.y = this.JUMP_SPEED;
			this.jumping = true;
		}
	
		if (this.jumping && this.input.keyboard.upDuration(Phaser.Keyboard.UP)) {
			this.jumps--;
			this.jumping = false;
		}
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.wasd.left.isDown) {
			this.ninja.body.acceleration.x = -this.ACCELERATION;
			this.ninja.scale.x = -0.5;
			if(onTheGround) { 
				animateNinja = true;
				this.ninja.animations.play('walk');
			}
		} else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.wasd.right.isDown) {
			this.ninja.body.acceleration.x = this.ACCELERATION;
			this.ninja.scale.x = 0.5;
			if(onTheGround) { 
				animateNinja = true;
				this.ninja.animations.play('walk');
			}
		} else {
			this.ninja.body.acceleration.x = 0;
		}
		
		if(this.wasd.down.isDown || this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			if(onTheGround){
				this.ninja.frame = 1;
			} else {
				this.ninja.frame = 7;
			}
		}
		else
		{
			if(this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				this.ninja.animations.play('attack');				
				this.onNinjaAttack();
				animateNinja = true;
			} else if(onTheGround && this.ninja.body.velocity.x == 0) {
				this.ninja.frame = 2;
			}			
		}
		
		if(!animateNinja) {
			this.ninja.animations.stop();
		}
		
		if(prevFrame != this.ninja.frame || this.ninja.animations.currentAnim.isPlaying) {
			this.resizeBodyByCurrentFrame("ninja", this.ninja);
		}
	},
	onNinjaDead : function () {
		this.ninja.animations.play('dead');
		this.ninja.alive = false;
	},
	onNinjaAttack: function() {
		if (this.game.time.now < this.attackTime) return;
		this.attackTime = this.game.time.now + 300;
		
		var shuriken = this.shurikens.getFirstDead();
		if (!shuriken) return;
		shuriken.anchor.set(0.5);
		shuriken.reset(this.ninja.x + this.ninja.width/2, this.ninja.y - this.ninja.height/2);
		shuriken.scale.setTo(0.8);
		shuriken.body.velocity.x = (this.ninja.scale.x > 0 ? 600 : -600);
	},
	resizeBodyByCurrentFrame: function(atlasName, sprite) {
		var frameData = this.cache.getFrameData(atlasName).getFrame(sprite.frame);
		sprite.body.setSize(frameData.width, frameData.height, 0, 0);
	},
	resize: function() {
		this.dragon.position.x = this.game.world.centerX - this.dragon.width / 2;
	}
};
