const mongoose = require('mongoose');
const Game = require('../models/Game');

exports.getGames = async (req, res) => {
  const games = await Game.find();
  res.json(games);
};

exports.createGame = async (req, res) => {
  const game = await Game.create(req.body);
  res.json(game);
};

exports.updateGame = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'Falta el parámetro :id en la URL' });
    }

    // validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Evitar que el cliente cambie el _id o id mediante el body
    const update = { ...req.body };
    delete update._id;
    delete update.id;

    //evitar actualizar a valores vacíos no deseados//
    Object.keys(update).forEach(k => {
      if (typeof update[k] === 'undefined') delete update[k];
    });

    const updated = await Game.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    if (!updated) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    return res.json(updated);
  } catch (err) {
    console.error('updateGame error:', err);
    return res.status(500).json({ error: 'Error interno al actualizar juego' });
  }
};

exports.deleteGame = async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ message: "Juego eliminado" });
};
