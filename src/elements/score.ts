import { Text } from "./base/text";

export enum ScoreOperations {
  INCREASE,
  DECREASE,
  SET_VALUE,
}

export class Score extends Text {
  private remainingValue: number;
  private totalValue: number;

  private descr: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initScore: number = 0,
    type?: string
  ) {
    const descr = type ? `${type}:` : "";
    super(scene, x, y, `${descr} ${initScore}/${initScore}`);
    this.descr = descr;
    scene.add.existing(this);

    this.totalValue = initScore;
    this.remainingValue = initScore;
  }

  public changeValue(operation: ScoreOperations, value: number): void {
    switch (operation) {
      case ScoreOperations.INCREASE:
        this.remainingValue += value;
        break;
      case ScoreOperations.DECREASE:
        this.remainingValue -= value;
        break;
      case ScoreOperations.SET_VALUE:
        this.remainingValue = value;
        break;
      default:
        break;
    }

    this.setText(`${this.descr} ${this.remainingValue}/${this.totalValue}`);
  }

  public getValue(): number {
    return this.remainingValue;
  }
}
