class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Pre-cargar recursos si es necesario
        this.load.image('button', 'path/to/button.png');
    }

    create() {
        this.add.text(400, 200, 'Main Menu', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Crear botón para ir a la escena EditDeck
        const editDeckButton = this.add.sprite(400, 300, 'button').setInteractive();

        editDeckButton.on('pointerdown', () => {
            this.scene.start('EditDeck');
        });

        // Agregar texto al botón
        this.add.text(400, 290, 'Editar Deck', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    }
}
