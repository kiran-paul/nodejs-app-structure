const express = require('express');
const azureBlobStorageController = require('../controllers/azure-storage/azure_blob_storage_controller');
const validation = require('../middlewares/request_validator_middleware');

const router = express.Router();

router.get('/read-json', validation.jsonFile(), azureBlobStorageController.readJSONFile);

module.exports = router;