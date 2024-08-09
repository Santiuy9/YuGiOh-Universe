// game.js
// Definir la escena EditDeck
class EditDeck extends Phaser.Scene {
    constructor() {
        super({ key: 'EditDeck' });
    }

    preload() {
        this.load.json('listCards', 'jasons_y_scripts/Heroes.json');
        this.load.image('Background', 'assets/background.png');

        // Cargar imágenes desde JSON
        this.load.once('filecomplete-json-listCards', (key, type, data) => {
            if (data && Array.isArray(data.data)) {
                data.data.slice(0, 20).forEach(card => {
                    const imageUrl = card.card_images[0].image_url;
                    this.load.image(card.id.toString(), imageUrl);
                });
            } else {
                console.error('Error al cargar los datos del JSON o los datos están vacíos.');
            }
        }, this);
    }

    create() {
        // Array para cartas seleccionadas
        const selectedCards = [];
        
        const background = this.add.image(0, 0, 'Background').setOrigin(0).setScale(0.6);
        const backgroundWidth = 1500;
        const backgroundHeight = 700;
        background.setDisplaySize(backgroundWidth, backgroundHeight);
        background.setDepth(-5);

        // Crear nuevo contenedor para soltar las cartas
        const dropZoneContainer = this.add.container(300, 25).setDepth(0);
        const dropZoneBackground = this.add.graphics();
        dropZoneBackground.fillStyle(0x000000, 0.5); // Fondo verde con transparencia
        dropZoneBackground.fillRect(300, 25, 675, 650); // Ajusta el tamaño del contenedor
        dropZoneBackground.setDepth(-1);
        // dropZoneContainer.setDepth(-1);
        // dropZoneContainer.add(dropZoneBackground);

        // Crear contenedor para imágenes duplicadas y detalles con fondo
        const duplicateBackground = this.add.graphics();
        duplicateBackground.fillStyle(0x000000, 0.5); // Color negro con transparencia
        duplicateBackground.fillRect(25, 25, 250, 650); // Ajusta el tamaño del fondo según el contenedor
        const duplicateContainer = this.add.container(25, 25);
        // duplicateContainer.add(duplicateBackground);

        const listCards = this.cache.json.get('listCards').data;
        const container = this.add.container(1000, 25);
        const imageWidth = 100;
        const imageHeight = 150;
        const offset = 180;

        const containerHeight = (imageHeight + offset) * 30;
        const listCardBackground = this.add.graphics();
        listCardBackground.fillStyle(0x000000, 0.5);
        listCardBackground.fillRect(0, 0, imageWidth + 20, containerHeight);

        container.add(listCardBackground);


        for (let i = 0; i < 20; i++) {
            const card_images = listCards[i].card_images;
            for (let j = 0; j < card_images.length; j++) {
                // Extraer solo el número entre el último '/' y '.jpg'
                let imageUrl = card_images[j].image_url.toString();
                let startIndex = imageUrl.lastIndexOf('/') + 1;
                let endIndex = imageUrl.indexOf('.jpg');
                let imageNumber = imageUrl.substring(startIndex, endIndex);
                
                // console.log(imageNumber); // Esto imprimirá solo el número
                // console.log(imageUrl); // Esto imprimirá solo el número
        
                const carta = this.add.image(60, 90 + 160 * i, imageNumber);
                carta.setOrigin(0.5);
                carta.setDisplaySize(imageWidth, imageHeight);
                carta.setInteractive({ draggable: true }); // Habilitar arrastre
                container.add(carta);

                let miTween;

                carta.on('pointerover', () => {
                    carta.setTint('0x757575')
                    // miTween = this.tweens.add({
                    //     targets: carta,
                    //     scaleX: 0.175,
                    //     scaleY: 0.175,
                    //     yoyo: true,
                    //     repeat: -1,
                    //     ease: 'Sine.easeInOut'
                    // });
                });

                carta.on('pointerout', () => {
                    carta.setTint()
                    // miTween.stop()
                    // carta.setDisplaySize(imageWidth, imageHeight);
                });

                // Manejar el arrastre
                carta.on('dragstart', (pointer, dragX, dragY) => { 
                    console.log(`Iniciando arrastre de "${listCards[i].name}"`)
                    carta.setData('originalX', carta.x);
                    carta.setData('originalY', carta.y);
                });

                carta.on('drag', (pointer, dragX, dragY) => {
                    carta.x = dragX;
                    carta.y = dragY;
                    // console.log(`x: ${carta.x}`)
                    // console.log(`y: ${carta.y}`)
                    
                });

                carta.on('dragend', (pointer, dragX, dragY) => {
                    const zone = (carta.x > -75 || carta.x < -700) ? listCards : selectedCards;
                    carta.x = carta.getData('originalX')
                    carta.y = carta.getData('originalY')
                    if (zone == listCards) {
                        console.log(`Finalizando arrastre de "${listCards[i].name}" en el mismo lugar`)
                        
                    }
                    else {
                        console.log(`Finalizando arrastre de "${listCards[i].name}" en el Mazo`)
                        selectedCards.push({ id: listCards[i].id, name: listCards[i].name, imageNumber: imageNumber });
                        console.log(selectedCards);
                        const nuevaCarta = this.add.image((selectedCards.length * 110) - 40, 90, imageNumber);
                        nuevaCarta.setInteractive({ draggable: true });
                        nuevaCarta.setDepth(5);

                        let ultimaAdicion = listCards[i].name;
                        // console.log(listCards[i].name)
                        let contador = 0;
                        
                        for (let i = 0; i < selectedCards.length; i++) {
                            // console.log(selectedCards[i].name)
                            if (ultimaAdicion === selectedCards[i].name) {
                                contador ++;
                                // console.log(contador);
                            }
                            if (contador === 3) {
                               console.log(`Ya existen 3 copias de ${ultimaAdicion} dentro del Deck`) 
                               carta.disableInteractive();
                               carta.setTint('0x303030')
                            }
                        }
                        
                        if (selectedCards.length > 6) {
                            nuevaCarta.x = (selectedCards.length * 110) - 700;
                            nuevaCarta.y = 250;
                        }
                        if (selectedCards.length > 12) {
                            nuevaCarta.x = (selectedCards.length * 110) - 1360;
                            nuevaCarta.y = 410;
                        }
                        if (selectedCards.length > 18) {
                            nuevaCarta.x = (selectedCards.length * 110) - 2020;
                            nuevaCarta.y = 570;
                        }
                        nuevaCarta.setDisplaySize(imageWidth, imageHeight);
                        dropZoneContainer.add(nuevaCarta);

                        nuevaCarta.on('pointerover', () => {
                            nuevaCarta.setTint('0x757575')
                        });

                        nuevaCarta.on('pointerout', () => {
                            nuevaCarta.setTint()
                        });

                        nuevaCarta.on('dragstart', (pointer, dragX, dragY) => {
                            console.log(`Iniciando arrastre de ${listCards[i].name}`);
                            nuevaCarta.setData('originalXnueva', nuevaCarta.x);
                            nuevaCarta.setData('originalYnueva', nuevaCarta.y);
                        });
                        nuevaCarta.on('drag', (pointer, dragX, dragY) => {
                            nuevaCarta.x = dragX;
                            nuevaCarta.y = dragY;
                            // console.log(`x: ${nuevaCarta.x}`)
                            // console.log(`y: ${nuevaCarta.y}`)
                        });
                        nuevaCarta.on('dragend', (pointer, dragX, dragY) => {
                            const zone2 = (nuevaCarta.x > 730) ? listCards : selectedCards;
                            if (zone2 == listCards) {
                                console.log(`Finalizando arrastre de ${listCards[i].name} en Lista de Cartas`);
                                let indice = selectedCards.findIndex(card => card.name === listCards[i].name);
                                console.log(indice);
                                selectedCards.splice(indice, 1);
                                nuevaCarta.destroy();
                                console.log(selectedCards);

                                actualizarPosiciones(dropZoneContainer, selectedCards, imageWidth, imageHeight);
                                // Revisa si la carta eliminada tiene menos de 3 copias ahora
                                let contador = selectedCards.filter(c => c.name === listCards[i].name).length;
                                console.log(contador)
                                if (contador < 3) {
                                    carta.setInteractive({ draggable: true });
                                    carta.setTint(); // Restablece el color original de la carta
                                }
                            } else {
                                console.log(`Finalizando arrastre de ${listCards[i].name} en el Mazo`);
                                nuevaCarta.x = nuevaCarta.getData('originalXnueva');
                                nuevaCarta.y = nuevaCarta.getData('originalYnueva');
                            }
                        });

                        // Función para actualizar posiciones de cartas en el contenedor
                        const actualizarPosiciones = (container, selectedCards, imageWidth, imageHeight) => {
                            // Eliminar todas las cartas del contenedor antes de reposicionarlas
                            container.removeAll(true);
                            // Reposicionar cada carta en base a su índice en selectedCards
                            selectedCards.forEach((card, index) => {
                                const nuevaCarta = this.add.image((index * 110) + 70, 90, card.imageNumber);
                                nuevaCarta.setInteractive({ draggable: true });
                                nuevaCarta.setDepth(5);
                                if (index > 5) {
                                    nuevaCarta.x = (index * 110) - 590;
                                    nuevaCarta.y = 250;
                                }
                                if (index > 11) {
                                    nuevaCarta.x = (index * 110) - 1250;
                                    nuevaCarta.y = 410;
                                }
                                if (index > 17) {
                                    nuevaCarta.x = (index * 110) - 1910;
                                    nuevaCarta.y = 570;
                                }

                                nuevaCarta.setDisplaySize(imageWidth, imageHeight);
                                container.add(nuevaCarta);

                                // Añadir eventos de arrastre a las nuevas cartas
                                nuevaCarta.on('dragstart', (pointer, dragX, dragY) => {
                                    console.log(`Iniciando arrastre de ${card.name}`);
                                    nuevaCarta.setData('originalXnueva', nuevaCarta.x);
                                    nuevaCarta.setData('originalYnueva', nuevaCarta.y);
                                });

                                nuevaCarta.on('drag', (pointer, dragX, dragY) => {
                                    nuevaCarta.x = dragX;
                                    nuevaCarta.y = dragY;
                                });

                                nuevaCarta.on('dragend', (pointer, dragX, dragY) => {
                                    const zone2 = (nuevaCarta.x > 730) ? listCards : selectedCards;
                                    if (zone2 == listCards) {
                                        console.log(`Finalizando arrastre de ${card.name} en Lista de Cartas`);
                                        let indice = selectedCards.findIndex(c => c.name === card.name);
                                        console.log(indice);
                                        selectedCards.splice(indice, 1);
                                        nuevaCarta.destroy();
                                        console.log(selectedCards);
                                        // alert(`Removiste a ${card.name} del Mazo`)
                                        // Revisa si la carta eliminada tiene menos de 3 copias ahora
                                        let contador = selectedCards.filter(c => c.name === card.name).length;
                                        console.log(contador)
                                        if (contador < 3) {
                                            carta.setInteractive({ draggable: true });
                                            carta.setTint(); // Restablece el color original de la carta
                                        }
                                        actualizarPosiciones(container, selectedCards, imageWidth, imageHeight);
                                    }
                                    else {
                                        console.log(`Finalizando arrastre de ${card.name} en el Mazo`);
                                        nuevaCarta.x = nuevaCarta.getData('originalXnueva');
                                        nuevaCarta.y = nuevaCarta.getData('originalYnueva');
                                    }
                                });
                            });
                        };

                    }
                });
            }
        }

        
        
        // Scroll en Container
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

// Configuración del juego
const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 700,
    scene: [EditDeck],
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Crear la instancia del juego
const game = new Phaser.Game(config);
