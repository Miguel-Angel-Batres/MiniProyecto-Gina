class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('bgDance', 'assets/bg_win.png');
        // Cargar el sprite de Finn bailando (suponiendo que sea un spritesheet)
        this.load.spritesheet('finnDance', 'assets/finn_dance.png', {
            frameWidth: 120, // Ajusta al tamaño de cada frame
            frameHeight: 117
        });
        this.load.spritesheet('jakeDance', 'assets/jake_dance.png', {
            frameWidth: 108, // Ajusta al tamaño de cada frame
            frameHeight: 85
        });
    }

    create() {
        this.add.image(800, 400, 'bgDance').setScale(1);

        // Activar el canvas
        const winCanvas = document.getElementById('win');
        winCanvas.style.display = 'block';

        if(this.registry.get('selectedCharacter') === "jake"){
            this.anims.create({
                key: 'dance',
                frames: this.anims.generateFrameNumbers('jakeDance', { start: 0, end: 24 }),
                              frameRate: 10,
                              repeat: -1
            });
        } else {
            this.anims.create({
                key: 'dance',
                frames: this.anims.generateFrameNumbers('finnDance', { start: 0, end: 19 }),
                              frameRate: 10,
                              repeat: -1
            });
        }
        // Crear animación


        // Agregar a Finn bailando
        const finn = this.add.sprite(800, 400, 'finnDance').setScale(2);
        finn.play('dance');

        // Texto de victoria
        this.add.text(650, 200, 'You win!', {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '32px',
            fill: '#000'
        });

        this.add.text(800, 600, 'Press SPACE to go to menu', {
            fontFamily: '"Press Start 2P", Arial',
            fontSize: '20px',
            fill: '#000'
        }).setOrigin(0.5);  // Centrar el texto


        // Presionar espacio para volver al menú
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('WinScene');
            this.game.destroy(true);  // Detener todo el juego y liberar los recursos

            const menu = document.querySelector('.menu');
            menu.style.display = 'flex';

            const body = document.querySelector('body');
            body.style.backgroundImage = "url('/assets/bgHDnotext.jpg')";
            body.style.backgroundSize = "cover";
            body.style.backgroundRepeat = "no-repeat";
            body.style.backgroundPosition = "center top";
            body.style.imageRendering = "auto";
            body.classList.remove('inactive');

            winCanvas.style.display = 'none'; // Ocultar canvas después de salir
        });
    }
}

export { WinScene };
