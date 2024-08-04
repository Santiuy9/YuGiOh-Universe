const fs = require('fs');

// Lee el archivo JSON original
fs.readFile('./Api-Yugioh.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    // Parsea el archivo JSON
    const jsonData = JSON.parse(data);

    // Filtra los datos y crea el nuevo JSON con los campos necesarios
    const filteredData = jsonData.data.map(card => {
        return {
            id: card.id,
            name: card.name,
            type: card.type,
            frameType: card.frameType,
            desc: card.desc,
            atk: card.atk,
            def: card.def,
            level: card.level,
            race: card.race,
            attribute: card.attribute,
            card_sets: card.card_sets,
            card_images: card.card_images
        };
    });

    // Guarda el nuevo JSON en un archivo
    fs.writeFile('./YugiohCardsData.json', JSON.stringify({ data: filteredData }, null, 2), err => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
        } else {
            console.log('Archivo "YugiohCardsData.json" creado exitosamente.');
        }
    });
});