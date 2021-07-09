import { Side } from "./verticalTile";

export class HorizontalTile extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    enableCollision: Side | boolean,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.getBody().setAllowGravity(false);
    this.setOrigin(1, 1);

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
