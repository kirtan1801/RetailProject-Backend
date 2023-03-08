const sequelize = require('sequelize');
const dotenv = require('dotenv');

const app = require('./app');

process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('UncaughtException.....');
    process.exit(1);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App listening on ${port}`);
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: 'false',
        message: 'Page not found',
        error: {
            message: 'You reached a route that is not defined on this server',
        },
    });
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('Unhandled Rejection...');
    server.close(() => {
        process.exit(1);
    });
});
