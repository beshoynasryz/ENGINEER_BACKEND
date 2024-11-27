const asyncHandler = require('express-async-handler');
const Note = require('../models/notesmodel');
const Project = require('../models/projectModel');
const { getLocalizedMessage } = require('../config/localization/index.js');

const createNote = asyncHandler(async (req, res) => {
    const { content, projectId } = req.body;

    // Validate the input
    if (!content || !projectId) {
        return res.status(400).json({ message: getLocalizedMessage(req.locale, 'note.contentProjectIdRequired') });
    }

    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
        return res.status(404).json({ message: getLocalizedMessage(req.locale, 'note.projectNotFound') });
    }

    // Create the note
    const newNote = await Note.create({
        content,
        projectId,
    });

    res.status(201).json({ message: getLocalizedMessage(req.locale, 'note.createdSuccessfully'), note: newNote });
});

module.exports = {
    createNote,
};
