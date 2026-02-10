import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Ensure creator is in members array
groupSchema.pre('save', function(next) {
  if (!this.members.includes(this.createdBy)) {
    this.members.push(this.createdBy);
  }
  next();
});

export default mongoose.model('Group', groupSchema);
