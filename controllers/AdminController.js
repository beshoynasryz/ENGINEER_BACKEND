const Admin = require('../models/adminModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_EXPIRATION, JWT_SECRET } = require('../config/jwtConfig');
const { getLocalizedMessage } = require('../config/localization/index.js');
const { Op } = require('sequelize');

const countryPhoneSpecs = {
    '+20': 10,    // Egypt
    '+213': 9,    // Algeria
    '+973': 8,    // Bahrain
    '+269': 7,    // Comoros
    '+253': 8,    // Djibouti
    '+964': 10,   // Iraq
    '+962': 9,    // Jordan
    '+965': 8,    // Kuwait
    '+961': 8,    // Lebanon
    '+218': 10,   // Libya
    '+222': 8,    // Mauritania
    '+212': 9,    // Morocco
    '+968': 8,    // Oman
    '+970': 9,    // Palestine
    '+974': 8,    // Qatar
    '+966': 9,    // Saudi Arabia
    '+252': [7, 9], // Somalia (7 or 9 digits)
    '+249': 9,    // Sudan
    '+963': 9,    // Syria
    '+216': 8,    // Tunisia
    '+971': 9,    // UAE
    '+967': 9,    // Yemen
};
  
// Helper function to determine country code and validate phone number
const validatePhoneNumber = (phone_number) => {
    // Extract the first 3 or 2 digits to identify the country code
    const possibleCountryCodes = Object.keys(countryPhoneSpecs);
    
    // Try extracting country code (3 digits and then 2 digits)
    const countryCode = possibleCountryCodes.find(code => phone_number.startsWith(code));
    
    if (!countryCode) {
        return { 
            valid: false, 
            message: "Invalid country code." 
        };
    }
    
    // Remove the country code from the phone number
    const remainingNumber = phone_number.slice(countryCode.length);

    // Get the expected length for the remaining part of the phone number
    const expectedLength = countryPhoneSpecs[countryCode];
    
    // Handle Somalia special case (either 7 or 9 digits)
    if (Array.isArray(expectedLength)) {
        if (!expectedLength.includes(remainingNumber.length)) {
            return { 
                valid: false, 
                message: `Phone number should have ${expectedLength.join(' or ')} digits.` 
            };
        }
    } else if (remainingNumber.length !== expectedLength) {
        return { 
            valid: false, 
            message: `Phone number should have ${expectedLength} digits.` 
        };
    }
  
    // If valid
    return { valid: true, countryCode };
};


// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, phone_number, password, confirm_password, role } = req.body;

    if (!password || !confirm_password || password !== confirm_password) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'admin.passwordMismatch') });
    }

    const phoneValidation = validatePhoneNumber(phone_number);
    if (!phoneValidation.valid) {
        return res.status(400).json({ error: phoneValidation.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
   
    const newAdmin = await Admin.create({
        name,
        phone_number,
        role,
        password: hashedPassword,
       
    });

    res.status(201).json({
        message: getLocalizedMessage(req.locale, 'admin.registerSuccess'),
        data: newAdmin,
    });
});


// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { phone_number, password, role } = req.body; // Add role to request body

    // Find admin by phone number and role
    const admin = await Admin.findOne({ where: { phone_number, role } });

    // Check if admin exists and password matches
    if (admin && (await bcrypt.compare(password, admin.password))) {

        // Generate JWT token
        const token = jwt.sign({ id: admin.adminID, role: admin.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        // Exclude password from the admin data and send role
        const { password, ...adminData } = admin.toJSON(); // Remove password

        // Return the token and admin data excluding the password
        res.json({ 
            token, 
            admin: adminData,  // Send admin data without the password
            message: getLocalizedMessage(req.locale, 'admin.loginSuccess') 
        });
    } else {
        res.status(401).json({ error: getLocalizedMessage(req.locale, 'admin.loginInvalidCredentials') });
    }
});


// Get All Admins
const getAllAdmins = asyncHandler(async (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Validate the pagination parameters
    if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
        return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    // Prepare the filter conditions
    const filterConditions = {
        name: { [Op.like]: `%${search}%` }, // Case-insensitive filter by admin name
        phone_number: { [Op.like]: `%${search}%` } // Case-insensitive filter by phone number
    };

    // Fetch admins based on the filter conditions
    const { count, rows } = await Admin.findAndCountAll({
        where: {
            [Op.or]: [
                { name: filterConditions.name }, // Search by name
                { phone_number: filterConditions.phone_number } // Search by phone number
            ]
        },
        limit: limitNumber,
        offset,
    });

    // Send paginated response
    res.status(200).json({
        total: count,
        totalPages: Math.ceil(count / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
        data: rows.length > 0 ? rows : [],
    });
});

// Get Admin by ID
const getAdminById = asyncHandler(async (req, res) => {
    const admin = await Admin.findByPk(req.params.id);
  

    if (admin) {
        res.json(admin);
    } else {
        res.status(404).json({ error: getLocalizedMessage(req.locale, 'admin.notFound') });
    }
});

// Update Admin
const updateAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findByPk(req.params.id);

    if (!admin) {
        return res.status(404).json({ error: getLocalizedMessage(req.locale, 'admin.notFound') });
    }

    const { name, phone_number, role } = req.body;

    // Validate phone number if provided
    if (phone_number) {
        const phoneValidation = validatePhoneNumber(phone_number);
        if (!phoneValidation.valid) {
            return res.status(400).json({ error: phoneValidation.message });
        }
    }

    const imagePath = req.files && req.files['image'] 
        ? `/images/${req.files['image'][0].filename}` 
        : admin.image;

    await admin.update({
        name,
        phone_number,
        role,
        image: imagePath,  // Update image if a new one is uploaded
    });

    res.json({
        message: getLocalizedMessage(req.locale, 'admin.updated'),
        data: admin,
    });
});

// Delete Admin
const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findByPk(req.params.id);
  

    if (admin) {
        await admin.destroy();
        res.json({ message: getLocalizedMessage(req.locale, 'admin.deleted') });
    } else {
        res.status(404).json({ error: getLocalizedMessage(req.locale, 'admin.notFound') });
    }
});

// Get Admin Profile
const getAdminProfile = asyncHandler(async (req, res) => {
    const { id } = req.user; // Extract admin ID from the token payload
  

    // Fetch admin profile
    const admin = await Admin.findByPk(id, {
        attributes: ['adminID', 'phone_number','image', 'role']
    });

    if (!admin) {
        return res.status(404).json({ error: getLocalizedMessage(req.locale, 'admin.fetchError') });
    }

    res.status(200).json({ admin, message: getLocalizedMessage(req.locale, 'admin.fetchProfileSuccess') });
});

module.exports = {
    registerAdmin,
    loginAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    getAdminProfile
};
