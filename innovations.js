const express = require('express');
const router = express.Router();
const Innovation = require('../models/Innovation');
const auth = require('../middleware/auth');

// Get all innovations
router.get('/', auth, async (req, res) => {
  try {
    const innovations = await Innovation.find()
      .populate('creator', 'username department')
      .populate('collaborators', 'username department');
    res.json(innovations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create innovation
router.post('/', auth, async (req, res) => {
  try {
    const innovation = new Innovation({
      ...req.body,
      creator: req.user.userId
    });
    await innovation.save();
    res.status(201).json(innovation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get innovation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const innovation = await Innovation.findById(req.params.id)
      .populate('creator', 'username department')
      .populate('collaborators', 'username department');
    if (!innovation) {
      return res.status(404).json({ message: 'Innovation not found' });
    }
    res.json(innovation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update innovation
router.put('/:id', auth, async (req, res) => {
  try {
    const innovation = await Innovation.findById(req.params.id);
    if (!innovation) {
      return res.status(404).json({ message: 'Innovation not found' });
    }

    // Check if user is creator or collaborator
    if (innovation.creator.toString() !== req.user.userId &&
        !innovation.collaborators.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedInnovation = await Innovation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedInnovation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add collaborator
router.post('/:id/collaborators', auth, async (req, res) => {
  try {
    const innovation = await Innovation.findById(req.params.id);
    if (!innovation) {
      return res.status(404).json({ message: 'Innovation not found' });
    }

    if (innovation.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { collaboratorId } = req.body;
    if (innovation.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ message: 'User already a collaborator' });
    }

    innovation.collaborators.push(collaboratorId);
    await innovation.save();
    res.json(innovation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
