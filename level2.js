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
      this.load.image("iceground", "assets/platform_ice.png");
      this.load.image("heart", "assets/heart.png");


      this.load.spritesheet("penguin", "assets/gunter.png", {
        frameWidth: 56,
        frameHeight: 61,
      });
      this.load.spritesheet("penguin_idle", "assets/gunter_idle.png", {
        frameWidth: 56,
        frameHeight: 61,
      });
      this.load.spritesheet("iceking", "assets/iceking.png", {
        frameWidth: 104,
        frameHeight: 103,
      });
      


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
        this.platforms_penguins = this.physics.add.staticGroup();
  
        // Forsito para crear las plataformas
        for (let x = 0; x <= 5000; x += 490) {  
          let platform = this.platforms.create(x, 770, "iceground").setDisplaySize(500, 64).refreshBody();
          platform.body.setSize(500, 58); 
          platform.body.setOffset(0, 20); 
        }
      
        
      const platformPositions = [
        { x: 400, y: 500 },
        { x: 900, y: 400 },
        { x: 1400, y: 450 },
        { x: 2000, y: 450 },
        { x: 2500, y: 550 },
        { x: 3000, y: 350 }
      ];
      
      // Creando plataformas flotantes
      platformPositions.forEach((pos) => {
        this.platforms.create(pos.x, pos.y, "iceground").setDisplaySize(350, 60).refreshBody();
        
        // Creandole paredes a cada lado
        let leftwal =this.platforms_penguins.create(pos.x - 250, pos.y-50).setDisplaySize(10, 100).refreshBody().setScale(1.3);
        leftwal.setVisible(false);
        let rightwal = this.platforms_penguins.create(pos.x + 250, pos.y-50,).setDisplaySize(10, 100).refreshBody().setScale(1.3);
        rightwal.setVisible(false);
      });

        // animacion de pinguinos
        this.anims.create({
          key: "penguin_left",
          frames: this.anims.generateFrameNumbers("penguin", { start: 0, end: 7 }),
          frameRate: 10,
          repeat: -1,
        });
        this.anims.create({
          key: "penguin_right",
          frames: this.anims.generateFrameNumbers("penguin", { start: 8, end: 15 }),
          frameRate: 10,
          repeat: -1,
        });
        this.anims.create({
          key: "penguin_idle",
          frames: [{ key: "penguin_idle", frame: 0 }],
          frameRate: 10,
          repeat: -1,
        });



        this.penguins = this.physics.add.group();

        let numpenguins = 5;
        let startX = 1000;
        let spacing = 300;
        let penguinspeed = 150;
        
      for (let i = 0; i < numpenguins; i++) {
          let x = startX + i * spacing; 
          let direction = i & 1 === 1 ? 1 : -1;

          let penguin = this.penguins.create(x, 700, "penguin_idle").setScale(2);
          penguin.anims.play("penguin_right");
          penguin.setBounce(0.5);
          penguin.setCollideWorldBounds(true);
          penguin.setVelocityX(penguinspeed * direction);
          if (direction === -1) {
            penguin.anims.play("penguin_left");
          }
        }
        platformPositions.forEach((pos) => {
          let penguin = this.penguins.create(pos.x,pos.y -80, "penguin_idle").setScale(2);
          penguin.anims.play("penguin_right");
          penguin.setBounce(0.5);
          penguin.setCollideWorldBounds(true);
          penguin.setVelocityX(penguinspeed); 

      });


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
      this.anims.create({
        key: "attack_left",
        frames: this.anims.generateFrameNumbers("finn_attack", { start: 0, end: 6 }),
        frameRate: 15,
        repeat: 0,
      });
      this.anims.create({
        key: "attack_right",
        frames: this.anims.generateFrameNumbers("finn_attack", { start: 7, end: 13 }),
        frameRate: 15,
        repeat: 0,
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
      this.player.setGravityY(2500);
  
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
    this.heartSprites = [];
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(140 + 100 + i * 55, 75, "heart").setScrollFactor(0); // Posición y distancia entre los corazones
      this.heartSprites.push(heart);
    }
  
      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.penguins, this.platforms_penguins);
      this.physics.add.collider(this.penguins, this.platforms);
      this.physics.add.collider(this.sword, this.platforms);
  
      // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
      this.physics.add.overlap(this.player, this.sword, () => {
        this.grabarscore();
        this.bossmusic.pause();
        this.bossmusic.currentTime = 0;
        this.scene.start('WinScene');
        this.scene.stop();

      });
      this.colisionpenguinil = this.physics.add.overlap(this.player, this.penguins, this.RemoveLive, null, this);
      
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


        // crear zkey
    this.zkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    // al acabar animacion de ataque se desactiva
    this.player.on('animationcomplete', (anim) => {
      if(anim.key === 'attack_right'){
        this.attacking = false;
        this.player.body.setSize(54, 83);
        this.player.body.setOffset(0, 0);

      }
      if(anim.key === 'attack_left'){
        this.attacking = false;
        this.player.body.setSize(54, 83);
        this.player.body.setOffset(0, 0);
      }
    });
   this.player.on('animationstart', (anim) => {
    if(anim.key === 'attack_right' || anim.key === 'attack_left'){
      var random3 = Phaser.Math.Between(1, 3);
      switch(random3){
        case 1:
        this.sound.play('finn_attack1');
        break;
        case 2:
        this.sound.play('finn_attack2');
        break;
        case 3:
        this.sound.play('finn_attack3');
        break;
      }
    }
    });

        }
    
  
    update() {
      if (this.gameOver) {
        return;
      }
      if (this.cursors.left.isDown){
        if(!this.attacking){
          this.player.anims.play("left", true);
        }
        this.goingleft = true;
        this.player.setVelocityX(-320);
      } else if (this.cursors.right.isDown) {
        if(!this.attacking){
          this.player.anims.play("right", true);
        }
        this.goingleft = false;
        this.player.setVelocityX(320);
      } else {
        if(!this.attacking){
          this.player.anims.play("turn");
        }
        this.player.setVelocityX(0);
        this.player.body.setSize(54, 83);
      }
  
      if(this.zkey.isDown){
        if(this.goingleft){
          this.player.anims.play("attack_left", true);
          this.attacking = true;
          this.player.body.setSize(132, 83);
  
        }
        else{        
          this.player.anims.play("attack_right", true);
          this.attacking = true;
          this.player.body.setSize(132, 83);
        }
      }
  
      if (this.cursors.up.isDown && this.player.body.touching.down || this.cursors.space.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-1300);
      }
      if (this.player.body.velocity.y > 0) { 
        this.player.setGravityY(3000); // Aumenta la gravedad en la caída
      } else {
          this.player.setGravityY(2500); // Mantiene gravedad normal en el salto
      }
      // Controlar la direccion de los pinguinos
      this.penguins.children.iterate((penguin) => {
        if (penguin.body.blocked.right) {
          penguin.setVelocityX(-150);
          penguin.anims.play("penguin_left");
        }
        if (penguin.body.blocked.left) {
          penguin.setVelocityX(150);
          penguin.anims.play("penguin_right");
        }
      });
      let cameraEnd = this.cameras.main.scrollX + this.cameras.main.width; // Posición final de la cámara
     
      if (cameraEnd >= 5000 && this.player.x >= 4350) {  
          this.cameras.main.stopFollow(); 
          this.cameralocked = true;
      }
      if(this.cameralocked){
        const maxX = 5050 - this.cameras.main.width;
        if(this.player.x <= maxX){
          this.player.x = maxX;
        }
      }
    }
  
    
    RemoveLive() {

      if(this.attacking){
        this.penguins.children.iterate((penguin) => {
          if (penguin.body.touching.up) {
            penguin.disableBody(true, true);
            this.score += 10;
            this.scoreText.setText("Score: " + this.score);
          }

        });
      }else{
      // Restar una vida
      this.lives--;
      this.heartSprites[this.lives].setVisible(false);
      // Sonido de muerte
      if(this.selectedCharacter === 'finn') {
        var random3 = Phaser.Math.Between(1, 3);
        switch(random3){
          case 1:
            this.sound.play('finnDeath1');
            break;
          case 2:
            this.sound.play('finnDeath2');
            break;
          case 3:
            this.sound.play('finnDeath3');
            break;
        }
      }
      if(this.selectedCharacter === 'jake') {
        var random3 = Phaser.Math.Between(1, 3);
        switch(random3){
          case 1:
            this.sound.play('jakeDeath1');
            break;
          case 2:
            this.sound.play('jakeDeath2');
            break;
          case 3:
            this.sound.play('jakeDeath3');
            break;
        }
      }
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

         // Damos efecto de opacidad al player por 2 segundos
        this.player.setAlpha(0.5);
        this.colisionpenguinil.active = false;
        this.time.delayedCall(3000, () => {
        this.player.setAlpha(1);
        this.colisionpenguinil.active = true;
      });      
      }
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
  