// const { Room } = require('../../../models/Room');

// const createRoom = async () => {
//   try {
//     const room = await Room.create({ users: [] });
//     return room.id;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// const addUserBySocketId = async (roomId, socketId) => {
//   try {
//     const user = await User.findOne({ where: { socketId } });
//     const room = await Room.findByPk(roomId);

//     if (user && room) {
//       const users = room.users ? [...room.users, user.id] : [user.id];
//       await room.update({ users });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// const getRoom = async (roomId) => {
//   try {
//     return await Room.findByPk(roomId);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const deleteRoomById = async (roomId) => {
//   try {
//     const room = await Room.findByPk(roomId, { include: User });

//     if (room) {
//       await room.destroy();
//       return room;
//     }
//     return null;
//   } catch (error) {
//     console.error(error);
//   }
// };

// module.exports = {
//   createRoom,
//   addUserBySocketId,
//   getRoom,
//   deleteRoomById
// };


// // 
// // const { Room, User } = require('../models');

// // const createRoom = async () => {
// //   try {
// //     const room = await Room.create({ users: [] });
// //     return room.id;
// //   } catch (error) {
// //     console.error(error);
// //     return null;
// //   }
// // };

// // const addUserBySocketId = async (roomId, socketId) => {
// //   try {
// //     const user = await User.findOne({ where: { socketId } });
// //     const room = await Room.findByPk(roomId);

// //     if (user && room) {
// //       const users = room.users ? [...room.users, user.id] : [user.id];
// //       await room.update({ users });
// //     }
// //   } catch (error) {
// //     console.error(error);
// //   }
// // };

// // const deleteRoomById = async (roomId) => {
// //   try {
// //     const room = await Room.findByPk(roomId, { include: User });

// //     if (room) {
// //       await room.destroy();
// //       return room;
// //     }
// //     return null;
// //   } catch (error) {
// //     console.error(error);
// //   }
// // };

// // module.exports = {
// //   createRoom,
// //   addUserBySocketId,
// //   deleteRoomById
// // };
