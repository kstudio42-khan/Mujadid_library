const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleUr: String,
    author: String,
    authorUr: String,
    type: { type: String, enum: ['free', 'physical'], default: 'free' },
    category: String,
    price: { type: Number, default: 0 },
    pages: { type: Number, default: 1 },
    desc: String,
    descUr: String,
    content: String,
    rating: { type: Number, default: 0 },
    readers: { type: Number, default: 0 },
    coverPhotoFileId: String,
    pdfFileId: String,
    hasPdf: { type: Boolean, default: false },
    coverEmoji: String,
    dateAdded: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', bookSchema);
