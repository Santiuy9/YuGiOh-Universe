// game.js

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
        this.add.text(400, 200, 'Main Menu', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Crear botón para ir a la escena EditDeck
        const editDeckButton = this.add.sprite(400, 350, 'button').setScale(0.2).setInteractive();

        editDeckButton.on('pointerdown', () => {
            this.scene.start('EditDeck');
        });

        // Agregar texto al botón
        this.add.text(400, 290, 'Editar Deck', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    }
}

// Definir la escena EditDeck
class EditDeck extends Phaser.Scene {
    constructor() {
        super({ key: 'EditDeck' });
    }

    preload() {
        this.load.json('herosData', 'HEROS.json');

        // Cargar imágenes desde JSON
        this.load.once('filecomplete-json-herosData', (key, type, data) => {
            if (data && Array.isArray(data.data)) {
                data.data.slice(0, 4).forEach(card => {
                    const imageUrl = card.card_images[0].image_url;
                    this.load.image(card.id.toString(), imageUrl);
                });
            } else {
                console.error('Error al cargar los datos del JSON o los datos están vacíos.');
            }
        }, this);
    }

    create() {
        const herosData = this.cache.json.get('herosData').data;
        let x = 300;
        let y = 50;
        const offset = 150;

        if (herosData && Array.isArray(herosData)) {
            herosData.slice(0, 4).forEach(card => {
                this.add.image(x, y, card.id.toString()).setScale(0.3);
                y += offset;
                if (x > this.cameras.main.width - offset) {
                    x = 50;
                    x += offset;
                }
            });
        } else {
            console.error('Error al cargar los datos del JSON o los datos están vacíos.');
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenu, EditDeck],
};

const game = new Phaser.Game(config);


