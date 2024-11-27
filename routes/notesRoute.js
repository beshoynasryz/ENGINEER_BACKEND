const express = require('express');
const router = express.Router();
const { createNote } = require('../controllers/notesController'); 

// Route to create a new note
router.post('/create', createNote);

module.exports = router;
