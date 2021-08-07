import { Enemy } from "../elements/enemy";
import { Level } from "../elements/level";
import { Player } from "../elements/player";
import { Side, WAYS_TO_DIE } from "../enums";
import { Projectile } from "../elements/projectile";
import { Trap } from "../trap";
import { Direction, Platform } from "../elements/platform";
import { Collectable } from "../elements/collectable";
import {
  defaultGroupSettings,
  gravityDefyGroupSettings,
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

export class Level1 extends Level {
  private spikes: Phaser.GameObjects.Sprite;
  constructor() {
    super(1, levelObjectives);
  }

  create(): void {
    this.initPlayer(playerStartPosition);
    this.setupLevel();
    this.initEnemies();
    this.initTraps();
    this.initCollectables();
    this.initUI();

    this.setupColliders();
    this.setupEvents();
  }

  protected setupColliders() {
    super.setupColliders();

    this.physics.add.collider(this.player, this.spikes, () => {
      this.player.getDamage(1, WAYS_TO_DIE.spikes);
    });
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
    this.physics.add.overlap(
      this.enemies,
      this.projectilesGroup,
      (enemy, projectile) => {
        (enemy as Enemy).getDamage(1);
        (projectile as Projectile).disableBody(true, true);
      }
    );
    this.physics.add.collider(
      this.player,
      this.platformGroup,
      (player: Player, platform: RotatingPlatform) => {
        this.player.setWallJump(false);
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
  }

  private initTraps(): void {
    const walls = this.wallGroup.getChildren();
    const positionOfTopWall = walls[walls.length - 1].body;
    this.spikes = new Trap(
      this,
      positionOfTopWall.position.x - 8,
      positionOfTopWall.position.y - 24,
      "spikes"
    );
  }

  private initCollectables(): void {
    this.collectables = this.physics.add.group(gravityDefyGroupSettings);
    this.collectables.add(new Collectable(this, 100, 300, "collectable"));
    this.collectables.add(new Collectable(this, 700, 500, "collectable"));
    this.collectables.add(
      new Collectable(this, 800, this.game.canvas.height - 60, "collectable")
    );
    this.collectables.add(
      new Collectable(this, platformWithFruit, 300, "collectable")
    );
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

  protected setupLevel(): void {
    this.worldWallsGroup = this.physics.add.group(staticGroupSettings);
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
      this.worldWallsGroup.add(
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
      this.worldWallsGroup.add(
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
        this.worldWallsGroup.add(
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
