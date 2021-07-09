import { ANIMATIONS } from "../enums";

export class Collectable extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(1, 1);
    this.anims.create({
      key: ANIMATIONS.collectableIdle,
      frames: this.anims.generateFrameNumbers(ANIMATIONS.collectableIdle, {
        start: 0,
        end: 16,
      }),
      repeat: -1,
      frameRate: 16,
    });
    this.getBody().setSize(16, 16);
    this.anims.play(ANIMATIONS.collectableIdle);
  }

  protected getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
