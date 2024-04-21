const mongoose = require("mongoose");

const bidderSchema = new mongoose.Schema({
  bidderName: {
    type: String,
    required: true,
  },

  bidAmount: {
    type: Number,
    required: true,
  },
  bidtrnx: {
    type: String,
    require: true,
  },
  bidderEmail: {
    type: String,
    require: true,
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

const auctionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },

    locationName: {
      type: String,
      required: true,
    },
    homeName: {
      type: String,
      required: true,
    },
    homeSize: {
      type: Number,
      required: true,
    },
    startingPrice: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    bidders: [bidderSchema],
  },
  {
    timestamps: true,
  }
);

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
