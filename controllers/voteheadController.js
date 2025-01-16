const Votehead = require('../models/Votehead');

exports.addVotehead = async (req, res) => {
  try {
    const { name, description } = req.body;
    const votehead = new Votehead({ name, description });
    await votehead.save();
    res.status(201).json({ message: 'Votehead added successfully', votehead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVoteheads = async (req, res) => {
  try {
    const voteheads = await Votehead.find();
    res.status(200).json({ voteheads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVotehead = async (req, res) => {
  try {
    const { id } = req.params;
    const votehead = await Votehead.findByIdAndDelete(id);
    if (!votehead) return res.status(404).json({ message: 'Votehead not found' });
    res.status(200).json({ message: 'Votehead deleted successfully', votehead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
