var game = new Phaser.Game({
    renderer: Phaser.AUTO,
    parent: 'game',
    transparent: false,
    alignH: true,
    alignV: true,
    backgroundColor: '#41C9D6',
    disableVisibilityChange: true,
    scaleMode: Phaser.ScaleManager.RESIZE,
});
game.state.add('play', playState);
game.state.start('play');