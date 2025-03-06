import { GameScene } from './game.js';
import { PauseScene } from './pause.js';
import { WinScene } from './winmenu.js';
import { LoseScene } from './losemenu.js';

const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [GameScene, PauseScene, WinScene, LoseScene],
};
function startGame(personaje) {
  var game = new Phaser.Game(config);
  game.registry.set("selectedCharacter", personaje);
  console.log("juego empezado");
}
export { startGame }; // Exporta la función para poder ser importada en otro archivo
