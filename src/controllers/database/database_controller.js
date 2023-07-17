const db = require('../../config/database_config');
const { validationResult } = require('express-validator');

const databaseController = {};

databaseController.dbInsert = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { table, attributes, data } = req.body;
        // check that the table is valid
        const model = db.sequelize.models[table];
        if (!model) {
            return res.status(400).json({message: 'Invalid table'});
        }
        // check that the attributes are valid
        const validAttributes = Object.keys(model.rawAttributes);
        for (const attribute of attributes) {
            if (!validAttributes.includes(attribute)) {
            return res.status(400).send({message: `Invalid attribute: ${attribute}`});
            }
        }
        // insert the data into the table using Sequelize
        const result = await model.create(data, { fields: attributes });
        return res.status(200).send({message: 'Insertion successfull', result});

    } catch (error) {
        next(error);
    }
};

databaseController.dbUpdate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { table, attributes, data, where } = req.body;
        // check that the table is valid
        const model = db.sequelize.models[table];
        if (!model) {
            return res.status(400).json({message: 'Invalid table'});
        }
        // check that the attributes are valid
        const validAttributes = Object.keys(model.rawAttributes);
        for (const attribute of attributes) {
            if (!validAttributes.includes(attribute)) {
            return res.status(400).send({message: `Invalid attribute: ${attribute}`});
            }
        }
        // update the data into the table using Sequelize
        const [rowsAffected] = await model.update(data, { where });
        return res.status(200).send({message: `${rowsAffected} row(s) updated`});
    } catch (error) {
        next(error);
    }
};

databaseController.dbDelete = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { table, where } = req.body;
        // check that the table is valid
        const model = db.sequelize.models[table];
        if (!model) {
            return res.status(400).json({message: 'Invalid table'});
        }
        await model.destroy({ where });
        return res.status(200).send({message: 'Deleted successfully'});

    } catch (error) {
        next(error);
    }
};

databaseController.dbRawQuery = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const query = req.body;
        const [result] = await db.sequelize.query(query);
        res.status(200).json({message: 'Query executed successfully', result});
    } catch (error) {
        next(error);
    }
};


module.exports = databaseController;