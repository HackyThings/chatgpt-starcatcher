class Loader {
    constructor(app) {
      this.app = app;
      this.loader = new PIXI.Loader();
    }
  
    loadAssets(assets, onAssetsLoaded) {
      for (const key in assets) {
        if (Object.hasOwnProperty.call(assets, key)) {
          const asset = assets[key];
          this.loader.add(key, asset);
        }
      }
  
      // Start loading the assets
      console.log("Assets loaded");
      this.loader.load(() => onAssetsLoaded());
    }
  }
  
  export { Loader };
  