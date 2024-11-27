const asyncHandler = require('express-async-handler');

const { Conversation , User ,Message } = require('../Associations/Association')

// Get all conversations for a user
exports.userConversation = asyncHandler(async (req, res) => {
    const conversations = await Conversation.findAll({
        where: {
          '$Users.userID$': req.user.id
        },
        include: [
          {
            model: User,
            attributes: ['userID', 'name'],
            through: { attributes: [] }
          }
        ],
    });

    if (conversations && conversations.length > 0) {
        // If conversations exist, send them in response
        return res.status(200).json({ conversations });
    } 

    // If no conversations exist, send a different response
    return res.status(200).json({ conversations: "No conversations for this user" });
});

exports.getConversation = asyncHandler(async (req, res) => {
    const conversationId = req.params.id;

    if (conversationId) {
        // Fetch messages for the given conversationId
        const messages = await Message.findAll({
            where: { conversationId },
            order: [['createdAt', 'ASC']] // Sort by creation time
        });

        if (messages && messages.length > 0) { 
            // If messages exist, send them
            return res.status(200).json({ messages });
        } else {
            // If no messages found, send this response
            return res.status(200).json({ messages: "Nothing exists in this conversation" });
        }
    }

    // If conversationId is not valid
    return res.status(404).json({ message: "You should provide a valid ID" });
});
