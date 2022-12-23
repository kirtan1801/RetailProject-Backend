const sequelize = require('sequelize');
const dotenv = require('dotenv');

const app = require('./app');

process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('UncaughtException.....');
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App listening on ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('Unhandled Rejection...');
    server.close(() => {
        process.exit(1);
    });
});
