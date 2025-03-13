class Level2 extends Phaser.Scene {
    constructor() {
      super({ key: "Level2" });
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
      this.load.image("sky2", "assets/bg2.png");
      this.load.on("filecomplete", (key) => {
        this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      });
  
    }
  
    create() {
       // Seteando el mundo a 5000px de ancho
       this.physics.world.setBounds(0, 0, 5000, 800); 
  
       // Fondo del mundo
       let background = this.add.image(750, 400, "sky2");
       background.setDisplaySize(1920, 1080);
       background.setScrollFactor(0); // Fondo fijo
   
   
       // Fisicas de las plataformas
       this.platforms = this.physics.add.staticGroup();
  
        // Forsito para crear las plataformas
        for (let x = 0; x <= 5000; x += 500) {  // Cada plataforma mide 500px
          let platform = this.platforms.create(x, 770, "ground").setDisplaySize(500, 64).refreshBody();

          // Ajustar el tamaño de la colisión para permitir atravesar el 10% superior ()
          platform.body.setSize(500, 58); // Hacer la plataforma más corta en la altura
          platform.body.setOffset(0, 20); // Desplazar la colisión hacia abajo para permitir el paso por la parte superior
        }
      
      // Creando plataformas flotantes 
      this.platforms.create(400, 500, "ground").setDisplaySize(300, 32).refreshBody().setScale(2);
      this.platforms.create(900, 400, "ground").setDisplaySize(300, 32).refreshBody().setScale(2);
      this.platforms.create(1400, 300, "ground").setDisplaySize(300, 32).refreshBody().setScale(2);
      this.platforms.create(2000, 450, "ground").setDisplaySize(300, 32).refreshBody().setScale(2);
      this.platforms.create(2500, 550, "ground").setDisplaySize(300, 32).refreshBody().setScale(2);
      this.platforms.create(3000, 350, "ground").setDisplaySize(300, 32).refreshBody().setScale(2);
   
      if(this.selectedCharacter === 'finn'){
       // sword al final del nivel
        this.sword = this.physics.add.sprite(4950, 80, "sword").setScale(2);
        this.sword.setBounce(0.2);
      }
      if(this.selectedCharacter === 'jake'){
        // sandwich al final del nivel
        this.sword = this.physics.add.sprite(4950, 80, "sandwich").setScale(2);
        this.sword.setBounce(0.2);
      }

        
      // Fisicas del player
      console.log(this.selectedCharacter);
      if(this.selectedCharacter === 'finn'){
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
    if(this.selectedCharacter === 'jake'){
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
      this.player.setBounce(0);
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
      this.livesText = this.add.text(16, 60, "Lives:", {
        fontFamily: '"Press Start 2P", Arial',
        fontSize: "32px",
        fill: "#000",
        });
     this.livesText.setScrollFactor(0);
  
      this.physics.add.collider(this.player, this.platforms);
      //this.physics.add.collider(this.stars, this.platforms);
      this.physics.add.collider(this.bombs, this.platforms);
      this.physics.add.collider(this.sword, this.platforms);
  
      // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
      this.physics.add.overlap(this.player, this.sword, () => {
        this.grabarscore();
        this.bossmusic.pause();
        this.bossmusic.currentTime = 0;
        this.scene.start('WinScene');
        this.scene.stop();

       

      });
      this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
  
      this.input.keyboard.on('keydown-ESC', () => {
        document.getElementById("pause").play();
        this.bossmusic.pause();
        this.scene.launch('PauseScene');
        this.scene.pause();
      });
  
      this.input.keyboard.on('keydown-D', () => {
        this.hitBomb();
      });
  
      this.input.keyboard.on('keydown-W', () => {
        this.grabarscore();
        this.scene.start('WinScene');
      });
       // Crear los sprites de corazones para representar las vidas
        this.heartSprites = [];
        for (let i = 0; i < this.lives; i++) {
            let heart = this.add.image(140 + 100 + i * 55, 75, "heart").setScrollFactor(0); // Posición y distancia entre los corazones
            this.heartSprites.push(heart);
            }

        this.bossmusic = document.getElementById("bossMusic");
        this.events.on('resume', () => {
          this.bossmusic.play();
        });
        this.bossmusic.play();

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
  
      if (this.cursors.up.isDown && this.player.body.touching.down || this.cursors.space.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-700);
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
      this.heartSprites[this.lives].setVisible(false);
      
      if (this.lives <= 0) {
        // Si las vidas llegan a 0, termina el juego
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play("turn");
        this.gameOver = true;
        this.grabarscore();
        this.time.delayedCall(1000, () => {
          this.bossmusic.pause();
          this.bossmusic.currentTime = 0;
          this.scene.start('LoseScene');
        });
      } else {
        // Si aún hay vidas, solo reposicionamos al jugador sin eliminar las bombas
        this.player.setPosition(100, 450);
        this.player.setVelocity(0, 0); // Detener cualquier movimiento
        this.player.clearTint(); // Quitar el color rojo
      }
    }
    grabarscore(){
      // Comprobar nickname en scores de localstorage
      let scores = JSON.parse(localStorage.getItem('scores'));
      let nickname = localStorage.getItem('nickname');
      let nickfinded = scores.find(score => score.nickname === nickname);
      
      if(nickfinded){
        if(this.score > nickfinded.score){
          nickfinded.score = this.score;
          localStorage.setItem('scores', JSON.stringify(scores));
        }
      }else{
        scores.push({nickname: nickname, score: this.score, time: new Date().toLocaleString(), character: this.selectedCharacter});
        localStorage.setItem('scores', JSON.stringify(scores));
      }
    }
  }
  
  export { Level2 };
  