const Sequelize = require('sequelize');

const db = new Sequelize('retail', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliances: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

module.exports = db;
