const express = require("express");
const router = express.Router();
const {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  bidAuctionbyId,
  bidpayId,
} = require("../controller/auctionController");

// create auction
router.post("/createauction", createAuction);

router.post("/editaction/:id", updateAuction);

// get all auctions
router.get("/getallauctoin", getAllAuctions);

// get a specific auction by ID
router.get("/:email", getAuctionById);

// update an auction by ID
router.put("/:id", updateAuction);

router.put("/bid/:id", bidAuctionbyId);

router.put("/bid/pay/:id", bidpayId);

// delete an auction by ID
router.delete("/:id", deleteAuction);

module.exports = router;
