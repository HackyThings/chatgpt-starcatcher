class FallingObject extends PIXI.Container {
  constructor(app, starTexture, asteroidTexture) {
    super();
    this.app = app;

    // Randomly choose whether to load the star or asteroid texture
    this.isStar = Math.random() < 0.75;
    const texture = this.isStar ? starTexture : asteroidTexture;

    // Create the sprite using the selected texture
    this.sprite = new PIXI.Sprite(texture);

    this.sprite.anchor.set(0.5);

    // Set the initial position to a random x-coordinate and off the top of the screen
    this.sprite.x = Math.random() * app.screen.width;
    this.sprite.y = -this.sprite.height;

    // Set the initial rotation to a random angle
    this.sprite.rotation = Math.random() * Math.PI * 2;

    // Set the rotation speed to a random value between -0.05 and 0.05
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;

    // Add the sprite to the container
    this.addChild(this.sprite);
  }

  update(delta) {
    // Rotate the sprite
    this.sprite.rotation += this.rotationSpeed;
  }

  isStar() {
    return this.isStar;
  }
}

export { FallingObject };
