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
    this.load.image("sandwich", "assets/sandwich.png");
    this.load.image("sword", "assets/sword.png");


    this.load.audio('finnDeath1', 'sounds/Finn/finn_death_01.mp3');
    this.load.audio('finnDeath2', 'sounds/Finn/finn_death_02.mp3');
    this.load.audio('finnDeath3', 'sounds/Finn/finn_death_03.mp3');
    this.load.audio('jakeDeath1', 'sounds/Jake/jake_death_01.mp3');
    this.load.audio('jakeDeath2', 'sounds/Jake/jake_death_02.mp3');
    this.load.audio('jakeDeath3', 'sounds/Jake/jake_death_03.mp3');
    this.load.audio('finn_attack1', 'sounds/Finn/finn_attack1_03.mp3');
    this.load.audio('finn_attack2', 'sounds/Finn/finn_attack2_03.mp3');
    this.load.audio('finn_attack3', 'sounds/Finn/finn_attack2_01.mp3');
    

    this.load.spritesheet("finn", "assets/finn.png", {
      frameWidth: 54,
      frameHeight: 83,
    });
    this.load.spritesheet("jake", "assets/jake.png", {
      frameWidth: 55,
      frameHeight: 68,
    });
    this.load.spritesheet("worm", "assets/worm.png", {
      frameWidth: 46,
      frameHeight: 16,
    });
    this.load.spritesheet("finn_attack", "assets/finn_attack.png", {
      frameWidth: 132,
      frameHeight: 119,
    });
    this.load.image("heart", "assets/heart.png");


    this.load.on("filecomplete", (key) => {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });

  }

  create() {
    // Seteando el mundo a 5000px de ancho
    this.physics.world.setBounds(0, 0, 5000, 800);

    // Musica de fondo
    this.bgmusic1 = document.getElementById("bgMusic");

    // Fondo del mundo
    let background = this.add.image(800, 400, "sky");
    background.setDisplaySize(window.innerWidth, window.innerHeight);
    background.setScrollFactor(0); // Fondo fijo


    // Fisicas de las plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms_worms = this.physics.add.staticGroup();
    // Forsito para crear las plataformas
    for (let x = 0; x <= 5000; x += 490) {  
      let platform = this.platforms.create(x, 770, "ground").setDisplaySize(500, 64).refreshBody();

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
      this.platforms.create(pos.x, pos.y, "ground").setDisplaySize(350, 50).refreshBody();
      
      // Creandole paredes a cada lado
      let leftwal =this.platforms_worms.create(pos.x - 250, pos.y-50).setDisplaySize(10, 100).refreshBody().setScale(1.3);
      leftwal.setVisible(false);
      let rightwal = this.platforms_worms.create(pos.x + 250, pos.y-50,).setDisplaySize(10, 100).refreshBody().setScale(1.3);
      rightwal.setVisible(false);
    });
    

      // Crear la animación del gusano
      this.anims.create({
        key: "worm_left",
        frames: this.anims.generateFrameNumbers("worm", { start: 0, end: 8 }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: "worm_right",
        frames: this.anims.generateFrameNumbers("worm", { start: 9, end: 17 }),
        frameRate: 8,
        repeat: -1,
      });
      

    // Crear grupo de gusanos
    this.worms = this.physics.add.group();

    let numWorms = 5;
    let startX = 1000;
    let spacing = 300;
    let wormSpeed = 150;
    
   for (let i = 0; i < numWorms; i++) {
      let x = startX + i * spacing; // Posición calculada para cada gusano
      let direction = i & 1 === 1 ? 1 : -1; // Alternar dirección (1 = derecha, -1 = izquierda)

      let worm = this.worms.create(x, 700, "worm_idle").setScale(4);
      worm.anims.play("worm_right");
      worm.setBounce(0.5);
      worm.body.setSize(46, 16);  // Ajusta el tamaño del cuerpo
      worm.setCollideWorldBounds(true);
      worm.setVelocityX(wormSpeed * direction); // Asignar velocidad positiva o negativa

      if (direction === -1) {
        worm.anims.play("worm_left");
      }
    }
    // Crear gusanos en plataformas flotantes
    platformPositions.forEach((pos) => {
      let worm = this.worms.create(pos.x,pos.y -50, "worm_idle").setScale(2);
      worm.anims.play("worm_right");
      worm.setBounce(0.5);
      worm.body.setSize(46, 16);  // Ajusta el tamaño del cuerpo
      worm.setCollideWorldBounds(true);
      worm.setVelocityX(wormSpeed); // Asignar velocidad positiva o negativa

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
    if (this.selectedCharacter === 'finn') {
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
    if (this.selectedCharacter === 'jake') {
      this.player = this.physics.add.sprite(100, 450, "jake").setScale(2);
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

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontFamily: '"Press Start 2P", Arial',
      fontSize: "32px",
      fill: "#000",
    });
    this.scoreText.setScrollFactor(0);

    // fecha en la partee dereecha superior
    let fecha = new Date();
    // solo en numeros
    fecha = fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate();
    this.dateText = this.add.text(1100, 16, "Date: " + fecha, {
      fontFamily: '"Press Start 2P", Arial',
      fontSize: "32px",
      fill: "#000",
    });
    this.dateText.setScrollFactor(0);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.sword, this.platforms);
    this.physics.add.collider(this.worms, this.platforms);
    this.physics.add.collider(this.worms,this.platforms_worms);


    // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.overlap(this.player, this.sword, () => {
      this.bgmusic1.pause();
      this.bgmusic1.currentTime = 0;
      this.registry.set("level", 2);
      this.scene.start('Level2');
      console.log('cambio de nivel');
    });

    this.colisiongusanil =  this.physics.add.overlap(this.player, this.worms, this.removeLive, null, this); 



    this.input.keyboard.on('keydown-ESC', () => {
      document.getElementById("pause").play();
      this.bgmusic1.pause();
      this.scene.launch('PauseScene');
      this.scene.pause();
    });

    this.input.keyboard.on('keydown-D', () => {
      this.removeLive();
    });

    this.input.keyboard.on('keydown-W', () => {
      this.grabarscore();
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

    // // Sonido de inicio
    // this.backgroundsound = this.sound.add("music1");
    // this.backgroundsound.play({volume: 1,loop:true});
    this.events.on("resume",() => {
      this.bgmusic1.play();
    });
    this.bgmusic1.play();

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

  // Controlar la direccion y animación de los gusanos
  this.worms.children.iterate((worm) => {
    if (worm.body.blocked.right) {
      worm.setVelocityX(-150);
      worm.anims.play("worm_left", true);
    } else if (worm.body.blocked.left) {
      worm.setVelocityX(150);
      worm.anims.play("worm_right", true);
    }

  });

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

    }
  }

  removeLive() { 
    
    if(this.attacking){
    // eliminar gusano
    this.worms.children.iterate((worm) => {
      if (worm.body.touching.up) {
        worm.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
      }
    });
   
    }else{
    // Restar una vida
    this.lives--;
  
    // Actualizar los corazones según las vidas restantes
    if (this.lives >= 0) {
      this.heartSprites[this.lives].setVisible(false);
    }
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
        this.bgmusic1.pause();
        this.bgmusic1.currentTime = 0;  
        this.scene.start('LoseScene');
      });
    } else {
      // Si aún hay vidas, reposicionamos al jugador sin eliminar los gusanos
      this.player.setPosition(100, 450);
      this.player.setVelocity(0, 0); 
      this.player.clearTint(); 

      // Damos efecto de opacidad al player por 2 segundos
      this.player.setAlpha(0.5);
      this.colisiongusanil.active = false;
      this.time.delayedCall(3000, () => {
        this.player.setAlpha(1);
        this.colisiongusanil.active = true;
      });      
    }
  }
  }
  grabarscore(){
     // Comprobar nickname en scores de localstorage
     let scores = JSON.parse(localStorage.getItem('scores'));
     // Crear scores si no existe
      if(!scores){
        scores = [];
      }

     let nickname = localStorage.getItem('nickname');
     let nickfinded = scores.find(score => score.nickname === nickname);
     
     if(nickfinded){
       if(this.score >= nickfinded.score){
          nickfinded.score = this.score;
          nickfinded.character = this.selectedCharacter;
            // fecha de hoy
          let today = new Date();
          let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          nickfinded.time = date;
          localStorage.setItem('scores', JSON.stringify(scores));
        }
     }else{
       // fecha de hoy
       let today = new Date();
       let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
       scores.push({nickname: nickname, score: this.score, time: date, character: this.selectedCharacter});
       localStorage.setItem('scores', JSON.stringify(scores));
     }
     
  }

}

export { Level1 };
