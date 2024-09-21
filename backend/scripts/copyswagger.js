// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs').promises;

const source = 'src/swagger.yaml';
const destination = 'dist/swagger.yaml';

async function copyFile() {
   try {
      await fs.cp(source, destination);
      console.log('swagger.yaml copiado para dist/src');
   } catch (err) {
      console.error('Erro ao copiar swagger.yaml:', err);
   }
}

// Execute the function
copyFile();
