import "phaser";
import { gameOptions } from "./configs";

import { Level1, Loading } from "./scenes";

type GameConfigExtended = Phaser.Types.Core.GameConfig & {
  winScore: number;
};

declare global {
  interface Window {
    sizeChanged: () => void;
    game: Phaser.Game;
  }
}

export const gameConfig: GameConfigExtended = {
  title: "Death by choice",
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0472FC",
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1200,
    height: 800,
    //   width: window.innerWidth,
    //  height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
      // debug: true,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      //    window.sizeChanged();
    },
  },
  // canvasStyle: `display: block; width: 90%; height: 90%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [Loading, Level1],
  winScore: 40,
};

window.sizeChanged = () => {
  if (window.game.isBooted) {
    setTimeout(() => {
      window.game.scale.resize(window.innerWidth, window.innerHeight);

      window.game.canvas.setAttribute(
        "style",
        `display: block; width: ${window.innerWidth - 50}px; height: ${
          window.innerHeight - 50
        }px;`
      );
    }, 100);
  }
};

// window.onresize = () => window.sizeChanged();

window.game = new Phaser.Game(gameConfig);
