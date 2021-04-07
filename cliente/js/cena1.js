// Importar a próxima cena
import { cena2 } from "./cena2.js";

// Criar a cena 1
var cena1 = new Phaser.Scene("Cena 1");

// Variáveis locais
var map;
var tileset0;
var blocos;
var tileset1;
var ceu;
var player;
var player2;
var cursors;
var timedEvent;
var timer;
var timerText;
var life = 0;
var lifeText;
var laser;
var audiolaser;
// var stars;
// var audiojoia;
var tema;
var temaConfig;
var jogador;
var doisJogadores = false;

// Carregar os assets
cena1.preload = function () {
    // Tilesets
    this.load.image("blocos", "assets/blocos.png");
    this.load.image("ceu", "assets/ceu.png");

    // Tilemap
    this.load.tilemapTiledJSON("mapa", "assets/mapa.json");

    // Jogador 1
    this.load.spritesheet("personagem", "assets/personagem.png", {
        frameWidth: 29,
        frameHeight: 37,
    });

    // Jogador 2
    this.load.spritesheet("personagem2", "assets/personagem2.png", {
        frameWidth: 29,
        frameHeight: 37,
    });

    // Laser
    this.load.image("laser", "assets/laser.png");

    // Gema
    // this.load.image("gema", "assets/gema.png");

    // Efeitos sonoros
    // this.load.audio("audiojoia", "assets/audiojoia.mp3");
    this.load.audio("audiolaser", "assets/audiolaser.mp3");

    // Trilha sonora
    this.load.audio("tema", "assets/tema.mp3");

    // Tela cheia
    this.load.spritesheet("fullscreen", "assets/fullscreen.png", {
       frameWidth: 40,
       frameHeight: 40,
    });
};

