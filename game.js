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
        this.add.text(600, 200, 'Main Menu', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Crear botón para ir a la escena EditDeck
        const editDeckButton = this.add.sprite(600, 350, 'button').setScale(0.2).setInteractive();

        editDeckButton.on('pointerdown', () => {
            this.scene.start('EditDeck');
        });

        // Agregar texto al botón
        this.add.text(600, 290, 'Editar Deck', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    }
}

// Definir la escena EditDeck
class EditDeck extends Phaser.Scene {
    constructor() {
        super({ key: 'EditDeck' });
    }

    preload() {
        this.load.json('herosData', 'HEROS.json');
        this.load.image('Background', 'assets/background.png');

        // Cargar imágenes desde JSON
        this.load.once('filecomplete-json-herosData', (key, type, data) => {
            if (data && Array.isArray(data.data)) {
                data.data.slice(0, 10).forEach(card => {
                    const imageUrl = card.card_images[0].image_url;
                    this.load.image(card.id.toString(), imageUrl);
                });
            } else {
                console.error('Error al cargar los datos del JSON o los datos están vacíos.');
            }
        }, this);
    }

    create() {
        const background = this.add.image(0, 0, 'Background').setOrigin(0).setScale(0.6);
        const backgroundWidth = 1500;
        const backgroundHeight = 700;
        background.setDisplaySize(backgroundWidth, backgroundHeight);

        const herosData = this.cache.json.get('herosData').data;
        const container = this.add.container(1000, 25);
        const imageWidth = 100;
        const imageHeight = 150;
        const offset = 180;

        const containerHeight = (imageHeight + offset) * 10;
        const listCardBackground = this.add.graphics();
        listCardBackground.fillStyle(0x8a2be2, 0.75);
        listCardBackground.fillRect(0, 0, imageWidth + 20, containerHeight);

        container.add(listCardBackground);

        // Crear contenedor para imágenes duplicadas con fondo
        const duplicateContainer = this.add.container(25, 25);
        const duplicateBackground = this.add.graphics();
        duplicateBackground.fillStyle(0x000000, 0.5); // Color negro con transparencia
        duplicateBackground.fillRect(0, 0, 250, 650); // Ajusta el tamaño del fondo según el contenedor
        duplicateContainer.add(duplicateBackground);

        if (herosData && Array.isArray(herosData)) {
            let y = 100;

            herosData.slice(0, 10).forEach(card => {
                const image = this.add.image(60, y, card.id.toString());
                image.setDisplaySize(imageWidth, imageHeight);
                image.setOrigin(0.5);
                image.setInteractive({ draggable: true }); // Habilitar arrastre

                // Agregar eventos para el mouse
                image.on('pointerover', () => {
                    this.tweens.add({
                        targets: image,
                        displayWidth: imageWidth * 1.3,
                        displayHeight: imageHeight * 1.3,
                        duration: 300,
                        ease: 'Power2'
                    });

                    // Duplicar la imagen y agregarla al contenedor de duplicados
                    const duplicateImage = this.add.image(25, 25, card.id.toString());
                    duplicateImage.setDisplaySize(imageWidth * 2, imageHeight * 2);
                    duplicateImage.setOrigin(0.5);
                    // duplicateImage.setAlpha(0.5); // Opcional: cambiar opacidad para distinguir
                    duplicateContainer.add(duplicateImage);

                    // Posicionar la imagen duplicada en el centro del contenedor de duplicados
                    duplicateImage.x = 125;
                    duplicateImage.y = 225;
                });

                image.on('pointerout', () => {
                    this.tweens.add({
                        targets: image,
                        displayWidth: imageWidth,
                        displayHeight: imageHeight,
                        duration: 300,
                        ease: 'Power2'
                    });

                    // Limpiar las imágenes duplicadas al salir del hover
                    // duplicateContainer.removeAll();
                });

                image.on('pointerdown', () => this.showCardDetails(card));

                // Manejar el arrastre
                image.on('dragstart', (pointer, dragX, dragY) => {
                    // image.setAlpha(0.5);
                });

                image.on('drag', (pointer, dragX, dragY) => {
                    image.x = dragX;
                    image.y = dragY;
                });

                image.on('dragend', (pointer, dragX, dragY) => {
                    // image.setAlpha(1);
                });

                container.add(image);
                y += offset;
            });
        } else {
            console.error('Error al cargar los datos del JSON o los datos están vacíos.');
        }

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            container.y -= deltaY / 1;
            if (container.y > 50) {
                container.y = 25;
            }
            if (container.y < 600 - containerHeight + 50) {
                container.y = 600 - containerHeight + 75;
            }
        });
    }

    showCardDetails(card) {
        const detailContainer = this.add.container(400, 300);
        const detailBackground = this.add.graphics();
        detailBackground.fillStyle(0x000000, 0.7);
        detailBackground.fillRect(-150, -75, 300, 150);

        const detailText = `Nombre: ${card.name}\nTipo: ${card.type}\nDescripción: ${card.desc}`;
        const detailBox = this.add.text(0, 0, detailText, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { left: 10, right: 10, top: 10, bottom: 10 },
        }).setOrigin(0.5);

        const closeButton = this.add.text(0, 60, 'Cerrar', {
            fontSize: '16px',
            fill: '#ff0000',
            backgroundColor: '#fff',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        }).setOrigin(0.5).setInteractive();

        closeButton.on('pointerdown', () => {
            detailContainer.destroy();
        });

        detailContainer.add([detailBackground, detailBox, closeButton]);

        this.time.delayedCall(5000, () => {
            detailContainer.destroy();
        }, [], this);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 700,
    scene: [MainMenu, EditDeck],
};

const game = new Phaser.Game(config);

