require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('./models/Game');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gametracker';

async function main(){
  await mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true });
  console.log('Conectado a MongoDB para seed');

  await Game.deleteMany({});
  await Game.insertMany([
    { title: 'La leyenda de Michell', platform: 'PC', description: 'Un juego épico', rating: 4.5, coverUrl: '' },
    { title: 'Juego de prueba', platform: 'PS5', description: 'Demo', rating: 3.8, coverUrl: '' }
  ]);

  console.log('Seed completado');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
