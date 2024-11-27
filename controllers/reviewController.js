const asyncHandler = require('express-async-handler');
const { User, Review } = require('../Associations/Association');
const { getLocalizedMessage } = require('../config/localization/index.js');

exports.createReview = asyncHandler(async (req, res, next) => {
    const { rating, comment, engineerID } = req.body;
    const userID = req.user.id;

    // Check if the user exists
    const user = await User.findByPk(userID);
    if (!user) {
        return res.status(404).json({ 
            state: "Not Found", 
            message: getLocalizedMessage(req.locale, 'user.notFound', { id: userID }) 
        });
    }

    // Create the new review
    const newReview = await Review.create({
        rating,
        comment,
        engineerID: engineerID,
        userName: user.name,
    });

    // Fetch all reviews for the engineer
    const reviews = await Review.findAll({ where: { engineerID: engineerID } });

    // Calculate the sum of ratings and count of reviews
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const countReviews = reviews.length;

    // Calculate the average rating and round to the nearest whole number
    const averageRating = countReviews ? Math.round(totalRatings / countReviews) : 0;

    // Respond with the new review, the number of ratings, and the average rating
    res.status(200).json({
        newReview,
        numberOfRatings: countReviews,
        ratingAverage: averageRating,
        message: getLocalizedMessage(req.locale, 'review.createdSuccessfully')
    });
});

exports.getAllReview = asyncHandler(async (req, res, next) => {
    const { id: engineerID } = req.params; // Engineer ID from route params
    const { page = 1, limit = 10 } = req.query;  // Page and limit from query parameters

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'pagination.invalidPage') });
    }

    if (isNaN(limitNumber) || limitNumber <= 0) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'pagination.invalidLimit') });
    }

    // Calculate offset
    const offset = (pageNumber - 1) * limitNumber;

    // Fetch reviews with pagination
    const { rows: reviews, count: totalReviews } = await Review.findAndCountAll({
        where: { engineerID: engineerID },
        limit: limitNumber,
        offset,
    });

    // Calculate the sum of ratings and count of reviews
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const countReviews = reviews.length;

    // Calculate the average rating and round up
    const averageRating = countReviews ? Math.ceil(totalRatings / countReviews) : 0;

    // Respond with the reviews, the number of ratings, the average rating, and pagination info
    res.status(200).json({
        reviews,
        numberOfRatings: countReviews,
        ratingAverage: averageRating,
        totalPages: Math.ceil(totalReviews / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
        message: getLocalizedMessage(req.locale, 'review.fetchSuccess')
    });
});
