class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
    this.score = 0;
    this.lives = 3;
    const platformPositions = [
      { x: 400, y: 550 },
      { x: 1000, y: 410 },
      { x: 1600, y: 440 },
      { x: 2300, y: 500 },
      { x: 3000, y: 340 },
      { x: 3700, y: 320 },
      { x: 4200, y: 550 },
      { x: 4800, y: 380 },
      { x: 5300, y: 600 },
      { x: 6000, y: 270 },
      { x: 6700, y: 460 },
      { x: 7200, y: 320 },
      { x: 7800, y: 510 },
      { x: 8100, y: 290 },
    ];

    this.platformPositions = platformPositions;
    this.cameralocked = false;
    this.WORLD_BOUNDS = { x: 10000, y: 800 };
    this.PLAYER_VELOCITY = { x: 500, y: -1300 };
    this.PLATFORM_DIMENSIONS = { width: 600, height: 70 };
    this.WORM_VELOCITY = 150;
  }
  init() {
    this.gameOver = false;
    this.selectedCharacter = this.game.registry.get("selectedCharacter");
    this.score = this.game.registry.get("score");
    this.lives = this.game.registry.get("lives");
  
  }
  LoadImages() {
    this.load.image("sky2", "assets/bg2.png");
    this.load.image("iceground", "assets/platform_ice.png");
    this.load.image("heart", "assets/heart.png");
  }
  LoadSprites() {
    this.load.spritesheet("penguin", "assets/gunter.png", {
      frameWidth: 56,
      frameHeight: 61,
    });
    this.load.spritesheet("penguin_idle", "assets/gunter_idle.png", {
      frameWidth: 56,
      frameHeight: 61,
    });
    this.load.spritesheet("iceking", "assets/iceking_RL.png", {
      frameWidth: 106,
      frameHeight: 99,
    });
    this.load.spritesheet("iceking_up", "assets/iceking.png", {
      frameWidth: 104,
      frameHeight: 103,
    });
    this.load.spritesheet("jake_attack", "assets/jake_attack.png", {
      frameWidth: 140,
      frameHeight: 68,
    });
    this.load.spritesheet("icicle", "assets/icicle.png", {
      frameWidth: 57,
      frameHeight: 20,
    });
    this.load.spritesheet("iceking_death", "assets/iceking_death.png", {
      frameWidth: 108,
      frameHeight: 179,
    });
  }
  LoadSounds() {
    this.load.audio("penguinspawn", "sounds/Ice King/gunterspawn1.mp3");
    this.load.audio("penguinspawn2", "sounds/Ice King/gunterspawn2.mp3");
    this.load.audio("penguinspawn3", "sounds/Ice King/gunterspawn3.mp3");
    this.load.audio("Wenk1", "sounds/Gunter/General_wenk5.mp3");
    this.load.audio("Wenk2", "sounds/Gunter/Gunter_Wenk01.mp3");
    this.load.audio("Wenk3", "sounds/Gunter/Gunter_Wenk02.mp3");
    this.load.audio("Wenk4", "sounds/Gunter/Gunter_Wenk03.mp3");
    this.load.audio("Wenk5", "sounds/Gunter/Gunter_Wenk04.mp3");
    this.load.audio("Wenk6", "sounds/Gunter/Gunter_Wenk05.mp3");
    this.load.audio("Wenk7", "sounds/Gunter/Gunter_Wenk06.mp3");
    this.load.audio("Wenk8", "sounds/Gunter/Gunter_Wenk07.mp3");
    this.load.audio("Wenk9", "sounds/Gunter/Gunter_Wenk08.mp3");
    this.load.audio("Wenk10", "sounds/Gunter/Gunter_Wenk09.mp3");
    this.load.audio("guntercalls", "sounds/guntercalls.mp3");
    this.load.audio("sonidofase1", "sounds/fase1.mp3");
    this.load.audio("sonidofase2", "sounds/fase2.mp3");
  }
  preload() {
    this.LoadImages();
    this.LoadSprites();
    this.LoadSounds();


    this.load.on("filecomplete", (key) => {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });
  }
  setupWorld() {
    this.physics.world.setBounds(
      0,
      0,
      this.WORLD_BOUNDS.x,
      this.WORLD_BOUNDS.y
    );
  }
  setupMusic() {
    this.bossmusic = document.getElementById("bossMusic");
    this.bossmusic.volume = 0.4;
    this.bossmusic.loop = true;
    this.events.on("resume", () => {
      this.bossmusic.play();
      this.sound.resumeAll();
    });
    this.bossmusic.play();
  }
  setupBackground() {
    let background = this.add.image(750, 400, "sky2");
    background.setDisplaySize(1920, 1080);
    background.setScrollFactor(0);
  }
  CreatePlatforms() {
    // Fisicas de las plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms_penguins = this.physics.add.staticGroup();

    // Forsito para crear las plataformas
    for (let x = 0; x <= this.WORLD_BOUNDS.x; x += 490) {
      let platform = this.platforms
        .create(x, 770, "iceground")
        .setDisplaySize(
          this.PLATFORM_DIMENSIONS.width,
          this.PLATFORM_DIMENSIONS.height
        )
        .refreshBody();
      platform.body.setSize(
        this.PLATFORM_DIMENSIONS.width,
        this.PLATFORM_DIMENSIONS.height
      );
      platform.body.setOffset(0, 20);
    }
    // Creando plataformas flotantes
    this.platformPositions.forEach((pos) => {
      this.platforms
        .create(pos.x, pos.y, "iceground")
        .setDisplaySize(
          this.PLATFORM_DIMENSIONS.width - 250,
          this.PLATFORM_DIMENSIONS.height - 20
        )
        .refreshBody();

      // Creandole paredes a cada lado
      let leftwal = this.platforms_penguins
        .create(pos.x - 250, pos.y - 50)
        .setDisplaySize(10, 100)
        .refreshBody()
        .setScale(1.3);
      leftwal.setVisible(false);
      let rightwal = this.platforms_penguins
        .create(pos.x + 250, pos.y - 50)
        .setDisplaySize(10, 100)
        .refreshBody()
        .setScale(1.3);
      rightwal.setVisible(false);
    });
  }
  CreateFood() {
    this.food = this.physics.add.staticGroup();
    this.hearts = this.physics.add.staticGroup();

    // crear comida arriba de cada plataforma
    if (this.selectedCharacter === "finn") {
      this.platformPositions.forEach((pos) => {
        let random = Phaser.Math.Between(0, 1);
        if (random === 0) {
          let random2 = Phaser.Math.Between(0, 1);
          if (random2 === 0) {
            let food = this.food
              .create(pos.x, pos.y - 200, "finn_cupcake")
              .setScale(3);
            food.setBounce(0);
          } else {
            let heart = this.hearts
              .create(pos.x, pos.y - 200, "heart")
              .setScale(2);
          }
        }
      });
    } else {
      this.platformPositions.forEach((pos) => {
        let random = Phaser.Math.Between(0, 1);

        if (random === 0) {
          let random2 = Phaser.Math.Between(0, 1);
          if (random2 === 0) {
            let food = this.food
              .create(pos.x, pos.y - 200, "jake_cupcake")
              .setScale(2);
            food.setBounce(0);
          } else {
            let heart = this.hearts
            .create(pos.x, pos.y - 200, "heart")
            .setScale(2);
          heart.setBounce(0);
        
          }
        }
      });
    }
  }
  CreateAnimations() {
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
    this.anims.create({
      key: "iceking_right",
      frames: this.anims.generateFrameNumbers("iceking", { start: 0, end: 9 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "iceking_up",
      frames: this.anims.generateFrameNumbers("iceking_up", {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.anims.create({
      key: "iceking_death",
      frames: this.anims.generateFrameNumbers("iceking_death", {
        start: 0,
        end: 8,
      }),
      frameRate: 3,
      repeat: 0,
    });
    if (this.selectedCharacter === "finn") {
      console.log("finn");
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
        frameRate: 14,
        repeat: 0,
      });
      this.anims.create({
        key: "attack_right",
        frames: this.anims.generateFrameNumbers("finn_attack", {
          start: 7,
          end: 13,
        }),
        frameRate: 14,
        repeat: 0,
      });
    }
    if (this.selectedCharacter === "jake") {
      this.player = this.physics.add.sprite(100, 450, "jake").setScale(2);
      console.log("jake");
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
        frames: this.anims.generateFrameNumbers("jake_attack", {
          start: 0,
          end: 6,
        }),
        frameRate: 14,
        repeat: 0,
      });
      this.anims.create({
        key: "attack_right",
        frames: this.anims.generateFrameNumbers("jake_attack", {
          start: 7,
          end: 13,
        }),
        frameRate: 14,
        repeat: 0,
      });
    }
  }
  CreatePenguins() {
    this.penguins = this.physics.add.group();
    let numpenguins = 5;
    let startX = 1000;
    let spacing = 300;
    let penguinspeed = 150;
    for (let i = 0; i < numpenguins; i++) {
      let x = startX + i * spacing;
      let direction = i & (1 === 1) ? 1 : -1;

      let penguin = this.penguins.create(x, 700, "penguin_idle").setScale(2);
      penguin.anims.play("penguin_right");
      penguin.setBounce(0.5);
      penguin.setCollideWorldBounds(true);
      penguin.setVelocityX(penguinspeed * direction);
      let randomtime = Phaser.Math.Between(1000, this.WORLD_BOUNDS.x);
      penguin.soundEvent = this.time.addEvent({
        delay: randomtime,
        callback: () => {
          if (penguin.active) {
            let randomWenk = Phaser.Math.Between(1, 10);
            this.sound.play(`Wenk${randomWenk}`, { volume: 0.3 });
          } else {
            penguin.soundEvent.remove();
          }
        },
        loop: true,
      });
      if (direction === -1) {
        penguin.anims.play("penguin_left");
      }
    }
    let penguincount = 0;
    this.platformPositions.forEach((pos) => {
      penguincount++;
      if (penguincount % 2 === 0) {
        let penguin = this.penguins
          .create(pos.x, pos.y - 80, "penguin_idle")
          .setScale(2);
        penguin.anims.play("penguin_right");
        penguin.setBounce(0.5);
        penguin.setCollideWorldBounds(true);
        penguin.setVelocityX(penguinspeed);
        // añadir timer de sonido
        let randomtime = Phaser.Math.Between(1000, this.WORLD_BOUNDS.x);
        penguin.soundEvent = this.time.addEvent({
          delay: randomtime,
          callback: () => {
            if (penguin.active) {
              let randomWenk = Phaser.Math.Between(1, 10);
              this.sound.play(`Wenk${randomWenk}`, { volume: 0.3 });
            } else {
              penguin.soundEvent.remove();
            }
          },
          loop: true,
        });
      }
    });
  }
  CreateBoss() {
    this.boss = this.physics.add
      .sprite(this.WORLD_BOUNDS.x - 200, 600, "iceking")
      .setScale(2);
    this.boss.anims.play("iceking_right");
    this.boss.salud = 200;
    // boss sin gravedad
    this.boss.body.setAllowGravity(false);
    this.boss.setCollideWorldBounds(true);
    this.boss.setVelocity(0, 0);
    this.boss.body.setImmovable(true);
  }
  CreatePhases() {
    this.fase1 = this.tweens.add({
      targets: this.boss,
      y: this.boss.y - 600,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Linear",
      paused: true,
    });
    this.flyingpenguins = this.physics.add.group();
    this.fase2 = this.tweens.add({
      targets: this.boss,
      x: this.WORLD_BOUNDS.x - 850,
      y: 150,
      duration: 4000,
      ease: "Power2",
      paused: true,
      onComplete: () => {
        this.boss.anims.play("iceking_up");
        let soundnum = Phaser.Math.Between(0, 2);
        if (!this.spawnmobsevent) {
          this.spawnCount = 0;
          this.spawnmobsevent = this.time.addEvent({
            delay: 2000,
            callback: () => {
              let penguin = this.flyingpenguins
                .create(this.boss.x, this.boss.y, "penguin_idle")
                .setScale(2);

              if (penguin.active) {
                let randomWenk = Phaser.Math.Between(1, 10);
                this.sound.play(`Wenk${randomWenk}`, { volume: 0.3 });
              } else {
                penguin.soundEvent.remove();
              }

              this.spawnCount++;
              if (this.spawnCount % 4 === 0) {
                switch (soundnum) {
                  case 0:
                    this.sound.play("penguinspawn", { volume: 4 });
                    break;
                  case 1:
                    this.sound.play("penguinspawn2", { volume: 2 });
                    break;
                  case 2:
                    this.sound.play("penguinspawn3", { volume: 2 });
                    break;
                }
                soundnum++;
                if (soundnum > 2) {
                  soundnum = 0;
                }
              }
              penguin.anims.play("penguin_idle");
              penguin.setBounce(0.5);
              penguin.setCollideWorldBounds(true);
            },
            loop: true,
          });
        }
        this.tweens.add({
          targets: this.boss,
          x: this.WORLD_BOUNDS.x - 1250,
          duration: 4000,
          ease: "Sine.easeInOut",
          onComplete: () => {
            if (!this.bossLoopTween) {
              this.bossLoopTween = this.tweens.add({
                targets: this.boss,
                x: this.WORLD_BOUNDS.x - 250,
                duration: 4000,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
              });
            }
          },
        });
      },
      onStart: () => {
        this.sound.play("sonidofase1", { volume: 2 });
      },
    });
    this.regresarfase1 = this.tweens.add({
      targets: this.boss,
      x: this.WORLD_BOUNDS.x - 200,
      y: 650,
      duration: 4500,
      ease: "Power2",
      paused: true,
      onComplete: () => {
        this.boss.anims.play("iceking_right");
        this.spawnCount = 0;
        this.tweens.add({
          targets: this.boss,
          y: this.boss.y - 600,
          duration: 6000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        let randomtimespawn = Phaser.Math.Between(1000, 1500);
        this.sound.play("guntercalls", { volume: 2 });
        this.numpenguins = 0;
        this.regresarfase1event = this.time.addEvent({
          delay: randomtimespawn,
          callback: () => {
            this.numpenguins++;
            let penguin = this.flyingpenguins
              .create(this.WORLD_BOUNDS.x, 700, "penguin_idle")
              .setScale(2);
            penguin.anims.play("penguin_left");
            penguin.setBounce(0.5);
            penguin.setCollideWorldBounds(true);
            penguin.setVelocityX(-100);
            let randomtimespawn = Phaser.Math.Between(100, 4000);
            penguin.soundEvent = this.time.addEvent({
              delay: randomtimespawn,
              callback: () => {
                if (penguin.active) {
                  let randomWenk = Phaser.Math.Between(1, 10);
                  this.sound.play(`Wenk${randomWenk}`, { volume: 0.3 });
                } else {
                  penguin.soundEvent.remove();
                }
              },
              loop: true,
            });
            console.log(this.numpenguins);
            if (this.numpenguins % 7 === 0) {
              this.sound.play("guntercalls", { volume: 2.5 });
            }
          },
          loop: true,
        });
      },
      onStart: () => {
        this.sound.play("sonidofase2", { volume: 2 });
      },
    });
  }
  setupPlayerPhysics() {
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(2500);
  }
  setupCamera() {
    this.cameras.main.setBounds(0, 0, this.WORLD_BOUNDS.x, this.WORLD_BOUNDS.y);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
  }
  setupUI() {
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
    for (let i = 0; i < 3; i++) {
      let heart = this.add
        .image(140 + 100 + i * 55, 75, "heart")
        .setScrollFactor(0);
      this.heartSprites.push(heart);
    }

    let fecha = new Date();
    fecha = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;

    this.dateText = this.add
      .text(1100, 16, "Date: " + fecha, {
        fontFamily: '"Press Start 2P", Arial',
        fontSize: "32px",
        fill: "#000",
      })
      .setScrollFactor(0);


    let nickname = localStorage.getItem("nickname");

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
  updateLifes(lives) {
    this.heartSprites.forEach((heart) => heart.setVisible(false));
    for (let i = 0; i < lives; i++) {
      this.heartSprites[i].setVisible(true);
    }
  }

  create() {
    this.setupWorld();
    this.setupMusic();
    this.setupBackground();
    this.CreatePlatforms();
    this.CreateFood();
    this.CreateAnimations();
    this.CreatePenguins();
    this.CreateBoss();
    this.CreatePhases();
    this.setupPlayerPhysics();
    this.setupCamera();
    this.setupUI();
    this.updateLifes(this.lives);
    this.updateScore(this.score);
    this.setupInput();

    this.setupPhysics();
    this.setupAnimationEvents();
  }
  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.zkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.input.keyboard.on("keydown-ESC", this.handlePause, this);
    this.input.keyboard.on("keydown-D", this.handleLives, this);
    this.input.keyboard.on("keydown-S", this.handleWin, this);
  }

 
  setupPhysics() {
    this.canAttack = true;
    this.icicles = this.physics.add.group();
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.penguins, this.platforms_penguins);
    this.physics.add.collider(this.penguins, this.platforms);
    this.physics.add.collider(this.flyingpenguins, this.platforms);
    this.physics.add.collider(this.icicles, this.platforms);
    this.physics.add.collider(
      this.player,
      this.food,
      this.handleFood,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.hearts,
      this.handleHealth,
      null,
      this
    );
    this.colisionicicle = this.physics.add.collider(
      this.player,
      this.icicles,
      this.handleIcicleCollision,
      null,
      this
    );
    this.colisionpenguinil2 = this.physics.add.overlap(
      this.player,
      this.flyingpenguins,
      this.handleLives,
      null,
      this
    );
    this.colisionpenguinil = this.physics.add.overlap(
      this.player,
      this.penguins,
      this.handleLives,
      null,
      this
    );
    this.colisionboss = this.physics.add.overlap(
      this.player,
      this.boss,
      this.handleAttackBoss,
      null,
      this
    );
  }

  handlePause() {
    document.getElementById("pause").play();
    this.bossmusic.pause();
    this.sound.pauseAll();
    this.scene.launch("PauseScene");
    this.scene.pause();
  }

  setupAnimationEvents() {
    this.player.on("animationcomplete", (anim) => {
      if (anim.key === "attack_right" || anim.key === "attack_left") {
        this.attacking = false;
        if (this.selectedCharacter === "finn") {
          this.player.body.setSize(54, 83);
        } else {
          this.player.body.setSize(55, 68);
        }
        this.player.body.setOffset(0, 0);
      }
    });
    this.boss.on("animationcomplete", (anim) => {
      if (anim.key === "iceking_death") {
        this.sound.pauseAll();
        this.bossmusic.pause();
        this.bossmusic.currentTime = 0;
        this.grabarscore();
        this.scene.start("WinScene");
      }
    });
    this.player.on("animationstart", (anim) => {
      if (anim.key === "attack_right" || anim.key === "attack_left") {
        let randomSound = Phaser.Math.Between(1, 3);
        let soundKey = `${this.selectedCharacter}_attack${randomSound}`;
        this.sound.play(soundKey);
      }
    });
    this.icicleCounter = 0;
    this.boss.on("animationupdate", (anim, frame) => {
      if (frame.index === anim.frames.length - 1) {
        if (anim.key === "iceking_right" && this.cameralocked) {
          this.icicleCounter++;
          if (this.icicleCounter % 3 === 0) {
            let icicle = this.icicles
              .create(this.boss.x, this.boss.y, "icicle")
              .setScale(4);
            this.physics.moveToObject(icicle, this.player, 400);
            icicle.angle = Phaser.Math.Angle.Between(
              icicle.x,
              icicle.y,
              this.player.x,
              this.player.y
            );
            let angle = Phaser.Math.Angle.Between(
              this.player.x,
              this.player.y,
              icicle.x,
              icicle.y
            );
            icicle.setRotation(angle);

            this.time.addEvent({
              delay: this.WORLD_BOUNDS.x,
              callback: () => {
                icicle.destroy();
              },
            });
          }
        }
      }
    });
  }
  handlePlayerMovement() {
    if (this.player.y > 780) {
      this.player.y = 750;
      console.log(this.player.y);
    }

    if (this.cursors.left.isDown) {
      if (!this.attacking) {
        this.player.anims.play("left", true);
      }
      this.goingleft = true;
      this.player.setVelocityX(-this.PLAYER_VELOCITY.x);
    } else if (this.cursors.right.isDown) {
      if (!this.attacking) {
        this.player.anims.play("right", true);
      }
      this.goingleft = false;
      this.player.setVelocityX(this.PLAYER_VELOCITY.x);
    } else {
      if (!this.attacking) {
        this.player.anims.play("turn");
      }
      this.player.setVelocityX(0);
    }
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
          this.player.body.setSize(140, 68);
        }
        this.time.addEvent({
          delay: 700,
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
          this.player.body.setSize(140, 68);
        }
        this.time.addEvent({
          delay: 700,
          callback: () => {
            this.attackCooldown = false;
          },
        });
      }
    }
  }
  handlePlayerJump() {
    if (
      (this.cursors.up.isDown && this.player.body.touching.down) ||
      (this.cursors.space.isDown && this.player.body.touching.down)
    ) {
      this.player.setVelocityY(this.PLAYER_VELOCITY.y);
    }
  }
  handleWin() {
    if (
      this.boss.anims.currentAnim &&
      this.boss.anims.currentAnim.key === "iceking_death"
    ) {
      return;
    }
    this.tweens.killTweensOf(this.boss);
    this.boss.setVelocity(0, 0);
    this.boss.anims.play("iceking_death");
  }
  handleFood(player, food) {
    food.disableBody(true, true);
    this.updateScore(20);
    this.sound.play("pop");

  }
  handleHealth(player, heart) {
    if (this.lives < 3) {
      this.lives++;
      this.heartSprites[this.lives - 1].setVisible(true);
    }
    heart.disableBody(true, true);
    this.updateScore(30);
    this.sound.play("pop");
  }
  applyGravity() {
    this.player.setGravityY(this.player.body.velocity.y > 0 ? 3000 : 2500);
  }
  updatePenguins() {
    this.flyingpenguins.children.iterate((penguin) => {
      if (penguin.body.blocked.down) {
        if (penguin.body.velocity.x === 0) {
          let speedX = 150 * (Math.random() < 0.5 ? -1 : 1);
          penguin.setVelocityX(speedX);
          penguin.anims.play(speedX > 0 ? "penguin_right" : "penguin_left");
        }
      }
      if (penguin.body.blocked.right) {
        penguin.setVelocityX(-150);
        penguin.anims.play("penguin_left");
      }
      if (penguin.body.blocked.left) {
        penguin.setVelocityX(150);
        penguin.anims.play("penguin_right");
      }
    });

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
  }
  updateBoss() {
    if (this.boss.salud <= 100) {
      if (this.fase1.isPlaying() && this.fase2.isPaused()) {
        this.fase1.stop();
      }
      if (this.fase2.isPaused()) {
        this.fase2.play();
      }
    }
    if (this.boss.salud === 0) {
      this.handleWin();
    }
    if (this.flyingpenguins.getChildren().length === 15) {
      if (this.fase2.isPlaying()) {
        this.fase2.stop();
      }
      if (this.bossLoopTween) {
        this.bossLoopTween.stop();
        this.bossLoopTween = null;
      }
      if (this.spawnmobsevent) {
        this.spawnmobsevent.remove(false);
        this.spawnmobsevent = null;
      }
      if (this.regresarfase1.isPaused()) {
        this.regresarfase1.play();
      }
    }
  }
  cameraBossLocked() {
    let cameraEnd = this.cameras.main.scrollX + this.cameras.main.width;
    if (
      cameraEnd >= this.WORLD_BOUNDS.x &&
      this.player.x >= this.WORLD_BOUNDS.x - 700
    ) {
      this.cameras.main.stopFollow();
      this.cameralocked = true;
      if (this.fase1.isPaused()) {
        this.fase1.play();
      }
    }
    if (this.cameralocked) {
      const maxX = this.WORLD_BOUNDS.x - this.cameras.main.width;
      if (this.player.x <= maxX) {
        this.player.x = maxX;
      }

      if (!this.crearcorazones) {
        this.crearcorazones = this.time.addEvent({
          delay: 10000,
          callback: () => {
            let randomx = Phaser.Math.Between(this.WORLD_BOUNDS.x - 1450, this.WORLD_BOUNDS.x - 100);
            let heart = this.hearts
              .create(randomx, 700, "heart")
              .setScale(2);
            heart.setBounce(0);
          },
          loop: true,
        });
      }

      this.flyingpenguins.children.iterate((penguin) => {
        if (penguin.x <= this.cameras.main.scrollX) {
          penguin.setVelocityX(150);
          penguin.anims.play("penguin_right");
        }
      });

      if (this.penguins.getChildren().length > 0) {
        let toDestroy = [];

        this.penguins.children.iterate((penguin) => {
          if (penguin.x <= this.cameras.main.scrollX) {
            toDestroy.push(penguin);
          }
        });

        toDestroy.forEach((penguin) => penguin.destroy());
      }
    }
  }

  update() {
    this.handlePlayerMovement();
    this.handlePlayerAttack();
    this.handlePlayerJump();
    this.applyGravity();
    this.updatePenguins();
    this.updateBoss();
    this.cameraBossLocked();
    this.updateConsumibleHearts();
    if (this.gameOver) {
      return;
    }
  }
  updateConsumibleHearts(){
    this.hearts.getChildren().forEach((heart) => { 
      if (this.cameras.main.worldView.contains(heart.x, heart.y)) {
          if (!heart.corazonesopacidad) { 
              heart.corazonesopacidad = this.time.addEvent({
                  delay: 300,
                  callback: () => {
                      heart.setAlpha(heart.alpha === 1 ? 0.3 : 1);
                  },
                  repeat: 8,
              });

              this.time.delayedCall(300 * 6, () => { 
                  heart.destroy(); 
              });
          }
      }
  });
  }

  handleAttackBoss() {
    if (this.attacking) {
      if (!this.bossHit) {
        this.bossHit = true;
        this.boss.setTint(0xff0000);
        this.boss.salud -= 10;

        this.time.delayedCall(500, () => {
          this.boss.clearTint();
          this.bossHit = false;
        });
      }
    } else {
      this.reduceLives();
    }
  }
  handleIcicleCollision(player, icicle) {
    if (this.attacking) {
      if (icicle.body.velocity.x > 0) {
        icicle.setVelocityX(icicle.body.velocity.x * 2);
      } else {
        icicle.setVelocityX(icicle.body.velocity.x * -1);
      }
      // player inmune por 1 segundo
      this.colisionicicle.active = false;
      this.time.delayedCall(500, () => {
        this.colisionicicle.active = true;
      });
    } else {
      this.handleLives();
    }
  }

  handleLives() {
    if (this.attacking) {
      this.RemovePenguins(this.penguins);
      this.RemovePenguins(this.flyingpenguins);
    } else {
      this.reduceLives();
    }
  }

  reduceLives() {
    this.lives--;
    if (this.lives >= 0 && this.lives < this.heartSprites.length) this.heartSprites[this.lives].setVisible(false);
    this.playDeathSound();
    if (this.lives <= 0) {
      this.endGame();
    } else {
      this.respawnPlayer();
    }
  }
  RemovePenguins(group) {
    group.children.iterate((penguin) => {
      if (penguin.body.touching.up) {
        penguin.disableBody(true, true);
        this.updateScore(10);
      }
    });
  }

  updateScore(points) {
    this.score += points;
    this.scoreText.setText("Score: " + this.score);
  }

  playDeathSound() {
    let random3 = Phaser.Math.Between(1, 3);
    let soundKey =
      this.selectedCharacter === "finn"
        ? `finnDeath${random3}`
        : `jakeDeath${random3}`;
    this.sound.play(soundKey);
  }

  endGame() {
    this.physics.pause();
    this.physics.pause();
    this.player.setVelocity(0, 0);
    this.player.setTint(0xff0000);
    this.player.anims.play("turn");
    this.gameOver = true;
    this.grabarscore();
    this.time.delayedCall(1000, () => {
      this.bossmusic.pause();
      this.bossmusic.currentTime = 0;
      this.sound.pauseAll();
      this.scene.start("LoseScene");
    });
  }

  respawnPlayer() {
    if (this.cameralocked) {
      this.player.setPosition(this.WORLD_BOUNDS.x - 1000, 600);
      this.colisionboss.active = false;
      this.colisionpenguinil2.active = false;
      this.colisionicicle.active = false;
    } else {
      this.colisionpenguinil.active = false;
    }
    this.player.setVelocity(0, 0);
    this.player.clearTint();
    this.player.setAlpha(0.5);

    this.time.delayedCall(3000, () => {
      this.player.setAlpha(1);
      this.colisionpenguinil.active = true;
      this.colisionpenguinil2.active = true;
      this.colisionboss.active = true;
      this.colisionicicle.active = true;
    });
  }

  grabarscore() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let nickname = localStorage.getItem("nickname");
    let nickfinded = scores.find((score) => score.nickname === nickname);

    if (nickfinded) {
      if (this.score > nickfinded.score) {
        nickfinded.score = this.score;
      }
    } else {
      scores.push({
        nickname: nickname,
        score: this.score,
        time: new Date().toLocaleString(),
        character: this.selectedCharacter,
      });
    }
    localStorage.setItem("scores", JSON.stringify(scores));
  }
}

export { Level2 };
