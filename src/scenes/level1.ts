import { Enemy } from "../elements/enemy";
import { Level } from "../elements/level";
import { Player } from "../elements/player";
import { Text } from "../elements/base/text";
import { Score, ScoreOperations } from "../elements/score";
import { Tile } from "../elements/base/tile";
import { EVENTS, Side, WAYS_TO_DIE } from "../enums";
import { Projectile } from "../elements/projectile";
import { Trap } from "../trap";
import { Direction, Platform } from "../elements/platform";
import { Collectable } from "../elements/collectable";
import { Button } from "../elements/base/button";
import {
  defaultGroupSettings,
  gravityDefyGroupSettings,
  mapDeathsText,
  staticGroupSettings,
} from "../configs";
import { RotatingPlatform } from "../elements/rotatingPlatform";
import { VerticalTile } from "../elements/verticalTile";
import { HorizontalTile } from "../elements/horizontalTile";

const platformWithFruit = 1100;

const playerStartPosition = {
  x: 50,
  y: -80,
};

const enemyPosition = {
  x: -300,
  y: -60,
};

const levelObjectives = [
  WAYS_TO_DIE.fell,
  WAYS_TO_DIE.enemy,
  WAYS_TO_DIE.spikes,
  WAYS_TO_DIE.crashed,
  WAYS_TO_DIE.backfire,
  WAYS_TO_DIE.burned,
];

//TODO: move any common logic for all levels in Level Class
export class Level1 extends Level {
  protected groundLayer!: Phaser.GameObjects.Group;
  protected wallGroup!: Phaser.GameObjects.Group;
  protected ground!: Tile;
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

  protected spikes: Phaser.GameObjects.Sprite;

  constructor() {
    super(1);
    this.waysToDie = levelObjectives;
    this.remainingWaysToDie = levelObjectives;
  }

  create(): void {
    this.initUI();
    this.initWorld();
    this.setupLevel();
    this.initPlayer();
    this.initEnemies();
    this.initObstacles();
    this.initObjectives(this.waysToDie.length);
    // this.initCamera();

    this.setupColliders();
    this.setupEvents();
  }

  update(): void {
    this.player.update();
    if (this.player.getBody().checkWorldBounds()) {
      this.player.getDamage(1, WAYS_TO_DIE.fell);
    }
  }

