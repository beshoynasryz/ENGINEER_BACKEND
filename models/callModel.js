// const DataTypes = require("sequelize")
// const sequelize = require("../config/dbConfig");


// const Call = sequelize.define('Call', {
//     callID: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     callerID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'user', // Assuming 'users' is the name of your User table
//             key: 'userID'
//         }
//     },
//     lawyerID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'user', // Assuming 'users' is the name of your User table
//             key: 'userID'
//         }
//     },
//     startTime: {
//         type: DataTypes.DATE,
//         allowNull: false
//     },
//     endTime: {
//         type: DataTypes.DATE,
//         allowNull: true
//     },
//     duration: {
//         type: DataTypes.INTEGER,
//         allowNull: true // Duration in seconds
//     },
    
}, {
    tableName: 'calls',
    timestamps: true 
});
module.exports = Call;
    
// }, {
//     tableName: 'calls',
//     timestamps: true 
// });
// module.exports = Call;