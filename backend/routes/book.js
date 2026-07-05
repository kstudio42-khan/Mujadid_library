const express = require('express');
const router = express.Router();
const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/book');
const adminAuth = require('../middleware/adminAuth'); 

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', adminAuth, createBook);
router.put('/:id', adminAuth, updateBook);
router.delete('/:id', adminAuth, deleteBook);

module.exports = router;
