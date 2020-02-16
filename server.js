const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

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
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
