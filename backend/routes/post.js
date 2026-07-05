const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost, likePost, addComment } = require('../controllers/post');
const auth = require('../middleware/auth');

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, addComment);

module.exports = router;
