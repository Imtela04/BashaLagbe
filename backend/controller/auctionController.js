const Auction = require("../models/Auction");

const createAuction = async (req, res) => {
  try {
    const newAuction = new Auction({
      email: req.body.email,
      homeName: req.body.homeName,
      locationName: req.body.locationName,
      homeSize: req.body.homeSize,
      startingPrice: req.body.startingPrice,
      date: req.body.date,
      details: req.body.details,
      image: req.body.image,
      //auctionStartTime: req.body.auctionStartTime,
      //auctionEndTime: req.body.auctionEndTime,
    });

    const auction = await newAuction.save();

    res.status(200).send({
      message: "Auction created successfully!",
      auction,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({}).sort({ timestamp: -1 });
    res.send(auctions);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAuctionById = async (req, res) => {
  const email = req.params.email;
  try {
    const auction = await Auction.find({ email });
    res.send(auction);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findOne({ _id: req.params.id });

    if (auction) {
      auction.homeName = req.body.homeName;
      auction.homeSize = req.body.homeSize;
      auction.details = req.body.details;
      auction.image = req.body.image;

      const updatedAuction = await auction.save();

      res.send({
        message: "Auction updated successfully!",
        auction: updatedAuction,
      });
    } else {
      res.status(404).send({
        message: "This Auction not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteAuction = async (req, res) => {
  try {
    await Auction.deleteOne({ _id: req.params.id });

    res.status(200).send({
      message: "Auction deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const bidAuctionbyId = async (req, res) => {
  const auctionId = req.params.id; // Extract auction ID from URL
  const { email, trxnid, bidderName, bidAmount } = req.body; // Extract bidder information from request body

  try {
    // Find the auction document by ID and update it
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        $push: {
          bidders: {
            bidderName,
            bidAmount,
            bidtrnx: trxnid,
            bidderEmail: email,
          },
        },
      },
      { new: true } // Returns the updated document
    );

    if (!updatedAuction) {
      return res.status(404).send("Auction not found");
    }

    // Send the updated auction data as a response
    res.status(200).json(updatedAuction);
  } catch (error) {
    // Handle any errors
    res.status(500).send("Server Error: " + error.message);
  }
};

const bidpayId = async (req, res) => {
  const auctionId = req.params.id; // Extract auction ID from URL
  const { trxnid, email } = req.body; // Extract bidder transaction ID and email from request body

  try {
    // Find the auction document by ID
    let auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    // Find the bidder and update payment status
    const bidderIndex = auction.bidders.findIndex(
      (bidder) => bidder.bidtrnx === trxnid && bidder.bidderEmail === email
    );
    if (bidderIndex === -1) {
      return res.status(404).send("Bidder not found");
    }

    auction.bidders[bidderIndex].payment = true; // Update payment status to true

    // Save the updated auction
    const updatedAuction = await auction.save();

    // Send the updated auction data as a response
    res.status(200).json(updatedAuction);
  } catch (error) {
    // Handle any errors
    res.status(500).send("Server Error: " + error.message);
  }
};

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  bidAuctionbyId,
  bidpayId,
};
