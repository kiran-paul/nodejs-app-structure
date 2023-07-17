const { Base64 } = require('js-base64');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/database_config');
const { validationResult } = require('express-validator');


const userController = {};

userController.getUserRoles = async(req, res, next) => {
  await db.UserRoles.findAll({
    attributes: ['role']
  }).then(roles => {
    res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json(roles);
  }).catch(error => {
    next(error);
  });
}

userController.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ errors: errors.array() });
  }
  try {
    const { first_name ,last_name, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.Users.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      role: role,
      password: hashedPassword
    });
    res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

userController.validateUsername = async (req, res, next) => {
  try {
    const email = req.body.email;
    const decodedEmail = Base64.decode(email);
    const user = await db.Users.findByPk(decodedEmail);
    if (!user) {
      return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Invalid email' });
    }
    return res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Valid email'});
  } catch (error) {
    next(error);
  }
};

userController.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ errors: errors.array() });
  }
  try {
    const email = req.body.email;
    const password = req.body.password;
    const decodedEmail = Base64.decode(email);
    const decodedPassword = Base64.decode(password);
    const user = await db.Users.findByPk(decodedEmail);
    if (!user) {
      return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Invalid email' });
    }
    if(user['dataValues']['failed_login'] >=4  && user['dataValues']['account_lock_time'] > Date.now()){
      return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: `Login attempts limit exceeded, Please try after ${user['dataValues']['account_lock_time'].toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}`});
    }
    const passwordMatch = await bcrypt.compare(decodedPassword, user.password);
    if (!passwordMatch) {
      //increment failedAttempts in db
      await db.Users.update({
        failed_login: user['dataValues']['failed_login'] + 1,
        account_lock_time: Date.now() + (2 * 60 * 1000)
      }, {
        where: {
          email: decodedEmail
        }
      }).then(updated =>{
        console.log('Incremented failed attempts');
      });
      return res.status(401).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Invalid password' });
    }
    const accessToken = jwt.sign({ user: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user: user.email }, process.env.REFRESH_TOKEN_SECRET);
    //update failedAttempts in db to 0
    await db.Users.update({
      failed_login: 0
    }, {
      where: {
        email: decodedEmail
      }
    }).then(updated =>{
      console.log('Updated failed attempt to default');
    });
    return res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Login successful', accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

userController.getUsers = async (req, res, next) => {
  try {
    const users = await db.Users.findAll();
    if(users.length === 0){
      res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'No records' });
    }
    res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json(users);
  } catch (error) {
    next(error);
  }
};

userController.updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ errors: errors.array() });
  }
  try {
    const { first_name, last_name, role, email } = req.body;
    const user = await db.Users.findByPk(email);
    if (!user) {
      return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'User not found, invalid email' });
    }
    await db.Users.update({
      first_name: first_name,
      last_name: last_name,
      role: role
    }, {
      where: {
        email: email
      }
    }).then(updated =>{
      return res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'User updated successfully' });
    });
  } catch (error) {
    next(error);
  }
};

userController.deleteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ errors: errors.array() });
  }
  try {
    const email = req.query.email;
    const user = await db.Users.findByPk(email);
    if (!user) {
      return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'User not found, invalid email' });
    }
    await db.Users.destroy({
      where: {
        email: email
      }
    });
    return res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

userController.getUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ errors: errors.array() });
  }
  try {
    const email = req.query.email;
    const user = await db.Users.findByPk(email);
    if (!user) {
      return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'User not found, invalid email' });
    }
    res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json(user);
  } catch (error) {
    next(error);
  }
};

userController.updatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await db.Users.findByPk(email);
    if (!user) {
      return res.status(400).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'User not found, invalid email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.Users.update({
      password: hashedPassword
    }, {
      where: {
        email: email
      }
    }).then(updated => {
      return res.status(200).setHeader('X-XSS-Protection', '1; mode=block').json({ message: 'Password updated successfully' });
    });
  } catch (error) {
    next(error);
  }
};


module.exports = userController;

