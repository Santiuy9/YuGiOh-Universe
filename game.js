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

// Definir la escena EditDeck
class EditDeck extends Phaser.Scene {
    constructor() {
        super({ key: 'EditDeck' });
    }

    preload() {
        this.load.json('herosData', 'jasons_y_scripts/Heroes.json');
        this.load.image('Background', 'assets/background.png');

        // Cargar imágenes desde JSON
        this.load.once('filecomplete-json-herosData', (key, type, data) => {
            if (data && Array.isArray(data.data)) {
                data.data.slice(0, 100).forEach(card => {
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

        const containerHeight = (imageHeight + offset) * 30;
        const listCardBackground = this.add.graphics();
        listCardBackground.fillStyle(0x000000, 0.5);
        listCardBackground.fillRect(0, 0, imageWidth + 20, containerHeight);

        container.add(listCardBackground);

        // Crear contenedor para imágenes duplicadas y detalles con fondo
        const duplicateBackground = this.add.graphics();
        duplicateBackground.fillStyle(0x000000, 0.5); // Color negro con transparencia
        duplicateBackground.fillRect(25, 25, 250, 650); // Ajusta el tamaño del fondo según el contenedor
        const duplicateContainer = this.add.container(25, 25);
        // duplicateContainer.add(duplicateBackground);

        // Crear nuevo contenedor para soltar las cartas
        const dropZoneContainer = this.add.container(300, 25);
        const dropZoneBackground = this.add.graphics();
        dropZoneBackground.fillStyle(0x000000, 0.5); // Fondo verde con transparencia
        dropZoneBackground.fillRect(0, 0, 675, 650); // Ajusta el tamaño del contenedor
        dropZoneContainer.add(dropZoneBackground);

        if (herosData && Array.isArray(herosData)) {
            let y = 100;

            herosData.slice(0, 57).forEach(card => {
                const image = this.add.image(60, y, card.id.toString());
                image.setDisplaySize(imageWidth, imageHeight);
                image.setOrigin(0.5);
                image.setInteractive({ draggable: true }); // Habilitar arrastre

                let nameBox;
                let attributeBox;
                let levelBox;
                let typeBox;
                let descriptionBox;
                let attackBox;
                let defenseBox;

                let miTween;
                // Agregar eventos para el mouse
                image.on('pointerover', () => {
                    const cardName = card.name;
                    const cardAttribute = card.attribute;
                    const cardLevel = card.level;
                    const cardType = card.type;
                    const cardDescription = card.desc;
                    const cardAttack = card.atk;
                    const cardDefense = card.def;

                    nameBox = this.add.text(125, 25, cardName, {
                        fontSize: '20px',
                        fill: '#fff',
                    }).setOrigin(0.5);
                    attributeBox = this.add.text(240, 355, cardAttribute, {
                        fontSize: '16px',
                        fill: '#fff',
                    }).setOrigin(1, 0);
                    typeBox = this.add.text(125, 380, cardType, {
                        fontSize: '16px',
                        fill: '#fff'
                    }).setOrigin(0.5);
                    levelBox = cardType == 'spell card' || cardType == 'trap card' ? null : this.add.text(10, 355, `Level ${cardLevel}`, {
                        fontSize: '16px',
                        fill: '#fff',
                    }).setOrigin(0);
                    descriptionBox = this.add.text(10, 390, cardDescription, {
                        fontSize: '12px',
                        fill: '#fff',
                        wordWrap: { width: 240 }
                    }).setOrigin(0);
                    attackBox = cardType == 'spell card' || cardType == 'trap card' ? null : this.add.text(10, 630, `ATK: ${cardAttack}`, {
                        fontSize: '16px',
                        fill: '#fff',
                    }).setOrigin(0);
                    defenseBox = card.type == 'spell card' || cardType == 'trap card' ? null : this.add.text(160, 630, `DEF: ${cardDefense}`, {
                        fontSize: '16px',
                        fill: '#fff',
                    }).setOrigin(0);

                    duplicateContainer.add(nameBox);
                    duplicateContainer.add(attributeBox);
                    duplicateContainer.add(levelBox);
                    duplicateContainer.add(typeBox);
                    duplicateContainer.add(descriptionBox);
                    duplicateContainer.add(attackBox);
                    duplicateContainer.add(defenseBox);

                    miTween = this.tweens.add({
                        targets: image,
                        displayWidth: imageWidth * 1.3,
                        displayHeight: imageHeight * 1.3,
                        yoyo: true,
                        repeat: -1,
                        duration: 500,
                        ease: 'Sine.easeInOut'
                    });

                    // Duplicar la imagen y agregarla al contenedor de duplicados
                    const duplicateImage = this.add.image(125, 200, card.id.toString());
                    duplicateImage.setDisplaySize(imageWidth * 2, imageHeight * 2);
                    duplicateImage.setOrigin(0.5);
                    duplicateContainer.add(duplicateImage);
                });

                image.on('pointerout', () => {
                    miTween.stop();
                    image.setDisplaySize(imageWidth, imageHeight);
                    // Limpiar las imágenes duplicadas y los detalles al salir del hover
                    duplicateContainer.removeAll(true);
                });

                // Manejar el arrastre
                image.on('dragstart', (pointer, dragX, dragY) => { 
                    image.setData('originalX', image.x);
                    image.setData('originalY', image.y);
                });

                image.on('drag', (pointer, dragX, dragY) => {
                    image.x = dragX;
                    image.y = dragY;
                });

                image.on('dragend', (pointer, dragX, dragY) => {
                    const dropZoneBounds = dropZoneContainer.getBounds();
                    if (Phaser.Geom.Rectangle.Contains(dropZoneBounds, dragX, dragY)) {
                        image.x = 200; // Coordenada fija dentro del nuevo contenedor
                        image.y = 300; // Coordenada fija dentro del nuevo contenedor
                        dropZoneContainer.add(image);
                    } else {
                        image.x = image.getData('originalX');
                        image.y = image.getData('originalY');
                    }
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
            if (container.y < 600 - containerHeight + 150) {
                container.y = 600 - containerHeight + 175;
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 700,
    scene: [EditDeck, MainMenu],
};

const game = new Phaser.Game(config);
