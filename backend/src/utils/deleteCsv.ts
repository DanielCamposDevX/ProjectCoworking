import fs from 'fs';

export function deleteCSVFile(filePath: string) {
   fs.unlink(filePath, (err) => {
      if (err) {
         console.error(err);
      }
   });
}
