class MenuState extends PIXI.Container {
  constructor(app, logoTexture, playerTextures) {
    super();
    this.app = app;

    // Add a black background to the menu state
    const menuBg = new PIXI.Graphics();
    menuBg.beginFill(0x111217);
    menuBg.drawRect(0, 0, app.screen.width, app.screen.height);
    menuBg.endFill();
    this.addChild(menuBg);

    // Define the animation speed and the number of stars to create
    this.animationSpeed = 1;
    this.numStars = 100;

    // Create an array to store the star graphics
    this.starGraphics = [];

    // Create the star graphics and randomly position them on the screen
    for (let i = 0; i < this.numStars; i++) {
      const speed = Math.random() * 0.5 + 0.1; // Random speed between 0.1 and 0.6
      const opacity = speed / 0.6; // Opacity is proportional to speed
      const star = new PIXI.Graphics();
      star.beginFill(0xffffff, opacity);
      star.drawCircle(0, 0, 2);
      star.endFill();
      star.x = Math.random() * app.screen.width;
      star.y = Math.random() * app.screen.height;
      star.speed = speed; // Store the speed as a property of the star
      this.starGraphics.push(star);
      this.addChild(star);
    }

    // Add the logo image to the menu state container with a white border
    const logoImage = new PIXI.Sprite(logoTexture);
    logoImage.anchor.set(0.5, 0);
    logoImage.x = app.screen.width / 2;
    logoImage.y = 50;
    logoImage.width = 400;
    logoImage.height = 400;

    const logoBorder = new PIXI.Graphics();
    const borderPadding = 16;
    const borderWidth = logoImage.width + borderPadding * 2;
    const borderHeight = logoImage.height + borderPadding * 2;
    logoBorder.lineStyle(8, 0xffffff, 1);
    logoBorder.drawRoundedRect(
      logoImage.x - borderWidth / 2,
      logoImage.y - borderPadding,
      borderWidth,
      borderHeight,
      16
    );
    this.addChild(logoBorder, logoImage);

    // Add an update function to animate the stars
    this.animateFunc = this.animateStars.bind(this);
    app.ticker.add(this.animateFunc);

    this.logoImage = logoImage;

    // Create the player options
    const playerOptions = new PIXI.Container();

    const optionWidth = 200;
    const optionHeight = 200;
    const optionSpacing = 1;
    const optionY = app.screen.height / 2 - optionHeight / 2;

    let optionX =
      app.screen.width / 2 -
      (optionWidth * Object.keys(playerTextures).length +
        optionSpacing * (Object.keys(playerTextures).length - 1)) /
        2;

    for (const color in playerTextures) {
      if (Object.hasOwnProperty.call(playerTextures, color)) {
        const texture = playerTextures[color];

        const option = new PIXI.Sprite(texture);
        option.anchor.set(0.5);
        option.x = optionX + optionWidth / 2;
        option.y = optionY + optionHeight / 2;

        option.interactive = true;
        option.buttonMode = true;
        option.on("pointerdown", () => {
          // Emit a custom event with the selected player color
          document.dispatchEvent(
            new CustomEvent("switchToGameState", { detail: { color } })
          );
        });

        playerOptions.addChild(option);

        optionX += optionWidth + optionSpacing;
      }
    }

    playerOptions.x = 0;
    playerOptions.y = app.screen.height / 2 - optionHeight / 2 - 425;

    this.addChild(playerOptions);
    this.playerOptions = playerOptions;

    // Add text under the player color selections
    const chooseShipText = new PIXI.Text("Choose a ship to start playing!", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      align: "center",
    });
    chooseShipText.anchor.set(0.5);
    chooseShipText.position.set(
      app.screen.width / 2,
      app.screen.height / 2 + 125
    );
    this.addChild(chooseShipText);

    console.log("Menu State Loaded");
  }

  animateStars() {
    // Update the position of each star based on its speed
    for (let i = 0; i < this.numStars; i++) {
      const star = this.starGraphics[i];
      star.x -= this.animationSpeed * star.speed;
      if (star.x < -10) {
        star.x = this.app.screen.width + 10;
        star.y = Math.random() * this.app.screen.height;
      }
    }
  }

  destroy() {
    // Remove the container from the stage and destroy all its children
    this.app.ticker.remove(this.animateFunc);
    this.logoImage.destroy();
    this.playerOptions.destroy();

    // Call the PIXI.Container destroy method
    super.destroy();
  }
}

// Export the MenuState class as a named export
export { MenuState };
