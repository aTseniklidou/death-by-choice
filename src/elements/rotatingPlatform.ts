import { Side } from "../enums";
import { Direction, Platform } from "./platform";

export class RotatingPlatform extends Platform {
  private newAngle: number;
  private isFacingUp: boolean;
  private sideWithHazard: Side;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    distance: number,
    speed: number,
    movesOn: Direction,
    rotationInterval: number,
    sideWithHazard: Side,
    frame?: string | number
  ) {
    super(scene, x, y, texture, distance, speed, movesOn, frame);
    this.newAngle = 0;
    this.sideWithHazard = sideWithHazard;
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

  public collisionWithHazard(): boolean {
    return (
      (this.isFacingUp &&
        this.sideWithHazard === Side.up &&
        this.body.touching.up) ||
      (!this.isFacingUp &&
        this.sideWithHazard === Side.up &&
        this.body.touching.down) ||
      (this.isFacingUp &&
        this.sideWithHazard === Side.down &&
        this.body.touching.down) ||
      (!this.isFacingUp &&
        this.sideWithHazard === Side.down &&
        this.body.touching.up)
    );
  }

  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}
