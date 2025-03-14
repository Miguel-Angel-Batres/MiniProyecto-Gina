class PauseScene extends Phaser.Scene{
    constructor(){
        super({key: 'PauseScene'});
    }
    create(){
        this.bgmusic1 = document.getElementById("bgMusic");
        this.add.text(420, 400, 'Press SPACE to resume', {
            fontFamily: '"Press Start 2P", Arial',
             fontSize: '32px', fill: '#000'
        });
        this.add.text(420, 450, 'Press ESC to go to menu', {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '32px', fill: '#000'
         });

        this.input.keyboard.on('keydown-SPACE', () => {
            document.getElementById("buttonsound").play();
            if(this.registry.get('level') == 1){
                this.scene.resume('Level1');
            }else{
                this.scene.resume('Level2');
            }
            this.scene.stop();

        });
        this.input.keyboard.on('keydown-ESC', () => {
            document.getElementById("buttonsoundexit").play();
            if(this.registry.get('level') == 1){
                this.bgmusic1.currentTime = 0;
                this.scene.stop('Level1');
            }
            else{
                this.bgmusic1.currentTime = 0;
                this.scene.stop('Level2');
            }
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
export { PauseScene }; // Exporta la clase para poder ser importada en otro archivo
