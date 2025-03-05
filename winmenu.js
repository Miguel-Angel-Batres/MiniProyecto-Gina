class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
    }

    create() {
        this.add.image(750, 400, 'sky').setDisplaySize(1500, 800);
        this.add.text(690, 400, 'You win!', { fontSize: '32px', fill: '#000' });
        this.add.text (550, 450, 'Press SPACE to go to menu', { fontSize: '32px', fill: '#000' });
        // precionar espacio para volver al menu
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('GameScene');
            this.game.destroy(true);  // Detener todo el juego y liberar los recursos

            const menu = document.querySelector('.menu');
            menu.style.display = 'flex';

            const body = document.querySelector('body');
            body.classList.remove('active');


        });
    }
}

export { WinScene }; // Exporta la clase para poder ser importada en otro archivo