import { Side } from "../enums";
import { Tile } from "./base/tile";

export class VerticalTile extends Tile {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    enableCollision: Side | boolean,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    if (enableCollision !== Side.up) {
      this.getBody().checkCollision.up = false;
    }
    if (enableCollision !== Side.down) {
      this.getBody().checkCollision.down = false;
    }
    if (enableCollision === false) {
      this.getBody().checkCollision.down = false;
      this.getBody().checkCollision.up = false;
    }
  }

  protected getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
