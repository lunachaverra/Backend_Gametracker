const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controllers/reviewController');

router.get('/:id', reviewCtrl.getReviews);
router.post('/:id', reviewCtrl.createReview);
router.delete('/:id', reviewCtrl.deleteReview);

module.exports = router;
