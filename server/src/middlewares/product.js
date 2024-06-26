import axiosServer from '../configs/axiosConfig.js'

const ProductMiddleware = {
    create: async (data) => {
        try {
            const query = {
                query: `mutation CreateProduct($input: ProductInput!) {
							productCreate(input: $input) {
								product {
									id
								}
							}
				  		}`,
                variables: {
                    input: { ...data },
                },
            }

            let _res = await axiosServer({
                data: JSON.stringify(query),
            })

            if (_res.errors) {
                throw _res.errors[0].message
            }

            return _res
        } catch (error) {
            console.error('ProductMiddleware error:', error)
            throw error
        }
    },
}

export default ProductMiddleware
