require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const Game = require('./models/Game');
const Review = require('./models/Review');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gametracker';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error MongoDB:', err));

app.get('/', (req, res) => res.send('Backend GameTracker funcionando ??'));

/* --- CRUD Games --- */
app.get('/api/games', async (req, res) => {
  const games = await Game.find().sort({ createdAt: -1 });
  res.json(games);
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game no encontrado' });
    res.json(game);
  } catch (err) {
    res.status(400).json({ error: 'ID inv�lido' });
  }
});

app.post('/api/games', async (req, res) => {
  const newGame = new Game(req.body);
  await newGame.save();
  res.status(201).json(newGame);
});


app.put('/api/games/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('--- DIAGNOSTIC PUT START ---');
    console.log('Received PUT /api/games/:id');
    console.log('params.id =', id);
    console.log('raw body =', req.body);

    if (!id) {
      console.log('-> Missing id in params');
      return res.status(400).json({ error: 'Falta :id en la URL' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('-> Invalid ObjectId:', id);
      return res.status(400).json({ error: 'ID inválido' });
    }

    // show the targeted document before update
    const before = await Game.findById(id).lean();
    console.log('Document BEFORE update (found?):', !!before, before ? before : 'NOT FOUND');

    // clean payload and build $set
    const payload = { ...req.body };
    delete payload._id;
    delete payload.id;
    Object.keys(payload).forEach(k => {
      if (typeof payload[k] === 'undefined') delete payload[k];
    });
    console.log('Using $set payload =', payload);

    // perform update using findOneAndUpdate to get query details in mongoose debug
    mongoose.set('debug', true); // enable debug logging of queries (prints to console)
    const updated = await Game.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true, context: 'query' }
    );
    mongoose.set('debug', false); // turn off debug to avoid noisy logs afterwards

    // show result and also list any documents that match the updated fields (for debugging)
    console.log('Document AFTER update (result):', updated);
    if (payload.title) {
      const sameTitle = await Game.find({ title: payload.title }).lean();
      console.log('Documents with same title after update (count):', sameTitle.length);
      // only print small info for each
      console.log(sameTitle.map(d => ({ _id: d._id.toString(), title: d.title })));
    }

    console.log('--- DIAGNOSTIC PUT END ---');

    if (!updated) return res.status(404).json({ error: 'Game no encontrado' });
    return res.json(updated);
  } catch (err) {
    console.error('updateGame diagnostic error:', err);
    return res.status(500).json({ error: 'Error interno al actualizar' });
  }
});


app.delete('/api/games/:id', async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ message: 'El juego fue eliminado' });
});

/* --- Reviews --- */
app.get('/api/games/:gameId/reviews', async (req, res) => {
  const reviews = await Review.find({ game: req.params.gameId }).sort({ createdAt: -1 });
  res.json(reviews);
});

app.post('/api/games/:gameId/reviews', async (req, res) => {
  const review = new Review({ ...req.body, game: req.params.gameId });
  await review.save();
  res.status(201).json(review);
});

app.delete('/api/reviews/:id', async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Rese�a eliminada' });
});

app.put('/api/reviews/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!updated) return res.status(404).json({ error: 'Reseña no encontrada' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));
