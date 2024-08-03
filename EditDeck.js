class EditDeck extends Phaser.Scene {
    constructor() {
        super({ key: 'EditDeck' });
    }

    preload() {
        // Cargar JSON con las cartas Hero
        this.load.json('heroCards', 'path/to/HEROS.json');
    }

    create() {
        // Obtener los datos del JSON
        const heroCards = this.cache.json.get('heroCards');

        let y = 50;

        heroCards.forEach(card => {
            // Crear una imagen para cada carta
            this.add.image(400, y, 'path/to/images/' + card.card_images[0].image_url.split('/').pop())
                .setOrigin(0.5)
                .setDisplaySize(100, 150);
            y += 160; // Ajusta el espaciado según sea necesario
        });

        // Agregar botón para volver al menú principal
        const backButton = this.add.sprite(50, 50, 'button').setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Agregar texto al botón
        this.add.text(50, 40, 'Volver', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    }
}
