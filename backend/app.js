const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const customerRoutes = require("./routes/customerRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "BashaLagbe API is running",
    version: "1.0.0"
  });
});

// API routes
app.use("/api/customer", customerRoutes);
app.use("/api/auction", auctionRoutes); // Fixed typo
app.use("/api/rating", ratingRoutes); // Module 1: Rating system

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server started on port ${port}`));

module.exports = app;