export class Text extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
    super(scene, x, y, text, {
      fontSize: "12px",
      color: "#fff",
      stroke: "#000",
      padding: { x: 5, y: 5 },
    });

    this.setOrigin(0, 0);

    scene.add.existing(this);
  }
}
