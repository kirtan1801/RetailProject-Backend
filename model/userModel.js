const Sequelize = require('sequelize');
const db = require('../utils/database');

const userSchema = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        // need to check. Even if this got failed, id got incremented.
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    alternateNumber: {
        type: Sequelize.STRING,
    },
    role: {
        type: Sequelize.ENUM('admin', 'user'),
    },
    password: {
        //need to validate password
        type: Sequelize.STRING,
        allowNull: false,
    },
    passwordChangedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    passwordResetToken: {
        type: Sequelize.STRING,
    },
    passwordResetExpire: {
        type: Sequelize.DATE,
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pincode: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    addressLine1: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    addressLine2: {
        type: Sequelize.STRING,
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    createdAt: {
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE,
    },
    updatedAt: {
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE,
    },
});

module.exports = userSchema;
