const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name');
        res.json(posts);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({ ...req.body, author: req.user.id });
        res.status(201).json(post);
    } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate({ _id: req.params.id, author: req.user.id }, req.body, { new: true });
        if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
        res.json(post);
    } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
        if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
        res.json({ message: 'Post deleted' });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        const liked = post.likes.includes(req.user.id);
        if (liked) post.likes.pull(req.user.id);
        else post.likes.push(req.user.id);
        
        await post.save();
        res.json(post);
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        post.comments.push({ userId: req.user.id, text });
        await post.save();
        res.json(post);
    } catch (e) { res.status(500).json({ message: e.message }); }
};