cena1.create = function () {
    // Trilha sonora
    tema = this.sound.add("tema");
    var temaConfig = {
        mute: false,
        volume: 0.5,
        loop: true,
    };
    tema.play(temaConfig);

    // Efeitos sonoros
    // audiojoia = this.sound.add("audiojoia");
    audiolaser = this.sound.add("audiolaser");

    // Tilemap
    map = this.make.tilemap({ key: "mapa" });

    // Tilesets
    tileset1 = map.addTilesetImage("ceu", "ceu");
    tileset0 = map.addTilesetImage("blocos", "blocos");

    // Camada 1: ceu
    ceu = map.createStaticLayer("ceu", tileset1, 0, 0);

    // Camada 2: plataformas
    blocos = map.createStaticLayer("blocos", tileset0, 0, 0);

    // Personagens
    player = this.physics.add.sprite(550, 1200, "personagem");
    player2 = this.physics.add.sprite(400, 1300, "personagem2");

    // Laser, cria-se um objeto
    laser = this.physics.add.sprite(400, 1550, "laser");
    
    // Remove a gravidade do laser (objeto)
    laser.body.setAllowGravity(false);

    blocos.setCollisionByProperty({ collides: true });

    // Personagens colidem com os limites da cena
    player.setCollideWorldBounds(true);
    player2.setCollideWorldBounds(true);

    // Detecção de colisão: plataformas
    this.physics.add.collider(player, blocos, null, null, this);
    this.physics.add.collider(player2, blocos, null, null, this);

    // Animação do jogador 1 para a esquerda
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("personagem", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1,
    });

    // Animação do jogador 2 para a esquerda
    this.anims.create({
        key: "left2",
        frames: this.anims.generateFrameNumbers("personagem2", {
            start: 0,
            end: 1,
        }),
        frameRate: 10,
        repeat: -1,
    });

    // Animação do jogador 1 para a direita
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("personagem", { start: 4, end: 5 }),
        frameRate: 3,
        repeat: -1,
    });

    // Animação do jogador 2 para a direita
    this.anims.create({
        key: "right2",
        frames: this.anims.generateFrameNumbers("personagem2", {
            start: 4,
            end: 5,
        }),
        frameRate: 10,
        repeat: -1,
    });

    // Animação do jogador 1 parado para a esquerda
    this.anims.create({
        key: "stopped",
        frames: [{ key: "personagem", frame: 3 }],
        frameRate: 20,
    });

    // Animação do jogador 2 parado para a esquerda
    this.anims.create({
        key: "stopped2",
        frames: [{ key: "personagem2", frame: 3 }],
        // frameRate: 20,
    });

    // Gravidade do jogo
    player.body.setGravityY(450);
    player2.body.setGravityY(450);

    this.physics.add.collider(player, laser, hitLaser, null, this);

    // Localização das gemas
    // stars = this.physics.add.group({
        // key: "gema",
        // repeat: 1,
        // setXY: { x: 400, y: 1320, stepX: 200 },
    // });

    // Detecção de colisão e disparo de evento entre personagens e as gemas
    // this.physics.add.collider(stars, blocos, null, null, this);
    // this.physics.add.overlap(player, stars, collectStar1, null, this);
    // this.physics.add.overlap(player2, stars, collectStar2, null, this);

    // Mostra na tela o contador
    // timerText = this.add.text(400, 60, timer, {
       // fontSize: "25px",
       // fill: "white",
    // });
    // timerText.setScrollFactor(0);

    // Mostra há quanto tempo estão jogando
    lifeText = this.add.text(400, 10, life, {
        fontSize: "25px",
        fill: "white",
    });
    lifeText.setScrollFactor(0);

    // Cena (800x1600) maior que a tela (800x600)
    this.cameras.main.setBounds(0, 0, 800, 1600);
    this.physics.world.setBounds(0, 0, 800, 1600);

    // A câmera segue o jogador 1
    //   this.cameras.main.startFollow(player, true, 0.5, 0.5);

  // Direcionais do teclado
  cursors = this.input.keyboard.createCursorKeys();
  //   up = this.input.keyboard.addKey("W");
  //   left = this.input.keyboard.addKey("A");
  //   right = this.input.keyboard.addKey("D");

  // Botão de ativar e desativar a tela cheia
  var button = this.add
    .image(800 - 5, 555, "fullscreen", 0)
    .setOrigin(1, 0)
    .setInteractive()
    .setScrollFactor(0);

  // Ao clicar no botão de tela cheia
  button.on(
    "pointerup",
    function () {
      if (this.scale.isFullscreen) {
        button.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

  // Tecla "F" também ativa e desativa a tela cheia
  var FKey = this.input.keyboard.addKey("F");
  FKey.on(
    "down",
    function () {
      if (this.scale.isFullscreen) {
        button.setFrame(0);
        this.scale.stopFullscreen();
      } else {
        button.setFrame(1);
        this.scale.startFullscreen();
      }
    },
    this
  );

    // Conectar no servidor via WebSocket
    this.socket = io();

    // Disparar evento quando jogador entrar na partida
    var self = this;
    var physics = this.physics;
    var cameras = this.cameras;
    var time = this.time;
    var socket = this.socket;

    this.socket.on("jogadores", function (jogadores) {
        if (jogadores.primeiro !== undefined && jogadores.segundo !== undefined) {
            doisJogadores = true;
            if (jogadores.primeiro === self.socket.id) {
                // Define jogador como o primeiro
                jogador = 1;

                // Personagens colidem com os limites da cena
                player.setCollideWorldBounds(true);

                // Detecção de colisão: plataformas
                physics.add.collider(player, blocos, null, null, this);

                // Detecção de colisão e disparo de evento: gemas
                // physics.add.overlap(player, stars, collectStar1, null, this);

                // Detecção de colisão e disparo de evento: espinhos
                // physics.add.collider(player, spikes, hitBomb1, null, this);

                // Câmera seguindo o personagem 1
                cameras.main.startFollow(player);

                // Remove a gravidade do oponente
                player2.body.setAllowGravity(false);
            } else if (jogadores.segundo === self.socket.id) {
                // Define jogador como o segundo
                jogador = 2;

                // Personagens colidem com os limites da cena
                player2.setCollideWorldBounds(true);

                // Detecção de colisão: plataformas
                physics.add.collider(player2, blocos, null, null, this);

                // Detecção de colisão e disparo de evento: gemas
                // physics.add.overlap(player2, stars, collectStar2, null, this);

                // Detecção de colisão e disparo de evento: espinhos
                // physics.add.collider(player2, spikes, hitBomb2, null, null, this);

                // Câmera seguindo o personagem 2
                cameras.main.startFollow(player2);

                // Remove a gravidade do oponente
                player.body.setAllowGravity(false);
            }
        } else {
            doisJogadores = false;
        }

        // Os dois jogadores estão conectados
        console.log(jogadores);
        if (jogadores.primeiro !== undefined && jogadores.segundo !== undefined) {
            // Contagem regressiva em segundos (3.000 milissegundos)
            timer = 3;
            timedEvent = time.addEvent({
                delay: 3000,
                callback: countdown,
                callbackScope: this,
                loop: true,
            });
        }
    });
    // Desenhar o outro jogador
    this.socket.on("desenharOutroJogador", ({ frame, x, y }) => {
        if (jogador === 1) {
            player2.setFrame(frame);
            player2.x = x;
            player2.y = y;
        } else if (jogador === 2) {
            player.setFrame(frame);
            player.x = x;
            player.y = y;
        }
    });
};

// Pontuação do jogador 1
// function collectStar1(player, star) {
    // star.disableBody(true, true);

    // score += 10;
    // scoreText.setText("Pontuação J1: " + score);
    // Ao coletar a gema, toca o efeito sonoro
    // audiogema.play();
// }

// Pontuação do jogador 2
// function collectStar2(player2, star) {
   // star.disableBody(true, true);

    // score += 10;
    // scoreText2.setText("Pontuação J2: " + score);
    // Ao coletar a gema, toca o efeito sonoro
    // audiogema.play();
// }

// Vida do jogador 1
function hitLaser1(player, laser) {
    // spikes.disableBody(false, false);

    // lives -= 1;
    // livesText.setText("Vidas J1: " + lives);
    // Ao colidir com o espinho, toca o efeito sonoro
   // audioespinho.play();
// }

// Vida do jogador 2
function hitLaser2(player2, laser) {
   // spikes.disableBody(false, false);

    // lives -= 1;
    // livesText2.setText("Vidas J2: " + lives);
    // Ao colidir com o espinho, toca o efeito sonoro
  //  audioespinho.play();
// }

cena1.update = function () {
    if (jogador === 1 && timer >= 0) {
        // if (jogador === 1 && doisJogadores === true) {
        if (cursors.left.isDown) {
            player.body.setVelocityX(-120);
            player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(120);
            player.anims.play("right", true);
        } else {
            player.body.setVelocityX(0);
            player.anims.play("stopped", true);
        }
        if (cursors.up.isDown && player.body.blocked.down) {
            player.body.setVelocityY(-400);
        }
        this.socket.emit("estadoDoJogador", {
            frame: player.anims.currentFrame.index,
            x: player.body.x + 15,
            y: player.body.y + 18,
        });
    } else if (jogador === 2 && timer >= 0) {
        if (cursors.left.isDown) {
            player2.body.setVelocityX(-120);
            player2.anims.play("left2", true);
            console.log(player2.anims.currentFrame.index);
        } else if (cursors.right.isDown) {
            player2.body.setVelocityX(120);
            player2.anims.play("right2", true);
            console.log(player2.anims.currentFrame.index);
        } else {
            player2.body.setVelocityX(0);
            player2.anims.play("stopped2", true);
        }
        if (cursors.up.isDown && player2.body.blocked.down) {
            player2.body.setVelocityY(-400);
        }
        this.socket.emit("estadoDoJogador", {
            frame: player2.anims.currentFrame.index,
            x: player2.body.x + 15,
            y: player2.body.y + 18,
        });
    }
};
// // Se o numero de vidas chegar a zero, inicia a cena 2
// if (lives <= 0) {
//   player.setTint(0xff0000);
//   this.scene.start(cena2);
//   lives = 3;
//   score = 0;
//   tema.pause(temaConfig);
// }

function countdown() {
    laser.y -= 10
    // Reduz o contador em 1 segundo
    timer -= 1;
    timerText.setText(timer);

    if (timer === 0) {
    // Adiciona o tempo de vida em 1 segundo
        life += 1;
        lifeText.setText(life);
    }    

    // Se o contador chegar a zero, inicia a cena 2
    else if (timer === -60) {
        tema.stop();
        this.scene.start(cena2);
    }
};

// Exportar a cena
export { cena1 };