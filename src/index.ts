import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './module/logger/logger';
import amqp from 'amqplib';

let server: any;

mongoose.connect(config.mongoose.url).then(() => {
    logger.info('Connected to MongoDB');

    server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: string) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

process.on('SIGINT', () => {
    logger.info('SIGINT received');
    if (server) {
        server.close();
    }
});


let channel: amqp.Channel | undefined;
async function connectRabbitMQ() {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('scrapeQueue');
}

connectRabbitMQ();
export default channel;