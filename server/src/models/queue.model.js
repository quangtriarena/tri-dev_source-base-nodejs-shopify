import { DataTypes } from 'sequelize'
import instancePostgresDB from '../configs/databaseConfig.js'

const { sequelize } = instancePostgresDB

const QueueModel = sequelize.define('Queue', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    queueId: {
        type: DataTypes.STRING,
    },

    queueName: {
        type: DataTypes.STRING,
    },

    jobName: {
        type: DataTypes.STRING,
    },

    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'processing', 'completed', 'failed'],
    },
})

export default QueueModel
