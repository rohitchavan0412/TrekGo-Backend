const mongoose = require('mongoose');

const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a durations']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'A tour must a have a summary'],
    trim: true //only work with string to remove the whiteSpaces before and after
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have an image cover']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now() // in mangoo it converts to date
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
