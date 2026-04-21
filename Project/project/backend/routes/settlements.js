import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Settlement from '../models/Settlement.js';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all settlements for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const settlements = await Settlement.find({ group: req.params.groupId })
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .sort({ settledAt: -1 });

    res.json(settlements);
  } catch (error) {
    console.error('Get settlements error:', error);
    res.status(500).json({ message: 'Error fetching settlements' });
  }
});

// Calculate balances for a group
router.get('/balances/:groupId', async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    }).populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Get all expenses for the group
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email');

    // Get all settlements for the group
    const settlements = await Settlement.find({ group: req.params.groupId });

    // Calculate balances
    const balances = {};
    group.members.forEach(member => {
      balances[member._id.toString()] = {
        user: member,
        paid: 0,
        owes: 0,
        net: 0
      };
    });

    // Calculate from expenses
    expenses.forEach(expense => {
      const paidBy = expense.paidBy._id.toString();
      balances[paidBy].paid += expense.amount;

      expense.splits.forEach(split => {
        const userId = split.user._id.toString();
        if (userId !== paidBy) {
          balances[userId].owes += split.amount;
        } else {
          balances[userId].owes += split.amount;
          balances[userId].paid -= split.amount;
        }
      });
    });

    // Adjust for settlements
    settlements.forEach(settlement => {
      const fromUser = settlement.fromUser.toString();
      const toUser = settlement.toUser.toString();
      balances[fromUser].owes -= settlement.amount;
      balances[toUser].paid -= settlement.amount;
    });

    // Calculate net balance
    Object.keys(balances).forEach(userId => {
      balances[userId].net = balances[userId].paid - balances[userId].owes;
    });

    res.json(balances);
  } catch (error) {
    console.error('Calculate balances error:', error);
    res.status(500).json({ message: 'Error calculating balances' });
  }
});

// Create settlement
router.post('/', [
  body('fromUser').notEmpty().withMessage('From user is required'),
  body('toUser').notEmpty().withMessage('To user is required'),
  body('group').notEmpty().withMessage('Group is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { fromUser, toUser, group, amount } = req.body;

    // Verify group exists and user is member
    const groupDoc = await Group.findOne({
      _id: group,
      members: req.user._id
    });

    if (!groupDoc) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verify both users are members
    if (!groupDoc.members.includes(fromUser) || !groupDoc.members.includes(toUser)) {
      return res.status(400).json({ message: 'Both users must be members of the group' });
    }

    // Verify fromUser is the authenticated user
    if (fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only settle debts you owe' });
    }

    const settlement = new Settlement({
      fromUser,
      toUser,
      group,
      amount: parseFloat(amount)
    });

    await settlement.save();
    await settlement.populate('fromUser', 'name email');
    await settlement.populate('toUser', 'name email');
    await settlement.populate('group', 'name');

    res.status(201).json(settlement);
  } catch (error) {
    console.error('Create settlement error:', error);
    res.status(500).json({ message: 'Error creating settlement' });
  }
});

export default router;
