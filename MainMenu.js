// Definir la escena Principal (MainMenu)
class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Pre-cargar recursos si es necesario
        this.load.image('button', 'assets/button_go.png');
    }

    create() {
        this.add.text(750, 200, 'Main Menu', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Crear botón para ir a la escena EditDeck
        const editDeckButton = this.add.sprite(750, 350, 'button').setScale(0.2).setInteractive();

        editDeckButton.on('pointerdown', () => {
            this.scene.start('EditDeck');
        });

        // Agregar texto al botón
        this.add.text(750, 290, 'Editar Deck', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    }
}