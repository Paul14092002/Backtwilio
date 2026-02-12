import dotenv from 'dotenv';
dotenv.config(); // PRIMERO cargar variables de entorno

import app from './app.js'; // LUEGO importar app

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});