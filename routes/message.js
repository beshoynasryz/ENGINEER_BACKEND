const express = require('express');
const router = express.Router();
const { getConversation , userConversation } = require('../controllers/messageController'); // Adjust the path as needed
const { Auth, AuthorizeRole } = require('../middlewares/AuthMiddleware');

// Route to get all engineers with optional filters and pagination
router.get('/',Auth, userConversation);
router.get('/:id',Auth,  getConversation); 

module.exports = router;
