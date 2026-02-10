import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Group from '../models/Group.js';
import Expense from '../models/Expense.js';
import Settlement from '../models/Settlement.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get dashboard summary
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all groups user is member of
    const groups = await Group.find({ members: userId });

    let totalOwed = 0;
    let totalToReceive = 0;
    const groupSummaries = [];

    for (const group of groups) {
      // Get all expenses for the group
      const expenses = await Expense.find({ group: group._id })
        .populate('paidBy', 'name email')
        .populate('splits.user', 'name email');

      // Get all settlements for the group
      const settlements = await Settlement.find({ group: group._id });

      // Calculate user's balance in this group
      let paid = 0;
      let owes = 0;

      expenses.forEach(expense => {
        if (expense.paidBy._id.toString() === userId.toString()) {
          paid += expense.amount;
        }

        expense.splits.forEach(split => {
          if (split.user._id.toString() === userId.toString()) {
            owes += split.amount;
            if (expense.paidBy._id.toString() === userId.toString()) {
              paid -= split.amount;
            }
          }
        });
      });

      // Adjust for settlements
      settlements.forEach(settlement => {
        if (settlement.fromUser.toString() === userId.toString()) {
          owes -= settlement.amount;
        }
        if (settlement.toUser.toString() === userId.toString()) {
          paid -= settlement.amount;
        }
      });

      const net = paid - owes;
      totalOwed += Math.max(0, -net);
      totalToReceive += Math.max(0, net);

      groupSummaries.push({
        group: {
          id: group._id,
          name: group.name,
          description: group.description
        },
        balance: net,
        owed: Math.max(0, -net),
        toReceive: Math.max(0, net)
      });
    }

    res.json({
      totalOwed: parseFloat(totalOwed.toFixed(2)),
      totalToReceive: parseFloat(totalToReceive.toFixed(2)),
      groups: groupSummaries
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Error fetching dashboard summary' });
  }
});

export default router;
