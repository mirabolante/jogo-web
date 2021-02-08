import { cena1 } from "./cena1.js";

var cena0 = new Phaser.Scene("Cena 0");

cena0.preload = function () {
    this.load.image("cena0", "cena0.png");
};

cena0.create = function () {
    var button = this.add.image(400, 300, "cena0", 0).setInteractive();

    button.on(
        "pointerdown",
        function () {
            this.scene.start(cena1);
        },
        this
    );
};

cena0.update = function () { };

export { cena0 };