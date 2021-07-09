export enum Side {
  up = "up",
  down = "down",
  left = "left",
  right = "right",
}
export class VerticalTile extends Phaser.Physics.Arcade.Sprite {
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
