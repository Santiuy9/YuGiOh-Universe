const fs = require('fs');

// Leer el archivo JSON original
fs.readFile('./Api-Yugioh.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo JSON:', err);
        return;
    }

    // Parsear el JSON
    const originalData = JSON.parse(data);

    // Filtrar los datos relevantes
    const filteredData = originalData.data.map(card => ({
        id: card.id,
        name: card.name,
        type: card.type,
        frameType: card.frameType,
        desc: card.desc,
        race: card.race,
        archetype: card.archetype,
        card_images: card.card_images,
        card_sets: card.card_sets
    }));

    // Guardar los datos filtrados en un nuevo archivo JSON
    fs.writeFile('./archivo_filtrado.json', JSON.stringify(filteredData, null, 2), (err) => {
        if (err) {
            console.error('Error al escribir el archivo JSON:', err);
            return;
        }
        console.log('Archivo JSON filtrado guardado exitosamente.');
    });
});
