const SequelizeAuto = require('sequelize-auto');
const path = require('path');

// define the options for sequelize-auto
const options = {
  // database name
  database: 'dbname',
  // database username
  username: 'username',
  // database password
  password: 'password',
  // database host
  host: 'hostname',
  // database port
  port: '3306',
  // output directory for generated models
  directory: path.resolve(__dirname, './src/models'),
  // file name for generated models
  additional: {
    timestamps: false // exclude timestamps fields from generated models
  },
  // use the specific dialect of your database
  dialect: 'mysql',
  // generate models for the specific table only
  tables: ['table_one',
  'table_two',
  'table_three']
};

// create an instance of SequelizeAuto with the options
const auto = new SequelizeAuto(
  options.database,
  options.username,
  options.password,
  options
);

// generate models for the specific table
auto.run(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Models generated successfully!');
  }
});
