const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    twoFactorSecret: String, // Секрет для 2FA
});

// Хэширование пароля перед сохранением
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
