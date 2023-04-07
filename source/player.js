class Player extends PIXI.Container {
  constructor(app, playerTexture) {
    super();

    // Create the player sprite using the player texture
    this.player = new PIXI.Sprite(playerTexture);

    // Center the player sprite within the container
    this.player.anchor.set(0.5);

    // Add the player sprite to the container
    this.addChild(this.player);

    console.log("Player Loaded");
  }
}

// Export the Player class as a named export
export { Player };
