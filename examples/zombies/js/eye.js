 var Eye = function (game, x, y, scale, time) {
	'use strict';
	
	var bmd = game.add.bitmapData(game.width, game.height);
	this.context = bmd.context;
	bmd.dirty = true;
	Phaser.Sprite.call(this, game, x, y, bmd);
		
	// The time at which this eye will come alive
	this.activationTime = time;
	
	// The speed at which the iris follows the mouse
	this.irisSpeed = 0.01 + ( Math.random() * 0.2 ) / scale;
	
	// The speed at which the eye opens and closes
	this.blinkSpeed = 0.2 + ( Math.random() * 0.2 );
	this.blinkInterval = 5000 + 5000 * ( Math.random() );
	
	// Timestamp of the last blink
	this.blinkTime = Date.now();
	
	this.scale = scale;
	this.size = 70 * scale;
	
	this.x = x * game.width; 
	this.y = y * game.height + ( this.size * 0.15 );
	
	this.iris = {
		x: this.x,
		y: this.y - ( this.size * 0.1 ),
		size: this.size * 0.2
	};
	
	this.pupil = {
		width: 2 * scale,
		height: this.iris.size * 0.75
	};
	
	this.exposure = {
		top: 0.1 + ( Math.random() * 0.3 ),
		bottom: 0.5 + ( Math.random() * 0.3 ),
		current: 0,
		target: 1
	};
	
	// Affects the amount of inner shadow
	this.tiredness = ( 0.5 - this.exposure.top ) + 0.1;
	
	this.isActive = false;
	
	this.startTime = Date.now();
	
	game.add.existing(this);
};

Eye.prototype = Object.create(Phaser.Sprite.prototype);
Eye.prototype.constructor = Eye;

Eye.prototype.update = function(){ 
	
	var mouse = {};
	mouse.x = this.game.input.mousePointer.x;
	mouse.y = this.game.input.mousePointer.y;
	
	// The number of seconds that have passed since initialization
	var seconds = ( Date.now() - this.startTime ) / 1000;
	
	// Out with the old ...
	//this.context.clearRect( 0, 0, this.game.width, this.game.height );
	
	if( seconds > this.activationTime * 10 ) {
		this.activate();
	};
	
	this.updateEye(mouse);
};

Eye.prototype.updateEye = function(mouse) {
	
	if( this.isActive === true ) {
		this.renderEye(mouse);
	}
};	

Eye.prototype.activate = function() {
	this.isActive = true;
};

Eye.prototype.renderEye = function(mouse) {
	var time = Date.now();
		
	if( this.exposure.current < 0.012 ) {
		this.exposure.target = 1;
	}
	else if( time - this.blinkTime > this.blinkInterval ) {
		this.exposure.target = 0;
		this.blinkTime = time;
	}
	
	this.exposure.current += ( this.exposure.target - this.exposure.current ) * this.blinkSpeed;
	
	// Eye left/right
	var el = { x: this.x - ( this.size * 0.8 ), y: this.y - ( this.size * 0.1 ) };
	var er = { x: this.x + ( this.size * 0.8 ), y: this.y - ( this.size * 0.1 ) };
	
	// Eye top/bottom
	var et = { x: this.x, y: this.y - ( this.size * ( 0.5 + ( this.exposure.top * this.exposure.current ) ) ) };
	var eb = { x: this.x, y: this.y - ( this.size * ( 0.5 - ( this.exposure.bottom * this.exposure.current ) ) ) };
	
	// Eye inner shadow top
	var eit = { x: this.x, y: this.y - ( this.size * ( 0.5 + ( ( 0.5 - this.tiredness ) * this.exposure.current ) ) ) };
	
	// Eye iris
	var ei = { x: this.x, y: this.y - ( this.iris.size ) };
	
	// Offset the iris depending on mouse position
	var eio = { 
		x: ( mouse.x - ei.x ) / ( window.innerWidth - ei.x ), 
		y: ( mouse.y ) / ( window.innerHeight )
	};
	
	// Apply the iris offset
	ei.x += eio.x * 16 * Math.max( 1, this.scale * 0.4 );
	ei.y += eio.y * 10 * Math.max( 1, this.scale * 0.4 );
	
	this.iris.x += ( ei.x - this.iris.x ) * this.irisSpeed;
	this.iris.y += ( ei.y - this.iris.y ) * this.irisSpeed;
	
	// Eye fill drawing
	this.context.fillStyle = 'rgba(255,255,255,1.0)';
	this.context.strokeStyle = 'rgba(100,100,100,1.0)';
	this.context.beginPath();
	this.context.lineWidth = 3;
	this.context.lineJoin = 'round';
	this.context.moveTo( el.x, el.y );
	this.context.quadraticCurveTo( et.x, et.y, er.x, er.y );
	this.context.quadraticCurveTo( eb.x, eb.y, el.x, el.y );
	this.context.closePath();
	this.context.stroke();
	this.context.fill();
	
	// Iris
	this.context.save();
	this.context.globalCompositeOperation = 'source-atop';
	this.context.translate(this.iris.x*0.1,0);
	this.context.scale(0.9,1);
	this.context.strokeStyle = 'rgba(0,0,0,0.5)';
	this.context.fillStyle = 'rgba(130,50,90,0.9)';
	this.context.lineWidth = 2;
	this.context.beginPath();
	this.context.arc(this.iris.x, this.iris.y, this.iris.size, 0, Math.PI*2, true);
	this.context.fill();
	this.context.stroke();
	this.context.restore();
	
	// Iris inner
	this.context.save();
	this.context.shadowColor = 'rgba(255,255,255,0.5)';
	this.context.shadowOffsetX = 0;
	this.context.shadowOffsetY = 0;
	this.context.shadowBlur = 2 * this.scale;
	this.context.globalCompositeOperation = 'source-atop';
	this.context.translate(this.iris.x*0.1,0);
	this.context.scale(0.9,1);
	this.context.fillStyle = 'rgba(255,255,255,0.2)';
	this.context.beginPath();
	this.context.arc(this.iris.x, this.iris.y, this.iris.size * 0.7, 0, Math.PI*2, true);
	this.context.fill();
	this.context.restore();
	
	// Pupil
	this.context.save();
	this.context.globalCompositeOperation = 'source-atop';
	this.context.fillStyle = 'rgba(0,0,0,0.9)';
	this.context.beginPath();
	this.context.moveTo( this.iris.x, this.iris.y - ( this.pupil.height * 0.5 ) );
	this.context.quadraticCurveTo( this.iris.x + ( this.pupil.width * 0.5 ), this.iris.y, this.iris.x, this.iris.y + ( this.pupil.height * 0.5 ) );
	this.context.quadraticCurveTo( this.iris.x - ( this.pupil.width * 0.5 ), this.iris.y, this.iris.x, this.iris.y - ( this.pupil.height * 0.5 ) );
	this.context.fill();
	this.context.restore();
	
	this.context.save();
	this.context.shadowColor = 'rgba(0,0,0,0.9)';
	this.context.shadowOffsetX = 0;
	this.context.shadowOffsetY = 0;
	this.context.shadowBlur = 10;
	
	// Eye top inner shadow
	this.context.fillStyle = 'rgba(120,120,120,0.2)';
	this.context.beginPath();
	this.context.moveTo( el.x, el.y );
	this.context.quadraticCurveTo( et.x, et.y, er.x, er.y );
	this.context.quadraticCurveTo( eit.x, eit.y, el.x, el.y );
	this.context.closePath();
	this.context.fill();
	
	this.context.restore();
};