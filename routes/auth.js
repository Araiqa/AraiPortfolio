const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Замените на значение из .env

// Nodemailer настройка
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'arailym.gainullova05@gmail.com', // Gmail отправителя
        pass: 'bnwdanoimdeeivsh', // Пароль приложения Gmail
    },
});

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, gender, role } = req.body;

        console.log('Регистрация данных:', req.body);

        // Генерация секрета для двухфакторной аутентификации
        const twoFactorSecret = speakeasy.generateSecret({ name: `AuthApp (${username})` });

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохранение пользователя в базе данных
        const user = new User({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            age,
            gender,
            role,
            twoFactorSecret: twoFactorSecret.base32,
        });
        await user.save();

        console.log('Пользователь успешно зарегистрирован:', user);
        console.log('Пароль перед хэшированием:', password);

        console.log('Хэшированный пароль:', hashedPassword);


        // Генерация QR-кода для 2FA
        const qrCode = await qrcode.toDataURL(twoFactorSecret.otpauth_url);

        // Отправка письма с QR-кодом
        await transporter.sendMail({
            from: 'arailym.gainullova05@gmail.com',
            to: username,
            subject: 'Welcome to AuthApp',
            html: `
                <h1>Hello ${firstName}, welcome to AuthApp!</h1>
                <p>To enable 2FA, please scan this QR code in your authentication app:</p>
                <img src="${qrCode}" alt="QR Code">
            `,
        });

        res.status(201).json({ message: 'User registered successfully. Check your email for 2FA setup instructions.' });
    } catch (err) {
        console.error('Ошибка при регистрации:', err);
        res.status(400).json({ error: err.message });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { username, password, twoFactorCode } = req.body;
        console.log('Login attempt:', req.body);

        // Поиск пользователя
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        console.log('User found:', user);

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for:', username);
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        console.log('Password verified for:', username);

        // Проверка 2FA
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: twoFactorCode,
        });

        if (!verified) {
            console.log('Invalid 2FA code for:', username);
            return res.status(401).json({ message: 'Invalid 2FA code' });
        }
        console.log('2FA code verified for:', username);

        // Генерация JWT токена
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        console.log('Token generated for:', username);

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
