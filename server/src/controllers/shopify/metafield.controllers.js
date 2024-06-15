import MetafieldServices from "../../services/shopify/metafield/metafields.services.js";

const MetafieldControllers = {
	app: {},
	definition: {
		create: async (req, res) => {
			try {
				const _data = await MetafieldServices.definition.createMetafieldDefinition({
					payload: req.body,
					type: "boolean",
					name: "Test",
					ownerType: "PRODUCT",
					namespace: "app:t_", // cái này cần phải cài app mới được
					key: "test",
					description: "Definition of test metafield with product",
					access: {
						admin: "MERCHANT_READ_WRITE",
						storefront: "PUBLIC_READ",
					},
				});

				return res.status(200).json(_data);
			} catch (error) {
				console.log("MetafieldControllers definition create error", error);

				throw error;
			}
		},

		findAll: async (req, res) => {
			try {
				let query = req.query;

				const _data = await MetafieldServices.definition.getAllMetafieldDefinitions({
					query,
					ownerType: "PRODUCT",
				});

				return res.status(200).json(_data);
			} catch (error) {
				console.log("MetafieldControllers definition findAll error", error);

				throw error;
			}
		},

		findById: async (req, res) => {
			try {
				const { id } = req.params;

				const _data = await MetafieldServices.definition.getByIdMetafieldDefinition(id);

				return res.status(200).json(_data);
			} catch (error) {
				console.log("MetafieldControllers definition findById error", error);

				throw error;
			}
		},

		update: async (req, res) => {
			try {
				const { id } = req.params;
				const data = req.body;

				const _data = await MetafieldServices.definition.updateMetafieldDefinition();

				return res.status(200).json(_data);
			} catch (error) {
				console.log("MetafieldControllers definition update error", error);

				throw error;
			}
		},

		delete: async (req, res) => {
			try {
				const { id } = req.params;

				const _data = await MetafieldServices.definition.deleteMetafieldDefinition(id);

				return res.status(200).json(_data);
			} catch (error) {
				console.log("MetafieldControllers definition delete error", error);

				throw error;
			}
		},

		setValue: async (req, res) => {
			try {
				const { id } = req.params;
				const body = req.body;

				const _data = await MetafieldServices.definition.setValueMetafieldDefinition(
					id,
					body
				);

				return res.status(200).json(_data);
			} catch (error) {
				console.log("MetafieldControllers definition setValue error", error);

				throw error;
			}
		},
	},
	product: {},
	variant: {},
	collection: {},
	customer: {},
	order: {},
	webhook: {},
};

export default MetafieldControllers;
