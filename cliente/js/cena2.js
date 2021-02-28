// Importar a próxima cena
import { cena1 } from "./cena1.js";

// Criar a cena 2
var cena2 = new Phaser.Scene("Cena 2");

// Carregar a imagem de fundo
cena2.preload = function () {
    this.load.image("cena2", "assets/cena2.png");
};

// Criar botão com a imagem de fundo
cena2.create = function () {
    var button = this.add.image(400, 300, "cena2", 0).setInteractive();

    // Ao clicar no botão, retorna para a cena 1
    button.on(
        "pointerdown",
        function () {
            this.scene.start(cena1);
        },
        this
    );
};

cena2.update = function () { };

// Exportar a cena
export { cena2 };