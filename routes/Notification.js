const router = require('express').Router();
const {
  markRead , userNotification 
  // , userLogs
} = require('../controllers/Notification');

const { Auth, AuthorizeRole } = require('../middlewares/AuthMiddleware');

router.put('/notification/:id',Auth, markRead);
router.get('/notification',Auth , userNotification);
// router.get('/callLogs',Auth , userLogs);


module.exports = router;
 