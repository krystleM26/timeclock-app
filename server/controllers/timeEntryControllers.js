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


