const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('db_pb', 'agis', '12345', {
  host: 'localhost', // Atau alamat server PostgreSQL
  dialect: 'postgres', // Menggunakan PostgreSQL
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
  email: {
    type: DataTypes.STRING,
  },
});

module.exports = { Contact, sequelize };
    