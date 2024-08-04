const fs = require('fs');

// Lee el archivo JSON original
fs.readFile('./YugiohCardsData.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    // Parsea el archivo JSON
    const jsonData = JSON.parse(data);

    // Filtra las cartas que contienen "HERO" en el nombre o la descripción
    // y que no tienen "skill" en el frameType
    const filteredData = jsonData.data.filter(card => 
        (card.name && card.name.includes('HERO')) ||
        (card.desc && card.desc.includes('HERO')) &&
        card.frameType !== 'skill'
    );

    // Guarda el nuevo JSON en un archivo
    fs.writeFile('./Heros.json', JSON.stringify({ data: filteredData }, null, 2), err => {
        if (err) {
            console.error('Error al escribir el archivo:', err);
        } else {
            console.log('Archivo "Heroes.json" creado exitosamente.');
        }
    });
});
