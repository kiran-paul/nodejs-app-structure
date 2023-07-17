require('dotenv').config();
const express = require('express');
const axios = require("axios");
const userRoutes = require('./src/routes/user_routes');
const databaseRoutes = require('./src/routes/database_routes');
const azureBlobStorageRoutes = require('./src/routes/azure_blob_storage_routes');
const errorMiddleware = require('./src/middlewares/error_middleware');
const loggingMiddleware = require('./src/middlewares/logging_middleware');
const authMiddleware = require('./src/middlewares/auth_middleware');
const corsMiddleware = require('./src/middlewares/cors_middleware');
const helmetMiddleware = require('./src/middlewares/helmet_middleware');


const app = express();

// Middlewares
app.use(corsMiddleware.restrict());
app.use(helmetMiddleware.security());
app.use(authMiddleware.authenticateToken);
app.use(express.json());
app.use(loggingMiddleware);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/azure-blob', azureBlobStorageRoutes);


// Error handling middleware
app.use(errorMiddleware.handleErrors);

// Sample api
app.get('/', (req, res) => {
    res.json({ message: 'Node services are running!' });
});

// Communicate to external service
app.get('/hello-flask', async (req,res) => {
    await axios.get(process.env.EXTERNAL_BASE_URL+'/').then(response => {
        res.status(200).json(response.data);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});


// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;