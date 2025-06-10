const TimeEntry = require('../models/TimeEntry');
const User = require('../models/User');


  exports.createTimeEntry = async (req, res) => {
    console.log('createTimeEntry called with:', req.body);
    try {
        const { name, date, hoursWorked, notes } = req.body;
        let user = await User.findOne({ name });
        if (!user) {
            user = new User({ name });
            await user.save();
          }
          const newEntry = new TimeEntry({
            userId: user.id,
            date,
            hoursWorked,
            notes
          });
          await newEntry.save();
    res.status(201).json({ message: 'Time entry created successfully' });
} catch (err) {
    console.error('Error saving time entry:', err);
    res.status(500).json({ error: 'Failed to create time entry' });
  }
};

exports.getTimeEntries = async (req, res) => {
    try {
      const entries = await TimeEntry.find().populate('userId', 'name');
      res.status(200).json(entries);
    } catch (err) {
      console.error('Error fetching time entries:', err);
      res.status(500).json({ error: 'Failed to fetch time entries' });
    }
  };
  
