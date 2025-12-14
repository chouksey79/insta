const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Notification = require('../models/Notification');

const router = express.Router();

router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAlreadyFollowing = currentUser.following.some(
      id => id.toString() === targetUserId
    );
    
    if (isAlreadyFollowing) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    // Create notification for the user being followed
    const notification = new Notification({
      user: targetUserId,
      type: 'follow',
      fromUser: currentUserId
    });
    await notification.save();

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/unfollow/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.some(
      id => id.toString() === targetUserId
    );
    
    if (!isFollowing) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users for discovery (excluding current user)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('username followers following')
      .limit(50);

    // Get current user to check follow status
    const currentUser = await User.findById(req.user._id);
    
    const usersWithFollowStatus = users.map(user => ({
      id: user._id,
      username: user.username,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing: currentUser.following.some(
        id => id.toString() === user._id.toString()
      )
    }));

    res.json({ users: usersWithFollowStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('followers', 'username')
      .populate('following', 'username');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user is following this user
    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.some(
      id => id.toString() === req.params.userId
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing: isFollowing,
        isOwnProfile: req.user._id.toString() === req.params.userId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
