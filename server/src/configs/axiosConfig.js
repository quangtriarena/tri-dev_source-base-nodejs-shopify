import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const axiosServer = axios.create({
	baseURL: `${process.env.SHOP}/admin/api/${process.env.API_VERSION}/graphql.json`,
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"X-Shopify-Access-Token": `${process.env.ACCESS_TOKEN_APP_DEV}`,
	},
});

axiosServer.interceptors.request.use(
	function (config) {
		// get accessToken from app
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

// Add a response interceptor
axiosServer.interceptors.response.use(
	function (response) {
		return response.data;
	},
	function (error) {
		return Promise.reject(error);
	}
);

export default axiosServer;
