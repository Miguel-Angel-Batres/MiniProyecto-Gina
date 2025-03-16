class LoseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoseScene' });
    }   
    preload(){
        this.load.image('death_screen', 'assets/death_screen.png');
    }

    create() {
        this.add.image(800, 400, 'death_screen').setScale(1.7);  

               this.add.text(620, 120, 'You lose!', {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '32px', fill: '#fff'
        });
        this.add.text(380, 150, 'Press SPACE to go to menu', {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '32px', fill: '#fff'
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('Level1');
            this.game.destroy(true);

            const menu = document.querySelector('.menu');
            menu.style.display = 'flex';

            const body = document.querySelector('body');
            body.style.backgroundImage = "url('/assets/bgHDnotext.jpg')";
            body.style.backgroundSize = "cover";
            body.style.backgroundRepeat = "no-repeat";
            body.style.backgroundPosition = "center top";
            body.style.imageRendering = "auto";
            body.classList.remove('inactive');


        });

    }
}

export { LoseScene };
