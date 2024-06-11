import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_VER = "2024-04";
const SHOP_URL = "49-tri-personalize.myshopify.com";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_APP_DEV;

const MetafieldServices = {
	app: {
		getOwnerId: async () => {},
	},
	definition: {
		createMetafieldDefinition: async () => {
			try {
				const query = {
					query: `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
							metafieldDefinitionCreate(definition: $definition) {
								createdDefinition {
								id
								name
								namespace
								key
								access {
									admin
									storefront
								}
								# add other return fields
								}
								userErrors {
								field
								message
								code
								}
							}
					}
					`,
					variables: {
						definition: {
							name: "Personalize",
							namespace: "$app:sb_",
							key: "personalize",
							description: "Definition of personalize metafield with product",
							type: "boolean",
							ownerType: "PRODUCT",
							access: {
								admin: "MERCHANT_READ_WRITE",
								storefront: "PUBLIC_READ",
							},
						},
					},
				};

				const _res = await axios({
					method: "post",
					url: `https://${SHOP_URL}/admin/api/${API_VER}/graphql.json`,
					headers: {
						"X-Shopify-Access-Token": ACCESS_TOKEN,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(query),
				});

				return _res.data.data.metafieldDefinitionCreate.createdDefinition;
			} catch (error) {
				console.log("CreateMetafieldDefinition error", error);

				throw error;
			}
		},

		getAllMetafieldDefinitions: async () => {
			try {
				const query = {
					query: `query {
					metafieldDefinitions(first: 250, ownerType: PRODUCT) {
						edges {
							node {
								id
								name
								namespace
								ownerType
								key
								access {
									admin
									storefront
								}
							}
						}
					}
				}
				`,
				};

				const _res = await axios({
					method: "post",
					url: `https://${SHOP_URL}/admin/api/${API_VER}/graphql.json`,
					headers: {
						"X-Shopify-Access-Token": ACCESS_TOKEN,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(query),
				});

				return _res.data;
			} catch (error) {
				console.log("getAllMetafieldDefinitions error", error);

				throw error;
			}
		},

		getByIdMetafieldDefinition: async (id) => {
			try {
				const query = {
					query: `metafieldDefinition(
					id: "gid://shopify/MetafieldDefinition/${id}"
				  ) {
					name;
				  },
				`,
				};

				const _res = await axios({
					method: "post",
					url: `https://${SHOP_URL}/admin/api/${API_VER}/graphql.json`,
					headers: {
						"X-Shopify-Access-Token": ACCESS_TOKEN,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(query),
				});

				return _res.data;
			} catch (error) {
				console.log("findByIdMetafieldDefinition error", error);

				throw error;
			}
		},

		checkAppPrefixMetafield: async () => {
			try {
				const query = {
					query: `query MetafieldDefinitions {
						metafieldDefinitions(ownerType: PRODUCT, namespace: "$app:sb_", first: 250) {
							nodes {
								description
								id
								key
								metafieldsCount
								name
								namespace
								ownerType    
							}
						}
					}
					`,
				};

				const _res = await axios({
					method: "post",
					url: `https://${SHOP_URL}/admin/api/${API_VER}/graphql.json`,
					headers: {
						"X-Shopify-Access-Token": ACCESS_TOKEN,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(query),
				});

				return _res.data.data.metafieldDefinitions.nodes.find(
					(_item) => _item.name === "Personalize" && _item.namespace.includes("sb_")
				);
			} catch (error) {
				console.log("checkAppPrefixMetafield error", error);

				throw error;
			}
		},

		updateMetafieldDefinition: async (metafieldData) => {
			try {
				const appPrefix = await MetafieldMiddleware.checkAppPrefixMetafield(ACCESS_TOKEN);

				const query = {
					query: `mutation UpdateMetafieldDefinition($definition: MetafieldDefinitionUpdateInput!) {
					metafieldDefinitionUpdate(definition: $definition) {
					  updatedDefinition {
						id
						name
						access {
							admin
							storefront
						}
					  }
					  userErrors {
						field
						message
						code
					  }
					}
				  }`,
					variables: {
						definition: {
							name: "Personalize",
							namespace: appPrefix.namespace,
							key: appPrefix.key,
							ownerType: "PRODUCT",
							access: {
								admin: "MERCHANT_READ",
								storefront: "PUBLIC_READ",
							},
						},
					},
				};

				const _res = await axios({
					method: "post",
					url: `https://${SHOP_URL}/admin/api/${API_VER}/graphql.json`,
					headers: {
						"X-Shopify-Access-Token": ACCESS_TOKEN,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(query),
				});

				return _res.data;
			} catch (error) {
				console.log("updateMetafieldDefinition error", error);

				throw error;
			}
		},

		deleteMetafieldDefinition: async (id) => {
			try {
				const query = {
					query: `mutation DeleteMetafieldDefinition($id: ID!, $deleteAllAssociatedMetafields: Boolean!) {
					metafieldDefinitionDelete(id: $id, deleteAllAssociatedMetafields: $deleteAllAssociatedMetafields) {
					  deletedDefinitionId
					  userErrors {
						field
						message
						code
					  }
					}
				  }
					`,
					variables: {
						id: `gid://shopify/MetafieldDefinition/${id}`,
						deleteAllAssociatedMetafields: true,
					},
				};

				const _res = await axios({
					method: "post",
					url: `https://${SHOP_URL}/admin/api/${API_VER}/graphql.json`,
					headers: {
						"X-Shopify-Access-Token": ACCESS_TOKEN,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(query),
				});

				return _res.data;
			} catch (error) {
				console.log("deleteMetafieldDefinition error", error);

				throw error;
			}
		},

		setValueMetafieldDefinition: async (id, value) => {
			try {
				const appPrefix = await MetafieldMiddleware.checkAppPrefixMetafield();

				const query = {
					query: `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
					metafieldsSet(metafields: $metafields) {
					  metafields {
						key
						namespace
						value
						createdAt
						updatedAt
					  }
					  userErrors {
						field
						message
						code
					  }
					}
				  }
					  `,
					variables: {
						metafields: [
							{
								key: appPrefix.key,
								namespace: appPrefix.namespace,
								ownerId: `gid://shopify/Product/${id}`,
								type: "boolean",
								value,
							},
						],
					},
				};

				const _res = await axios({
					method: "post",
					url: `https://${SHOP_URL}/admin/api/${API_VER}/graphql.json`,
					headers: {
						"X-Shopify-Access-Token": ACCESS_TOKEN,
						"Content-Type": "application/json",
					},
					data: JSON.stringify(query),
				});

				return _res.data;
			} catch (error) {
				console.log("setValueMetafieldDefinition error", error);

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

export default MetafieldServices;
