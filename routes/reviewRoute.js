const router = require('express').Router()
const reviewController = require('../controllers/reviewController');
const { Auth } = require('../middlewares/AuthMiddleware');



router.post('/create',Auth, reviewController.createReview);


router.get('/engineer/:id' ,  reviewController.getAllReview);

module.exports = router; 
