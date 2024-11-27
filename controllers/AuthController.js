const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/jwtConfig');
const { getLocalizedMessage } = require('../config/localization/index.js');
const asyncHandler = require('express-async-handler');

const validSpecializations = ['architect', 'interior']; 

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



const registerUser = asyncHandler(async (req, res) => {
    const { role, name, phone_number, password, confirm_password, specialization } = req.body;
    if (!password || !confirm_password) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'user.loginError') });
    }


    const phoneValidation = validatePhoneNumber(phone_number);
    if (!phoneValidation.valid) {
        return res.status(400).json({ error: phoneValidation.message });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'user.passwordMismatch') });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const certificationPath = req.files['certification'] ? `/images/${req.files['certification'][0].filename}` : null;

    if (role !== 'client' && specialization) {
        if (!validSpecializations.includes(specialization.toLowerCase())) {
            return res.status(400).json({ error: getLocalizedMessage(req.locale, 'user.invalidSpecialization') });
        }
    }

    const newUser = await User.create({
        role,
        name,
        phone_number,
        password: hashedPassword,
        specialization: specialization ? specialization.toLowerCase() : null,
        certification: certificationPath,
        status: role === 'engineer' ? 'pending' : null
    });

    const token = jwt.sign({ id: newUser.userID, role: newUser.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res.status(201).json({ token, msg: getLocalizedMessage(req.locale, 'user.registerSuccess'), data: newUser });
});

const loginUser = asyncHandler(async (req, res) => {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'user.loginError') });
    }
    const phoneValidation = validatePhoneNumber(phone_number);
    if (!phoneValidation.valid) {
        return res.status(400).json({ error: phoneValidation.message });
    }

    if (!phone_number || !password) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'user.loginError') });
    }

    const user = await User.findOne({ where: { phone_number } });

    if (!user) {
        return res.status(404).json({ error: getLocalizedMessage(req.locale, 'user.userNotFound') });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: getLocalizedMessage(req.locale, 'user.invalidPassword') });
    }

    if (user.role === 'engineer' && ['pending', 'reject'].includes(user.status)) {
        return res.status(403).json({ error: getLocalizedMessage(req.locale, 'user.accountInactive') });
    }

    const token = jwt.sign({ id: user.userID, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res.json({ token, data: user });
});

const updateUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['accept', 'reject'].includes(status)) {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'user.statusInvalid') });
    }

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ error: getLocalizedMessage(req.locale, 'user.userNotFound') });
    }

    if (user.role !== 'engineer') {
        return res.status(400).json({ error: getLocalizedMessage(req.locale, 'user.statusInvalid') });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ msg: getLocalizedMessage(req.locale, 'user.statusUpdated'), data: user });
});

module.exports = {
    registerUser,
    loginUser,
    updateUserStatus
};
