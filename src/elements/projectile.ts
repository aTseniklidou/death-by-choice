import { gameOptions } from "../configs";

const getPosition = (
  source: Phaser.Physics.Arcade.Sprite
): { x: number; y: number } => {
  const facingLeft = source.scaleX < 0;
  const x = source.body.position.x + (facingLeft ? 0 : source.body.width);
  const y = source.body.position.y + source.body.height / 2;
  return { x, y };
};

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private speed: number;
  private source: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, source: Phaser.Physics.Arcade.Sprite) {
    const { x, y } = getPosition(source);

    super(scene, x, y, "projectile");

    this.source = source;
    const facingLeft = source.scaleX < 0;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (facingLeft) {
      this.speed = -gameOptions.projectileSpeed;
    } else {
      this.speed = gameOptions.projectileSpeed;
    }
  }

  update(): void {
    this.body.velocity.x = this.speed;
    if (this.getBody().checkWorldBounds()) {
      this.disableBody(true, true);
    }
  }

  public enable(): void {
    const { x, y } = getPosition(this.source);
    const facingLeft = this.source.scaleX < 0;
    if (facingLeft) {
      this.speed = -gameOptions.projectileSpeed;
    } else {
      this.speed = gameOptions.projectileSpeed;
    }
    this.enableBody(true, x, y, true, true);
  }

  public recoil(): void {
    this.speed = this.speed * -1;
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
