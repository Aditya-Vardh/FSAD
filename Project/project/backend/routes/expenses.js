import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all expenses for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    // Verify user is member of group
    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// Create expense
router.post('/', [
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('paidBy').notEmpty().withMessage('Paid by is required'),
  body('group').notEmpty().withMessage('Group is required'),
  body('splitType').isIn(['equal', 'custom']).withMessage('Split type must be equal or custom')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { description, amount, paidBy, group, splitType, splits } = req.body;

    // Verify user is member of group
    const groupDoc = await Group.findOne({
      _id: group,
      members: req.user._id
    });

    if (!groupDoc) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verify paidBy is member of group
    if (!groupDoc.members.includes(paidBy)) {
      return res.status(400).json({ message: 'Payer must be a member of the group' });
    }

    let expenseSplits = [];

    if (splitType === 'equal') {
      // Split equally among all members
      const amountPerPerson = parseFloat((amount / groupDoc.members.length).toFixed(2));
      expenseSplits = groupDoc.members.map(member => ({
        user: member,
        amount: amountPerPerson
      }));
    } else {
      // Custom split
      if (!splits || !Array.isArray(splits) || splits.length === 0) {
        return res.status(400).json({ message: 'Splits are required for custom split' });
      }

      // Verify all split users are members
      for (const split of splits) {
        if (!groupDoc.members.includes(split.user)) {
          return res.status(400).json({ message: 'All split users must be group members' });
        }
      }

      expenseSplits = splits;
    }

    const expense = new Expense({
      description,
      amount: parseFloat(amount),
      paidBy,
      group,
      splitType,
      splits: expenseSplits
    });

    await expense.save();
    await expense.populate('paidBy', 'name email');
    await expense.populate('splits.user', 'name email');
    await expense.populate('group', 'name');

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: error.message || 'Error creating expense' });
  }
});

// Update expense
router.put('/:id', [
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const expense = await Expense.findById(req.params.id).populate('group');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Verify user is member of group
    const group = await Group.findOne({
      _id: expense.group._id,
      members: req.user._id
    });

    if (!group) {
      return res.status(403).json({ message: 'You are not authorized to update this expense' });
    }

    if (req.body.description) expense.description = req.body.description;
    if (req.body.amount) {
      expense.amount = parseFloat(req.body.amount);
      // Recalculate splits if equal split
      if (expense.splitType === 'equal') {
        const amountPerPerson = parseFloat((expense.amount / group.members.length).toFixed(2));
        expense.splits = group.members.map(member => ({
          user: member,
          amount: amountPerPerson
        }));
      }
    }

    await expense.save();
    await expense.populate('paidBy', 'name email');
    await expense.populate('splits.user', 'name email');
    await expense.populate('group', 'name');

    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Error updating expense' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('group');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Verify user is member of group
    const group = await Group.findOne({
      _id: expense.group._id,
      members: req.user._id
    });

    if (!group) {
      return res.status(403).json({ message: 'You are not authorized to delete this expense' });
    }

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
});

export default router;
