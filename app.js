const express = require('express');
const morgan = require('morgan');

//getting the Routers for the particular route file
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//getting the global Error handler
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

//Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

//Routes
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
//app.post('/api/v1/tours', createTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

//Router Mountaing
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Cant find ${req.originalUrl} on this server`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
