const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../models/tourModel');

//Replace the <PASSWORD> string with actual password from the config file
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

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

//Read The JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//import data to database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loaded successfully ');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//delete all data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully ');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
