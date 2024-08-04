const fs = require('fs');
const path = require('path');

// Directorio donde están almacenadas las imágenes
const directory = './cards/normal_size/';  // Reemplaza con la ruta correcta

// Verificar si el directorio existe
if (!fs.existsSync(directory)) {
    console.error('El directorio especificado no existe:', directory);
    process.exit(1);
}

fs.readdir(directory, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio:', err);
        return;
    }

    files.forEach(file => {
        // Verificar si el archivo es una imagen JPG
        if (path.extname(file) === '.jpg') {
            // Separar el nombre del archivo y la extensión
            const name = path.basename(file, '.jpg');
            
            // Dividir el nombre por el carácter '_'
            const parts = name.split('_');
            
            // Mostrar información de depuración
            console.log(`Archivo encontrado: ${file}`);
            console.log(`Partes del nombre: ${parts.join(', ')}`);
            
            // Si hay más de dos partes, renombrar el archivo
            if (parts.length >= 2) {
                // Crear el nuevo nombre de archivo con solo el primer ID
                const newName = `${parts[0]}.jpg`;
                const oldPath = path.join(directory, file);
                const newPath = path.join(directory, newName);
                
                // Renombrar el archivo
                fs.rename(oldPath, newPath, err => {
                    if (err) {
                        console.error(`Error al renombrar ${file}:`, err);
                    } else {
                        console.log(`Renombrado: ${oldPath} a ${newPath}`);
                    }
                });
            }
        }
    });
});
