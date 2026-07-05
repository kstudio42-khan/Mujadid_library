const express = require('express');
const router = express.Router();
const { getBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/book');
const auth = require('../middleware/auth'); 
// Assuming a simple role check in middleware or controller would be added later.
// For now, allow admin actions.

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
