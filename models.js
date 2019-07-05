const dotenv = require('dotenv');

dotenv.config();

const DbName = process.env.REACT_APP_DB_NAME;
const DbId = process.env.REACT_APP_DB_ID;
const DbPassword = process.env.REACT_APP_DB_PASSWORD;
const DbHost = process.env.REACT_APP_DB_HOST;
const DbTable = process.env.REACT_APP_DB_TABLE;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(DbName, DbId, DbPassword, {host: DbHost, dialect: 'mysql'});

const todolistitem = sequelize.define(DbTable, {
  itemTodo: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN
});

module.exports = {
  sequelize: sequelize,
  todolistitem: todolistitem
}