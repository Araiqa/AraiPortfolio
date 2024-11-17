const express = require('express');
const Drama = require('../models/Drama');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'arailym.gainullova05@mail.com', // Ваш email
        pass: 'araikrasotka', // Пароль приложения
    },
});

// Функция для отправки писем
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({ from: 'your_email@gmail.com', to, subject, text });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Middleware для проверки ролей
const authorize = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, SECRET_KEY);

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

// Создать драму (для администраторов и редакторов)
router.post('/', authorize(['admin', 'editor']), async (req, res) => {
    try {
        const { title, description, images, releaseDate, genres, episodes, duration } = req.body;

        if (images.length > 3) {
            return res.status(400).json({ message: 'Maximum of 3 images allowed' });
        }

        const drama = new Drama({ title, description, images, releaseDate, genres, episodes, duration });
        await drama.save();

        // Отправка уведомления о создании
        sendEmail(
            'admin_email@mail.com',
            'New Drama Created',
            `A new drama titled "${title}" has been created.`
        );

        res.status(201).json({ message: 'Drama created successfully', drama });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Получить все драмы
router.get('/', async (req, res) => {
    try {
        const dramas = await Drama.find();
        res.json(dramas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить драму (только для администраторов)
router.put('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, images, releaseDate, genres, episodes, duration } = req.body;

        if (images && images.length > 3) {
            return res.status(400).json({ message: 'Maximum of 3 images allowed' });
        }

        const updatedDrama = await Drama.findByIdAndUpdate(
            id,
            { title, description, images, releaseDate, genres, episodes, duration, updatedAt: Date.now() },
            { new: true }
        );

        // Отправка уведомления об обновлении
        sendEmail(
            'admin_email@gmail.com',
            'Drama Updated',
            `The drama titled "${updatedDrama.title}" has been updated.`
        );

        res.json({ message: 'Drama updated successfully', updatedDrama });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удалить драму (только для администраторов)
router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDrama = await Drama.findByIdAndDelete(id);

        // Отправка уведомления об удалении
        sendEmail(
            'admin_email@gmail.com',
            'Drama Deleted',
            `The drama titled "${deletedDrama.title}" has been deleted.`
        );

        res.json({ message: 'Drama deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
