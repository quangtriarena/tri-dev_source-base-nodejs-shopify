import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

// default method: POST => only use graphql query shopify, don't use REST API
const axiosServer = axios.create({
    baseURL: `${process.env.SHOP}/admin/api/${process.env.API_VERSION}/graphql.json`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': `${process.env.ACCESS_TOKEN_APP_DEV}`,
    },
})

axiosServer.interceptors.request.use(
    function (config) {
        // in axiosServer:  add your headers here or extra headers...
        return config
    },
    function (error) {
        console.log('axios interceptors request error >>>>', error)
        throw error
    }
)

// Add a response interceptor
axiosServer.interceptors.response.use(
    function (response) {
        return response.data
    },
    function (error) {
        console.log('axios interceptors response error >>>>', error)
        throw error
    }
)

export default axiosServer
