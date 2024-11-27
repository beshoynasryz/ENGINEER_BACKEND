const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('../models/userModel'); // Import the User model

const Project = sequelize.define('Project', {
  projectID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accept', 'reject','completed'),
    allowNull: true,
    defaultValue: 'pending', 
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  client_files: {
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: [],
  },
  engineer_files: {
    type: DataTypes.JSON, 
    allowNull: true,
    defaultValue: [],
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
 
  engineerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User, // References the User model
      key: 'userID',
    },
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'userID',
    },
  },
}, {
  tableName: 'projects',
  timestamps: true, // This will add createdAt and updatedAt columns
});

module.exports = Project;
