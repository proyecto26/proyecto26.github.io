/* global Phaser */

var playState = {
    init: function () {
        this.input.maxPointers = 1;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.updateLayout();

        //Pixel Art
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.time.desiredFps = 60;
    },
    preload: function () {
        this.game.load.crossOrigin = true;
        this.game.load.image('tube', tubeUrl);
        this.game.load.image('ground', groundUrl);
        this.game.load.spritesheet('bird', birdUrl, 75, 55);

        this.game.load.audio('hit', [
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/hit.ogg',
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/hit.wav'
        ]);
        this.game.load.audio('die', [
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/die.ogg',
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/die.wav'
        ]);
        this.game.load.audio('point', [
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/point.ogg',
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/point.wav'
        ]);
        this.game.load.audio('wing', [
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/wing.ogg',
            'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/audio/wing.wav'
        ]);
    },
    create: function () {
        this.isDebugging = false;
        this.totalScore = 0;
        this.started = false;
        this.dead = false;
        this.canJump = true;
        this.canRestart = false;

        this.game.world.setBounds(-10, 0, this.game.width + 10, this.game.height);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.checkCollision.up = false;

        this.tubes = this.game.add.group();
        this.tubes.enableBody = true;
        this.tubes.createMultiple(12, 'tube');
        this.newtubes = this.game.time.events.loop(1500, this.newTube, this);
        this.newtubes.timer.stop(false);

        this.sensors = this.game.add.group();
        this.sensors.enableBody = true;

        var groundCache = this.game.cache.getFrame('ground');
        this.ground = this.game.add.tileSprite(-10, this.game.height, this.game.width + 20, groundCache.height, 'ground');
        this.ground.anchor.y = 1;
        this.game.physics.arcade.enable(this.ground);
        this.ground.body.immovable = true;
        this.ground.body.moves = false;
        this.ground.autoScroll(-50, 0);

        this.bird = this.game.add.sprite(this.game.world.centerX / 2, this.game.world.centerY, 'bird');
        this.bird.anchor.set(0.5);
        this.bird.scale.set(0.8);
        this.bird.animations.add('fly', null, 15, true);
        this.bird.animations.play('fly');
        this.tweenFly = this.game.add.tween(this.bird);
        this.tweenFly.to({ y: this.bird.y + 20 }, 400, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

        this.bird.checkWorldBounds = true;
        this.bird.pivot.x = -this.bird.width / 2;
        this.bird.events.onOutOfBounds.add(function () {
            this.canJump = false;
        }, this);
        this.bird.events.onEnterBounds.add(function () {
            this.canJump = true;
        }, this);

        this.game.input.onDown.add(this.jump, this);
        this.scoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY / 3, "0", { font: "60px Arial", fill: "#ffffff" });
        this.scoreText.anchor.set(0.5);

        // Audio
        this.hitAudio = this.add.audio('hit');
        this.dieAudio = this.add.audio('die');
        this.pointAudio = this.add.audio('point');
        this.wingAudio = this.add.audio('wing');
    },
    start: function () {
        this.ground.autoScroll(0, 0);
        this.tweenFly.stop();
        this.game.physics.arcade.enable(this.bird);
        this.bird.body.setSize(this.bird.width - 10, this.bird.height - 10, 0, 0);
        this.bird.body.gravity.y = 2000;
        this.bird.body.collideWorldBounds = true;

        this.newtubes.timer.start();

        this.started = true;
    },
    gameOver: function () {
        var self = this;
        self.newtubes.timer.stop(false);

        self.game.add.tween(self.game.camera).to({ x: -10 }, 40, Phaser.Easing.Sinusoidal.InOut, true, 0, 5, true);
        self.bird.animations.stop();

        self.flash = self.game.add.graphics(-10, 0);
        self.flash.beginFill(0xffffff, 1);
        self.flash.drawRect(0, 0, self.game.width + 20, self.game.height);
        self.flash.endFill();
        self.flash.alpha = 0.5;
        self.game.add.tween(self.flash).to({ alpha: 0 }, 50, Phaser.Easing.Cubic.In, true);

        self.dead = true;

        setTimeout(function () {
            self.canRestart = true;
        }, Phaser.Timer.SECOND * 0.5);

        self.tubes.forEachAlive(function (tube) {
            tube.body.velocity.x = 0;
        }, self);
        self.sensors.forEachAlive(function (sensor) {
            sensor.body.velocity.x = 0;
        }, self);

        self.hitAudio.play();
        setTimeout(function () {
            self.dieAudio.play();
        }, 300);
    },
    jump: function () {
        if (!this.dead) {
            this.start();
        }

        if (!this.dead && this.canJump) {
            this.bird.animations.play('fly');
            this.birdInJump = true;
            this.bird.body.velocity.y = -550;
            this.wingAudio.play();
        }

        if (this.dead && this.canRestart) {
            this.game.state.start(this.game.state.current);
        }
    },
    update: function () {
        this.game.physics.arcade.collide(this.bird, this.ground);
        if (!this.started || this.dead) return;
        this.game.physics.arcade.overlap(this.bird, this.sensors, this.incrementScore, null, this);
        this.game.physics.arcade.overlap(this.bird, this.tubes, this.gameOver, null, this);

        this.updateAngle();

        this.ground.tilePosition.x -= 2;

        if (this.ground.body.touching.up) {
            this.gameOver();
        }
    },
    updateAngle: function () {

        if (this.bird.body.touching.down) return;

        if (this.birdInJump) {
            if (this.bird.angle > -30) {
                this.bird.angle -= 10;
            } else {
                this.birdInJump = false;
            }
        } else if (this.bird.angle < 0) {
            this.bird.angle += 1;
        } else if (this.bird.angle < 45) {
            this.bird.animations.stop();
            this.bird.angle += 2;
        } else if (this.bird.angle < 90) {
            this.bird.angle += 4;
        }
    },
    resize: function () {

        if (this.bird) {
            this.bird.x = this.game.world.centerX / 2;
        }
        if (this.scoreText) {
            this.scoreText.y = this.game.world.centerY / 3;
            this.scoreText.x = this.game.world.centerX;
        }
        if (this.ground) {
            this.ground.width = this.game.width + 20;
        }
    },
    render: function () {
        if (!this.isDebugging) return;

        this.game.debug.text('Debugging', 10, 30, 'white', '20px "Sigmar One"');
        this.game.debug.body(this.bird);
        this.game.debug.body(this.ground, 'rgba(255, 255, 0, 0.5)');
        this.game.debug.geom(new Phaser.Point(this.bird.x, this.bird.y), '#FFFF00');
        if (this.tubes) {
            this.tubes.forEachAlive(function (tube) {
                this.game.debug.body(tube, 'rgba(0, 0, 255, 0.5)');
            }, this);
        }
        if (this.sensors) {
            this.sensors.forEachAlive(function (sensor) {
                this.game.debug.body(sensor, 'rgba(0, 255, 0, 0.5)');
            }, this);
        }
    },
    newTube: function () {
        var tube = this.game.cache.getFrame('tube');
        var randomPosition = this.game.rnd.integerInRange(100, tube.height) + this.ground.height;

        var velocity = -180;
        var posX = this.game.width + tube.width / 2;
        var tube1 = this.tubes.getFirstDead();
        tube1.reset(posX, randomPosition - 100);
        tube1.anchor.setTo(0.5, 1);
        tube1.body.velocity.x = velocity;
        tube1.body.immovable = true;
        tube1.checkWorldBounds = true;
        tube1.outOfBoundsKill = true;

        var tube2 = this.tubes.getFirstDead();
        tube2.reset(posX, randomPosition + 100 + tube.height);
        tube2.anchor.setTo(0.5, 0);
        tube2.scale.setTo(1, -1);
        tube2.body.velocity.x = velocity;
        tube2.body.immovable = true;
        tube2.checkWorldBounds = true;
        tube2.outOfBoundsKill = true;

        var sensor = this.sensors.create(this.game.width + tube.width, 0);
        sensor.body.setSize(40, this.game.height);
        sensor.body.velocity.x = velocity;
        sensor.body.immovable = true;
        sensor.alpha = 0;
    },
    incrementScore: function (bird, sensor) {
        sensor.kill();
        this.totalScore++;
        this.scoreText.setText(this.totalScore);
        this.pointAudio.play();
    },
    toggleDebug: function () {
        this.game.debug.reset();
        this.isDebugging = !this.isDebugging;
    }
};