import { Scene } from "phaser";

import { Character } from "./base/character";
import { Player } from "./player";
import { ANIMATIONS, EVENTS } from "../enums";
import { gameOptions } from "../configs";
import { frameSettingsEnemy } from "../scenes/loading";

export class Enemy extends Character {
  private target: Player;
  private distance = 300;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    target: Player,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.target = target;
    this.hp = 0;

    this.initAnimations();
    //  this.setImmovable(true);

    this.getBody().setSize(
      frameSettingsEnemy.frameWidth,
      frameSettingsEnemy.frameHeight
    );
    this.getBody().setOffset(0, 0);
    this.on("destroy", () => this.removeAllListeners());
  }

  update(): void {
    if (this.body) {
      this.body.gravity.y = gameOptions.gravity;
      const onTheLeft = this.target.x - this.x > 0;
      const targetIsFacingOpposite =
        (onTheLeft && this.target.scaleX > 0) ||
        (!onTheLeft && this.target.scaleX < 0);

      // this enemy attacks when player stands close, facing with their back
      if (
        targetIsFacingOpposite &&
        this.target.y === this.y &&
        Phaser.Math.Distance.BetweenPoints(
          { x: this.x, y: this.y },
          { x: this.target.x, y: this.target.y }
        ) < this.distance
      ) {
        const newVelocity = this.target.x - this.x;
        if (newVelocity > 0) {
          this.flipLeft();
        } else {
          this.flipRight();
        }
        this.getBody().setVelocityX(newVelocity);

        this.anims.play(ANIMATIONS.enemyRun, true);
      } else {
        this.getBody().setVelocity(0);
        this.anims.play(ANIMATIONS.enemyIdle, true);
      }
    }
  }

  private initAnimations(): void {
    this.anims.create({
      key: ANIMATIONS.enemyIdle,
      frames: this.anims.generateFrameNumbers(ANIMATIONS.enemyIdle, {
        start: 0,
        end: 10,
      }),
      frameRate: 20,
    });
    this.anims.create({
      key: ANIMATIONS.enemyRun,
      frames: this.anims.generateFrameNumbers(ANIMATIONS.enemyRun, {
        start: 0,
        end: 5,
      }),
      frameRate: 40,
    });
  }

  public getDamage(value: number): void {
    super.getDamage(value);
    if (this.hp <= 0) {
      this.disableBody(true, true);
    }
  }
}
