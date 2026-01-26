var myText = function(game, x, y, text, style){
  Phaser.Text.call(this, game, x, y, text, style);
  
  this.game.add.existing(this);
  
  this.fontStyles = [];
  this.fontWeights = [];
};

myText.prototype = Object.create(Phaser.Text.prototype);
myText.prototype.constructor = myText;

Phaser.Text.prototype.addFontStyle = function(style, position){
  this.fontStyles[position] = style;
  this.dirty = true;
  
  return this;
};

Phaser.Text.prototype.addFontWeight = function(weight, position){
  this.fontWeights[position] = weight;
  this.dirty = true;
  
  return this;
};

Phaser.Text.prototype.clearFontValues = function () {

    this.fontStyles = [];
    this.fontWeights = [];
    this.dirty = true;

    return this;

};

Phaser.Text.prototype.updateLine = function (line, x, y) {
  
  for (var i = 0; i < line.length; i++)
    {
        var letter = line[i];
      
        var components = this.fontToComponents(this.context.font);
        
        if(this.fontWeights[this._charCount]){
          components.fontWeight = this.fontWeights[this._charCount];
        }
        if(this.fontStyles[this._charCount]){
          components.fontStyle = this.fontStyles[this._charCount];
        }
      
        this.context.font = this.componentsToFont(components);
      
        if (this.style.stroke && this.style.strokeThickness)
        {
            if (this.strokeColors[this._charCount])
            {
                this.context.strokeStyle = this.strokeColors[this._charCount];
            }

            this.updateShadow(this.style.shadowStroke);
            this.context.strokeText(letter, x, y);
        }

        if (this.style.fill)
        {
            if (this.colors[this._charCount])
            {
                this.context.fillStyle = this.colors[this._charCount];
            }

            this.updateShadow(this.style.shadowFill);
            this.context.fillText(letter, x, y);
        }

        x += this.context.measureText(letter).width;

        this._charCount++;
    }
};

Phaser.Text.prototype.applyMarkdown = function () {
    var boldPositions = [];
    var italicPositions = [];
    var i = this.text.indexOf("**");
    while(i >= 0){
      this.text = this.text.substr(0, i) + this.text.substr(i+2);
      boldPositions.push(i);
      i = this.text.indexOf("**");
    }
    i = this.text.indexOf("*");
    while(i >= 0){
      this.text = this.text.substr(0, i) + this.text.substr(i+1);
      italicPositions.push(i);
      
      for (var j = 0; j < boldPositions.length; j++) { 
        if(i < boldPositions[j]) boldPositions[j]--;
      }
      
      i = this.text.indexOf("*");
    }
    for (i = 0; i < boldPositions.length; i=i+2) { 
        this.addFontWeight('bold', boldPositions[i]);
        this.addFontWeight('normal', boldPositions[i+1]);
    }
    for (i = 0; i < italicPositions.length; i=i+2) { 
        this.addFontStyle('italic', italicPositions[i]);
        this.addFontStyle('normal', italicPositions[i+1]);
    }
};