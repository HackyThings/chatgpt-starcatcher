import { Loader } from "./loader.js";
import { MenuState } from "./menu.js";
import { GameState } from "./game.js";

// Initialize PIXI
const app = new PIXI.Application({
  width: 1920,
  height: 1080,
  backgroundColor: 0x111217,
  resolution: window.devicePixelRatio || 1,
});

// Add the canvas to the page
document.body.appendChild(app.view);

// Define the assets to be loaded
const assets = {
  logo: "assets/logo.png",
  background: "assets/background.png",
  player_blue: "assets/player_blue.png",
  player_green: "assets/player_green.png",
  player_red: "assets/player_red.png",
  player_purple: "assets/player_purple.png",
  asteroid: "assets/asteroid.png",
  star: "assets/star.png",
};

// Create the loader
const loader = new Loader(app);

// Load the assets and create the menu state
loader.loadAssets(assets, onAssetsLoaded);

let menuState;
let gameState;

function onAssetsLoaded() {
  // Get the loaded textures
  const logoTexture = loader.loader.resources.logo.texture;
  const backgroundTexture = loader.loader.resources.background.texture;
  const playerTextures = {
    blue: loader.loader.resources.player_blue.texture,
    green: loader.loader.resources.player_green.texture,
    red: loader.loader.resources.player_red.texture,
    purple: loader.loader.resources.player_purple.texture,
  };
  const asteroidTexture = loader.loader.resources.asteroid.texture;
  const starTexture = loader.loader.resources.star.texture;

  // Create the menu and game states
  menuState = new MenuState(app, logoTexture, playerTextures);
  gameState = undefined;

  // Add the menu state container as the first game state
  app.stage.addChild(menuState);

  // Listen for a custom event to switch to the game state
  document.addEventListener("switchToGameState", (event) => {
    menuState.destroy();
    app.stage.removeChild(menuState);

    gameState = new GameState(
      app,
      backgroundTexture,
      event.detail.color,
      playerTextures,
      starTexture,
      asteroidTexture
    );

    app.stage.addChild(gameState);
  });

  // Listen for a custom event to switch back to the menu state
  document.addEventListener("switchToMenuState", () => {
    gameState.destroy();
    app.stage.removeChild(gameState);

    menuState = new MenuState(app, logoTexture, playerTextures);
    app.stage.addChild(menuState);
  });
}
