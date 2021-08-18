const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/route.driver.auth');

dotenv.config();
// routes
app.use(express.json());
app.use(cors());
app.use('/api/user', authRoute);

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


