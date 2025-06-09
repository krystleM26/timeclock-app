const express = require('express');
const router = express.Router();

const {
    createTimeEntry,
    getTimeEntries
  } = require('../controllers/timeEntryControllers');
  
  router.get('/', getTimeEntries);
  router.post('/', createTimeEntry);

  module.exports = router;
