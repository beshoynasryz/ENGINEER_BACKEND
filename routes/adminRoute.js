const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    getAdminProfile
} = require('../controllers/AdminController');
const { Auth, AuthorizeRole } = require('../middlewares/AuthMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

// Register Admin
router.post('/register', registerAdmin);

// Login Admin
router.post('/login', loginAdmin);
router.get('/Profile', Auth ,getAdminProfile);

// Get All Admins
router.get('/',Auth,AuthorizeRole('superadmin','admin'), getAllAdmins);

// Get Admin by ID
router.get('/:id', getAdminById);

// Update Admin
router.put('/:id', Auth, AuthorizeRole('superadmin', 'admin'), upload.single('image'), updateAdmin);

// Delete Admin
router.delete('/:id',Auth,AuthorizeRole('superadmin','admin'), deleteAdmin);

module.exports = router;
