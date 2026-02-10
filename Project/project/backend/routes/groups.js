import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Group from '../models/Group.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all groups for user
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id
    }).populate('createdBy', 'name email').populate('members', 'name email').sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Get single group
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      members: req.user._id
    }).populate('createdBy', 'name email').populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Error fetching group' });
  }
});

// Create group
router.post('/', [
  body('name').trim().notEmpty().withMessage('Group name is required'),
  body('members').isArray().withMessage('Members must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, description, members } = req.body;

    const group = new Group({
      name,
      description: description || '',
      createdBy: req.user._id,
      members: members || []
    });

    await group.save();
    await group.populate('createdBy', 'name email');
    await group.populate('members', 'name email');

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Error creating group' });
  }
});

// Update group
router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Group name cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const group = await Group.findOne({
      _id: req.params.id,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (req.body.name) group.name = req.body.name;
    if (req.body.description !== undefined) group.description = req.body.description;
    if (req.body.members) group.members = req.body.members;

    await group.save();
    await group.populate('createdBy', 'name email');
    await group.populate('members', 'name email');

    res.json(group);
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ message: 'Error updating group' });
  }
});

// Delete group
router.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or you are not the creator' });
    }

    await Group.deleteOne({ _id: req.params.id });
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: 'Error deleting group' });
  }
});

export default router;
