var playState = {
	create: function () {
                
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                
                this.maxSpeed = 300;
                this.shootUpTime = 0;
                
                this.shootSound = this.game.add.audio('shoot'); 
                this.music = this.game.add.audio('music');
                this.music.loop = true;
                this.music.play();
                
                this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, null);
                this.player.anchor.set(0.5);
                this.game.physics.arcade.enable(this.player);
                this.player.body.collideWorldBounds = true;
                this.player.body.setSize(this.player.width + 20, this.player.height + 10, 0,0);
                
                this.player.legs = this.game.add.sprite(0, 0, 'legs');
                this.player.legs.anchor.set(0.5);
                this.game.physics.arcade.enable(this.player.legs);
                this.player.legs.animations.add('walk', null, 10, true);
                this.player.addChild(this.player.legs);                

        	this.player.torso = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        	this.player.torso.anchor.setTo(0.5, 0.7);
                this.player.torso.frame = 2;                
                this.player.torso.animations.add('walk', [2,3,4,5,6,7,8,9], 16, true); 
                this.game.physics.arcade.enable(this.player.torso);           
                //this.player.addChild(this.player.torso);
                
                this.player.body.allowRotation = false;
                this.player.torso.body.allowRotation = false;
                
                this.game.camera.follow(this.player);
                
                //Debug mobile controls in desktop
                //this.game.device.desktop = false;
                
                this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
                
                this.buttonA = this.pad.addButton(this.game.width, this.game.height + 200, 'arcade', 'button1-up', 'button1-down');
                this.buttonA.onDown.add(this.playerShootUp, this);
                this.buttonA.repeatRate = 200;
                this.buttonA.addKey(Phaser.Keyboard.SPACEBAR);
                this.buttonA.visible = false;
                
                if (!this.game.device.desktop) {
                        
                        this.stick1 = this.pad.addStick(0, this.game.height + 400, 100, 'generic');
                        //this.stick1.scale = 0.8;
                        //this.stick1.alignBottomLeft(48);
                        this.add.tween(this.stick1).to( { posX: 150, posY: this.game.height - 150 }, 1500, "Back.easeOut", true, 500);
                
                        this.stick2 = this.pad.addStick(this.game.width, this.game.height + 200, 100, 'arcade');
                        this.stick2.scale = 0.8;
                        //this.stick2.alignBottomRight(48);
                        this.add.tween(this.stick2).to( { posX: this.game.width - 250, posY: this.game.height - 150 }, 2000, "Elastic.easeOut", true, 1000);
                
                        this.add.tween(this.buttonA).to( { posX: this.game.width - 110, posY: this.game.height - 250 }, 2000, "Elastic.easeOut", true, 1500);
                        this.buttonA.visible = true;
                }
                
                this.zombies = this.game.add.group();
                this.zombies.enableBody = true;
                this.zombies.createMultiple(10, 'zombie');
                
                this.bullets = this.game.add.group();
                this.bullets.enableBody = true;
                this.bullets.createMultiple(100, 'bullet');
                this.bullets.setAll('checkWorldBounds', true);	
                this.bullets.setAll('outOfBoundsKill', true);
                
                this.hud = Phaser.Plugin.HUDManager.create(this.game, this.player, 'gamehud');
                
                	
                
                this.blood = this.game.add.image(0, 0, 'blood');
                this.blood.width = this.game.world.width;
                this.blood.height = this.game.world.height;
                this.blood.alpha = 0;
                
                this.createZombie = this.game.time.events.loop(2000, this.newZombie, this);
                
                this.cursor = this.game.input.keyboard.createCursorKeys();
                this.game.input.keyboard.addKeyCapture([
                    Phaser.Keyboard.LEFT,
                    Phaser.Keyboard.RIGHT,
                    Phaser.Keyboard.UP,
                    Phaser.Keyboard.SPACEBAR
                ]);
          
                this.wasd = {
                    up:    this.game.input.keyboard.addKey(Phaser.Keyboard.W),
                    left:  this.game.input.keyboard.addKey(Phaser.Keyboard.A),
                    right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
                };
		
                //this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);
                //this.lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, this.shadowTexture);
                //this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
	},
        update: function(){
                
                this.game.physics.arcade.overlap(this.player, this.zombies, this.playerHit, null, this);
                this.game.physics.arcade.collide(this.bullets, this.zombies, this.zombieHit, null, this);
                
                this.player.torso.x = this.player.x;
                this.player.torso.y = this.player.y;
                if (this.game.device.desktop) {
                        this.playerMovement();
                        if(!this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
                           this.game.input.activePointer.isDown && 
                           this.game.time.now > this.shootUpTime){
                               this.shootUpTime = this.game.time.now + 200;
                               this.playerShootUp(); 
                        }
                }
                else{
                        this.playerMovementJoystick();
                }
                
                this.zombies.forEachAlive(function (zombie) {
                        if(this.game.physics.arcade.distanceBetween(zombie, this.player) > 50){
                            this.game.physics.arcade.moveToObject(zombie, this.player, 100);  
                            zombie.animations.play('walk');  
                        }
                        else{
                             zombie.body.velocity.set(0);   
                             zombie.animations.play('eat');
                        }
                        zombie.rotation = this.game.physics.arcade.angleBetween(zombie, this.player) + 1.57;
                }, this);
                
                //this.lightSprite.reset(this.game.camera.x, this.game.camera.y);
                //this.updateShadowTexture();
        },
        playerHit: function(){
                this.blood.alpha = 1;
                this.game.world.bringToTop(this.blood);
                
                this.game.time.events.add(Phaser.Timer.SECOND, function(){ this.blood.alpha = 0; }, this).autoDestroy = true;
        },
        zombieHit: function (bullet, zombie) {
                bullet.kill();
                zombie.damage++;
                if(zombie.damage >= 3){
                        zombie.kill();
                }
        },
        playerShootUp: function(){
                this.shootSound.play();
                this.oneShoot();
        },
	playerMovement: function (params) {
		var isMove = false;
                
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
                this.player.legs.body.angularVelocity = 0;
                
                if (this.cursor.left.isDown || this.wasd.left.isDown)
                {
                        this.player.legs.body.angularVelocity = -this.maxSpeed;
                }
                else if (this.cursor.right.isDown || this.wasd.right.isDown)
                {
                        this.player.legs.body.angularVelocity = this.maxSpeed;
                }
                
                if (this.cursor.up.isDown || this.wasd.up.isDown)
                {
                        this.game.physics.arcade.velocityFromAngle(this.player.legs.angle - 90, this.maxSpeed, this.player.body.velocity);
                        isMove = true;
                }
                
                this.walkPlayer(isMove);
                if(this.game.input.activePointer.isDown){
                      this.player.torso.rotation = this.game.physics.arcade.angleToPointer(this.player.torso) + 1.57;  
                }
                else{
                      this.player.torso.angle = this.player.legs.angle;
                }
                
                //this.player.torso.rotation = this.game.physics.arcade.angleBetween(this.player.torso, this.game.input.activePointer);
	},
        playerMovementJoystick: function () {
                if (this.stick1.isDown)
                {
                        this.physics.arcade.velocityFromRotation(this.stick1.rotation, this.stick1.force * this.maxSpeed, this.player.body.velocity);
                        this.player.legs.rotation = this.stick1.rotation + 1.57;
                        this.walkPlayer(true);
                }
                else
                {
                    this.player.body.velocity.set(0);
                    this.walkPlayer(false);
                }  
                if (this.stick2.isDown)
                {
                        this.player.torso.rotation = this.stick2.rotation + 1.57;
                        if(this.game.time.now > this.shootUpTime){
                               this.shootUpTime = this.game.time.now + 200;
                               this.playerShootUp(); 
                        }
                }    
                else{
                      this.player.torso.angle = this.player.legs.angle;
                }
        },
        walkPlayer: function(isMove){
               if (isMove) {
                    this.player.torso.animations.play('walk');
                    this.player.legs.animations.play('walk');
                }
                else{
                    this.player.torso.animations.stop();
                    this.player.torso.frame = 2;
                    this.player.legs.animations.stop();
                    this.player.legs.frame = 0;
                } 
                if((this.buttonA && this.buttonA.isDown) || 
                   (this.stick2 && this.stick2.isDown) ||
                    this.game.input.mousePointer.isDown)
                {
                    this.player.torso.frame = 0;   
                }
        },
        newZombie: function(){
                var zombie = this.zombies.getFirstDead();
                if (!zombie) {
                    return;
                }
                zombie.reset(0, 0);
                zombie.scale.set(1.3);
                zombie.anchor.set(0.5);
                zombie.body.setSize(zombie.width - 126, zombie.height - 126, 0,0);
                
                zombie.position.setTo(this.game.rnd.integerInRange(0, this.game.width), 
                                    this.game.rnd.integerInRange(0, this.game.height));
                zombie.animations.add('walk', this.game.math.numberArray(0, 29), 26, true);
                zombie.animations.add('eat', this.game.math.numberArray(30, 69), 30, true);
                zombie.animations.play('walk'); 
                zombie.damage = 0;
                
                /*var healthHUD = this.hud.addBar(0,-20, 32, 2, 10, 'health', zombie, Phaser.Plugin.HUDManager.HEALTHBAR);
                healthHUD.bar.anchor.setTo(0.5, 0.5);
                zombie.addChild(healthHUD.bar);
                healthHUD.allowRotation = false;
                healthHUD.bar.allowRotation = false;  */
        },
        oneShoot: function(){
                var bullet = this.bullets.getFirstDead();
                bullet.reset(0, 0);
                //bullet.anchor.setTo(-5.5, -0.2);
                bullet.anchor.set(0.5);
                //bullet.position.setTo(this.player.x, this.player.y);
                bullet.position.setTo(this.player.x - 64 * Math.cos(this.player.torso.rotation +1.6),
                                      this.player.y - 64 * Math.sin(this.player.torso.rotation +1.6)
                                     );
                bullet.angle = this.player.torso.angle - 90;
                this.game.physics.arcade.velocityFromAngle(this.player.torso.angle - 90, 400, bullet.body.velocity);      
        },
        updateShadowTexture: function () {
                this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
                this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);
                
                var radius = 250 + this.game.rnd.integerInRange(1, 10),
                    heroX = this.player.x - this.game.camera.x,
                    heroY = this.player.y - this.game.camera.y;
                
                var gradient = this.shadowTexture.context.createRadialGradient(
                        heroX, heroY, 250 * 0.75,
                        heroX, heroY, radius);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
                
                this.shadowTexture.context.beginPath();
                this.shadowTexture.context.fillStyle = gradient;
                this.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI*2, false);
                this.shadowTexture.context.fill();
                
                this.shadowTexture.dirty = true;
        },
        render: function () {
                /*this.game.debug.body(this.player);
                this.bullets.forEachAlive(function (zombie) {
                       this.game.debug.body(zombie); 
                },this);*/
        }
};