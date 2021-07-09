import { WAYS_TO_DIE } from "./enums";

export const gameOptions = {
  // default gravity
  gravity: 900,

  // player friction when on wall
  playerGrip: 50,

  // player horizontal speed
  playerSpeed: 200,

  // player jump force
  playerJump: 400,

  // player double jump force
  playerDoubleJump: 250,

  projectileSpeed: 1000,
};

export const staticGroupSettings = {
  runChildUpdate: true,
  immovable: true,
  allowGravity: false,
};

export const gravityDefyGroupSettings = {
  runChildUpdate: true,
  allowGravity: false,
};

export const defaultGroupSettings = {
  runChildUpdate: true,
};

export const mapDeathsText = (wayToDie: WAYS_TO_DIE) =>
  ({
    [WAYS_TO_DIE.backfire]: "You shot yourself",
    [WAYS_TO_DIE.enemy]: "You were killed",
    [WAYS_TO_DIE.fell]: "You fell and died",
    [WAYS_TO_DIE.crashed]: "You were crashed",
    [WAYS_TO_DIE.spikes]: "You took a spike to the knee",
    [WAYS_TO_DIE.burned]: "You burned to death",
  }[wayToDie] || "You died here");
