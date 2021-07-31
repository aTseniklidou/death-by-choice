import { ANIMATIONS, EVENTS, WAYS_TO_DIE } from "../enums";
import { Character } from "./base/character";
import { gameOptions } from "../configs";
import { frameSettingsPlayer } from "../scenes/loading";

export class Player extends Character {
  private leftMoveKey: Phaser.Input.Keyboard.Key;
  private rightMoveKey: Phaser.Input.Keyboard.Key;
  private jumpKey: Phaser.Input.Keyboard.Key;
  private fireKey: Phaser.Input.Keyboard.Key;

  private canJump: boolean;
  private wallJumped: boolean;
  private canDoubleJump: boolean;
  private wallSliding: boolean;

  private isOnWall: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    this.hp = 0;
    // CONTROLS SETUP
    this.leftMoveKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.rightMoveKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.fireKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.CTRL
    );
    this.jumpKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.canJump = true;
    this.canDoubleJump = false;
    this.isOnWall = false;
    this.getBody().setSize(
      frameSettingsPlayer.frameWidth,
      frameSettingsPlayer.frameHeight
    );

    this.initAnimations();
  }

  handleJump() {
    // player can jump when on the ground or on the wall
    if (this.canJump || this.isOnWall) {
      this.wallSliding = false;
      this.body.velocity.y = -gameOptions.playerJump;

      if (this.isOnWall) {
        if (this.scaleX > 0) {
          this.flipLeft();
        } else {
          this.flipRight();
        }
        this.wallJumped = true;
        this.getBody().setVelocityX(this.scaleX * gameOptions.playerSpeed);
      }
      this.isOnWall = false;
      this.canJump = false;

      this.anims.play(ANIMATIONS.playerJump, true);

      // player can now double jump
      this.canDoubleJump = true;
    } else {
      if (this.canDoubleJump) {
        this.anims.play(ANIMATIONS.playerDoubleJump, true);
        this.canDoubleJump = false;
        this.body.velocity.y = -gameOptions.playerDoubleJump;
      }
    }
  }

  private handleWallSlide() {
    const isTouchingDown = this.body.touching.down;
    if (!isTouchingDown) {
      const isHittingWallLeft = this.body.touching.left;
      const isHittingWallRight = this.body.touching.right;

      const isPressingLeft = this.leftMoveKey.isDown;
      const isPressingRight = this.rightMoveKey.isDown;
      if (
        (isHittingWallLeft && !isPressingLeft) ||
        (isHittingWallRight && !isPressingRight) ||
        this.wallSliding
      ) {
        this.wallSliding = true;
        this.anims.play(ANIMATIONS.playerWallJump, true);
        this.isOnWall = true;
        this.body.gravity.y = 0;
        this.body.velocity.y = gameOptions.playerGrip;
      }
    }
  }

  private handleMove() {
    const isTouchingDown = this.body.touching.down;
    if (this.leftMoveKey.isDown) {
      this.getBody().setVelocityX(-gameOptions.playerSpeed);
      this.flipLeft();
      this.wallSliding = false;
      if (isTouchingDown) {
        this.canJump = true;
        this.anims.play(ANIMATIONS.playerRun, true);
      }
    } else if (this.rightMoveKey.isDown) {
      this.getBody().setVelocityX(gameOptions.playerSpeed);
      this.flipRight();
      this.wallSliding = false;
      if (isTouchingDown) {
        this.canJump = true;
        this.anims.play(ANIMATIONS.playerRun, true);
      }
    } else if (isTouchingDown) {
      this.wallSliding = false;
      this.wallJumped = false;
      this.isOnWall = false;
      this.canJump = true;
      this.anims.play(ANIMATIONS.playerIdle, true);
    }
  }

  private handleWallGrab() {
    const isTouchingDown = this.body.touching.down;
    if (!isTouchingDown) {
      const isHittingWallLeft = this.body.touching.left;
      const isHittingWallRight = this.body.touching.right;

      const isPressingLeft = this.leftMoveKey.isDown;
      const isPressingRight = this.rightMoveKey.isDown;

      if (
        (isHittingWallLeft && isPressingLeft) ||
        (isHittingWallRight && isPressingRight)
      ) {
        this.body.gravity.y = 0;
        this.body.velocity.y = 0;
        this.isOnWall = true;
        this.anims.play(ANIMATIONS.playerWallJump, true);
      }
    }
  }

  update(): void {
    this.body.gravity.y = gameOptions.gravity;
    if (!this.wallJumped) {
      this.getBody().setVelocityX(0);
    }
    this.handleWallSlide();

    this.handleMove();

    this.handleWallGrab();

    if (!this.isOnWall && this.body.velocity.y > 0) {
      this.anims.play(ANIMATIONS.playerFall, true);
    }
    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      // add animation
      this.scene.game.events.emit(EVENTS.shoot);
    }
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.handleJump();
    }
  }

  private initAnimations(): void {
    [
      { type: ANIMATIONS.playerIdle, start: 0, end: 10, rate: 20 },
      { type: ANIMATIONS.playerRun, start: 0, end: 11, rate: 20 },
      { type: ANIMATIONS.playerJump, start: 0, end: 0, rate: 1 },
      { type: ANIMATIONS.playerDoubleJump, start: 0, end: 5, rate: 25 },
      { type: ANIMATIONS.playerFall, start: 0, end: 0, rate: 1 },
      { type: ANIMATIONS.playerWallJump, start: 0, end: 4, rate: 10 },
    ].map((animSettings) =>
      this.anims.create({
        key: animSettings.type,
        frames: this.anims.generateFrameNumbers(animSettings.type, {
          start: animSettings.start,
          end: animSettings.end,
        }),
        frameRate: animSettings.rate,
      })
    );
  }

  public getDamage(value: number, wayToDie?: WAYS_TO_DIE): void {
    super.getDamage(value);

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS.died, wayToDie);
    }
  }
}
