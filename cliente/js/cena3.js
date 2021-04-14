// Importar a próxima cena
import { cena1 } from "./cena1.js";

// Criar a cena 2
var cena3 = new Phaser.Scene("Cena 3");

// Carregar a imagem de fundo
cena3.preload = function () {
    this.load.image("cena3", "assets/cena3.png");
};

// Criar botão com a imagem de fundo
cena3.create = function () {
    var button = this.add.image(400, 300, "cena3", 0).setInteractive();

    // Ao clicar no botão, retorna para a cena 1
    button.on(
        "pointerdown",
        function () {
            this.scene.start(cena1);
        },
        this
    );
};

cena3.update = function () { };

// Exportar a cena
export { cena3 };