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

        // Crear nuevo contenedor para soltar las cartas
        const dropZoneContainer = this.add.container(300, 25).setDepth(0);
        const dropZoneBackground = this.add.graphics();
        dropZoneBackground.fillStyle(0x000000, 0.5); // Fondo verde con transparencia
        dropZoneBackground.fillRect(0, 0, 675, 650); // Ajusta el tamaño del contenedor
        dropZoneContainer.add(dropZoneBackground);

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

        
        // console.log(listCards)
        

        if (listCards && Array.isArray(listCards)) {
            let y = 100;

            listCards.slice(0, 20).forEach(card => {
                // console.log(card) 
                const carta = this.add.image(60, y, card.id.toString());
                carta.setDisplaySize(imageWidth, imageHeight);
                carta.setOrigin(0.5);
                carta.setInteractive({ draggable: true }); // Habilitar arrastre

                // console.log(card.id.toString())

                let nameBox;
                let attributeBox;
                let levelBox;
                let typeBox;
                let descriptionBox;
                let attackBox;
                let defenseBox;
                
                const cardName = card.name;
                const cardAttribute = card.attribute;
                const cardLevel = card.level;
                const cardType = card.type;
                const cardDescription = card.desc;
                const cardAttack = card.atk;
                const cardDefense = card.def;
                
                let miTween;
                // Agregar eventos para el mouse
                carta.on('pointerover', () => {
                    

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
                        targets: carta,
                        displayWidth: imageWidth * 1.3,
                        displayHeight: imageHeight * 1.3,
                        yoyo: true,
                        repeat: -1,
                        duration: 500,
                        ease: 'Sine.easeInOut'
                    });

                    carta.setTint('0x707070')

                    // Duplicar la imagen y agregarla al contenedor de duplicados
                    const duplicateImage = this.add.image(125, 200, card.id.toString());
                    duplicateImage.setDisplaySize(imageWidth * 2, imageHeight * 2);
                    duplicateImage.setOrigin(0.5);
                    duplicateContainer.add(duplicateImage);
                });

                carta.on('pointerout', () => {
                    miTween.stop();
                    carta.setDisplaySize(imageWidth, imageHeight);
                    // Limpiar las imágenes duplicadas y los detalles al salir del hover
                    duplicateContainer.removeAll(true);
                    carta.setTint();
                });

                // Manejar el arrastre
                carta.on('dragstart', (pointer, dragX, dragY) => { 
                    console.log(`Iniciando arrastre de "${cardName}`)
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
                    const zone = (carta.x > -700 && carta.x < -25) ? dropZoneContainer : listCards
                    if (zone == listCards) {
                        carta.x = carta.getData('originalX')
                        carta.y = carta.getData('originalY')
                        console.log(`Se ha soltado la carta en ${zone}`)
                        
                    }
                    else if (zone == dropZoneContainer) {
                        selectedCards.push({name: card.name, attribute: card.attribute, level: card.level, type: card.type, id: card.id})
                        console.log(selectedCards);
                        const newCarta = this.add.image(275 + selectedCards.length * 90, 100, card.id.toString()).setScale(0.1);
                        newCarta.setInteractive({ draggable: true })
                        carta.x = carta.getData('originalX')
                        carta.y = carta.getData('originalY')
                        // console.log(newCarta)
                        console.log(card.name)
                        console.log(`Se ha soltado la carta en ${zone}`)
                        
                        newCarta.on('dragstart', (pointer, dragX, dragY) => { 
                            console.log(`Iniciando arrastre de "${cardName}`)
                            newCarta.setData('originalXnew', newCarta.x);
                            newCarta.setData('originalYnew', newCarta.y);
                        });
                        
                        newCarta.on('drag', (pointer, dragX, dragY) => {
                            newCarta.x = dragX;
                            newCarta.y = dragY;
                            // console.log(`x: ${newCarta.x}`)
                            // console.log(`y: ${newCarta.y}`)
                            
                        });

                        newCarta.on('dragend', (pointer, dragX, dragY) => {
                            const zone2 = (newCarta.x > 1000) ? listCards : dropZoneContainer
                            if (zone2 == listCards) {
                                let indice = selectedCards.findIndex(card => card.name === card.name)
                                console.log(indice);
                                selectedCards.splice(indice, 1);
                                newCarta.destroy();
                                
                                
                            }
                            else {
                                newCarta.x = newCarta.getData('originalXnew')
                                newCarta.y = newCarta.getData('originalYnew')
                            }
                            console.log(selectedCards)
                        })
                        
                    }
                    



                    // if (image.x > -700 && image.x < -25) {
                    //     selectedCards.push({ id: card.id, name: card.name, });
                    //     image.x = 100; // Coordenada fija dentro del nuevo contenedor
                    //     image.y = 100; // Coordenada fija dentro del nuevo contenedor
                    //     dropZoneContainer.add(image);
                    //     console.log(selectedCards);
                    // } 
                    
                });

                container.add(carta);
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
    scene: [EditDeck],
};

const game = new Phaser.Game(config);
