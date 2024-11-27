// // const OnlineUser = require('../../../models/OnlineUser');

// const createUser = async (newUser) => {
//   try {
//     await OnlineUser.create(newUser);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const setUserStatus = async (id, status) => {
//   try {
//     await OnlineUser.update({ isBusy: status }, { where: { id } });
//   } catch (error) {
//     console.error(error);
//   }
// };

// const deleteUserBySocketId = async (socketId) => {
//   try {
//     const user = await OnlineUser.findOne({ where: { socketId } });
//     if (user) {
//       await user.destroy();
//       return user;
//     }
//     return null;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const getUserById = async (id) => {
//   try {
//     return await OnlineUser.findByPk(id);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const getAllUsers = async () => {
//   try {
//     return await OnlineUser.findAll();
//   } catch (error) {
//     console.error(error);
//   }
// };

// module.exports = {
//   createUser,
//   setUserStatus,
//   deleteUserBySocketId,
//   getUserById,
//   getAllUsers
// };
