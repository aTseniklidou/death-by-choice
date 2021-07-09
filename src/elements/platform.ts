export enum Direction {
  horizontal = "horizontal",
  vertical = "vertical",
}

// horizontal and vertical platforms
export class Platform extends Phaser.Physics.Arcade.Sprite {
  private speed: number;
  private distance: number;
  private startAt: number;
  private movesOn: string;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    distance: number,
    speed: number,
    movesOn: Direction,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.distance = distance;
    this.startAt = movesOn === Direction.horizontal ? x : y;
    this.speed = speed;
    this.movesOn = movesOn;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    //TODO: fix friction with player
  }

  update() {
    //TODO: replace with tweens
    if (this.distance && this.speed) {
      const speedDirection = this.distance < 0 ? -1 : 1;
      if (this.movesOn === Direction.horizontal) {
        if (this.x >= this.startAt) {
          this.setVelocityX(speedDirection * this.speed);
        } else if (this.x <= this.startAt + this.distance) {
          this.setVelocityX(-1 * speedDirection * this.speed);
        }
      } else {
        if (this.y >= this.startAt) {
          this.setVelocityY(speedDirection * this.speed);
        } else if (this.y <= this.startAt + this.distance) {
          this.setVelocityY(-1 * speedDirection * this.speed);
        }
      }
    }
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
