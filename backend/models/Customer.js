const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Module 1: User Type System
    userType: {
      type: String,
      enum: ['landlord', 'tenant', 'roommate'],
      default: 'tenant',
    },
    // Module 1: Profile Information
    bio: {
      type: String,
      required: false,
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    // Module 1: Rating System
    landlordRating: {
      totalRatings: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      ratings: [{
        ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }]
    },
    roommateRating: {
      totalRatings: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      ratings: [{
        ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now }
      }]
    },
    // Module 1: Building Ratings for Landlords
    buildingRatings: [{
      buildingName: String,
      rating: { type: Number, min: 1, max: 5 },
      ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }],
    // Module 1: Properties owned (for landlords)
    propertiesOwned: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction'
    }],
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
