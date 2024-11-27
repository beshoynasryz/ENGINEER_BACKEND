
// const onlineUsers = {};
// const rooms = {};
// const userStatus = {}; // To track user busy status

// const video = (socket, io) => {
//     // console.log("inside video " , socket.id)
//     const userId = socket.id;
//     onlineUsers[userId] = userId;

//     userStatus[userId] = false;


//     io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));

//     socket.on('startCall', async (calleeSocketId) => {
//         if (!onlineUsers[calleeSocketId]) {
//             socket.emit('error', 'User not found');
//             return;
//         }
//         // Create a unique room ID
//         const roomId = [socket.id, calleeSocketId].sort().join('-');
//         rooms[roomId] = [socket.id, calleeSocketId];

//         socket.join(roomId);
//         io.to(calleeSocketId).emit('incomingCall', {
//             caller: onlineUsers[socket.id],
//             callerSocketId: socket.id,
//             roomId,
//         });

//         socket.emit('callInitiated', { calleeSocketId, roomId });
//     });

//     socket.on('acceptCall', ({ roomId }) => {
//         const room = rooms[roomId];
//         if (!room) {
//             socket.emit('error', 'Room not found');
//             return;
//         }

//         socket.join(roomId);
//         userStatus[socket.id] = true; // Mark user as busy

//         io.to(roomId).emit('callAccepted', { roomId });
//         io.to(roomId).emit('callStarted', { roomId });
//     });
//     socket.on('endCall', ({ roomId }) => {
//         const room = rooms[roomId];
//         if (!room) {
//             socket.emit('error', 'Room not found');
//             return;
//         }

//         // Mark users as not busy
//         room.forEach(id => {
//             userStatus[id] = false;
//         });

//         io.to(roomId).emit('callEnded', { roomId });

//         // Clean up the room 
//         delete rooms[roomId];
//     });
//     socket.on('videoChatOffer', ({ sdp, roomId }) => {
//         // console.log('Video chat offer received for room:', roomId);
//         const room = rooms[roomId];
//         if (!room) {
//             socket.emit('error', 'Room not found');
//             return;
//         }

//         const otherUser = room.find(id => id !== socket.id);
//         if (otherUser) {
//             io.to(otherUser).emit('getVideoChatOffer', { sdp, roomId });
//         }
//     });

//     socket.on('videoChatAnswer', ({ sdp, roomId }) => {
//         // console.log('Video chat answer received for room:', roomId);
//         const room = rooms[roomId];
//         if (!room) {
//             socket.emit('error', 'Room not found');
//             return;
//         }

//         const otherUser = room.find(id => id !== socket.id);
//         if (otherUser) {
//             io.to(otherUser).emit('getVideoChatAnswer', { sdp });
//         }
//     });

//     socket.on('candidate', ({ candidate, roomId }) => {
//         // console.log('Candidate received for room:', roomId);
//         const room = rooms[roomId];
//         if (!room) {
//             socket.emit('error', 'Room not found');
//             return;
//         }

//         const otherUser = room.find(id => id !== socket.id);
//         if (otherUser) {
//             io.to(otherUser).emit('getCandidate', candidate);
//         }
//     });

//     socket.on('disconnect', () => {
//         // console.log('User disconnected:', socket.id);
//         delete onlineUsers[socket.id];
//         io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));

//         for (const roomId in rooms) {
//             rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
//             if (rooms[roomId].length === 0) {
//                 delete rooms[roomId];
//             } else {
//                 io.to(roomId).emit('userLeft');
//             }
//         }
//     });
// };

// module.exports = video;
