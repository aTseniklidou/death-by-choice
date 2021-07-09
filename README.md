# Death by choice - A Phaser 3 TypeScript Game

A 2D platform game using Phaser 3 and Typescript [based on this boilerplate](https://github.com/photonstorm/phaser3-typescript-project-template).

| Controls | Description |
|---------|-------------|
| `Arrows` | Move the player. While wall climbing, hold to stick on a wall |
| `SPACE` | Press once to jump, twice to double jump |
| `CTRL` | Shoot |

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run watch` | Build project and open web server running project, watching for changes |
| `npm run dev` | Builds project and open web server, but do not watch for changes |
| `npm run build` | Builds code bundle with production settings (minification, no source maps, etc..) |

## Running game

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm run watch`.

After starting the development server with `npm run watch`, you can edit any files in the `src` folder
and Rollup will automatically recompile and reload your server (available at `http://localhost:10001`
by default).

## Configuring Rollup

* Edit the file `rollup.config.dev.js` to edit the development build.
* Edit the file `rollup.config.dist.js` to edit the distribution build.
