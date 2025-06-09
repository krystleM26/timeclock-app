const express = require('express');
const router = express.Router();

const {
    createTimeEntry,
    getTimeEntries
  } = require('../controllers/timeEntryControllers');
  
  router.post('/', createTimeEntry);
  router.get('/', getTimeEntries);

  module.exports = router;
