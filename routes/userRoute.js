const express = require('express');
const router = express.Router();
const { getAllEngineers, getUserById, getClients, getProfile, countEngineers, countClients, updateProfile, deleteUserById, deleteProfile } = require('../controllers/userController'); // Adjust the path as needed
const { Auth, AuthorizeRole } = require('../middlewares/AuthMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

// Route to get all engineers with optional filters and pagination
router.get('/getProfile'
    ,Auth
   , AuthorizeRole('engineer','client')
    , getProfile);
router.get('/engineers', getAllEngineers);
router.get('/clients', getClients);
router.get('/:id', getUserById);
// Define route for getting profile

router.get('/count/engineers', countEngineers);
router.get('/count/clients', countClients);

router.put('/updateProfile', Auth, AuthorizeRole('engineer', 'client'), upload.fields([
    { name: 'image', maxCount: 1 },        // For profile image
  ]), updateProfile);

  router.delete('/deleteUser/:id', Auth, AuthorizeRole('admin','superadmin'), deleteUserById);

// Route to delete the current user's profile
router.delete('/deleteProfile', Auth, deleteProfile);


module.exports = router;
