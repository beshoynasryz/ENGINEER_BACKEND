const onlineUsers = {}; // Maps userId to socketId
const { Conversation, Message } = require('../../../Associations/Association');

const chat = (socket, io) => {
    // Add user to online list
    socket.on('userOnline', ({ userId }) => {
        onlineUsers[userId] = socket.id;
        console.log(`User ${userId} is online with socket ID: ${socket.id}`);

        // Emit the updated list of online users to all clients
        io.emit('onlineUsers', Object.entries(onlineUsers).map(([userId, socketId]) => ({ userId, socketId })));
    });

    // When a user joins a private chat room
    socket.on('joinPrivateChat', async ({ userId1, userId2 }) => {
        try {
            const roomId = [userId1, userId2].sort().join('-');
            let conversation = await Conversation.findOne({ where: { name: roomId } });



            if (!conversation) {
                conversation = await Conversation.create({ name: roomId });
                console.log("Conversation created", conversation);
            }


            // io.to(conversation.name).emit('recieveMessage' , conversation)


            socket.join(conversation.name);

            io.to(conversation.name).emit('roomCreated', roomId)
            console.log(`User ${userId1} joined private chat with ${userId2} in room: ${conversation.name}`);
        } catch (error) {
            console.error("Error joining private chat:", error);
        }
    });

    // Handle sending a message
    socket.on('sendMessage', async (data) => {
        const { senderId, message_text, message_type, roomId } = data;

        try {
            // Find the conversation associated with the roomId
            let conversation = await Conversation.findOne({ where: { name: roomId } });

            if (!conversation) {
                console.error(`Conversation with roomId ${roomId} not found.`);
                return;
            }

            // Determine the initial status of the message
            let initialStatus = 'sent'; // Default status if recipient is offline


            // Save the message to the database
            const newMessage = await Message.create({
                senderId: senderId,
                message_text,
                message_type,
                status: initialStatus, // Set initial status as 'sent'
                conversationId: conversation.id
            });
            console.log("Message saved to database:", newMessage);

            const previousMessages = await Message.findAll({
                where: { conversationId: conversation.id },
                order: [['createdAt', 'ASC']] // Order messages by creation time
            });
            socket.emit('previousMessages', previousMessages)
            
            // io.to(newConversation.name).emit('recieveMessage', newConversation)

            // Find all users in the room
            const usersInRoom = io.sockets.adapter.rooms.get(roomId);

            console.log('99 =======================')
            console.log(usersInRoom)
            if (usersInRoom && usersInRoom.size > 1) {

                // If there are users in the room, check if they include the recipient
                const usersInRoomArray = Array.from(usersInRoom);
                const recipientInRoom = usersInRoomArray.some(socketId => {
                    // Get userId by socketId from onlineUsers
                    return Object.keys(onlineUsers).find(userId => onlineUsers[userId] === socketId);
                });
                console.log("======================70", recipientInRoom)
                if (recipientInRoom) {
                    // If any recipient is in the room, update message status to 'read'
                    initialStatus = 'read';
                    await Message.update({ status: 'read' }, { where: { id: newMessage.id } });
                } else {
                    // If no recipient is in the room, message status remains 'sent'
                    initialStatus = 'delivered';
                    await Message.update({ status: 'delivered' }, { where: { id: newMessage.id } });
                }

                // Emit the message to all users in the room
                usersInRoom.forEach((socketId) => {
                    // Get userId by socketId from onlineUsers
                    const userId = Object.keys(onlineUsers).find(userId => onlineUsers[userId] === socketId);

                    if (userId) {
                        io.to(socketId).emit('receiveMessage', {
                            ...data,
                            messageId: newMessage.id,
                            status: initialStatus
                        });
                        console.log(`Message sent to user ${userId} in room ${roomId}:`, data);
                    } else {
                        console.log(`Socket ID ${socketId} does not have a mapped userId.`);
                    }
                });
            } else {
                // If no users are in the room, the message status remains 'sent'
                await Message.update({ status: 'sent' }, { where: { id: newMessage.id } });
            }

        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    // When a user comes online, send them their unread messages
    socket.on('fetchUnreadMessages', async ({ userId }) => {
        try {
            const unreadMessages = await Message.findAll({
                where: {
                    recipient_id: userId,
                    status: 'sent',
                },
            });

            if (unreadMessages.length > 0) {
                // Send all unread messages to the user
                io.to(onlineUsers[userId]).emit('receiveUnreadMessages', unreadMessages);

                // Mark messages as read
                await Message.update({ status: 'read' }, {
                    where: { recipient_id: userId, status: 'unread' }
                });

                console.log(`Unread messages sent to user ${userId}`);
            }
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        // Find and remove the userId from onlineUsers
        const userId = Object.keys(onlineUsers).find(userId => onlineUsers[userId] === socket.id);

        if (userId) {
            delete onlineUsers[userId];
            console.log(`User ${userId} removed from online users`);
        }
    });
};

module.exports = chat;
