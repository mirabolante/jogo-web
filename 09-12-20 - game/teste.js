var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('blocos', 'blocos.png');
    this.load.image('ceu', 'ceu.png');
    this.load.tilemapTiledJSON('mapa', 'mapa.json');
    this.load.spritesheet('personagem', 'personagem.png', { frameWidth: 29, frameHeight: 37 });
}

function create() {
    const map = this.make.tilemap({ key: 'mapa' });
    const tileset0 = map.addTilesetImage('blocos', 'blocos');
    const tileset1 = map.addTilesetImage('ceu', 'ceu');
    const blocos = map.createStaticLayer('blocos', tileset0, 0, 0);
    const ceu = map.createStaticLayer('ceu', tileset1, 0, 0);

    player = this.physics.add.sprite(100, 450, 'personagem');

    player.setBounce(0.2);

    blocos.setCollisionByProperty({ collides: true });
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, blocos);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('personagem', { start: 4, end: 5 }),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: 'stopped',
        frames: [{ key: 'personagem', frame: 3 }],
        frameRate: 20
    });

    player.body.setGravityY(300);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-120);

        player.anims.play("left", true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(120);

        player.anims.play("right", true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('stopped');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}