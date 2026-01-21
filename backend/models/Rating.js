const mongoose = require("mongoose");

// Rating model for landlord and roommate ratings
const ratingSchema = new mongoose.Schema(
  {
    // Who is being rated
    ratedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    // Who submitted the rating
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    // Type of rating
    ratingType: {
      type: String,
      enum: ['landlord', 'roommate', 'building'],
      required: true
    },
    // Rating value (1-5 stars)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Optional comment
    comment: {
      type: String,
      required: false
    },
    // For building ratings
    buildingName: {
      type: String,
      required: false
    },
    // Related property (optional)
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: false
    }
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only rate another user once per type
ratingSchema.index({ ratedUser: 1, ratedBy: 1, ratingType: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
