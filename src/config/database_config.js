const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql"
});

const TableOne = require('../models/table_one')(sequelize, DataTypes);
const TableTwo = require('../models/table_two')(sequelize, DataTypes);
const TableThree = require('../models/table_three')(sequelize, DataTypes);





module.exports = { sequelize, TableOne, TableTwo, TableThree };
