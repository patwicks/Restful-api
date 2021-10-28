const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// router
const DriverRoute = require("./routes/route.driver");
const StoreRoute = require("./routes/route.store");
const MessageRoute = require("./routes/route.message");
const CoversationRoute = require("./routes/route.conversation");
const ServiceRequestRoute = require("./routes/route.serviceRequest");
const FeedbackRoute = require("./routes/route.feedback");
dotenv.config();
app.use(express.json());
app.use(cors());

// routes
app.use("/api/driver", DriverRoute);
app.use("/api/store", StoreRoute);
app.use("/api/message", MessageRoute);
app.use("/api/conversation", CoversationRoute);
app.use("/api/service", ServiceRequestRoute);
app.use("/api/feedback", FeedbackRoute);
// connect to the database
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We are now connected to the Database");
});

//listening port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is running to port ${port}...`);
});
