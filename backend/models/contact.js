const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('db_pb', 'agis', '12345', {
  host: 'localhost',
  dialect: 'postgres',
});

const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

module.exports = { Contact, sequelize };
    