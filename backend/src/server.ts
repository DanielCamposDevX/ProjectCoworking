import app, { init } from './app.js';

const port = +process.env.PORT || 4000;

init()
   .then(() => {
      app.listen(port, () => {
         console.log(`Server is listening on port ${port}.`);
      });
   })
   .catch((err) => {
      console.error(err);
   });
