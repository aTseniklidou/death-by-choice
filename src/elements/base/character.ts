export class Character extends Phaser.Physics.Arcade.Sprite {
  protected hp;

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
    this.body.bounce.y = 0.1;
    // this.getBody().setCollideWorldBounds(true);
  }

  protected getDamage(value: number): void {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        this.hp = this.hp - value;
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }

  protected flipLeft(): void {
    this.scaleX = -1;
    this.setOffset(this.width, 0);
  }

  protected flipRight(): void {
    this.scaleX = 1;
    this.setOffset(0, 0);
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
