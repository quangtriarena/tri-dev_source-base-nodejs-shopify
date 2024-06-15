import { DataTypes } from "sequelize";
import instancePostgresDB from "../configs/databaseConfig.js";

const { sequelize } = instancePostgresDB;

const ProductModel = sequelize.define("Product", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	// Add more fields as needed
});

export default ProductModel;
