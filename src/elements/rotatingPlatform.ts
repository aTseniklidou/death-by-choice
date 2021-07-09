import { Direction, Platform } from "./platform";

export class RotatingPlatform extends Platform {
  private newAngle: number;
  private isFacingUp: boolean;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    distance: number,
    speed: number,
    movesOn: Direction,
    rotationInterval: number,
    frame?: string | number
  ) {
    super(scene, x, y, texture, distance, speed, movesOn, frame);
    // this.setOrigin(0.5, 0.8);
    this.newAngle = 0;
    this.scene.time.addEvent({
      callback: this.rotate,
      callbackScope: this,
      delay: rotationInterval,
      loop: true,
    });
    this.angle = 0;
  }

  private rotate() {
    this.newAngle = 180;
  }

  update() {
    super.update();
    if (this.newAngle !== 0) {
      this.angle += 20;
      this.newAngle -= 20;
    } else {
      if (this.angle === -180) {
        this.isFacingUp = false;
      } else {
        this.isFacingUp = true;
      }
    }
  }

  public hazardIsUp(): boolean {
    return this.isFacingUp;
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
