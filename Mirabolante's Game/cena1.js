import { cena2 } from "./cena2.js";

var cena1 = new Phaser.Scene("Cena 1");

var map;
var tileset0;
var blocos;
var tileset1;
var ceu;
var player;
var player2;
var cursors;
var up;
var left;
var right;
var stars;
var spikes;
var audiogema;
var audioespinho;
var tema;
var temaConfig;
var score = 0;
var scoreText;
var scoreText2;
var lives = 3;
var livesText;
var livesText2;

cena1.preload = function () {
    this.load.image("blocos", "blocos.png");
    this.load.image("ceu", "ceu.png");
    this.load.tilemapTiledJSON("mapa", "mapa.json");
    //Jogador 1
    this.load.spritesheet("personagem", "personagem.png", {
        frameWidth: 29,
        frameHeight: 37,
    });
    //Jogador 2
    this.load.spritesheet("personagem2", "personagem2.png", {
        frameWidth: 29,
        frameHeight: 37,
    });
    this.load.image('gema', 'gema.png');
    this.load.image('espinho', 'espinho.png');
    this.load.audio("audiogema", "audiogema.mp3");
    this.load.audio("audioespinho", "audioespinho.mp3")
    this.load.audio("tema", "tema.mp3")
    //Tela cheia
    this.load.spritesheet("fullscreen", "fullscreen.png", {
        frameWidth: 40,
        frameHeight: 40,
    });
}

cena1.create = function () {
    tema = this.sound.add("tema");
    var temaConfig = {
        mute: false,
        volume: 0.5,
        loop: true
    }
    tema.play(temaConfig);

    audiogema = this.sound.add("audiogema");
    audioespinho = this.sound.add("audioespinho");

    map = this.make.tilemap({ key: "mapa" });
    tileset1 = map.addTilesetImage("ceu", "ceu");
    tileset0 = map.addTilesetImage("blocos", "blocos");
    ceu = map.createStaticLayer("ceu", tileset1, 0, 0);
    blocos = map.createStaticLayer("blocos", tileset0, 0, 0);

    //Personagens
    player = this.physics.add.sprite(65, 1492, "personagem");
    player2 = this.physics.add.sprite(728, 1492, "personagem2");

    player.setBounce(0.2);
    player2.setBounce(0.2);

    blocos.setCollisionByProperty({ collides: true });
    //Personagens colidem com os limites da cena
    player.setCollideWorldBounds(true);
    player2.setCollideWorldBounds(true);
    //Detecção de colisão nas plataformas
    this.physics.add.collider(player, blocos);
    this.physics.add.collider(player2, blocos);

    //Animação do jogador 1 para a esquerda
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("personagem", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1,
    });

    //Animação do jogador 2 para a esquerda
    this.anims.create({
        key: "left2",
        frames: this.anims.generateFrameNumbers("personagem2", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1,
    });

    //Animação do jogador 1 para a direita
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("personagem", { start: 4, end: 5 }),
        frameRate: 3,
        repeat: -1,
    });

    //Animação do jogador 2 para a direita
    this.anims.create({
        key: "right2",
        frames: this.anims.generateFrameNumbers("personagem2", { start: 4, end: 5 }),
        frameRate: 3,
        repeat: -1,
    });

    //Animação do jogador 1 parado para a esquerda
    this.anims.create({
        key: "stopped",
        frames: [{ key: "personagem", frame: 3 }],
        frameRate: 20,
    });

    //Animação do jogador 2 parado para a esquerda
    this.anims.create({
        key: "stopped2",
        frames: [{ key: "personagem2", frame: 3 }],
        frameRate: 20,
    });

    //Gravidade dos jogadores
    player.body.setGravityY(450);
    player2.body.setGravityY(450);

    stars = this.physics.add.group({
        key: 'gema',
        repeat: 0,
        setXY: { x: 550, y: 1320, stepX: 100 },
    });

    //Detecção de colisão e disparo de evento entre personagens e os itens coletáveis
    this.physics.add.collider(stars, blocos);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player2, stars, collectStar, null, this);

    spikes = this.physics.add.group({
        key: 'espinho',
        repeat: 2,
        setXY: { x: 300, y: 1460, stepX: 170 },
    });

    //Detecção de colisão e disparo de evento entre personagens e os espinhos
    this.physics.add.collider(spikes, blocos);
    this.physics.add.collider(player, spikes, hitBomb1, null, this);
    this.physics.add.collider(player2, spikes, hitBomb2, null, this);

    scoreText = this.add.text(10, 10, 'Pontuação J1: 0', { fontSize: '25px', fill: 'white' });
    scoreText.setScrollFactor(0);

    scoreText2 = this.add.text(550, 10, 'Pontuação J2: 0', { fontSize: '25px', fill: 'white' });
    scoreText2.setScrollFactor(0);

    livesText = this.add.text(10, 40, 'Vidas J1: 3', { fontSize: '25px', fill: 'white' });
    livesText.setScrollFactor(0);

    livesText2 = this.add.text(600, 40, 'Vidas J2: 3', { fontSize: '25px', fill: 'white' });
    livesText2.setScrollFactor(0);

    this.cameras.main.setBounds(0, 0, 800, 1600);
    this.physics.world.setBounds(0, 0, 800, 1600);
    //A câmera segue somente o jogador 1
    this.cameras.main.startFollow(player, true, 0.5, 0.5);

    // Direcionais do teclado
    cursors = this.input.keyboard.createCursorKeys();
    up = this.input.keyboard.addKey("W");
    left = this.input.keyboard.addKey("A");
    right = this.input.keyboard.addKey("D");

    //Botão de ativar e desativar a tela cheia
    var button = this.add
        .image(800 - 10, 550, "fullscreen", 0)
        .setOrigin(1, 0)
        .setInteractive()
        .setScrollFactor(0);

    //Ao clicar no botão de tela cheia
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

    //Tecla "F" também ativa e desativa a tela cheia
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
}


//Pontuação dos jogadores
function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Pontuação J1: ' + score);
    audiogema.play();
}

//Vida dos jogadores
function hitBomb1(player, spikes) {
    spikes.disableBody(false, false);

    lives -= 1;
    livesText.setText('Vidas J1: ' + lives);
    audioespinho.play();
}

function hitBomb2(player2, spikes) {
    spikes.disableBody(false, false);

    lives -= 1;
    livesText2.setText('Vidas J2: ' + lives);
    audioespinho.play();
}

cena1.update = function () {
    //Controle do jogador 1: WAD
    if (left.isDown) {
        player.setVelocityX(-120);

        player.anims.play("left", true);
    } else if (right.isDown) {
        player.setVelocityX(120);

        player.anims.play("right", true);
    } else {
        player.setVelocityX(0);

        player.anims.play("stopped");
    }
    if (up.isDown && player.body.blocked.down) {
        player.setVelocityY(-400);
    }

    //Controle do jogador 2: direcionais
    if (cursors.left.isDown) {
        player2.setVelocityX(-120);

        player2.anims.play("left2", true);
    } else if (cursors.right.isDown) {
        player2.setVelocityX(120);

        player2.anims.play("right2", true);
    } else {
        player2.setVelocityX(0);

        player2.anims.play("stopped2");
    }
    if (cursors.up.isDown && player2.body.blocked.down) {
        player2.setVelocityY(-400);
    }

    if (lives <= 0) {
        player.setTint(0xff0000);
        this.scene.start(cena2);
        lives = 3
        score = 0
        tema.pause(temaConfig);
    }
}

export { cena1 };