// Importar a próxima cena
import { cena2 } from "./cena2.js";
import { cena3 } from "./cena3.js";

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
var pointer;
var touchX;
var touchY;
var timedEvent;
var timer;
var life = 0;
var lifeText;
var laser;
var estrela;
var audioestrela;
var audiolaser;
var tema;
var temaConfig;
var jogador;
var doisJogadores = false;
var ice_servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
var localConnection;
var remoteConnection;
var midias;
const audio = document.querySelector("audio");

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

    // Estrela
    this.load.image("estrela", "assets/estrela.png");

    // Efeitos sonoros
    this.load.audio("audioestrela", "assets/audioestrela.mp3");
    this.load.audio("audiolaser", "assets/audiolaser.mp3");

    // Trilha sonora
    this.load.audio("tema", "assets/tema.mp3");

    // Tela cheia
    this.load.spritesheet("fullscreen", "assets/fullscreen.png", {
        frameWidth: 40,
        frameHeight: 40,
    });

    // Toque na tela
    this.load.spritesheet("esquerda", "assets/esquerda.png", {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.spritesheet("direita", "assets/direita.png", {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.spritesheet("cima", "assets/cima.png", {
        frameWidth: 64,
        frameHeight: 64
    });
};

cena1.create = function () {
    // Trilha sonora
    tema = this.sound.add("tema");
    var temaConfig = {
        mute: false,
        volume: 0.1,
        loop: true,
    };
    tema.play(temaConfig);

    // Efeitos sonoros
    audioestrela = this.sound.add("audioestrela");
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
    player = this.physics.add.sprite(313, 1430, "personagem");
    player2 = this.physics.add.sprite(490, 1430, "personagem2");

    // Remove (inicialmente) a gravidade dos jogadores
    player.body.setAllowGravity(false);
    player2.body.setAllowGravity(false);

    // Laser, cria-se um objeto
    laser = this.physics.add.sprite(400, 1550, "laser");

    // Remove a gravidade do laser (objeto)
    laser.body.setAllowGravity(false);

    // Estrela, cria-se um objeto
    estrela = this.physics.add.sprite(645, 40, "estrela");

    // Remove a gravidade da estrela (objeto)
    estrela.body.setAllowGravity(false);

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

    // Direcionais do teclado
    cursors = this.input.keyboard.createCursorKeys();
    // Touch
    pointer = this.input.addPointer(1);

    // Controle direcional por toque na tela
    var esquerda = this.add
        .image(660, 550, "esquerda", 0)
        .setInteractive()
        .setScrollFactor(0);

    var direita = this.add
        .image(750, 550, "direita", 0)
        .setInteractive()
        .setScrollFactor(0);

    var cima = this.add
        .image(50, 550, "cima", 0)
        .setInteractive()
        .setScrollFactor(0);

    this.physics.add.collider(player, laser, hitLaser, null, this);
    this.physics.add.collider(player2, laser, hitLaser, null, this);

    this.physics.add.collider(player, estrela, hitEstrela, null, this);
    this.physics.add.collider(player2, estrela, hitEstrela, null, this);

    // Mostra há quanto tempo estão jogando (a vida dos jogadores)
    lifeText = this.add.text(400, 10, life, {
        fontSize: "25px",
        fill: "white",
    });
    lifeText.setScrollFactor(0);

    // Cena (800x1600) maior que a tela (800x600)
    this.cameras.main.setBounds(0, 0, 800, 1600);
    this.physics.world.setBounds(0, 0, 800, 1600);

    // Botão de ativar e desativar a tela cheia
    var button = this.add
        .image(60, 20, "fullscreen", 0)
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
        if (jogadores.primeiro === self.socket.id) {
            // Define jogador como o primeiro
            jogador = 1;

            esquerda.on("pointerover", () => {
                esquerda.setFrame(1);
                player.setVelocityX(-120);
                player.anims.play("left", true);
            });
            esquerda.on("pointerout", () => {
                esquerda.setFrame(0);
                player.setVelocityX(0);
                player.anims.play("stopped", true);
            });

            direita.on("pointerover", () => {
                direita.setFrame(1);
                player.setVelocityX(120);
                player.anims.play("right", true);
            });
            direita.on("pointerout", () => {
                direita.setFrame(0);
                player.setVelocityX(0);
                player.anims.play("stopped", true);
            });

            cima.on("pointerover", () => {
                cima.setFrame(1);
                if (player.body.blocked.down) {
                    player.setVelocityY(-260);
                }
            });
            cima.on("pointerout", () => {
                cima.setFrame(0);
            });

            // Câmera seguindo o personagem 1
            cameras.main.startFollow(player);

            // Ativa a gravidade do jogador
            player.body.setAllowGravity(true);

            navigator.mediaDevices
                .getUserMedia({ video: false, audio: true })
                .then((stream) => {
                    midias = stream;
                    console.log(midias);
                })
                .catch((error) => console.log(error));
        } else if (jogadores.segundo === self.socket.id) {
            // Define jogador como o segundo
            jogador = 2;

            esquerda.on("pointerover", () => {
                esquerda.setFrame(1);
                player2.setVelocityX(-120);
                player2.anims.play("left2", true);
            });
            esquerda.on("pointerout", () => {
                esquerda.setFrame(0);
                player2.setVelocityX(0);
                player2.anims.play("stopped2", true);
            });

            direita.on("pointerover", () => {
                direita.setFrame(1);
                player2.setVelocityX(120);
                player2.anims.play("right2", true);
            });
            direita.on("pointerout", () => {
                direita.setFrame(0);
                player2.setVelocityX(0);
                player2.anims.play("stopped2", true);
            });

            cima.on("pointerover", () => {
                cima.setFrame(1);
                if (player2.body.blocked.down) {
                    player2.setVelocityY(-260);
                }
            });
            cima.on("pointerout", () => {
                cima.setFrame(0);
            });

            // Câmera seguindo o personagem 2
            cameras.main.startFollow(player2);

            // Ativa a gravidade do jogador
            player2.body.setAllowGravity(true);

            navigator.mediaDevices
                .getUserMedia({ video: false, audio: true })
                .then((stream) => {
                    midias = stream;
                    localConnection = new RTCPeerConnection(ice_servers);
                    midias
                        .getTracks()
                        .forEach((track) => localConnection.addTrack(track, midias));
                    localConnection.onicecandidate = ({ candidate }) => {
                        candidate &&
                            socket.emit("candidate", jogadores.primeiro, candidate);
                    };
                    console.log(midias);
                    localConnection.ontrack = ({ streams: [midias] }) => {
                        audio.srcObject = midias;
                    };
                    localConnection
                        .createOffer()
                        .then((offer) => localConnection.setLocalDescription(offer))
                        .then(() => {
                            socket.emit(
                                "offer",
                                jogadores.primeiro,
                                localConnection.localDescription
                            );
                        });
                })
                .catch((error) => console.log(error));
        }

        if (jogadores.primeiro !== undefined && jogadores.segundo !== undefined) {
            doisJogadores = true;
            timer = 60;
            timedEvent = time.addEvent({
                delay: 1000,
                callback: countdown,
                callbackScope: this,
                loop: true,
            });
        } else {
            doisJogadores = false;
        }
    });

    this.socket.on("offer", (socketId, description) => {
        remoteConnection = new RTCPeerConnection(ice_servers);
        midias
            .getTracks()
            .forEach((track) => remoteConnection.addTrack(track, midias));
        remoteConnection.onicecandidate = ({ candidate }) => {
            candidate && socket.emit("candidate", socketId, candidate);
        };
        remoteConnection.ontrack = ({ streams: [midias] }) => {
            audio.srcObject = midias;
        };
        remoteConnection
            .setRemoteDescription(description)
            .then(() => remoteConnection.createAnswer())
            .then((answer) => remoteConnection.setLocalDescription(answer))
            .then(() => {
                socket.emit("answer", socketId, remoteConnection.localDescription);
            });
    });

    socket.on("answer", (description) => {
        localConnection.setRemoteDescription(description);
    });

    socket.on("candidate", (candidate) => {
        const conn = localConnection || remoteConnection;
        conn.addIceCandidate(new RTCIceCandidate(candidate));
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

cena1.update = function () {
    if (jogador === 1 && doisJogadores === true) {
        this.socket.emit("estadoDoJogador", {
            frame: () => {
                try {
                    player.anims.currentFrame.index;
                } catch (e) {
                    return 0;
                }
            },
            x: player.body.x + 15,
            y: player.body.y + 18,
        });
    } else if (jogador === 2 && doisJogadores === true) {
        this.socket.emit("estadoDoJogador", {
            frame: () => {
                try {
                    player2.anims.currentFrame.index;
                } catch (e) {
                    return 0;
                }
            },
            x: player2.body.x + 15,
            y: player2.body.y + 18,
        });
    }
};

function countdown() {
    // O laser sobre 15 pixels no eixo Y
    laser.y -= 15;

    // Reduz o contador em 1 segundo
    timer -= 1;

    // Adiciona o tempo de vida em 1 segundo
    life += 1;
    lifeText.setText(life);
}

function hitEstrela(player, estrela) {
    audioestrela.play();
    tema.stop();
    this.scene.start(cena3);
}

function hitLaser(player, laser) {
    audiolaser.play();
    tema.stop();
    player.setTint(0xff0000);
    this.scene.start(cena2);
}

// Exportar a cena
export { cena1 };
