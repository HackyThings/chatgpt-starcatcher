import { FallingObject } from "./fallingObject.js";
import { Score } from "./score.js";
import { Player } from "./player.js";

class GameState extends PIXI.Container {
  constructor(
    app,
    backgroundTexture,
    playerColor,
    playerTextures,
    starTexture,
    asteroidTexture
  ) {
    super();
    this.app = app;

    this.starTexture = starTexture;
    this.asteroidTexture = asteroidTexture;

    // Create the background image sprite
    const backgroundImage = new PIXI.Sprite(backgroundTexture);
    backgroundImage.anchor.set(0.5);
    backgroundImage.x = app.screen.width / 2;
    backgroundImage.y = app.screen.height / 2;
    this.addChildAt(backgroundImage);

    this.playerTextures = playerTextures;
    this.playerColor = playerColor;

    // Create the player object and center it at the bottom of the screen
    const player = new Player(app, this.getPlayerTexture());
    player.x = app.screen.width / 2;
    player.y = app.screen.height - player.height / 2 - 150;
    this.player = player;
    this.addChild(player);

    // Add a black background to the game state
    const gameBg = new PIXI.Graphics();
    gameBg.beginFill(0x111217);
    gameBg.drawRect(0, 0, app.screen.width, app.screen.height);
    gameBg.endFill();
    this.addChildAt(gameBg, 0);

    // Set up keyboard input
    this.keys = {};
    window.addEventListener("keydown", (e) => this.keyboard(e, true));
    window.addEventListener("keyup", (e) => this.keyboard(e, false));

    this.fallingObjects = [];
    this.score = new Score();

    this.scoreText = new PIXI.Text(
      `Score: ${this.score.getScore().toString().padStart(4, "0")}`,
      {
        fill: "#ffffff",
        fontSize: 24,
        fontFamily: "Arial",
      }
    );
    this.scoreText.anchor.set(0.0);
    this.scoreText.x =
      backgroundImage.x + backgroundImage.width / 2 - 20 - this.scoreText.width;
    this.scoreText.y = backgroundImage.y - backgroundImage.height / 2 + 20;
    this.addChild(this.scoreText);

    // Create the lives text at the top left corner of the background image
    const livesText = new PIXI.Text("Lives: 3", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "left",
    });

    livesText.anchor.set(0, 0);
    livesText.position.set(
      backgroundImage.x - backgroundImage.width / 2 + 20,
      backgroundImage.y - backgroundImage.height / 2 + 20
    );
    this.addChild(livesText);
    this.livesText = livesText;

    // Initialize the game loop
    this.updateFunc = this.update.bind(this);
    app.ticker.add(this.updateFunc);

