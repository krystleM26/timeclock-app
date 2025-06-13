const TimeEntry = require('../models/TimeEntry');
const User = require('../models/User');


exports.createTimeEntry = async (req, res) => {
  console.log('📌 Controller hit: createTimeEntry');
  try {
    const { name, date, hoursWorked, notes } = req.body;

    if (!name || !date || !hoursWorked) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let user = await User.findOne({ name });
    if (!user) {
      user = new User({ name });
      await user.save();
    }

    const newEntry = await TimeEntry.create({
      name,
      userId: user._id,
      date,
      hoursWorked,
      notes,
    });

    console.log('✅ Time entry saved:', newEntry);
    res.status(201).json({ message: 'Time entry created', entry: newEntry });

  } catch (err) {
    console.error('❌ Full error object:', err);
    res.status(500).json({ message: 'Server error', error: err.message || err });
  }
};

exports.getTimeEntries = async (req, res) => {
  try {
    const entries = await TimeEntry.find().populate('userId', 'name');
    res.status(200).json(entries);
  } catch (err) {
    console.error('❌ Error in getTimeEntries:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTimeEntry = async (req, res) => {
  try {
    const updated = await TimeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE
exports.deleteTimeEntry = async (req, res) => {
  try {
    const deleted = await TimeEntry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

exports.getSummaryByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      date: {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) }),
      },
    };

    const summary = await TimeEntry.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$userId",
          totalHours: { $sum: "$hoursWorked" },
          entries: { $push: "$date" },
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("❌ Summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSummaryByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {
      date: {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) }),
      },
    };

    const summary = await TimeEntry.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$userId",
          totalHours: { $sum: "$hoursWorked" },
          entries: { $push: "$date" },
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("❌ Summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





