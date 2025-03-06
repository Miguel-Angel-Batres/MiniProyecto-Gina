class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.score = 0;
    this.lives = 3;
  }
  init() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
  }
  preload() {
    this.load.image("sky", "assets/bg1.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("candy", "assets/candy.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("finn", "assets/finn.png", {
      frameWidth: 54,
      frameHeight: 83,
    });
    this.load.spritesheet("jake", "assets/jake.png", {
      frameWidth: 55,
      frameHeight: 68,
    });
    this.load.on("filecomplete", (key) => {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });
  }

  create() {
    let background = this.add.image(750, 400, "sky");
    background.setDisplaySize(1500, 800);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(750, 800, "ground").setDisplaySize(1500, 64).refreshBody();

    this.player = this.physics.add.sprite(100, 450, "finn").setScale(2);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("finn", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    
    this.anims.create({
      key: "turn",
      frames: [{ key: "finn", frame: 8 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("finn", { start: 9, end: 16 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: "candy",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setScale(2);
    });

    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontFamily: '"Press Start 2P", Arial',
      fontSize: "32px",
      fill: "#000",
    });

    this.livesText = this.add.text(16, 50, "Lives: 3", {
      fontFamily: '"Press Start 2P", Arial',
      fontSize: "32px",
      fill: "#000",
    });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.launch('PauseScene');
      this.scene.pause();
    });

    this.input.keyboard.on('keydown-D', () => {
      this.hitBomb();
    });

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

  collectStar(player, candy) {
    candy.disableBody(true, true);

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

      if (this.bombs.countActive(true) === 2) {
        this.scene.start('WinScene');
      }
    }
  }

  hitBomb(player, bomb) {
    // Restar una vida
    this.lives--;
    this.livesText.setText("Lives: " + this.lives);

    if (this.lives <= 0) {
      // Si las vidas llegan a 0, termina el juego
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play("turn");
      this.gameOver = true;

      this.time.delayedCall(1000, () => {
        this.scene.start('LoseScene');
      });
    } else {
      // Si aún hay vidas, solo reposicionamos al jugador sin eliminar las bombas
      this.player.setPosition(100, 450);
      this.player.setVelocity(0, 0); // Detener cualquier movimiento
      this.player.clearTint(); // Quitar el color rojo
    }
  }
}

export { GameScene };
