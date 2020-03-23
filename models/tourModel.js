const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');


const tourschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A Tour name must have less or equal a 40 characters'],
      minlength: [10, 'A Tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour must contain only characters']
    },
    slug: String,
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
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1'],
      max: [5, 'Ratings must be below 5'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // Does not work when we update the document
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be less then actual price'
      }
    },
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
      default: Date.now(), // in mangoo it converts to date
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//tourschema.index({ price: 1 })
tourschema.index({ price: 1, ratingsAverage: -1 }) //compound index
tourschema.index({ slug: 1 })


// This is a opertional logic to show in the UI the total no of weeks
//using Virtual it creates the entery in doucument model but does not store in actual database model
tourschema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate
tourschema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

//Document MiddleWare And will be called before saving the document in the database model
// and runs before .save() and .create()
tourschema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourschema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromises)
//   next()
// })

// tourschema.pre('save', function(next){
//   console.log('will save document')
//   next()
// })

// tourschema.post('save', function(doc, next) {
//   console.log(doc)
//   next()
// })

//Query MiddleWare
tourschema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  //this.start = Date.now();
  next();
});

tourschema.post(/^find/, function (docs, next) {
  //console.log(`Query took ${Date.now() - this.start} millisec`);
  // console.log(docs);
  next();
});

tourschema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next()
})

// Aggregation middleware
tourschema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
