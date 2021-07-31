import { Side } from "../enums";
import { Tile } from "./base/tile";

export class HorizontalTile extends Tile {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    enableCollision: Side | boolean,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    if (enableCollision !== Side.left) {
      this.getBody().checkCollision.left = false;
    }
    if (enableCollision !== Side.right) {
      this.getBody().checkCollision.right = false;
    }
    if (enableCollision === false) {
      this.getBody().checkCollision.left = false;
      this.getBody().checkCollision.right = false;
    }
  }

  protected getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
