var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            //   debug: true,
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image("blocos", "blocos.png");
    this.load.image("ceu", "ceu.png");
    this.load.tilemapTiledJSON("mapa", "mapa.json");
    this.load.spritesheet("personagem", "personagem.png", {
        frameWidth: 29,
        frameHeight: 37,
    });
    this.load.image('gema', 'gema.png');
    this.load.image('espinho', 'espinho.png');
    this.load.audio("audiogema", "audiogema.mp3");
}

var score = 0;
var scoreText;

var lives = 3;
var livesText;

function create() {
    const audiogema = this.sound.add("audiogema");

    const map = this.make.tilemap({ key: "mapa" });
    const tileset1 = map.addTilesetImage("ceu", "ceu");
    const tileset0 = map.addTilesetImage("blocos", "blocos");
    const ceu = map.createStaticLayer("ceu", tileset1, 0, 0);
    const blocos = map.createStaticLayer("blocos", tileset0, 0, 0);

    player = this.physics.add.sprite(100, 1500, "personagem");

    player.setBounce(0.2);

    blocos.setCollisionByProperty({ collides: true });
    //   const debugGraphics = this.add.graphics().setAlpha(0.75);
    //   blocos.renderDebug(debugGraphics, {
    //     tileColor: null,
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    //   });
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, blocos);

    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("personagem", { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1,
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("personagem", { start: 4, end: 5 }),
        frameRate: 3,
        repeat: -1,
    });

    this.anims.create({
        key: "stopped",
        frames: [{ key: "personagem", frame: 3 }],
        frameRate: 20,
    });

    player.body.setGravityY(450);

    stars = this.physics.add.group({
        key: 'gema',
        repeat: 0,
        setXY: { x: 120, y: 303 },
    });

    this.physics.add.collider(stars, blocos);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    spikes = this.physics.add.group({
        key: 'espinho',
        repeat: 2,
        setXY: { x: 106, y: 184, stepX: 200 },
    });

    this.physics.add.collider(spikes, blocos);
    this.physics.add.collider(player, spikes, hitBomb, null, this);

    scoreText = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '25px', fill: '#000000' });
    livesText = this.add.text(16, this.sys.game.config.height - 550, 'Vidas: 3', { fontSize: '25px', fill: '#000000' });

    this.cameras.main.setBounds(0, 0, 800, 1600);
    this.physics.world.setBounds(0, 0, 800, 1600);
    this.cameras.main.startFollow(player, true, 0.5, 0.5);

    cursors = this.input.keyboard.createCursorKeys();
}

function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Pontuação: ' + score);
}

function hitBomb(player, spikes) {
    spikes.disableBody(false, false);

    lives -= 1;
    livesText.setText('Vidas: ' + lives);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-120);

        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(120);

        player.anims.play("right", true);
    } else {
        player.setVelocityX(0);

        player.anims.play("stopped");
    }

    //  if (cursors.up.isDown && player.body.touching.down) {
    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-400);
    }

    if (lives <= 0) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('stopped');
    }
}

function collectStar(player, star) {
    audiogema.play();
}
