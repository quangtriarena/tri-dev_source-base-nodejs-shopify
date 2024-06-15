import ProductModel from "../models/product.model.js";

const EntryModels = { ProductModel };

Object.keys(EntryModels).forEach((model) => {
	const _model = EntryModels[model];

	_model
		.sync()
		.then(() => {
			console.log(`👌 ${model} table created successfully`);
		})
		.catch((err) => {
			console.log(`⛔ An error occurred while creating the ${model} table:`, err);
		});
});

export default EntryModels;
