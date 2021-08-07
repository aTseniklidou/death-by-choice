import { Player } from "./player";
import { Enemy } from "./enemy";
import { Score, ScoreOperations } from "./score";
import { EVENTS, WAYS_TO_DIE } from "../enums";
import { Projectile } from "./projectile";

import { Text } from "./base/text";
import { Tile } from "./base/tile";
import { gravityDefyGroupSettings, mapDeathsText } from "../configs";
import { Button } from "./base/button";
export class Level extends Phaser.Scene {
  protected player!: Player;

  protected playerStartPosition!: { x: number; y: number };
  protected worldWallsGroup!: Phaser.GameObjects.Group;

  protected groundLayer!: Phaser.GameObjects.Group;
  protected wallGroup!: Phaser.GameObjects.Group;
  protected enemies!: Phaser.GameObjects.Group;
  protected projectilesGroup!: Phaser.GameObjects.Group;
  protected recoilGroup!: Phaser.GameObjects.Group;
  protected platformGroup!: Phaser.GameObjects.Group;
  protected collectables!: Phaser.GameObjects.Group;
  protected scoreLeft!: Score;
  protected scoreRight!: Score;
  protected levelInfo!: Text;
  protected waysToDie!: string[];
  protected remainingWaysToDie!: string[];

  constructor(levelIndex: number, levelObjectives: WAYS_TO_DIE[]) {
    super(`level-${levelIndex}-scene`);
    this.waysToDie = levelObjectives;
    this.remainingWaysToDie = levelObjectives;
  }

  protected initUI(): void {
    new Button(this.game.canvas.width - 60, 60, "Reset", this, () => {
      this.scene.restart();
    });

    this.levelInfo = new Text(
      this,
      20,
      20,
      "Find all ways to die or collect all fruits!"
    );
    this.scoreRight = new Score(
      this,
      this.game.canvas.width - 120,
      20,
      this.waysToDie.length,
      "deaths"
    );
    this.scoreLeft = new Score(
      this,
      this.game.canvas.width - 220,
      20,
      this.collectables.getChildren().length,
      "fruits"
    );
  }

  protected initPlayer(playerStartPosition: { x: number; y: number }): void {
    this.playerStartPosition = playerStartPosition;
    this.player = new Player(
      this,
      playerStartPosition.x,
      this.game.canvas.height + playerStartPosition.y
    );
    this.projectilesGroup = this.physics.add.group(gravityDefyGroupSettings);
  }

  protected setupColliders(): void {
    this.physics.add.collider(this.player, this.worldWallsGroup, () => {
      this.player.setWallJump(false);
    });
    this.groundLayer &&
      this.physics.add.collider(this.player, this.groundLayer, () => {
        this.player.setWallJump(false);
      });
    this.wallGroup &&
      this.physics.add.collider(this.player, this.wallGroup, () => {
        this.player.setWallJump(true);
      });

    this.recoilGroup &&
      this.physics.add.collider(this.player, this.recoilGroup, () => {
        this.player.setWallJump(false);
      });

    this.physics.add.overlap(
      this.player,
      this.collectables,
      (_, collectable) => {
        this.player.setWallJump(false);
        collectable.destroy();
        this.collectables.remove(collectable);
        this.scoreLeft.changeValue(ScoreOperations.DECREASE, 1);
        if (!this.collectables.getChildren().length) {
          this.levelInfo.setText("YOU WIN - the safe way!");
        }
      }
    );

    this.physics.add.overlap(
      this.player,
      this.projectilesGroup,
      (player, projectile) => {
        (player as Player).getDamage(1, WAYS_TO_DIE.backfire);
        (projectile as Projectile).disableBody(true, true);
      }
    );

    this.physics.add.collider(
      this.wallGroup,
      this.projectilesGroup,
      (_, projectile) => {
        (projectile as Projectile).disableBody(true, true);
      }
    );
    this.physics.add.collider(
      this.worldWallsGroup,
      this.projectilesGroup,
      (_, projectile) => {
        (projectile as Projectile).disableBody(true, true);
      }
    );
    this.recoilGroup &&
      this.physics.add.collider(
        this.recoilGroup,
        this.projectilesGroup,
        (_, projectile) => {
          (projectile as Projectile).recoil();
        }
      );
  }

  protected setupEvents() {
    this.game.events.on(EVENTS.shoot, () => {
      const disabledItem: any = this.projectilesGroup
        .getChildren()
        .find((p: Projectile) => !p.active);
      // recycle projectiles
      if (disabledItem) {
        disabledItem.enable();
      } else {
        this.projectilesGroup.add(new Projectile(this, this.player));
      }
    });
    this.game.events.on(
      EVENTS.died,
      (wayPlayerDied: WAYS_TO_DIE) => {
        this.collectables.clear(true, true);
        if (this.remainingWaysToDie.includes(wayPlayerDied)) {
          this.remainingWaysToDie = this.remainingWaysToDie.filter(
            (way) => way !== wayPlayerDied
          );
          this.scoreRight.changeValue(ScoreOperations.DECREASE, 1);
          if (this.remainingWaysToDie.length) {
            this.levelInfo.setText(
              "Find all ways to die! Restart to get the fruits"
            );
            this.scoreLeft.destroy();
          } else {
            this.levelInfo.setText("YOU WIN - with sacrifice!");
          }
          new Tile(
            this,
            this.player.body.position.x,
            this.player.body.position.y,
            "shadow"
          );
          new Text(
            this,
            this.player.body.position.x,
            this.player.body.position.y - 10,
            mapDeathsText(wayPlayerDied)
          );
        }
        this.player.body.position.x = this.playerStartPosition.x;
        this.player.body.position.y =
          this.game.canvas.height + this.playerStartPosition.y;
      },
      this
    );
  }
  update(): void {
    this.player.update();
    if (this.player.getBody().checkWorldBounds()) {
      this.player.getDamage(1, WAYS_TO_DIE.fell);
    }
  }
}
