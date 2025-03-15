class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this.score = 0;
    this.lives = 3;
    const platformPositions = [
      { x: 400, y: 500 },
      { x: 1000, y: 420 },
      { x: 1600, y: 430 },
      { x: 2300, y: 500 },
      { x: 3000, y: 340 },
      { x: 3700, y: 300 },
      { x: 4200, y: 550 },
      { x: 4800, y: 380 },
      { x: 5300, y: 600 },
      { x: 6000, y: 270 },
      { x: 6700, y: 460 },
      { x: 7200, y: 320 },
      { x: 7800, y: 510 },
      { x: 8300, y: 290 },

  ];
    this.platformPositions = platformPositions;
    this.WORLD_BOUNDS = { width: 10000, height: 800 };
    this.GRAVITY_Y = 2000;
    this.PLAYER_VELOCITY = {x: 500, y: -1300};
    this.PLATFORM_DIMENSIONS = { width: 600, height: 70 };
    this.WORM_VELOCITY = 150;
  }
  
  init() {
    this.gameOver = false;
    this.selectedCharacter = this.game.registry.get("selectedCharacter");
  }
  preload() {
    this.LoadImages();
    this.LoadSounds();
    this.LoadSprites();

    // Filtro para que las imagenes no se vean borrosas
    this.load.on("filecomplete", (key) => {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });
  }
  LoadImages() {
    this.load.image("sky", "assets/bg1.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("candy", "assets/candy.png");
    this.load.image("sandwich", "assets/sandwich.png");
    this.load.image("sword", "assets/sword.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("finn_cupcake", "assets/finn_cupcake.png");
    this.load.image("jake_cupcake", "assets/pancake.png");
  }
  LoadSounds() {
    this.load.audio("finnDeath1", "sounds/Finn/finn_death_01.mp3");
    this.load.audio("finnDeath2", "sounds/Finn/finn_death_02.mp3");
    this.load.audio("finnDeath3", "sounds/Finn/finn_death_03.mp3");
    this.load.audio("jakeDeath1", "sounds/Jake/jake_death_01.mp3");
    this.load.audio("jakeDeath2", "sounds/Jake/jake_death_02.mp3");
    this.load.audio("jakeDeath3", "sounds/Jake/jake_death_03.mp3");
    this.load.audio("finn_attack1", "sounds/Finn/finn_attack1_03.mp3");
    this.load.audio("finn_attack2", "sounds/Finn/finn_attack2_03.mp3");
    this.load.audio("finn_attack3", "sounds/Finn/finn_attack2_01.mp3");
    this.load.audio("finn_achieve", "sounds/Finn/finn_achieve.mp3");
    this.load.audio("jake_attack1", "sounds/Jake/jake_attack1_03.mp3");
      this.load.audio("jake_attack2", "sounds/Jake/jake_attack2_03.mp3");
      this.load.audio("jake_attack3", "sounds/Jake/jake_attack3_03.mp3");
      this.load.audio("jake_achieve", "sounds/Jake/jake_achieve.mp3");
    
  }
  LoadSprites() {
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
      frameHeight: 150,
    });
    this.load.spritesheet("jake_attack", "assets/jake_attack.png", {
      frameWidth: 140,
      frameHeight: 68,
    });
    
  }
  CreateFood() {
    this.food = this.physics.add.staticGroup();
    // crear comida arriba de cada plataforma
    if (this.selectedCharacter === "finn") {
      this.platformPositions.forEach((pos) => {
      let random = Phaser.Math.Between(0, 1);
        if (random === 0) {
          let food = this.food
            .create(pos.x, pos.y - 200, "finn_cupcake")
            .setScale(3);
          food.setBounce(0);
        }
      });
    } else {
      this.platformPositions.forEach((pos) => {
      let random = Phaser.Math.Between(0, 1);

        if (random === 0) {
          let food = this.food
            .create(pos.x, pos.y - 200, "jake_cupcake")
            .setScale(2);
          food.setBounce(0);
        }
      });
    }
  }
  create() {
    this.setupWorld();
    this.setupMusic();
    this.setupBackground();
    this.CrearPlataformas();
    this.CreateFood();
    this.CrearAnimaciones();
    this.CrearGusanos();
    this.setupGoalItem();
    this.setupPlayerPhysics();
    this.setupCamera();
    this.setupUI();
    this.setupCollisions();
    this.setupInputHandlers();
    this.setupHearts();
    this.setupEvents();
    this.setupAttackAnimationEvents();

    // Reproducir música de fondo
    this.bgmusic1.play();
  }

  setupWorld() {
    this.physics.world.setBounds(0, 0, this.WORLD_BOUNDS.width, this.WORLD_BOUNDS.height);
   
  }

  setupMusic() {
    this.bgmusic1 = document.getElementById("bgMusic");
  }

  setupBackground() {
    let background = this.add.image(800, 400, "sky");
    background.setDisplaySize(window.innerWidth, window.innerHeight);
    background.setScrollFactor(0);
  }

  setupGoalItem() {
    const setScale = this.selectedCharacter === "finn" ? 2 : 4;
    const goalItems = { finn: "sword", jake: "sandwich" };
    const positions = { finn: { x: 9900, y: 80 }, jake: { x:9900, y: 80 } };

    this.sword = this.physics.add
      .sprite(
        positions[this.selectedCharacter].x,
        positions[this.selectedCharacter].y,
        goalItems[this.selectedCharacter]
      )
      .setScale(setScale);
    this.sword.setBounce(0.2);
  }

  setupPlayerPhysics() {
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(this.GRAVITY_Y);

  }

  setupCamera() {
    this.cameras.main.setBounds(0, 0, this.WORLD_BOUNDS.width, this.WORLD_BOUNDS.height);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
  }

  setupUI() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.scoreText = this.add
      .text(16, 16, "Score: 0", {
        fontFamily: '"Press Start 2P", Arial',
        fontSize: "32px",
        fill: "#000",
      })
      .setScrollFactor(0);

      let fecha = new Date();
      fecha = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;

      // Mostrar la fecha en pantalla
      this.dateText = this.add
      .text(1100, 16, "Date: " + fecha, {
        fontFamily: '"Press Start 2P", Arial',
        fontSize: "32px",
        fill: "#000",
      })
      .setScrollFactor(0);

      // Obtener el nickname desde localStorage
      let nickname = localStorage.getItem("nickname");

      // Mostrar el nickname debajo de la fecha
      if (nickname) {
        this.nicknameText = this.add
        .text(1100, 60, "alias: " + nickname, {
          fontFamily: '"Press Start 2P", Arial',
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0);
      }
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.sword, this.platforms);
    this.physics.add.collider(this.worms, this.platforms);
    this.physics.add.collider(this.worms, this.platforms_worms);
    this.physics.add.collider(this.player, this.food, this.handleFood, null, this);
    this.physics.add.overlap(
      this.player,
      this.sword,
      this.nextLevel,
      null,
      this
    );
    this.colisiongusanil = this.physics.add.overlap(
      this.player,
      this.worms,
      this.handleLives,
      null,
      this
    ); 
  }

  dragNdrop(){

    const dragNdrop_div = document.getElementById('dragNdrop');// nivel intermedio para cambiar al nivel 2
    const box1 = document.getElementById('box1');
    const box2 = document.getElementById('box2');
    const dragNdrop_background = document.getElementById('dragNdrop_background')
    const image_dragNdrop = document.getElementById("image_dragNdrop");

    if (!box1.contains(image_dragNdrop)) {
      box1.appendChild(image_dragNdrop); // Mueve la imagen de vuelta a box1
    }
    image_dragNdrop.style.display = 'none';
    dragNdrop_background.style.display = 'none';  

    let hero = this.game.registry.get("selectedCharacter");
    let winSound = null;
    if (hero == "finn") {
      dragNdrop_background.src = "assets/BottomDragNDrop_FINN.png";
      image_dragNdrop.src = "assets/SwordDragNDrop_FINN.png";
      winSound = this.sound.add("finn_achieve");
    } else {
      dragNdrop_background.src = "assets/BottomDragNDrop_JAKE.png";
      image_dragNdrop.src = "assets/SanwisDragNDrop_JAKE.png";
      winSound = this.sound.add("jake_achieve");
    }
    dragNdrop_div.style.display = 'flex';
    box1.style.display = box2.style.display ='flex';
    dragNdrop_background.style.display = 'flex';
    image_dragNdrop.style.display = 'flex';

    const boxes = document.querySelectorAll(".box");

    image_dragNdrop.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
        e.target.classList.add("dragging");
        console.log("Estado: Arrastrando la imagen");
    });

    image_dragNdrop.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        console.log("Estado: Arrastre finalizado");
    });
