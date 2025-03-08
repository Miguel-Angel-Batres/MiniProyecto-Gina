class LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoseScene' });
    }

    preload() {
        this.load.image('lose', 'assets/sky.png');
    }

    create() {
        this.add.text(620, 400, 'You lose!', {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '32px', fill: '#000'
        });
        this.add.text(380, 450, 'Press SPACE to go to menu', {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '32px', fill: '#000'
        });
        // precionar espacio para volver al menu
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('Level1');
            this.game.destroy(true);  // Detener todo el juego y liberar los recursos

            const menu = document.querySelector('.menu');
            menu.style.display = 'flex';

            const body = document.querySelector('body');
            body.classList.remove('inactive');


        });

    }
}

export { LoseScene }; // Exporta la clase para poder ser importada en otro archivo