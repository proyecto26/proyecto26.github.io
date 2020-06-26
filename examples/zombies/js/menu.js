var menuState = {
	create: function () {
		this.game.add.image(0,0, 'background');
		this.title = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 200, 'title2');
		this.title.anchor.set(0.5);
		
		this.playButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 50, 'play', function(){
            if (this.game.device.desktop) { 
				this.game.scale.startFullScreen(false, false);
			}
			else{
				this.game.scale.startFullScreen(false); 
			}
			this.game.stateTransition.to('play');
        }, this);
		this.playButton.anchor.set(0.5);
        this.playButton.input.useHandCursor = true;
	}
};