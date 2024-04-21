// Import required modules
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");

const customerRoutes = require("./routes/customerRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const Report = require("./models/report");

// Create express app
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a blank route
app.get("/", (req, res) => {
  res.send("THIS IS THE API");
});

app.use("/api/customer/", customerRoutes);
app.use("/api/auctoin", auctionRoutes);

// app.get("/api/report", async (req, res) => {
//   const reportData = await Report.find({});
//   res.send(reportData);
// });

// app.post("/api/make/report", async (req, res) => {
//   const reportData = req.body;
//   const newReport = new Report(reportData);
//   const savedReport = await newReport.save();
//   res.send(savedReport);
// });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
