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
                data.data.slice(0, 30).forEach(card => {
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
        listCardBackground.fillStyle(0x000000, 0.5);
        listCardBackground.fillRect(0, 0, imageWidth + 20, containerHeight);

        container.add(listCardBackground);

        // Crear contenedor para imágenes duplicadas y detalles con fondo
        const duplicateBackground = this.add.graphics();
        duplicateBackground.fillStyle(0x000000, 0.5); // Color negro con transparencia
        duplicateBackground.fillRect(25, 25, 250, 650); // Ajusta el tamaño del fondo según el contenedor
        const duplicateContainer = this.add.container(25, 25);
        // duplicateContainer.add(duplicateBackground);

        if (herosData && Array.isArray(herosData)) {
            let y = 100;

            herosData.slice(0, 30).forEach(card => {
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

                    this.tweens.add({
                        targets: image,
                        displayWidth: imageWidth * 1.3,
                        displayHeight: imageHeight * 1.3,
                        duration: 300,
                        ease: 'Power2'
                    });

                    // Duplicar la imagen y agregarla al contenedor de duplicados
                    const duplicateImage = this.add.image(125, 200, card.id.toString());
                    duplicateImage.setDisplaySize(imageWidth * 2, imageHeight * 2);
                    duplicateImage.setOrigin(0.5);
                    duplicateContainer.add(duplicateImage);

                    // Mostrar detalles de la carta en el contenedor de duplicados
                    // this.showCardDetails(card, duplicateContainer);
                });

                image.on('pointerout', () => {
                    this.tweens.add({
                        targets: image,
                        displayWidth: imageWidth,
                        displayHeight: imageHeight,
                        duration: 300,
                        ease: 'Power2'
                    });

                    // Limpiar las imágenes duplicadas y los detalles al salir del hover
                    duplicateContainer.removeAll(true);
                    // duplicateContainer.removeAll(nameBox);
                    // duplicateContainer.removeAll(attributeBox);
                    // duplicateContainer.removeAll(levelBox);
                    // duplicateContainer.removeAll(typeBox);
                    // duplicateContainer.removeAll(descriptionBox);
                    // duplicateContainer.removeAll(attackBox);
                    // duplicateContainer.removeAll(defenseBox);

                    //duplicateContainer.add(duplicateBackground);
                });

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

    // showCardDetails(card, container) {
    //     // Añadir detalles de la carta al contenedor

    //     // Fondo de detalles
    //     // const detailBackground = this.add.graphics();
    //     // detailBackground.fillStyle(0x000000, 0.7);
    //     // detailBackground.fillRect(0, 300, 300, 150);
    //     // container.add(detailBackground);

    //     // Texto de detalles
    //     const detailText = `Nombre: ${card.name}\nTipo: ${card.type}\nDescripción: ${card.desc}`;
    //     const detailBox = this.add.text(25, 400, detailText, {
    //         fontSize: '16px',
    //         fill: '#fff',
    //         // backgroundColor: '#000',
    //         // padding: { left: 10, right: 10, top: 10, bottom: 10 },
    //     }).setOrigin(0);
    //     container.add(detailBox);
    // }
}

const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 700,
    scene: [EditDeck, MainMenu],
};

const game = new Phaser.Game(config);
