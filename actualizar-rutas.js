const fs = require('fs');
const path = require('path');

// Leer el archivo JSON con las imágenes descargadas
fs.readFile('./archivo_filtrado_hero.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo JSON:', err);
        return;
    }

    const cards = JSON.parse(data);

    // Actualizar las rutas de las imágenes
    cards.forEach(card => {
        if (card.card_images) {
            card.card_images.forEach(image => {
                if (image.image_url) {
                    let folder;
                    if (image.image_url.includes('cards_small')) {
                        folder = 'mini_size';
                    } else if (image.image_url.includes('cards_cropped')) {
                        folder = 'cropped';
                    } else {
                        folder = 'normal_size';
                    }
                    
                    // Extraer el nombre del archivo de la URL
                    const filename = path.basename(image.image_url);
                    // Actualizar la ruta en el JSON
                    image.image_url = `./cards/${folder}/${filename}`;
                    
                    // También actualizar las otras URLs si están presentes
                    if (image.image_url_small) {
                        image.image_url_small = `./cards/${folder}/${filename}`;
                    }
                    if (image.image_url_cropped) {
                        image.image_url_cropped = `./cards/${folder}/${filename}`;
                    }
                }
            });
        }
    });

    // Guardar el JSON actualizado con las nuevas rutas de las imágenes
    fs.writeFile('./HEROS.json', JSON.stringify(cards, null, 2), (err) => {
        if (err) {
            console.error('Error al escribir el archivo JSON actualizado:', err);
            return;
        }
        console.log('Archivo JSON actualizado con las rutas locales guardado exitosamente.');
    });
});
