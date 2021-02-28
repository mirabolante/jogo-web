// Importar a próxima cena
import { cena1 } from "./cena1.js";

// Criar a cena 0
var cena0 = new Phaser.Scene("Cena 0");

// Carregar a imagem de fundo
cena0.preload = function () {
    this.load.image("cena0", "assets/cena0.png");
};

// Criar botão com a imagem de fundo
cena0.create = function () {
    var button = this.add.image(400, 300, "cena0", 0).setInteractive();

    // Ao clicar no botão, inicia a cena 1
    button.on(
        "pointerdown",
        function () {
            this.scene.start(cena1);
        },
        this
    );
};

cena0.update = function () { };

// Exportar a cena 
export { cena0 };