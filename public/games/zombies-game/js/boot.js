var bootState = {
    preload: function () {
        this.game.load.image('loading', 'assets/loading.png');
        this.game.load.image('loadingborder', 'assets/loadingborder.png');
        this.game.stage.backgroundColor = '#A5DEF1';
    },
    create: function () {
        
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
        this.game.stateTransition.configure({
            duration: Phaser.Timer.SECOND * 0.8,
            ease: Phaser.Easing.Exponential.InOut,
            properties: {
                alpha: 0,
                scale: {
                    x: 1.4,
                    y: 1.4
                }
            }
        });
        
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        if (!this.game.device.desktop)
        {
            this.scale.forceOrientation(true, false);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }
        this.game.scale.setMaximum();
        this.scale.setScreenSize(true);
        this.game.state.start('load');
    },
    enterIncorrectOrientation: function () {
        document.getElementById('rotate').style.display = 'block';
        document.getElementById('game').style.display = 'none';
        this.game.paused = true;
    },
    leaveIncorrectOrientation: function () {
        document.getElementById('game').style.display = 'block';
        document.getElementById('rotate').style.display = 'none';
        this.game.paused = false;
        if (!this.game.device.desktop){ 
             this.game.scale.setShowAll();
             this.game.scale.refresh();
             this.game.scale.setMaximum();
             this.scale.setScreenSize(true);
             this.game.scale.startFullScreen(false);
        }
    }
};