const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  const reviews = await Review.find({ game: req.params.id });
  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    game: req.params.id
  });

  res.json(review);
};

exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "Review eliminada" });
};
