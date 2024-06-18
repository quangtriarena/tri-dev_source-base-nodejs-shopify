import dotenv from 'dotenv'
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })

import { Sequelize } from 'sequelize'

class Database {
    constructor() {
        this.sequelize = null
    }

    async connect(type = 'postgres') {
        if (this.sequelize) {
            console.log('Database connection already established.')
            return
        }

        switch (type) {
            case 'postgres':
                this.sequelize = new Sequelize(
                    process.env.DB_NAME,
                    process.env.DB_USER,
                    process.env.DB_PASSWORD,
                    {
                        host: process.env.DB_HOST,
                        dialect: 'postgres',
                        logging: false,
                    }
                )

                try {
                    await this.sequelize.authenticate()
                    console.log('Connection has been established successfully.')
                } catch (error) {
                    console.error('Unable to connect to the database:', error)
                    this.sequelize = null
                }
                break

            case 'mongo':
                // MongoDB connection logic
                break

            case 'mysql':
                // MySQL connection logic
                break

            default:
                console.error('Unsupported database type.')
                break
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
            Database.instance.connect()
        }
        return Database.instance
    }

    // Add your database methods here

    async closeConnection() {
        if (this.sequelize) {
            await this.sequelize.close()
            console.log('Database connection closed.')
            this.sequelize = null
        }
    }
}

const instancePostgresDB = Database.getInstance()

export default instancePostgresDB
