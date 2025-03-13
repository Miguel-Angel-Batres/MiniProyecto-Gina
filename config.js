import { Level1 } from './level1.js';
import { Level2 } from './level2.js';
import { PauseScene } from './pause.js';
import { WinScene } from './winmenu.js';
import { LoseScene } from './losemenu.js';

const config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 800,
  
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [Level1,Level2, PauseScene, WinScene, LoseScene],
};
function startGame(hero) {
  var game = new Phaser.Game(config);
  game.registry.set("selectedCharacter", hero);
  game.registry.set("level", 1);
  console.log("Game Started");
}
export { startGame }; // Exporta la función para poder ser importada en otro archivo
