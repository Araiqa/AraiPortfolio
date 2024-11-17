const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const dramaRoutes = require('./routes/dramas');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Middleware для статических файлов
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/auth2fa')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Подключение маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/dramas', dramaRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
