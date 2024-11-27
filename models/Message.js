const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User', // Ensure this matches the name of your User table
      key: 'userID'
    }
  },
  message_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  message_type: {
    type: DataTypes.STRING,
    defaultValue: 'text'
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read'),
    defaultValue: 'sent'
  }
}, {
  tableName: 'Messages',
  timestamps: true
});

module.exports = Message;
