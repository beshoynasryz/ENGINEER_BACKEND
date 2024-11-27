const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserStatus
} = require('../controllers/AuthController');
const { upload } = require('../middlewares/uploadMiddleware');
const { Auth, AuthorizeRole } = require('../middlewares/AuthMiddleware');
const localizationMiddleware = require('../middlewares/localizationMiddleware');

router.use(localizationMiddleware);

// Routes


router.post('/register',upload.fields([
  { name: 'certification', maxCount: 1 }
]) , registerUser);
router.post('/login', loginUser);
router.put('/status/:userId', Auth, AuthorizeRole('admin'), updateUserStatus);

module.exports = router;
