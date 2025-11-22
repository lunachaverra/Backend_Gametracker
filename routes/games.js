const express = require('express');
const router = express.Router();
const gameCtrl = require('../controllers/gameController');

router.get('/', gameCtrl.getGames);
router.post('/', gameCtrl.createGame);
router.put('/:id', gameCtrl.updateGame);
router.delete('/:id', gameCtrl.deleteGame);

module.exports = router;
