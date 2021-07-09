import { ANIMATIONS } from "../enums";

export const frameSettingsPlayer = {
  frameWidth: 32,
  frameHeight: 32,
};

export const frameSettingsEnemy = {
  frameWidth: 52,
  frameHeight: 32,
};

export class Loading extends Phaser.Scene {
  constructor() {
    super("loading-scene");
  }

  private loadPlayerAssets() {
    const playerPath = "player/";
    this.load.spritesheet(
      "player",
      `${playerPath}Idle.png`,
      frameSettingsPlayer
    );
    this.load.spritesheet(
      ANIMATIONS.playerIdle,
      `${playerPath}Idle.png`,
      frameSettingsPlayer
    );
    this.load.spritesheet(
      ANIMATIONS.playerRun,
      `${playerPath}Run.png`,
      frameSettingsPlayer
    );
    this.load.spritesheet(
      ANIMATIONS.playerJump,
      `${playerPath}Jump.png`,
      frameSettingsPlayer
    );
    this.load.spritesheet(
      ANIMATIONS.playerDoubleJump,
      `${playerPath}DoubleJump.png`,
      frameSettingsPlayer
    );
    this.load.spritesheet(
      ANIMATIONS.playerWallJump,
      `${playerPath}WallJump.png`,
      frameSettingsPlayer
    );
    this.load.spritesheet(
      ANIMATIONS.playerFall,
      `${playerPath}Fall.png`,
      frameSettingsPlayer
    );
  }

  private loadEnemyAssets() {
    const enemyPath = "enemy/";
    this.load.spritesheet("enemy", `${enemyPath}Idle.png`, frameSettingsEnemy);
    this.load.spritesheet(
      ANIMATIONS.enemyIdle,
      `${enemyPath}Idle.png`,
      frameSettingsEnemy
    );
    this.load.spritesheet(
      ANIMATIONS.enemyRun,
      `${enemyPath}Run.png`,
      frameSettingsEnemy
    );
  }

  preload(): void {
    this.load.baseURL = "assets/";
    this.loadPlayerAssets();
    this.loadEnemyAssets();
    this.load.atlas("terrain", "Terrain.png", "terrain_atlas.json");
    this.load.image("projectile", "particle.png");
    this.load.image("spikes", "spikes.png");
    this.load.image("shadow", "Shadow.png");
    this.load.image("firePlatform", "FirePlatform.png");
    this.load.spritesheet(ANIMATIONS.collectableIdle, `collectable.png`, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create(): void {
    this.scene.start("level-1-scene");
    //  this.scene.start("ui-scene");
  }
}
