const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Note = sequelize.define('Note', {
  noteID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'projectID',
    },
  },

}, {
  tableName: 'notes',
  timestamps: true, 
});

module.exports = Note;
