import { Player } from "./player";
import { Enemy } from "./enemy";

export class Level extends Phaser.Scene {
  protected player!: Player;

  constructor(levelIndex: number) {
    super(`level-${levelIndex}-scene`);
  }

  protected initWorld(): void {
    // setup world walls
  }

  protected initCamera(): void {
    this.cameras.main.setSize(this.game.canvas.width, this.game.canvas.height);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(2);
  }
}
