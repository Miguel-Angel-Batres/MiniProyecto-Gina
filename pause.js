class PauseScene extends Phaser.Scene{
    constructor(){
        super({key: 'PauseScene'});
    }
    preload(){
        this.load.image('sky', 'assets/sky.png');
    }
    create(){
    
        this.add.text(420, 400, 'Press SPACE to resume', {
            fontFamily: '"Press Start 2P", Arial',
             fontSize: '32px', fill: '#000' 
        });
        this.add.text(420, 450, 'Press ESC to go to menu', { 
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '32px', fill: '#000'
         });

        this.input.keyboard.on('keydown-SPACE', () => {
            if(this.registry.get('level') == 1)
                this.scene.resume('Level1');
            else
                this.scene.resume('Level2');
            this.scene.stop();
          
        });
        this.input.keyboard.on('keydown-ESC', () => {
            if(this.registry.get('level') == 1)
                this.scene.stop('Level1');
            else
                this.scene.stop('Level2');
            this.game.destroy(true); 

            const menu = document.querySelector('.menu');
            menu.style.display = 'flex';

            const body = document.querySelector('body');
            body.classList.remove('inactive');
        });
    }
}
export { PauseScene }; // Exporta la clase para poder ser importada en otro archivo