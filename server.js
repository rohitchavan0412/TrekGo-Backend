const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.log(err.name, err.message, err.stack);
  console.log('Uncaught Exception 💥 Shutting down...');
  process.exit(1);
});

//Replace the <PASSWORD> string with actual password from the config file
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//DataBase Connection code
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(connection => {
    //console.log(connection.connections);
    console.log(`connection successful`);
  });

const app = require('./app');
//starting the server
const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//if any error(unhandle promise) comes and if it is not handle then this code is executed and it will shut down the system
//only the promise that are related to database
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
 
