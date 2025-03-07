class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this.score = 0;
    this.lives = 3;
  }
  init() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.selectedCharacter = this.game.registry.get("selectedCharacter");
  }
  preload() {
    this.load.image("sky", "assets/bg1.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("candy", "assets/candy.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("sandwich", "assets/sandwich.png");
    this.load.image("sword", "assets/sword.png");
    this.load.spritesheet("finn", "assets/finn.png", {
      frameWidth: 54,
      frameHeight: 83,
    });
    this.load.spritesheet("jake", "assets/jake.png", {
      frameWidth: 55,
      frameHeight: 68,
    });
    this.load.image("heart", "assets/heart.png");


    this.load.on("filecomplete", (key) => {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });

  }

  create() {

    // Seteando el mundo a 5000px de ancho
    this.physics.world.setBounds(0, 0, 5000, 800);

    // Fondo del mundo
    let background = this.add.image(800, 400, "sky");
    background.setDisplaySize(window.innerWidth, window.innerHeight);
    background.setScrollFactor(0); // Fondo fijo


    // Fisicas de las plataformas
    this.platforms = this.physics.add.staticGroup();

    // Forsito para crear las plataformas
    for (let x = 0; x <= 5000; x += 500) {  // Cada plataforma mide 500px
      let platform = this.platforms.create(x, 770, "ground").setDisplaySize(500, 64).refreshBody();

      // Ajustar el tamaño de la colisión para permitir atravesar el 10% superior
      platform.body.setSize(500, 58); // Hacer la plataforma más corta en la altura
      platform.body.setOffset(0, 20); // Desplazar la colisión hacia abajo para permitir el paso por la parte superior
    }


    // Creando plataformas flotantes 
    this.platforms.create(400, 600, "ground").setDisplaySize(200, 32).refreshBody();
    this.platforms.create(900, 500, "ground").setDisplaySize(200, 32).refreshBody();
    this.platforms.create(1600, 400, "ground").setDisplaySize(200, 32).refreshBody();
    this.platforms.create(2200, 550, "ground").setDisplaySize(200, 32).refreshBody();
    this.platforms.create(2800, 450, "ground").setDisplaySize(200, 32).refreshBody();
    this.platforms.create(3500, 350, "ground").setDisplaySize(200, 32).refreshBody();

    // sword al final del nivel
    this.sword = this.physics.add.sprite(4950, 80, "sword").setScale(2);
    this.sword.setBounce(0.2);

    // Fisicas del player
    if (this.selectedCharacter === 'finn') {
      console.log('finn');
      this.player = this.physics.add.sprite(100, 450, "finn").setScale(2);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("finn", { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });


      this.anims.create({
        key: "turn",
        frames: [{ key: "finn", frame: 8 }],
        frameRate: 12,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("finn", { start: 9, end: 16 }),
        frameRate: 8,
        repeat: -1,
      });
    }
    if (this.selectedCharacter === 'jake') {
      this.player = this.physics.add.sprite(100, 450, "jake").setScale(2);
      console.log('jake');
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("jake", { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "jake", frame: 8 }],
        frameRate: 12,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("jake", { start: 9, end: 16 }),
        frameRate: 8,
        repeat: -1,
      });

    }
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(500);

    // Fijando camara al player
    this.cameras.main.setBounds(0, 0, 5000, 800);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    this.cursors = this.input.keyboard.createCursorKeys();

    // this.stars = this.physics.add.group({
    //   key: "candy",
    //   repeat: 11,
    //   setXY: { x: 12, y: 0, stepX: 70 },
    // });

    // this.stars.children.iterate(function (child) {
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //   child.setScale(2);
    // });

    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontFamily: '"Press Start 2P", Arial',
      fontSize: "32px",
      fill: "#000",
    });
    this.scoreText.setScrollFactor(0);

    this.physics.add.collider(this.player, this.platforms);
    //this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.sword, this.platforms);

    // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.overlap(this.player, this.sword, () => {
      this.registry.set("level", 2);
      this.scene.start('Level2');
      this.scene.stop();
      console.log('cambio de nivel');
    });
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
    this.livesText = this.add.text(16, 60, "Lives:", {
      fontFamily: '"Press Start 2P", Arial',
      fontSize: "32px",
      fill: "#000",
    });
    this.livesText.setScrollFactor(0);

    // Crear los sprites de corazones para representar las vidas
    this.heartSprites = [];
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(140 + 100 + i * 55, 75, "heart").setScrollFactor(0); // Posición y distancia entre los corazones
      this.heartSprites.push(heart);
    }

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
      this.player.setVelocityY(-600);
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

    // Actualizar los corazones según las vidas restantes
    if (this.lives >= 0) {
      this.heartSprites[this.lives].setVisible(false);
    }

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
      // Si aún hay vidas, reposicionamos al jugador sin eliminar las bombas
      this.player.setPosition(100, 450);
      this.player.setVelocity(0, 0); // Detener cualquier movimiento
      this.player.clearTint(); // Quitar el color rojo
    }
  }

}

export { Level1 };
