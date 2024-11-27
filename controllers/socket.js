

// const user = require('./socket/pubsub/users');
// const video = require('./socket/pubsub/video');
const chat = require('./socket/pubsub/chat');

exports.handleSocketConnection = function (io) {
    io.on('connection', (socket) => {
        // console.log("inside video and chat" , socket.id)

        // video(socket, io); 
        chat(socket, io); 

    });
};

