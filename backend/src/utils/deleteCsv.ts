import fs from 'fs';

export function deleteCSVFile(filePath: string) {
   fs.unlink(filePath, (err) => {
      if (err) {
         console.error(`Erro ao deletar o arquivo CSV: ${err.message}`);
      } else {
         console.log(`Arquivo CSV ${filePath} deletado com sucesso.`);
      }
   });
}
