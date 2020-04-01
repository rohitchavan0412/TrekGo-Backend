const express = require('express');
const morgan = require('morgan');

//getting the Routers for the particular route file
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouter')
const viewRouter = require('./routes/viewRoutes')

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

//to tell express the patg of resources 
const path = require('path')

//getting the global Error handler
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// cookie parser 
const cookieParser = require('cookie-parser')

const app = express();

//set the template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//Global Middlewares

//to server the static file
app.use(express.static(path.join(__dirname, 'resources')));


//https://github.com/helmetjs/helmet
//set secure HTTP
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//https://www.npmjs.com/package/express-rate-limit
// limit the request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again after an hour'
});
app.use('/api', limiter);

//Body parser, reading data from bady into req.bady
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// NOSql injection
app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//Router Mountaing
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
  const err = new AppError(`Cant find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
