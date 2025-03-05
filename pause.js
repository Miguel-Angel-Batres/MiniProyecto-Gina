class PauseScene extends Phaser.Scene{
    constructor(){
        super({key: 'PauseScene'});
    }
    preload(){
        this.load.image('sky', 'assets/sky.png');
    }
    create(){
        let background = this.add.image(750, 400, 'sky');
        background.setDisplaySize(1500, 800);
        this.add.text(575, 400, 'Press SPACE to resume', { fontSize: '32px', fill: '#000' });
        this.add.text(570, 450, 'Press ESC to go to menu', { fontSize: '32px', fill: '#000' });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop('GameScene');
            this.game.destroy(true);  // Detener todo el juego y liberar los recursos

            const menu = document.querySelector('.menu');
            menu.style.display = 'flex';

            const body = document.querySelector('body');
            body.classList.remove('active');



        });
    }
}
export { PauseScene }; // Exporta la clase para poder ser importada en otro archivo