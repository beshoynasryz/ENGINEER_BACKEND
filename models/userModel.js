const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('User', {
  userID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  role: {
    type: DataTypes.ENUM('client', 'engineer'),
    allowNull: false
  },
  name: {
    
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialization: {
    type: DataTypes.ENUM('architect', 'interior'), // Enum values
    allowNull: true,
  },
  certification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accept', 'reject'),
    allowNull: true,
    validate: {
      isStatusValid(value) {
        if (this.role === 'engineer' && !value) {
          throw new Error('Status is required for engineers');
        }
      }
    }
  }
}, {
  tableName: 'User',
  hooks: {
    beforeValidate: (user) => {
        if (user.role === 'client') {
            // Clear engineer-specific fields if role is client
            user.specialization = null;
            user.certification = null;
            user.status = null;
        } else if (user.role === 'engineer') {
            // Ensure specialization is not null
            if (!user.specialization) {
                throw new Error('Specialization is required for engineers');
            }
        }
    }
}

});

module.exports = User;
