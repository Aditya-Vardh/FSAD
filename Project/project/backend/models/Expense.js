import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  splitType: {
    type: String,
    enum: ['equal', 'custom'],
    default: 'equal'
  },
  splits: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true
});

// Validate splits sum equals amount
expenseSchema.pre('save', function(next) {
  if (this.splitType === 'custom') {
    const totalSplit = this.splits.reduce((sum, split) => sum + split.amount, 0);
    if (Math.abs(totalSplit - this.amount) > 0.01) {
      return next(new Error('Split amounts must equal the total expense amount'));
    }
  }
  next();
});

export default mongoose.model('Expense', expenseSchema);
