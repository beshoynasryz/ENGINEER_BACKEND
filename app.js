const express = require("express");
const http = require('http');
const https = require('https');
const cors = require('cors')
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const AuthRoute = require("./routes/AuthRoute");
const adminRoutes = require('./routes/adminRoute');
const projectRoute = require("./routes/projectRoute");
const noteRoute = require("./routes/notesRoute");
const reviewRoute = require("./routes/reviewRoute");
const userRoute = require('./routes/userRoute'); // Adjust the path as needed
const message = require('./routes/message'); // Adjust the path as needed
const transactionRoute = require('./routes/transactionRoute');
const Notification = require('./routes/Notification');

const sequelize = require("./config/dbConfig");
const errorHandler = require("./middlewares/errorHandeler"); // Fixed typo from errorHandeler to errorHandler
const bodyParser = require("body-parser");

const app = express();
app.use('/images', express.static(path.join(__dirname, 'images')));
const localizationMiddleware = require('./middlewares/localizationMiddleware');

app.use(localizationMiddleware);
// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const server = http.createServer(app);
const io = socketIo(server, {
  // cors: {
  //   origin: 'https://socket-sooty.vercel.app', // Replace with your frontend URL
  //   methods: ['GET', 'POST'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // },
});
const PORT = process.env.PORT || 3000;


app.use(cors({ origin: '*' }));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));


app.use(bodyParser.json());





// Serve the index.html file at /test endpoint
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});
app.get('/userA', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user4.html'));
});
app.get('/userB', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user5.html'));
});
app.get('/userC', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user6.html'));
});
app.get('/lawyer', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lawyer.html'));
});
app.get('/assdfdfsfdsfsd', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assdfdfsfdsfsd.html'));
});    

const { handleSocketConnection } = require('./controllers/socket');
handleSocketConnection(io)


 
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Define routes
app.use('/api/auth', AuthRoute);
app.use('/api/admins', adminRoutes);
app.use('/api/project', projectRoute);
app.use('/api/note', noteRoute);
app.use('/api/review', reviewRoute);
app.use('/api/user', userRoute);
app.use('/api/conversation', message);
app.use('/api', transactionRoute);
app.use('/api', Notification);

// Use error handler middleware
app.use(errorHandler);
