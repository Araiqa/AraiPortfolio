const mongoose = require('mongoose');

const dramaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    images: { type: [String], validate: [arrayLimit, '{PATH} exceeds the limit of 3'] }, // До 3 изображений
    releaseDate: { type: Date, required: true },
    genres: { type: [String], required: true },
    episodes: { type: Number, default: 0 },
    duration: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

// Ограничение массива изображений
function arrayLimit(val) {
    return val.length <= 3;
}

// Автоматическое обновление времени обновления
dramaSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Drama', dramaSchema);
