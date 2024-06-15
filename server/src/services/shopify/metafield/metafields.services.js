import axiosServer from "../../../configs/axiosConfig.js";

const MetafieldServices = {
	app: {
		getOwnerId: async () => {},
	},
	definition: {
		createMetafieldDefinition: async ({
			payload,
			ownerType,
			namespace,
			key,
			access,
			name,
			type,
			description,
		}) => {
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
							name,
							namespace,
							key,
							description,
							type,
							ownerType,
							access: {
								...access,
							},
						},
					},
				};

				const _res = await axiosServer({
					data: JSON.stringify(query),
				});

				return _res;
			} catch (error) {
				console.log("CreateMetafieldDefinition error", error);

				throw error;
			}
		},

		getAllMetafieldDefinitions: async ({ query, ownerType }) => {
			try {
				const query = {
					query: `query {
					metafieldDefinitions(first: 250, ownerType: ${ownerType}) {
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

				const _res = await axiosServer({
					data: JSON.stringify(query),
				});

				return _res;
			} catch (error) {
				console.log("getAllMetafieldDefinitions error", error);

				throw error;
			}
		},

		getByIdMetafieldDefinition: async (id) => {
			try {
				const query = {
					query: `metafieldDefinition(id: "gid://shopify/MetafieldDefinition/${id}") {
							name;
						},
					`,
				};

				const _res = await axiosServer({
					data: JSON.stringify(query),
				});

				return _res;
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

				const _res = await axiosServer({
					data: JSON.stringify(query),
				});

				return _res.data.metafieldDefinitions.nodes.find(
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

				const _res = await axiosServer({
					data: JSON.stringify(query),
				});

				return _res;
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

				const _res = await axiosServer({
					data: JSON.stringify(query),
				});

				return _res;
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

				const _res = await axiosServer({
					data: JSON.stringify(query),
				});

				return _res;
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
