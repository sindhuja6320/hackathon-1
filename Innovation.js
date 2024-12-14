const mongoose = require('mongoose');

const innovationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 50
  },
  department: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'on-hold'],
    default: 'active'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  timeline: {
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    milestones: [{
      title: String,
      date: Date,
      completed: Boolean
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Innovation', innovationSchema);
