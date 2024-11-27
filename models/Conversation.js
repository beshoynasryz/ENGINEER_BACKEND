const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'Conversations',
  timestamps: true
});

module.exports = Conversation;
