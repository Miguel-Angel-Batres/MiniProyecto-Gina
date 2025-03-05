class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: "GameScene" });
      this.score = 0; // Inicializamos el score aquí.
    }
    init(){
      this.score = 0;
      this.gameOver = false;
    }
    preload() {
      this.load.image("sky", "assets/sky.png");
      this.load.image("ground", "assets/platform.png");
      this.load.image("star", "assets/star.png");
      this.load.image("bomb", "assets/bomb.png");
      this.load.spritesheet("dude", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
    }
  
    create() {
      // A simple background for our game
      let background = this.add.image(750, 400, "sky");
      background.setDisplaySize(1500, 800);

  
      // The platforms group contains the ground and the 2 ledges we can jump on
      this.platforms = this.physics.add.staticGroup();
        
      // Create the ground of width 1500
      this.platforms.create(750, 800, "ground").setDisplaySize(1500, 64).refreshBody();

  
      // The player and its settings
      this.player = this.physics.add.sprite(100, 450, "dude").setScale(2);
  
      // Player physics properties
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
  
      // Player animations
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });
  
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
  
      // Input Events
      this.cursors = this.input.keyboard.createCursorKeys();
  
      // Some stars to collect, 12 in total
      this.stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
      });
  
      this.stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setScale(2);
      });
  
      // Create bombs
      this.bombs = this.physics.add.group();
  
      // The score
      this.scoreText = this.add.text(16, 16, "score: 0", {
        fontSize: "32px",
        fill: "#000",
      });
  
      // Collide the player with platforms
      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.stars, this.platforms);
      this.physics.add.collider(this.bombs, this.platforms);
  
      // Check if the player overlaps with any of the stars
      this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
      this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
      
      // Event to escape to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.launch('PauseScene');
            this.scene.pause();
        });
        
      // debug death
        this.input.keyboard.on('keydown-D', () => {
            this.hitBomb();
        });
      // debug win
        this.input.keyboard.on('keydown-W', () => {
            this.scene.start('WinScene');
        });
    }
  
    update() {
      if (this.gameOver) {
        return;
      }
  
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-320);
        this.player.anims.play("left", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(320);
        this.player.anims.play("right", true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
      }
  
      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }
  
    collectStar(player, star) {
      star.disableBody(true, true);
  
      // Add and update the score
      this.score += 10;
      this.scoreText.setText("Score: " + this.score);
  
      if (this.stars.countActive(true) === 0) {
        this.stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });
  
        var x =
          this.player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
  
        var bomb = this.bombs.create(x, 16, "bomb");
        bomb.setScale(2);
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

        if(this.bombs.countActive(true) === 2){
          //win
          this.scene.start('WinScene');
        }
      }
    }
  
    hitBomb(player, bomb) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play("turn");
      this.gameOver = true;

      this.time.delayedCall(1000, () => {
        this.scene.start('LoseScene');
      });
    }
  }
  
  export { GameScene }; // Export the class to be used in other files
  