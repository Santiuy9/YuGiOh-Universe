const fs = require('fs');
const path = require('path');

// Lee el archivo Heroes.json
fs.readFile('Heros.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    // Parsea el archivo JSON
    const jsonData = JSON.parse(data);

    // Actualiza las rutas de las imágenes
    jsonData.data.forEach(card => {
        card.card_images = card.card_images.map(image => ({
            ...image,
            image_url: path.join('cards', 'normal_size', `${card.id}.jpg`).replace(/\\/g, '/')
        }));
    });

    // Guarda el nuevo JSON en un archivo
    fs.writeFile('HeroesWithLocalImages.json', JSON.stringify(jsonData, null, 2), err => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
        } else {
            console.log('Archivo "HeroesWithLocalImages.json" creado exitosamente.');
        }
    });
});
