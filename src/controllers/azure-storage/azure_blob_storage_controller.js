require('dotenv').config();
const { BlobServiceClient } = require("@azure/storage-blob");
const { validationResult } = require('express-validator');

const connectionString = "DefaultEndpointsProtocol=https;AccountName="+process.env.AZURE_BLOB_ACCOUNT_NAME+";AccountKey="+process.env.AZURE_BLOB_ACCOUNT_KEY+";EndpointSuffix=core.windows.net";
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerName = process.env.AZURE_BLOB_CONTAINER;

const azureBlobStorageController = {};

azureBlobStorageController.readJSONFile = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const blobName = req.query.json_file;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        const downloadBlockBlobResponse = await blockBlobClient.download();
        const downloadedContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        
        const jsonContent = JSON.parse(downloadedContent);
        res.status(200).json(jsonContent);
    } catch(error) {
        next(error);
    }
};

function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
};

module.exports= azureBlobStorageController;