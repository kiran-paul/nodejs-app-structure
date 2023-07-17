const express = require('express');
const userController = require('../controllers/user/user_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const validation = require('../middlewares/request_validator_middleware');

const router = express.Router();

router.post('/register', validation.newUser(), userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', validation.token(), authMiddleware.refreshToken);
router.post('/logout', authMiddleware.logout);
router.get('/all', userController.getUsers);
router.get('/get', validation.email(), userController.getUser);
router.put('/update', validation.updateUser(), userController.updateUser);
router.delete('/delete', validation.email(), userController.deleteUser);
router.put('/update-password', validation.updatePassword(), userController.updatePassword);
router.get('/current-user',authMiddleware.getCurrentUser);
router.get('/roles', userController.getUserRoles);

module.exports = router;
