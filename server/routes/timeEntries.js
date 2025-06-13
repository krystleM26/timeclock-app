const express = require('express');
const router = express.Router();
const { createTimeEntry, getTimeEntries, updateTimeEntry, deleteTimeEntry } = require('../controllers/timeEntryControllers.js');
  
  router.get('/', getTimeEntries);
  router.post('/', (req, res, next) => {
    console.log('🎯 Route hit: POST /timeEntries');
    next();
  }, createTimeEntry);
  router.put('/:id', updateTimeEntry);
  router.delete('/:id', deleteTimeEntry);


  


  
  
  

  module.exports = router;