//
    boxes.forEach(box => {
        box.addEventListener("dragover", (e) => e.preventDefault());
        box.addEventListener("dragenter", () => box.classList.add("dragover"));
        box.addEventListener("dragleave", () => box.classList.remove("dragover"));

        box.addEventListener("drop", (e) => {
          e.preventDefault();
          if (!box.contains(image_dragNdrop)) {
              box.appendChild(image_dragNdrop);
          }
          box.classList.remove("dragover");

          winSound.play();
          // Esperar 2 segundos y cambiar a Level2
          setTimeout(() => {
              dragNdrop_div.style.display = 'none';
              image_dragNdrop.style.display = 'none';
              box1.style.display = box2.style.display = 'none';

              document.querySelector("canvas").style.display = "flex";
              this.registry.set("level", 2);
              this.registry.set("score", this.score);
              this.registry.set("lives", this.lives);
              this.scene.start("Level2");
              console.log("cambio de nivel");
          }, 2000);
      });
      
    });


    
  }
  nextLevel() {
    this.bgmusic1.pause();
    this.bgmusic1.currentTime = 0;
    
    this.scene.stop();
    //document.querySelector("canvas").style.display = "none";
    // this.dragNdrop();

    
    this.registry.set("level", 2);
    this.registry.set("score", this.score);
    this.registry.set("lives", this.lives);
    this.scene.start("Level2");
    console.log("cambio de nivel");
    
  }

  setupInputHandlers() {
    this.input.keyboard.on("keydown-ESC", () => {
      document.getElementById("pause").play();
      this.bgmusic1.pause();
      this.scene.launch("PauseScene");
      this.scene.pause();
    });

    this.input.keyboard.on("keydown-D", () => {
      this.handleLives();
    });

    this.input.keyboard.on("keydown-W", () => {
      this.grabarscore();
      this.bgmusic1.pause();
      this.bgmusic1.currentTime = 0;
      this.scene.start("WinScene");
    });

    this.zkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  }

  setupHearts() {
    this.livesText = this.add
      .text(16, 60, "Lives:", {
        fontFamily: '"Press Start 2P", Arial',
        fontSize: "32px",
        fill: "#000",
      })
      .setScrollFactor(0);

    this.heartSprites = [];
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add
        .image(140 + 100 + i * 55, 75, "heart")
        .setScrollFactor(0);
      this.heartSprites.push(heart);
    }
  }

  setupEvents() {
    this.events.on("resume", () => {
      this.bgmusic1.play();
    });
  }

  setupAttackAnimationEvents() {
    this.player.on("animationcomplete", (anim) => {
      if (anim.key === "attack_right" || anim.key === "attack_left") {
        this.attacking = false;
        if(this.selectedCharacter === "finn"){
          this.player.body.setSize(54, 83);
        }else{
          this.player.body.setSize(55, 68);
        }
        this.player.body.setOffset(0, 0);
      }
    });

    this.player.on("animationstart", (anim) => {
      if (anim.key === "attack_right" || anim.key === "attack_left") {
        if(this.selectedCharacter === "finn"){
          let soundKey = `finn_attack${Phaser.Math.Between(1, 3)}`;
          this.sound.play(soundKey);
        }else{
          let soundKey = `jake_attack${Phaser.Math.Between(1, 3)}`;
          this.sound.play(soundKey);
        }
      }
    });
  }

  CrearAnimaciones() {
    // Animacion del player
    if (this.selectedCharacter === "finn") {
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
        frames: this.anims.generateFrameNumbers("finn_attack", {
          start: 0,
          end: 6,
        }),
        frameRate: 15,
        repeat: 0,
      });
      this.anims.create({
        key: "attack_right",
        frames: this.anims.generateFrameNumbers("finn_attack", {
          start: 7,
          end: 13,
        }),
        frameRate: 15,
        repeat: 0,
      });
    }
    if (this.selectedCharacter === "jake") {
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
      this.anims.create({
        key: "attack_left",
        frames: this.anims.generateFrameNumbers("jake_attack", { start: 0, end: 7 }),
        frameRate: 15,
        repeat: 0,
      });
      this.anims.create({
        key: "attack_right",
        frames: this.anims.generateFrameNumbers("jake_attack", { start: 7, end: 13 }),
        frameRate: 15,
        repeat: 0,
      });
    }
    // Animación del gusano
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
  }
  CrearPlataformas() {
    // Fisicas de las plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms_worms = this.physics.add.staticGroup();

    // Forsito para crear las plataformas
    for (let x = 0; x <= this.WORLD_BOUNDS.width; x += 490) {
      let platform = this.platforms
        .create(x, 770, "ground")
        .setDisplaySize(this.PLATFORM_DIMENSIONS.width, this.PLATFORM_DIMENSIONS.height)
        .refreshBody();

      platform.body.setSize(this.PLATFORM_DIMENSIONS.width, this.PLATFORM_DIMENSIONS.height);
      platform.body.setOffset(0, 20);
    }

    // Plataformas flotantes
    this.platformPositions.forEach((pos) => {
      this.platforms
        .create(pos.x, pos.y, "ground")
        .setDisplaySize(this.PLATFORM_DIMENSIONS.width - 250, this.PLATFORM_DIMENSIONS.height - 20)
        .refreshBody();

      // Paredes a cada lado
      let leftwal = this.platforms_worms
        .create(pos.x - 250, pos.y - 50)
        .setDisplaySize(10, 100)
        .refreshBody()
        .setScale(1.3);
      leftwal.setVisible(false);
      let rightwal = this.platforms_worms
        .create(pos.x + 250, pos.y - 50)
        .setDisplaySize(10, 100)
        .refreshBody()
        .setScale(1.3);
      rightwal.setVisible(false);
    });
  }
  CrearGusanos() {
    // Grupo de gusanos
    this.worms = this.physics.add.group();
    let spacing = 2000;
    let numWorms = (this.WORLD_BOUNDS.width - 1000) / spacing;
    let startX = 1000;
    

    for (let i = 0; i < numWorms; i++) {
      let x = startX + i * spacing;
      let direction = i & (1 === 1) ? 1 : -1;

      let worm = this.worms.create(x, 700, "worm_idle").setScale(4);
      worm.anims.play("worm_right");
      worm.setBounce(0.5);
      worm.body.setSize(46, 16);
      worm.setCollideWorldBounds(true);
      worm.setVelocityX(this.WORM_VELOCITY * direction);
      if (direction === -1) {
        worm.anims.play("worm_left");
      }
    }
    let spawnonthree = 0;
    // Gusanos en plataformas flotantes
    this.platformPositions.forEach((pos) => {
      spawnonthree ++;
      if(spawnonthree % 3 == 0){
      let worm = this.worms.create(pos.x, pos.y - 50, "worm_idle").setScale(3);
      worm.anims.play("worm_right");
      worm.setBounce(0.5);
      worm.body.setSize(46, 16);
      worm.setCollideWorldBounds(true);
      worm.setVelocity(this.WORM_VELOCITY);
      }
    });
  }
  update() {
    if (this.gameOver) return;
    this.handlePlayerMovement();
    this.handlePlayerAttack();
    this.handlePlayerJump();
    this.applyGravity();
    this.updateWorms();
  }

  handlePlayerMovement() {
    if (this.cursors.left.isDown) {
      this.setPlayerMovement("left", -this.PLAYER_VELOCITY.x, true);
    } else if (this.cursors.right.isDown) {
      this.setPlayerMovement("right", this.PLAYER_VELOCITY.x, false);
    } else {
      this.stopPlayer();
    }
  }

  setPlayerMovement(direction, velocity, goingLeft) {
    if (!this.attacking) this.player.anims.play(direction, true);
    this.goingleft = goingLeft;
    this.player.setVelocityX(velocity);
  }

  stopPlayer() {
    if (!this.attacking) this.player.anims.play("turn");
    this.player.setVelocityX(0);
  }

  handlePlayerAttack() {
    if (this.zkey.isDown && !this.attackCooldown) {
      if (this.goingleft) {
        this.player.anims.play("attack_left", true);
        this.attacking = true;
        this.attackCooldown = true;
        if (this.selectedCharacter === "finn") {
          this.player.body.setSize(132, 83);
        } else {
          this.player.body.setSize(132, 68);
        }
        this.time.addEvent({
          delay: 300, // Tiempo de cooldown en milisegundos (0.5s)
          callback: () => {
            this.attackCooldown = false;
          },
        });
      } else {
        this.player.anims.play("attack_right", true);
        this.attacking = true;
        this.attackCooldown = true;
        if (this.selectedCharacter === "finn") {
          this.player.body.setSize(132, 83);
        } else {
          this.player.body.setSize(132, 68);
        }
        this.time.addEvent({
          delay: 300, // Tiempo de cooldown en milisegundos (0.5s)
          callback: () => {
            this.attackCooldown = false;
          },
        });
      }
    }
  }

  handlePlayerJump() {
    if (
      (this.cursors.up.isDown || this.cursors.space.isDown) &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(this.PLAYER_VELOCITY.y);
    }
  }
  handleFood(player, food) {
    food.disableBody(true, true);
    this.updateScore(20);
  }
  applyGravity() {
    this.player.setGravityY(this.player.body.velocity.y > 0 ? this.GRAVITY_Y + 200 : this.GRAVITY_Y);
  }
  updateScore(points) {
    this.score += points;
    this.scoreText.setText("Score: " + this.score);
  }
  updateWorms() {
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

  handleLives() {
    if (this.attacking) {
      this.removeWorms();
    } else {
      this.reduceLives();
    }
  }

  removeWorms() {
    this.worms.children.iterate((worm) => {
      if (worm.body.touching.up) {
        worm.disableBody(true, true);
        this.updateScore(10);
      }
    });
  }

  reduceLives() {
    this.lives--;
      if (this.lives >= 0) this.heartSprites[this.lives].setVisible(false);
      this.playDeathSound();
      if (this.lives <= 0) {
        this.endGame();
      } else {
        this.respawnPlayer();
      }
  }

  playDeathSound() {
    const sounds = ["Death1", "Death2", "Death3"].map(
      (s) => `${this.selectedCharacter.toLowerCase()}${s}`
    );
    this.sound.play(sounds[Phaser.Math.Between(0, 2)]);
  }

  endGame() {
    this.physics.pause();
    this.player.setVelocity(0, 0);
    this.player.anims.pause();
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.gameOver = true;
    this.grabarscore();
    this.time.delayedCall(1000, () => {
      this.bgmusic1.pause();
      this.bgmusic1.currentTime = 0;
      this.scene.start("LoseScene");
    });
  }

  respawnPlayer() {
    this.player.setVelocity(0, 0);
    this.player.clearTint();
    this.player.setAlpha(0.5);
    this.colisiongusanil.active = false;
    this.time.delayedCall(3000, () => {
      this.player.setAlpha(1);
      this.colisiongusanil.active = true;
    });
  }


  grabarscore() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let nickname = localStorage.getItem("nickname");
    let nickfinded = scores.find((score) => score.nickname === nickname);
    let date = new Date().toISOString().split("T")[0];

    if (nickfinded) {
      if (this.score >= nickfinded.score) {
        Object.assign(nickfinded, {
          score: this.score,
          character: this.selectedCharacter,
          time: date,
        });
      }
    } else {
      scores.push({
        nickname,
        score: this.score,
        time: date,
        character: this.selectedCharacter,
      });
    }
    localStorage.setItem("scores", JSON.stringify(scores));
  }
}

export { Level1 };
