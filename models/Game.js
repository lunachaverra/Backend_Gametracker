const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String },
  description: { type: String },
  
  // Imagen de portada
  cover: { type: String },

  //AGREGADO → campo genre
  genre: { type: String, required: true },

  status: { type: String, default: "Pendiente" },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  
  completed: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
