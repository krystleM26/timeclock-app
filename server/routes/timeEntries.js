const express = require('express');
const router = express.Router();
const { createTimeEntry, getTimeEntries } = require('../controllers/timeEntryControllers.js');
  
  router.get('/', getTimeEntries);
  router.post('/', (req, res, next) => {
    console.log('🎯 Route hit: POST /timeEntries');
    next();
  }, createTimeEntry);

  


  
  
  

  module.exports = router;
