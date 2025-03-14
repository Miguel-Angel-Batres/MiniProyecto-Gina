class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
    this.score = 0;
    this.lives = 5;
    const platformPositions = [
      { x: 400, y: 500 },
      { x: 900, y: 400 },
      { x: 1400, y: 450 },
      { x: 2000, y: 450 },
      { x: 2500, y: 550 },
      { x: 3000, y: 350 },
    ];
    this.platformPositions = platformPositions;
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
  }
  preload() {
    this.LoadImages();
    this.LoadSprites();
    this.load.audio("penguinspawn", "sounds/Ice King/gunterspawn1.mp3");
    this.load.audio("penguinspawn2", "sounds/Ice King/gunterspawn2.mp3");
    this.load.audio("penguinspawn3", "sounds/Ice King/gunterspawn3.mp3");
    // gunter Wenk
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

    

    this.load.on("filecomplete", (key) => {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    });
  }
  setupWorld() {
    this.physics.world.setBounds(0, 0, 5000, 800);
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
    for (let x = 0; x <= 5000; x += 490) {
      let platform = this.platforms
        .create(x, 770, "iceground")
        .setDisplaySize(500, 64)
        .refreshBody();
      platform.body.setSize(500, 58);
      platform.body.setOffset(0, 20);
    }
    // Creando plataformas flotantes
    this.platformPositions.forEach((pos) => {
      this.platforms
        .create(pos.x, pos.y, "iceground")
        .setDisplaySize(350, 60)
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
  CreaeteAnimations() {
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
      let randomtime = Phaser.Math.Between(1000,5000);
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
        loop: true
      });
      if (direction === -1) {
        penguin.anims.play("penguin_left");
      }
    }
    this.platformPositions.forEach((pos) => {
      let penguin = this.penguins
        .create(pos.x, pos.y - 80, "penguin_idle")
        .setScale(2);
      penguin.anims.play("penguin_right");
      penguin.setBounce(0.5);
      penguin.setCollideWorldBounds(true);
      penguin.setVelocityX(penguinspeed);
      // añadir timer de sonido
      let randomtime = Phaser.Math.Between(1000,5000);
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
        loop: true
      });

     });

  }
  CreateBoss() {
    this.boss = this.physics.add.sprite(4800, 600, "iceking").setScale(2);
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
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    this.flyingpenguins = this.physics.add.group();
    this.fase2 = this.tweens.add({
      targets: this.boss,
      x: 4150,
      y: 150,
      duration: 4000,
      ease: "Power2",
      paused: true,
      onComplete: () => {
        this.boss.anims.play("iceking_up");
        let soundnum = Phaser.Math.Between(0, 2);
        // Guardamos referencia al evento para poder detenerlo después
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
              // sonar sonido de spawn secuencialmente cada 4 pinguinos
              if (this.spawnCount % 4 === 0) {
                switch(soundnum){
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
                if(soundnum > 2){
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
          x: 3750,
          duration: 4000,
          ease: "Sine.easeInOut",
          onComplete: () => {
            if (!this.bossLoopTween) {
              this.bossLoopTween = this.tweens.add({
                targets: this.boss,
                x: 4750,
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
      }
    });
    this.regresarfase1 = this.tweens.add({
      targets: this.boss,
      x: 4800,
      y: 650,
      duration: 6000,
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
                    // Generar pingüino que venga de la derecha
                    let penguin = this.flyingpenguins
                        .create(5000, 700, "penguin_idle")
                        .setScale(2);
                    penguin.anims.play("penguin_left");
                    penguin.setBounce(0.5);
                    penguin.setCollideWorldBounds(true);
                    penguin.setVelocityX(-100);       
                    let randomtimespawn = Phaser.Math.Between(100, 4000);
                    penguin.soundEvent = this.time.addEvent({
                        delay: randomtimespawn,
                        callback: () => {
                            if (penguin.active) { // Verifica si el pingüino sigue en el juego
                                let randomWenk = Phaser.Math.Between(1, 10); // Número aleatorio entre 1 y 10
                                this.sound.play(`Wenk${randomWenk}`, { volume: 0.3 }); // Reproducir sonido aleatorio
                              } else {
                                penguin.soundEvent.remove(); // Si el pingüino muere, detener el sonido
                            }
                            if(this.numpenguins % 7 === 0){
                                this.sound.play("guntercalls", { volume: 2.5 });
                              
                            }
                        },
                        
                        loop: true,
                      
                    });                    
                },
                loop: true // Hacer que el evento se repita indefinidamente
            });
      },
      onStart: () => {
        this.sound.play("sonidofase2", { volume: 2 });
      }
    });
   
    this.fase1.play();
  }
  setupPlayerPhysics() {
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(2500);
  }
  setupCamera() {
    this.cameras.main.setBounds(0, 0, 5000, 800);
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
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add
        .image(140 + 100 + i * 55, 75, "heart")
        .setScrollFactor(0); // Posición y distancia entre los corazones
      this.heartSprites.push(heart);
    }
  }
  create() {
    this.setupWorld();
    this.setupMusic();
    this.setupBackground();
    this.CreatePlatforms();
    this.CreaeteAnimations();
    this.CreatePenguins();
    this.CreateBoss();
    this.CreatePhases();
    this.setupPlayerPhysics();
    this.setupCamera();
    this.setupUI();
    this.setupInput();
    this.setupPhysics();
    this.setupAnimationEvents();
  }
  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.zkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.input.keyboard.on("keydown-ESC", this.handlePause, this);
    this.input.keyboard.on("keydown-D", this.handleLives, this);
    this.input.keyboard.on("keydown-W", this.handleWin, this);
  }

  setupPhysics() {
    this.canAttack = true;
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.penguins, this.platforms_penguins);
    this.physics.add.collider(this.penguins, this.platforms);
    this.physics.add.collider(this.flyingpenguins, this.platforms);
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

  handleWin() {
    this.sound.pauseAll();
    this.bossmusic.pause();
    this.bossmusic.currentTime = 0;
    this.grabarscore();
    this.scene.start("WinScene");
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
    this.player.on("animationstart", (anim) => {
      if (anim.key === "attack_right" || anim.key === "attack_left") {
        let randomSound = Phaser.Math.Between(1, 3);
        let soundKey = `${this.selectedCharacter}_attack${randomSound}`;
        this.sound.play(soundKey);
        // debugear posicion antes de atacar
      }
    });
  }
  handlePlayerMovement() {
    // prevenir que el jugador se caiga abajo del suelo
    if (this.player.y > 790) {
      this.player.y = 769;
      console.log(this.player.y);
    }

    if (this.cursors.left.isDown) {
      if (!this.attacking) {
        this.player.anims.play("left", true);
      }
      this.goingleft = true;
      this.player.setVelocityX(-400);
    } else if (this.cursors.right.isDown) {
      if (!this.attacking) {
        this.player.anims.play("right", true);
      }
      this.goingleft = false;
      this.player.setVelocityX(1000);
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
          delay: 700, // Tiempo de cooldown en milisegundos (0.5s)
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
      this.player.setVelocityY(-1300);
    }
  }
  applyGravity() {
    this.player.setGravityY(this.player.body.velocity.y > 0 ? 3000 : 2500);
  }
  updatePenguins() {
    this.flyingpenguins.children.iterate((penguin) => {
      if (penguin.body.blocked.down) {
        if (penguin.body.velocity.x === 0) {
          // Si aún no tiene velocidad en X
          let speedX = 150 * (Math.random() < 0.5 ? -1 : 1); // Velocidad aleatoria a la izquierda o derecha
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
  }
  updateBoss() {
    if (this.boss.salud <= 100) {
      if (this.fase1.isPlaying() && this.fase2.isPaused()) {
        this.fase1.pause();
      }
      if (this.fase2.isPaused()) {
        this.fase2.play();
      }
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
      if (this.regresarfase1.isPaused() ) {
        this.regresarfase1.play();
    }
    
    }
    if (this.boss.salud <= 0) {
      this.handleWin();
    }
  }
  cameraBossLocked() {
    let cameraEnd = this.cameras.main.scrollX + this.cameras.main.width;
    if (cameraEnd >= 5000 && this.player.x >= 4350) {
      this.cameras.main.stopFollow();
      this.cameralocked = true;
    }
    if (this.cameralocked) {
      const maxX = 5050 - this.cameras.main.width;
      if (this.player.x <= maxX) {
        this.player.x = maxX;
      }
      // Pinguinos tampoco se pueden salir de la pantalla
      this.flyingpenguins.children.iterate((penguin) => {
        if (penguin.x <= this.cameras.main.scrollX) {
          penguin.setVelocityX(150);
          penguin.anims.play("penguin_right");
        }
      });
      // matar al grupo de pinguinos 1 vez 
      if (this.penguins.getChildren().length > 0) {
        let toDestroy = [];
    
        this.penguins.children.iterate((penguin) => {
            if (penguin.x <= this.cameras.main.scrollX) {
                toDestroy.push(penguin);
            }
        });
    
        // Elimina todos los pingüinos fuera de la cámara en una sola iteración
        toDestroy.forEach(penguin => penguin.destroy());
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

    if (this.gameOver) {
      return;
    }
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
    if (this.lives >= 0) this.heartSprites[this.lives].setVisible(false);
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
      this.scene.start("LoseScene");
    });
  }

  respawnPlayer() {
    if(this.cameralocked){
      this.player.setPosition(4000, 600);
      this.colisionboss.active = false;
      this.colisionpenguinil2.active = false;
    }else{
      this.player.setPosition(100, 450);
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