    console.log("Game State Loaded");
  }

  destroy() {
    // Remove all keyboard listeners
    window.removeEventListener("keydown", this.keyboard);
    window.removeEventListener("keyup", this.keyboard);

    // Remove the ticker listener
    this.app.ticker.remove(this.update);

    // Remove all children from the container
    this.removeChildren();

    // Call the PIXI.Container destroy method
    super.destroy();
  }

  getPlayerTexture() {
    let texture;

    switch (this.playerColor) {
      case "blue":
        texture = this.playerTextures.blue;
        break;
      case "green":
        texture = this.playerTextures.green;
        break;
      case "red":
        texture = this.playerTextures.red;
        break;
      case "purple":
        texture = this.playerTextures.purple;
        break;
      default:
        texture = this.playerTextures.blue;
    }

    return texture;
  }

  keyboard(event, value) {
    this.keys[event.code] = value;
  }

  createFallingObject() {
    // Create a new FallingObject and add it to the game state
    const fallingObject = new FallingObject(
      this.app,
      this.starTexture,
      this.asteroidTexture
    );

    const playerBounds = this.player.getBounds();
    const leftLimit = this.app.screen.width / 2 - 300;
    const rightLimit = this.app.screen.width / 2 + 300;

    // Set the position of the falling object to a random x-coordinate within the range where the player can move
    fallingObject.sprite.x =
      Math.random() * (rightLimit - leftLimit) + leftLimit;

    fallingObject.sprite.y = -fallingObject.sprite.height;

    this.addChild(fallingObject);
    this.fallingObjects.push(fallingObject);
  }

  gameOver() {
    // Stop the game loop
    this.app.ticker.remove(this.updateFunc);

    // Create a semi-transparent black overlay
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000, 0.8);
    overlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    overlay.endFill();
    this.addChildAt(overlay, 2);

    // Create the game over message and button
    const gameOverText = new PIXI.Text("Game Over", {
      fill: "#ffffff",
      fontSize: 48,
      fontFamily: "Arial",
      stroke: "#000000",
      strokeThickness: 5,
    });
    gameOverText.anchor.set(0.5);
    gameOverText.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2 - 50
    );
    this.addChild(gameOverText);

    // Add a text object to display the player's final score
    const scoreText = new PIXI.Text(`Final Score: ${this.score.getScore()}`, {
      fill: "#ffffff",
      fontSize: 36,
      fontFamily: "Arial",
      stroke: "#000000",
      strokeThickness: 5,
    });
    scoreText.anchor.set(0.5);
    scoreText.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2 + 50
    );
    this.addChild(scoreText);

    const menuButton = new PIXI.Graphics();
    menuButton.beginFill(0x222222);
    menuButton.drawRect(0, 0, 200, 60);
    menuButton.endFill();
    menuButton.interactive = true;
    menuButton.buttonMode = true;
    menuButton.on("pointerup", () => {
      // Switch back to the menu state
      const event = new Event("switchToMenuState");
      document.dispatchEvent(event);
    });

    const buttonText = new PIXI.Text("Back to Menu", {
      fill: "#ffffff",
      fontSize: 24,
      fontFamily: "Arial",
    });
    buttonText.anchor.set(0.5);
    buttonText.position.set(menuButton.width / 2, menuButton.height / 2);
    menuButton.addChild(buttonText);

    menuButton.position.set(
      this.app.screen.width / 2 - menuButton.width / 2,
      this.app.screen.height / 2 + 150
    );
    this.addChild(menuButton);
  }

  update(delta) {
    if (this.score.getLives() === 0) {
      this.gameOver();
      return;
    }

    const playerSpeed = 10;
    const playerBounds = this.player.getBounds();
    const leftLimit = this.app.screen.width / 2 - 300;
    const rightLimit = this.app.screen.width / 2 + 300;

    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
      // Move the player to the left

      if (playerBounds.left >= leftLimit) {
        this.player.x -= playerSpeed;
      }
    }

    if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
      // Move the player to the right

      if (playerBounds.right <= rightLimit) {
        this.player.x += playerSpeed;
      }
    }

    // Increase the spawn rate of falling objects over time
    const maxSpawnRate = 100; // Maximum spawn rate in milliseconds
    const minSpawnRate = 1; // Minimum spawn rate in milliseconds
    const timeToMaxSpawnRate = 6000; // Time in milliseconds to reach maximum spawn rate
    const timeSinceStart = this.timeSinceStart || 0;
    const spawnRate =
      maxSpawnRate -
      ((maxSpawnRate - minSpawnRate) *
        Math.min(timeSinceStart, timeToMaxSpawnRate)) /
        timeToMaxSpawnRate;
    this.timeSinceStart = timeSinceStart + delta;

    // Create a new falling object if it's time to do so
    this.timeSinceLastFallingObject =
      (this.timeSinceLastFallingObject || 0) + delta;
    if (this.timeSinceLastFallingObject > spawnRate) {
      this.timeSinceLastFallingObject = 0;
      this.createFallingObject();
    }

    // Update all falling objects
    this.fallingObjects.forEach((obj) => {
      const speed = 5; // Slow down the speed by 20%

      // Move the sprite down
      obj.sprite.y += speed;

      // If the sprite is off the bottom of the screen, remove it from the container
      if (obj.sprite.y > this.app.screen.height + obj.sprite.height) {
        this.removeChild(obj);
        this.fallingObjects.splice(this.fallingObjects.indexOf(obj), 1);
      } else {
        // Check for intersection with the player
        if (this.intersects(obj.sprite, this.player)) {
          console.log("collision detected!");
          this.removeChild(obj);
          this.fallingObjects.splice(this.fallingObjects.indexOf(obj), 1);

          // Update the score and lives
          if (obj.isStar) {
            this.score.incrementScore();
            this.scoreText.text = `Score: ${this.score.getScore()}`;
          } else {
            this.score.decrementLives();
            this.livesText.text = `Lives: ${this.score.getLives()}`;

            if (this.lives === 0) {
              this.gameOver();
            }
          }
        }
      }

      obj.update(delta);
    });
  }

  // Check if two rectangles intersect
  intersects(a, b) {
    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    );
  }
}

// Export the GameState class as a named export
export { GameState };
