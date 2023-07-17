const express = require('express');
const databaseController = require('../controllers/database/database_controller');
const validation = require('../middlewares/request_validator_middleware');

const router = express.Router();

router.post('/insert', validation.dbInsert(), databaseController.dbInsert);
router.put('/update', validation.dbUpdate(), databaseController.dbUpdate);
router.delete('/delete', validation.dbDelete(), databaseController.dbDelete);
router.post('/raw-query', validation.dbRawQuery(), databaseController.dbRawQuery);

module.exports = router;
