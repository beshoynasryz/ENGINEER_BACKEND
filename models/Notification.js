const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");


const Notification = sequelize.define('Notification', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  type: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  message: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
  }
 
}, {
  timestamps: true,
});

// Export the model for use in your application
module.exports = Notification;