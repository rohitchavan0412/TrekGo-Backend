const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//https://mongoosejs.com/docs/index.html
//Displays  all the tours
//200 - Success
exports.getAllTours = catchAsync(async (req, res, next) => {
  //read the data from database.find() method reads all the data from the database
  //find will return array of data and also converts the data in javaScript object
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //console.log('hii');
  const tours = await features.query;
  //query.sort().select().skip().limit()

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
});

//Displays a tour by ID
exports.getTour = catchAsync(async (req, res, next) => {
  //Tour.findOne({ _id: req.params.id}) its short hande is findById()

  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No Tour found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//Creates a new tour
//201 - Created
exports.createTour = catchAsync(async (req, res, next) => {
  //const newTour = new Tour({})
  //newTour.save().then().catch()
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      newTour
    }
  });
});

//updates an exiting tour
exports.updateTour = catchAsync(async (req, res, next) => {
  //console.log(req.params);
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true // validators that are decleare at the schema string,number,number
  });

  if (!tour) {
    return next(new AppError('No Tour found with that id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//delete a tour
//204 No Content
exports.deleteTour = catchAsync(async (req, res, next) => {
  //console.log(req.params);
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No Tour found with that id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/

//TO build a route for the data to be group and analysis it
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

//https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/index.html
//https://docs.mongodb.com/manual/reference/operator/aggregation/project/index.html
//https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      //Deconstructs an array field from the input documents to output a document for each element.
      //Each output document is the input document with the value of the array field replaced by the element.
      $unwind: '$startDates' //
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
