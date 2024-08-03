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
        this.load.image('Background', 'assets/background.png')

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
        const backgroundWidth = 1200;
        const backgroundHeight = 700;
        background.setDisplaySize(backgroundWidth, backgroundHeight);
        const herosData = this.cache.json.get('herosData').data;
        const container = this.add.container(650, 25);
        const imageWidth = 100; // Ajusta este valor según el tamaño deseado
        const imageHeight = 150; // Ajusta este valor según el tamaño deseado
        const offset = 160; // Ajusta este valor según el espacio entre imágenes

        // Crear un fondo para el contenedor
        const containerHeight = (imageHeight + offset) * 10; // Altura del contenedor basado en la cantidad de imágenes
        const listCardBackground = this.add.graphics();
        listCardBackground.fillStyle(0x8a2be2, 1); // Color violeta
        listCardBackground.fillRect(0, 0, imageWidth + 20, containerHeight); // Relleno del rectángulo

        container.add(listCardBackground);

        if (herosData && Array.isArray(herosData)) {
            let y = 10; // Ajusta el valor inicial según el padding deseado

            herosData.slice(0, 10).forEach(card => {
                const image = this.add.image(10, y, card.id.toString());
                image.setDisplaySize(imageWidth, imageHeight); // Establece un tamaño fijo para todas las imágenes
                image.setOrigin(0);
                image.setInteractive();
                image.on('pointerdown', () => this.showCardDetails(card));
                container.add(image);
                y += offset;
            });
        } else {
            console.error('Error al cargar los datos del JSON o los datos están vacíos.');
        }

        // Crear una máscara de desplazamiento
        // const maskShape = this.make.graphics();
        // maskShape.fillRect(50, 50, imageWidth + 20, 600); // Tamaño del área visible
        // const mask = maskShape.createGeometryMask();

        // container.setMask(mask);

        // Habilitar eventos de entrada
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            container.y -= deltaY / 1; // Ajusta la velocidad de desplazamiento
            if (container.y > 50) {
                container.y = 25;
            }
            if (container.y < 600 - containerHeight + 50) { // Ajusta el valor según la altura del contenedor
                container.y = 600 - containerHeight + 50;
            }
        });
    }

    showCardDetails(card) {
        // Mostrar detalles de la carta en una ventana emergente o en algún área de la pantalla
        const detailText = `Nombre: ${card.name}\nTipo: ${card.type}\nDescripción: ${card.desc}`;
        const detailBox = this.add.text(400, 300, detailText, {
            fontSize: '16px',
            fill: '#fff',
            listCardBackgroundColor: '#000',
            padding: { left: 10, right: 10, top: 10, bottom: 10 },
        }).setOrigin(0.5);

        // Añadir un temporizador para eliminar el cuadro de texto después de unos segundos
        this.time.delayedCall(3000, () => {
            detailBox.destroy();
        }, [], this);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    scene: [MainMenu, EditDeck],
};

const game = new Phaser.Game(config);
