const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const DriverRoute = require('./routes/route.driver');
const StoreRoute = require('./routes/route.store');

dotenv.config();
// routes
app.use(express.json());
app.use(cors());
app.use('/api/driver', DriverRoute);
app.use('/api/store', StoreRoute);

// connect to the database
mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are now connected to the Database');
});

//listening port
const port = process.env.PORT || 3000;
app.listen(port, ()=> { console.log(`App is running to port ${port}...` )})


