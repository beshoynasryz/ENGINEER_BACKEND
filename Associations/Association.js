const Project = require('../models/projectModel');
const Note = require('../models/notesmodel');
const Review = require('../models/reviewModel');

const User = require('../models/userModel');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Transaction = require("../models/transaction");

// User and Conversation association (many-to-many)
User.belongsToMany(Conversation, {  onDelete: 'CASCADE',
  through: 'User_Conversation' });
Conversation.belongsToMany(User, {  onDelete: 'CASCADE',
  through: 'User_Conversation' });

// Conversation and Message association (one-to-many)
Conversation.hasMany(Message, {  onDelete: 'CASCADE',
  foreignKey: 'conversationId' });
Message.belongsTo(Conversation, {  onDelete: 'CASCADE',
  foreignKey: 'conversationId' });

// User and Message association (one-to-many)
User.hasMany(Message, {  onDelete: 'CASCADE',
  foreignKey: 'senderId' });
Message.belongsTo(User, {  onDelete: 'CASCADE',
  as: 'Sender', foreignKey: 'senderId' });




// User-Project associations
User.hasMany(Project, {
  foreignKey: 'clientId',
  as: 'clientProjects',
});

User.hasMany(Project, {
  foreignKey: 'engineerId',
  as: 'engineerProjects',
});

Project.belongsTo(User, {
  foreignKey: 'clientId',
  as: 'client',
});

Project.belongsTo(User, {
  foreignKey: 'engineerId',
  as: 'engineer',
});

// Project-Note associations
Project.hasMany(Note, {
  foreignKey: 'projectId',
  as: 'notes',
});

Note.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});

// User-Review associations
User.hasMany(Review, {
  foreignKey: 'engineerID',
  onDelete: 'CASCADE',
  as: 'engineerReviews'
});

Review.belongsTo(User, {
  foreignKey: 'engineerID',
  onDelete: 'CASCADE',
  as: 'engineer'
});
// Association between User and Transaction
User.hasMany(Transaction, {
  foreignKey: 'userID',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(User, {
  foreignKey: 'userID',
  onDelete: 'CASCADE',
});
module.exports = {
  User,
  Project,
  Note,
  Review,
  Message,
  Conversation,
  Transaction
};
