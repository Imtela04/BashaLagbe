const Rating = require("../models/Rating");
const Customer = require("../models/Customer");

// Submit a rating
const submitRating = async (req, res) => {
  try {
    const { ratedUserId, ratingType, rating, comment, buildingName, propertyId } = req.body;
    const ratedBy = req.user._id; // From auth middleware

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).send({ message: "Rating must be between 1 and 5" });
    }

    // Check if user exists
    const ratedUser = await Customer.findById(ratedUserId);
    if (!ratedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if rating already exists
    let existingRating = await Rating.findOne({
      ratedUser: ratedUserId,
      ratedBy: ratedBy,
      ratingType: ratingType
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment;
      if (buildingName) existingRating.buildingName = buildingName;
      if (propertyId) existingRating.property = propertyId;
      await existingRating.save();
    } else {
      // Create new rating
      existingRating = new Rating({
        ratedUser: ratedUserId,
        ratedBy: ratedBy,
        ratingType: ratingType,
        rating: rating,
        comment: comment,
        buildingName: buildingName,
        property: propertyId
      });
      await existingRating.save();
    }

    // Update customer's rating statistics
    await updateCustomerRatingStats(ratedUserId, ratingType);

    res.status(200).send({
      message: "Rating submitted successfully",
      rating: existingRating
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Helper function to update customer rating statistics
const updateCustomerRatingStats = async (userId, ratingType) => {
  const ratings = await Rating.find({ ratedUser: userId, ratingType: ratingType });
  
  if (ratings.length === 0) return;

  const totalRatings = ratings.length;
  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

  const customer = await Customer.findById(userId);
  
  if (ratingType === 'landlord') {
    customer.landlordRating.totalRatings = totalRatings;
    customer.landlordRating.averageRating = averageRating;
  } else if (ratingType === 'roommate') {
    customer.roommateRating.totalRatings = totalRatings;
    customer.roommateRating.averageRating = averageRating;
  }

  await customer.save();
};

// Get ratings for a user
const getUserRatings = async (req, res) => {
  try {
    const { userId, ratingType } = req.params;

    const query = { ratedUser: userId };
    if (ratingType) {
      query.ratingType = ratingType;
    }

    const ratings = await Rating.find(query)
      .populate('ratedBy', 'name image')
      .sort({ createdAt: -1 });

    res.send(ratings);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get user's rating statistics
const getUserRatingStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).send({ message: "User not found" });
    }

    const stats = {
      landlordRating: customer.landlordRating,
      roommateRating: customer.roommateRating,
    };

    res.send(stats);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a rating (only by the person who submitted it)
const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findOne({ _id: ratingId, ratedBy: userId });
    
    if (!rating) {
      return res.status(404).send({ message: "Rating not found or unauthorized" });
    }

    await Rating.deleteOne({ _id: ratingId });
    
    // Update rating statistics
    await updateCustomerRatingStats(rating.ratedUser, rating.ratingType);

    res.send({ message: "Rating deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  submitRating,
  getUserRatings,
  getUserRatingStats,
  deleteRating
};
