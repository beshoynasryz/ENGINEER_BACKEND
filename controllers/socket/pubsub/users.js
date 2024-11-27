// // Import necessary functions
// const { createUser, deleteUserBySocketId, getAllUsers } = require('../controller/User');

// const user = (socket, io) => {
//   socket.on('user entered', async (userId) => {
//     try {
//       await createUser({ socketId: socket.id, userId, isBusy: false });
//       io.emit('get user list', await getAllUsers());
//       io.to(socket.id).emit('get socket id', socket.id);
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   socket.on('update user list', async () => {
//     io.emit('get user list', await getAllUsers());
//   });

//   socket.on('user exit', async () => {
//     await deleteUserBySocketId(socket.id);
//     io.emit('get user list', await getAllUsers());
//   });

//   socket.on('disconnect', async () => {
//     await deleteUserBySocketId(socket.id);
//     io.emit('get user list', await getAllUsers());
//   });
// };

// module.exports = user;
