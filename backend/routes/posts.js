const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const post = new Post({
      user: req.user._id,
      imageUrl,
      caption: caption || ''
    });

    await post.save();
    await post.populate('user', 'username');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    // Include posts from users you follow AND your own posts
    const followingIds = [...currentUser.following, currentUser._id];
    
    const posts = await Post.find({
      user: { $in: followingIds }
    })
      .populate('user', 'username')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('user', 'username')
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user._id);
    await post.save();

    // Create notification if user is not the post owner
    if (post.user.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        user: post.user,
        type: 'like',
        fromUser: req.user._id,
        post: post._id
      });
      await notification.save();
    }

    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:postId/unlike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }

    post.likes = post.likes.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await post.save();

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      username: req.user.username,
      text
    });

    await post.save();

    // Create notification if user is not the post owner
    if (post.user.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        user: post.user,
        type: 'comment',
        fromUser: req.user._id,
        post: post._id
      });
      await notification.save();
    }

    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
