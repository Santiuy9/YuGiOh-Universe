const fs = require('fs');
const https = require('https');
const path = require('path');

// Función para descargar imágenes
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => reject(err));
        });
    });
};

// Leer el archivo JSON filtrado
fs.readFile('./archivo_filtrado.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error al leer el archivo JSON:', err);
        return;
    }

    const cards = JSON.parse(data);

    // Filtrar las cartas que contienen "HERO" en el nombre o la descripción
    const heroCards = cards.filter(card => 
        card.name.includes('HERO') || card.desc.includes('HERO')
    );

    for (const card of heroCards) {
        for (const image of card.card_images) {
            // Determinar el tipo de imagen y la carpeta correspondiente
            let folder;
            if (image.image_url.includes('cards_small')) {
                folder = 'mini_size';
            } else if (image.image_url.includes('cards_cropped')) {
                folder = 'cropped';
            } else {
                folder = 'normal_size';
            }

            // Crear la carpeta si no existe
            const dir = path.join(__dirname, 'images', folder);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Definir el nombre y la ruta del archivo
            const filename = `${image.id}_${path.basename(image.image_url)}`;
            const filepath = path.join(dir, filename);
            
            // Descargar y guardar la imagen
            await downloadImage(image.image_url, filepath);
            image.image_url = `./images/${folder}/${filename}`;
        }
    }

    // Guardar el JSON actualizado con las rutas locales de las imágenes
    fs.writeFile('./archivo_filtrado_hero.json', JSON.stringify(heroCards, null, 2), (err) => {
        if (err) {
            console.error('Error al escribir el archivo JSON actualizado:', err);
            return;
        }
        console.log('Archivo JSON actualizado guardado exitosamente.');
    });
});
