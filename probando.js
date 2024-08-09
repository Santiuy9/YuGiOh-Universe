import ColorMatrixPipeline from './ColorMatrixPipeline.js';
export class EditDeck extends Phaser.Scene {
    constructor() {
        super({ key: 'editDeck' });
    }

    

    preload() {
        // Fondo
        this.load.image('backgroundDeck', 'assets/editDeckBackground.jpg');
        this.load.image('backCard', 'assets/cartas/backcard.jpg')
        this.load.image('mask', 'assets/mask.jpg')
        this.allCardsArray = [
            {nombre: 'Elemental HERO Avian', cantidad: 1},
            {nombre: 'Elemental HERO Burstinatrix', cantidad: 1},
            {nombre: 'Elemental HERO Flame Wingman', cantidad: 1},
            {nombre: 'Elemental HERO Neos', cantidad: 1},
            {nombre: 'Elemental HERO Dark Neos', cantidad: 1},
            {nombre: 'Elemental HERO Nebula Neos', cantidad: 1}
         
        ];
        this.iconNameCard = this.allCardsArray.nombre
        this.selectedCardsArray = [];
    
        for (let i = 0; i < this.allCardsArray.length; i++) {
            const cardData = this.allCardsArray[i];
            if (cardData.nombre) {
                this.load.image(`${this.allCardsArray[i].nombre}`, `assets/cartas/normal/${this.allCardsArray[i].nombre}.jpg`);
            }
            if (cardData.nombre) {
                this.load.image(`Short-${this.allCardsArray[i].nombre}`, `assets/cartas/short/Short-${this.allCardsArray[i].nombre}.jpg`);
            }
            // console.log(this.allCardsArray[i])
        };
    }
    create() {
        if (posicion !== -1) {
          console.log(`El elemento ${elementoBuscado} se encuentra en la posición ${posicion}`);
        } else {
          console.log(`El elemento ${elementoBuscado} no está en el array`);
        }
        // Fondo
        this.add.image(400, 300, 'backgroundDeck');
        // Boton "Atras"
        const botonBack = this.add.text(120, 610, 'Atras', {font: '24px Arial', fill: '#fff'})
        .setOrigin(0.5)
        .setInteractive();
        // Configurar una acción cuando se hace clic en el botón "Atras"
        botonBack.on('pointerdown', () => {
            this.scene.start('mainMenu');
        });
        botonBack.on('pointerover', () => {
            botonBack.setFill('#909');
        });
        botonBack.on('pointerout', () => {
            botonBack.setFill('#fff');
        });
        // IconCardsZone
        const iconCards = this.add.graphics();
        iconCards.fillStyle(0xffffff, 0.5)
        iconCards.fillRect(10, 10, 230, 570)
        // Parte trasera de Carta
        this.add.image(20, 20, 'backCard').setOrigin(0.0).setScale(0.324);
        // SelectedCardsZone
        const selectedCardsBG = this.add.graphics();
        selectedCardsBG.fillStyle(0xffffff, 0.5);
        selectedCardsBG.fillRect(250, 10, 430, 630);
        const selectedCards = this.add.container(250, 10);
        selectedCards.setSize(400, 630)
        // AllCardsZone
        const allCardsBG = this.add.graphics();
        allCardsBG.fillStyle(0xffffff, 0.5); // Color blanco con opacidad
        allCardsBG.fillRect(690, 10, 300, 630);
        const allCards = this.add.container(990, 10);
        allCards.setSize(600, 2000);
        allCards.setInteractive();
        let isDragging = false;
        let pointerOffset = {y: 0}
        const topLimit = -2000;
        const bottomLimit = 10;
        allCards.on('pointerdown', function (pointer) {
            console.log("Click en AllCards")
            isDragging = true;
            
            pointerOffset.y = allCards.y - pointer.y;
        });
        allCards.on('pointerup', function () {
            isDragging = false;
        });
        allCards.on('pointermove', function (pointer) {
            if (isDragging) {
                allCards.y = Phaser.Math.Clamp(pointer.y + pointerOffset.y, topLimit, bottomLimit);
            }
        });
        const splat = this.make.image({x: 250, y: 10, key: 'mask', add: false}).setOrigin(0.0)
        const mask1 = new Phaser.Display.Masks.BitmapMask(this, splat)
        allCards.mask = mask1
        selectedCards.mask = mask1
        for (let i = 0; i < this.allCardsArray.length; i++) {
            const icon = this.add.image(20, 20, `${this.allCardsArray[i].nombre}`).setOrigin(0.0);
            const carta = this.add.image(-250, 70 + i * 130, `Short-${this.allCardsArray[i].nombre}`).setOrigin(0.5).setInteractive({draggable: true});
            let miTween;
            let originalScaleX = carta.scaleX / 2;
            let originalScaleY = carta.scaleY / 2;
            const cardData = this.allCardsArray[i];
            carta.setScale(0.5)
            carta.setData('originalX', carta.x);
            carta.setData('originalY', carta.y);
            const cantidad = this.add.text(-235, 110 + i * 130, `x ${this.allCardsArray[i].cantidad}`, {font: '20px Arial', fill: '#000'});
            const nuevaCantidad = this.add.text(-235, 110 + i * 130, `x ${this.allCardsArray[i].cantidad}` - 1, {font: '20px Arial', fill: '#000'});
            nuevaCantidad.visible = false;
            icon.visible = false;
            allCards.add(carta);
            allCards.add(cantidad);
            allCards.add(nuevaCantidad);
            carta.on('pointerover', () => {
                miTween = this.tweens.add({
                    targets: carta,
                    scaleX: 0.56,
                    scaleY: 0.56,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                icon.setScale(0.5);
                icon.visible = true;
                carta.setTint('0x8f008f')
            });
            carta.on('pointerout', () => {
                miTween.stop()
                carta.setTint()
                carta.setScale(originalScaleX, originalScaleY);
                icon.visible = false;
            })
            carta.on('dragstart', () => {
                console.log(`Iniciando arrastre de "${this.allCardsArray[i].nombre}`)
                carta.setTint('0x8f8f8f')
            });
            carta.on('drag', (pointer, dragX, dragY) => {
                carta.x = dragX;
                carta.y = dragY;
            });
            carta.on('dragend', () => {
                carta.setTint()
                const zone = (carta.x < -840 || carta.x > -390) ? this.allCardsArray : this.selectedCards;
                if (zone == this.allCardsArray) {
                    carta.x = carta.getData('originalX')
                    carta.y = carta.getData('originalY')
              
                }
                else if (zone == this.selectedCards){
                    const nuevaCarta = this.add.image(0, 0 + i * 130, `Short-${this.allCardsArray[i].nombre}`).setOrigin(0.5).setInteractive({draggable: true}).setScale(0.4);
                    if (this.selectedCardsArray.push(this.allCardsArray[i].nombre)) {
                        let ultimaAdicion = this.allCardsArray[i].nombre
                        //console.log(ultimaAdicion)
                        let contador = 0;
                        //console.log(this.selectedCardsArray)
                        for (let i = 0; i < this.selectedCardsArray.length; i++) {
                            //console.log(this.selectedCardsArray[i])
                            
                            //console.log(contador)
                            if (ultimaAdicion === this.selectedCardsArray[i]) {
                                contador = contador + 1;
                                //console.log(contador)
                            }
                            if (contador > 2) {
                                console.log(`Hay tres cartas de ${ultimaAdicion}`)
                                contador = 0
                                carta.disableInteractive();
                                
                            }
                        }
                    }
                    carta.x = carta.getData('originalX')
                    carta.y = carta.getData('originalY')
                    nuevaCarta.x = nuevaCarta.getData('originalX')
                    nuevaCarta.y = nuevaCarta.getData('originalY')
                    selectedCards.add(nuevaCarta);
                    let seTween;
                    for (let i = 0; i <= this.selectedCardsArray.length; i++) {
                        nuevaCarta.x = 7.5 + i * 37.5
                        nuevaCarta.y = 60
                        if (this.selectedCardsArray.length > 10) {
                            nuevaCarta.x = -367.5 + i * 37.5
                            nuevaCarta.y = 170
                        }
                        if (this.selectedCardsArray.length > 20) {
                            nuevaCarta.x = -742.5 + i * 37.5
                            nuevaCarta.y = 280
                        }
                        if (this.selectedCardsArray.length > 30) {
                            nuevaCarta.x = -1117.5 + i * 37.5
                            nuevaCarta.y = 390
                        }
                    }
                    nuevaCarta.on('pointerover', () => {
                        seTween = this.tweens.add({
                            targets: nuevaCarta,
                            scaleX: 0.55,
                            scaleY: 0.55,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                        icon.setScale(0.5);
                        icon.visible = true;
                        nuevaCarta.setTint('0x8f008f')
                    });
                    nuevaCarta.on('pointerout', () => {
                        nuevaCarta.setScale(0.4);
                        nuevaCarta.setTint()
                        seTween.stop()
                        nuevaCarta.setTint()
                        icon.visible = false;
                    })
                    nuevaCarta.on('dragstart', () => {
                        console.log(`Iniciando arrastre de "${this.allCardsArray[i].nombre}`)
                    })
                    nuevaCarta.on('drag', (pointer, dragX, dragY) => {
                        nuevaCarta.x = dragX;
                        nuevaCarta.y= dragY;
                    });
                    nuevaCarta.on('dragend', () => {
                        const zone2 = (nuevaCarta.x < 0 || nuevaCarta.x > 435) ? this.allCardsArray : this.selectedCardsArray;
                        if (zone2 == this.selectedCardsArray) {
                            for (let i = 0; i <= this.selectedCardsArray.length; i++) {
                                nuevaCarta.x = 7.5 + i * 37.5;
                                nuevaCarta.y = 60;
                                if (this.selectedCardsArray.length > 10) {
                                    nuevaCarta.x = -330 + i * 37.5
                                    nuevaCarta.y = 170
                                }
                                if (this.selectedCardsArray.length > 20) {
                                    nuevaCarta.x = -742.5 + i * 37.5
                                    nuevaCarta.y = 280
                                }
                                if (this.selectedCardsArray.length > 30) {
                                    nuevaCarta.x = -1117.5 + i * 37.5
                                    nuevaCarta.y = 390
                                }
                            }                          
                        }
                        else {
                            selectedCards.remove(nuevaCarta);
                            this.selectedCardsArray.splice();
                        }
                        console.log(`Finalizando arrastre de "${this.allCardsArray[i].nombre}`)
                    });
                }
                console.log(`Finalizando arrastre de "${this.allCardsArray[i].nombre}`)
            })
        };
        console.log(posicion)
    }
    update() {
    }    
}



// if (listCards && Array.isArray(listCards)) {
        //     let y = 100;

        //     listCards.slice(0, 20).forEach(card => {
        //         // console.log(card) 
        //         const carta = this.add.image(60, y, card.id.toString());
        //         carta.setOrigin(0.5);
        //         carta.setInteractive({ draggable: true }); // Habilitar arrastre

        //         // console.log(card.id.toString())

        //         let nameBox;
        //         let attributeBox;
        //         let levelBox;
        //         let typeBox;
        //         let descriptionBox;
        //         let attackBox;
        //         let defenseBox;
                
        //         const cardName = card.name;
        //         const cardAttribute = card.attribute;
        //         const cardLevel = card.level;
        //         const cardType = card.type;
        //         const cardDescription = card.desc;
        //         const cardAttack = card.atk;
        //         const cardDefense = card.def;
                
        //         let miTween;
        //         // Agregar eventos para el mouse
        //         carta.on('pointerover', () => {
                    

        //             nameBox = this.add.text(125, 25, cardName, {
        //                 fontSize: '20px',
        //                 fill: '#fff',
        //             }).setOrigin(0.5);
        //             attributeBox = this.add.text(240, 355, cardAttribute, {
        //                 fontSize: '16px',
        //                 fill: '#fff',
        //             }).setOrigin(1, 0);
        //             typeBox = this.add.text(125, 380, cardType, {
        //                 fontSize: '16px',
        //                 fill: '#fff'
        //             }).setOrigin(0.5);
        //             levelBox = cardType == 'spell card' || cardType == 'trap card' ? null : this.add.text(10, 355, `Level ${cardLevel}`, {
        //                 fontSize: '16px',
        //                 fill: '#fff',
        //             }).setOrigin(0);
        //             descriptionBox = this.add.text(10, 390, cardDescription, {
        //                 fontSize: '12px',
        //                 fill: '#fff',
        //                 wordWrap: { width: 240 }
        //             }).setOrigin(0);
        //             attackBox = cardType == 'spell card' || cardType == 'trap card' ? null : this.add.text(10, 630, `ATK: ${cardAttack}`, {
        //                 fontSize: '16px',
        //                 fill: '#fff',
        //             }).setOrigin(0);
        //             defenseBox = card.type == 'spell card' || cardType == 'trap card' ? null : this.add.text(160, 630, `DEF: ${cardDefense}`, {
        //                 fontSize: '16px',
        //                 fill: '#fff',
        //             }).setOrigin(0);

        //             duplicateContainer.add(nameBox);
        //             duplicateContainer.add(attributeBox);
        //             duplicateContainer.add(levelBox);
        //             duplicateContainer.add(typeBox);
        //             duplicateContainer.add(descriptionBox);
        //             duplicateContainer.add(attackBox);
        //             duplicateContainer.add(defenseBox);

        //             miTween = this.tweens.add({
        //                 targets: carta,
        //                 displayWidth: imageWidth * 1.3,
        //                 displayHeight: imageHeight * 1.3,
        //                 yoyo: true,
        //                 repeat: -1,
        //                 duration: 500,
        //                 ease: 'Sine.easeInOut'
        //             });

        //             carta.setTint('0x707070')

        //             // Duplicar la imagen y agregarla al contenedor de duplicados
        //             const duplicateImage = this.add.image(125, 200, card.id.toString());
        //             duplicateImage.setDisplaySize(imageWidth * 2, imageHeight * 2);
        //             duplicateImage.setOrigin(0.5);
        //             duplicateContainer.add(duplicateImage);
        //         });

        //         carta.on('pointerout', () => {
        //             miTween.stop();
        //             carta.setDisplaySize(imageWidth, imageHeight);
        //             // Limpiar las imágenes duplicadas y los detalles al salir del hover
        //             duplicateContainer.removeAll(true);
        //             carta.setTint();
        //         });

        //         // Manejar el arrastre
        //         carta.on('dragstart', (pointer, dragX, dragY) => { 
        //             console.log(`Iniciando arrastre de "${cardName}`)
        //             carta.setData('originalX', carta.x);
        //             carta.setData('originalY', carta.y);
        //         });

        //         carta.on('drag', (pointer, dragX, dragY) => {
        //             carta.x = dragX;
        //             carta.y = dragY;
        //             // console.log(`x: ${carta.x}`)
        //             // console.log(`y: ${carta.y}`)
                    
        //         });

        //         carta.on('dragend', (pointer, dragX, dragY) => {
        //             const zone = (carta.x > -700 && carta.x < -25) ? dropZoneContainer : listCards
        //             if (zone == listCards) {
        //                 carta.x = carta.getData('originalX')
        //                 carta.y = carta.getData('originalY')
        //                 console.log(`Se ha soltado la carta en ${zone}`)
                        
        //             }
        //             else if (zone == dropZoneContainer) {
        //                 selectedCards.push({name: card.name, attribute: card.attribute, level: card.level, type: card.type, id: card.id})
        //                 console.log(selectedCards);
        //                 const newCarta = this.add.image(275 + selectedCards.length * 90, 100, card.id.toString()).setScale(0.1);
        //                 newCarta.setInteractive({ draggable: true })
        //                 carta.x = carta.getData('originalX')
        //                 carta.y = carta.getData('originalY')
        //                 // console.log(newCarta)
        //                 console.log(card.name)
        //                 console.log(`Se ha soltado la carta en ${zone}`)
                        
        //                 newCarta.on('dragstart', (pointer, dragX, dragY) => { 
        //                     console.log(`Iniciando arrastre de "${cardName}`)
        //                     newCarta.setData('originalXnew', newCarta.x);
        //                     newCarta.setData('originalYnew', newCarta.y);
        //                 });
                        
        //                 newCarta.on('drag', (pointer, dragX, dragY) => {
        //                     newCarta.x = dragX;
        //                     newCarta.y = dragY;
        //                     // console.log(`x: ${newCarta.x}`)
        //                     // console.log(`y: ${newCarta.y}`)
                            
        //                 });

        //                 newCarta.on('dragend', (pointer, dragX, dragY) => {
        //                     const zone2 = (newCarta.x > 1000) ? listCards : dropZoneContainer
        //                     if (zone2 == listCards) {
        //                         let indice = selectedCards.findIndex(card => card.name === card.name)
        //                         console.log(indice);
        //                         selectedCards.splice(indice, 1);
        //                         newCarta.destroy();
                                
                                
        //                     }
        //                     else {
        //                         newCarta.x = newCarta.getData('originalXnew')
        //                         newCarta.y = newCarta.getData('originalYnew')
        //                     }
        //                     console.log(selectedCards)
        //                 })
                        
        //             }
                    



        //             // if (image.x > -700 && image.x < -25) {
        //             //     selectedCards.push({ id: card.id, name: card.name, });
        //             //     image.x = 100; // Coordenada fija dentro del nuevo contenedor
        //             //     image.y = 100; // Coordenada fija dentro del nuevo contenedor
        //             //     dropZoneContainer.add(image);
        //             //     console.log(selectedCards);
        //             // } 
                    
        //         });

        //         container.add(carta);
        //         y += offset;
        //     });
        // } else {
        //     console.error('Error al cargar los datos del JSON o los datos están vacíos.');
        // }