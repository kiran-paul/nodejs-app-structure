const { query, body } = require('express-validator');

const validationRules = {};

validationRules.newUser = () => {
    return [
    body('first_name').notEmpty().withMessage('first_name is required'),
    body('last_name').notEmpty().withMessage('last_name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('role').notEmpty().withMessage('role is required'),
    body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    ];
};


validationRules.login = () => {
    return [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain a number')
    ];
};

validationRules.updateUser = () => {
    return [
        body('first_name').notEmpty().withMessage('first_name is required'),
        body('last_name').notEmpty().withMessage('last_name is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('role').notEmpty().withMessage('role is required')
    ];
};

validationRules.updatePassword = () => {
    return [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('password is required')
            .isLength({ min: 8 }).withMessage('password must be at least 8 characters long')
    ];
};

validationRules.email  = () => {
    return [
      query('email').notEmpty().withMessage('email parameter is required')
    ];
};

validationRules.token  = () => {
    return [
      body('token').notEmpty().withMessage('token parameter is required')
    ];
};

validationRules.dbInsert  = () => {
    return [
      body('table').notEmpty().withMessage('table parameter is required'),
      body('attributes').notEmpty().withMessage('attributes parameter is required'),
      body('data').notEmpty().withMessage('data parameter is required')
    ];
};

validationRules.dbUpdate  = () => {
    return [
      body('table').notEmpty().withMessage('table parameter is required'),
      body('where').notEmpty().withMessage('where parameter is required'),
      body('data').notEmpty().withMessage('data parameter is required'),
      body('attributes').notEmpty().withMessage('attributes parameter is required')
    ];
};

validationRules.dbDelete  = () => {
    return [
      body('table').notEmpty().withMessage('table parameter is required'),
      body('where').notEmpty().withMessage('where parameter is required')
    ];
};

validationRules.dbRawQuery  = () => {
    return [
      body('query').notEmpty().withMessage('query parameter is required')
    ];
};

validationRules.username = () => {
    return [
        query('user_name').notEmpty().withMessage('user_name parameter is required')
    ];
};



module.exports = validationRules;