  private setupColliders() {
    this.physics.add.collider(this.player, this.groundLayer);
    this.physics.add.collider(this.player, this.wallGroup);
    this.physics.add.collider(this.player, this.recoilGroup);

    this.physics.add.collider(this.player, this.spikes, () => {
      this.player.getDamage(1, WAYS_TO_DIE.spikes);
    });
    this.physics.add.overlap(
      this.player,
      this.collectables,
      (_, collectable) => {
        collectable.destroy();
        this.collectables.remove(collectable);
        this.scoreLeft.changeValue(ScoreOperations.DECREASE, 1);
        if (!this.collectables.getChildren().length) {
          this.levelInfo.setText("YOU WIN - the safe way!");
        }
      }
    );
    this.physics.add.collider(this.player, this.enemies, (_, enemy: Enemy) => {
      const hitByEnemyFront =
        (enemy.scaleX > 0 && enemy.body.touching.left) ||
        (enemy.scaleX < 0 && enemy.body.touching.right);
      const enemyWasMoving = Math.abs(enemy.body.velocity.x) !== 100;
      if (hitByEnemyFront && enemyWasMoving) {
        this.player.getDamage(1, WAYS_TO_DIE.enemy);
      }
    });
    this.physics.add.collider(this.groundLayer, this.enemies);
    this.physics.add.collider(
      this.player,
      this.platformGroup,
      (player: Player, platform: RotatingPlatform) => {
        if (
          (platform.body.touching.down && player.body.touching.down) ||
          (platform.body.touching.up && player.body.touching.up)
        ) {
          this.player.getDamage(1, WAYS_TO_DIE.crashed);
        }
        if (platform.collisionWithHazard && platform.collisionWithHazard()) {
          this.player.getDamage(1, WAYS_TO_DIE.burned);
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
    this.physics.add.overlap(
      this.enemies,
      this.projectilesGroup,
      (enemy, projectile) => {
        (enemy as Enemy).getDamage(1);
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
      this.recoilGroup,
      this.projectilesGroup,
      (_, projectile) => {
        (projectile as Projectile).recoil();
      }
    );
  }

  private setupEvents() {
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
        this.player.body.position.x = playerStartPosition.x;
        this.player.body.position.y =
          this.game.canvas.height + playerStartPosition.y;
      },
      this
    );
  }
  private initUI(): void {
    new Button(this.game.canvas.width - 60, 60, "Reset", this, () => {
      this.scene.restart();
    });
  }

  private initObstacles(): void {
    const walls = this.wallGroup.getChildren();
    const positionOfTopWall = walls[walls.length - 1].body;
    this.spikes = new Trap(
      this,
      positionOfTopWall.position.x - 8,
      positionOfTopWall.position.y - 24,
      "spikes"
    );
  }

  private initObjectives(total: number): void {
    this.collectables = this.physics.add.group(gravityDefyGroupSettings);
    this.collectables.add(new Collectable(this, 100, 300, "collectable"));
    this.collectables.add(new Collectable(this, 700, 500, "collectable"));
    this.collectables.add(
      new Collectable(this, 800, this.game.canvas.height - 60, "collectable")
    );
    this.collectables.add(
      new Collectable(this, platformWithFruit, 300, "collectable")
    );
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
  private initPlayer(): void {
    this.player = new Player(
      this,
      playerStartPosition.x,
      this.game.canvas.height + playerStartPosition.y
    );
    this.projectilesGroup = this.physics.add.group(gravityDefyGroupSettings);
  }

  private initEnemies(): void {
    this.enemies = this.physics.add.group(defaultGroupSettings);
    this.enemies.add(
      new Enemy(
        this,
        this.game.canvas.width + enemyPosition.x,
        this.game.canvas.height + enemyPosition.y,
        "enemy",
        this.player
      )
    );
  }

  private setupLevel(): void {
    this.groundLayer = this.physics.add.group(staticGroupSettings);
    this.wallGroup = this.physics.add.group(staticGroupSettings);
    this.platformGroup = this.physics.add.group(staticGroupSettings);
    this.recoilGroup = this.physics.add.group(staticGroupSettings);

    const grassSize = 42;
    const wallSize = 32;
    const outerWallSize = 48;
    const outerWallThickness = 16;

    const totalHorizontalWalls = this.game.canvas.width / outerWallSize + 1;
    const totalVerticalWalls = this.game.canvas.height / outerWallSize + 1;
    for (let tileNo = 0; tileNo < totalHorizontalWalls; tileNo++) {
      this.wallGroup.add(
        new HorizontalTile(
          this,
          tileNo * outerWallSize + outerWallSize,
          outerWallThickness,
          "terrain",
          false,
          "wall-horizontal"
        )
      );
    }

    for (let tileNo = 0; tileNo < totalVerticalWalls; tileNo++) {
      this.wallGroup.add(
        new VerticalTile(
          this,
          outerWallThickness,
          tileNo * outerWallSize + outerWallSize,
          "terrain",
          false,
          "wall-vertical"
        )
      );
    }
    const rightWallsToExclude = [8, 9];
    for (let tileNo = 0; tileNo < totalVerticalWalls; tileNo++) {
      if (rightWallsToExclude.includes(tileNo)) {
        this.recoilGroup.add(
          new VerticalTile(
            this,
            this.game.canvas.width,
            tileNo * outerWallSize + outerWallSize,
            "terrain",
            false,
            "metal-vertical"
          )
        );
      } else {
        this.wallGroup.add(
          new VerticalTile(
            this,
            this.game.canvas.width,
            tileNo * outerWallSize + outerWallSize,
            "terrain",
            false,
            "wall-vertical"
          )
        );
      }
    }

    const howManyInScreen = Math.round(this.game.canvas.width / grassSize) + 1;
    const positionsToExcludeGround = [7, 8, 9, 10];
    for (let tileNo = 0; tileNo < howManyInScreen; tileNo++) {
      if (!positionsToExcludeGround.includes(tileNo)) {
        this.groundLayer.add(
          new HorizontalTile(
            this,
            tileNo * grassSize + grassSize,
            this.game.canvas.height,
            "terrain",
            tileNo === 6 ? Side.right : tileNo === 11 ? Side.left : false,
            "grass-big"
          )
        );
      }
    }

    const leftWallPoints = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    leftWallPoints.forEach((tile, index) => {
      this.wallGroup.add(
        new VerticalTile(
          this,
          600,
          this.game.canvas.height - (150 + wallSize * tile),
          "terrain",
          index === 0
            ? Side.down
            : index === leftWallPoints.length - 1
            ? Side.up
            : false,
          "brick-small"
        )
      );
    });
    const rightWallPointsPart1 = [0, 1, 2, 3, 4, 5, 6];
    rightWallPointsPart1.forEach((tile, index) => {
      this.wallGroup.add(
        new VerticalTile(
          this,
          800,
          this.game.canvas.height - (150 + wallSize * tile),
          "terrain",
          index === 0
            ? Side.down
            : index === rightWallPointsPart1.length - 1
            ? Side.up
            : false,
          "brick-small"
        )
      );
    });

    const rightWallPointsPart2 = [11, 12, 13, 14];
    rightWallPointsPart2.forEach((tile, index) => {
      this.wallGroup.add(
        new VerticalTile(
          this,
          800,
          this.game.canvas.height - (150 + wallSize * tile),
          "terrain",
          index === 0
            ? Side.down
            : index === rightWallPointsPart2.length - 1
            ? Side.up
            : false,
          "brick-small"
        )
      );
    });

    this.platformGroup.add(
      new Platform(
        this,
        200,
        this.game.canvas.height - 70,
        "terrain",
        -200,
        80,
        Direction.vertical,
        "platform-horizontal"
      )
    );
    this.platformGroup.add(
      new Platform(
        this,
        500,
        this.game.canvas.height - 400,
        "terrain",
        -400,
        100,
        Direction.horizontal,
        "platform-horizontal"
      )
    );
    this.platformGroup.add(
      new RotatingPlatform(
        this,
        platformWithFruit,
        400,
        "firePlatform",
        -50,
        80,
        Direction.vertical,
        2000,
        Side.up
      )
    );
  }
}
