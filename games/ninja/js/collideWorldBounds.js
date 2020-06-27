Phaser.Physics.Arcade.Body.prototype.checkWorldBounds = function () {
    if (this.position.x < this.game.physics.arcade.bounds.x && this.game.physics.arcade.checkCollision.left)
    {
        this.position.x = this.game.physics.arcade.bounds.x;
        this.velocity.x *= -this.bounce.x;
        this.blocked.left = true;
    }
    else if (this.right > this.game.physics.arcade.bounds.right && this.game.physics.arcade.checkCollision.right)
    {
        this.position.x = this.game.physics.arcade.bounds.right - this.width;
        this.velocity.x *= -this.bounce.x;
        this.blocked.right = true;
    }

    if (this.position.y < this.game.physics.arcade.bounds.y && this.game.physics.arcade.checkCollision.up)
    {
        this.position.y = this.game.physics.arcade.bounds.y;
        this.velocity.y *= -this.bounce.y;
        this.blocked.up = true;
    }
}