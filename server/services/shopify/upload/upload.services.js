import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import AxiosServer from "../../../configs/axiosConfig.js";

const UploadServices = {
	single: async (file) => {
		try {
			const queryStagedUploadsCreate = {
				query: `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
					stagedUploadsCreate(
						input:$input
					) {
						stagedTargets {
							url
							resourceUrl
							parameters {
								name
								value
							}
						}
						userErrors {
							field
							message
						}
					}
				}
				`,
				variables: {
					input: [
						{
							filename: file.originalname,
							mimeType: file.mimetype,
							resource: "FILE",
							httpMethod: "POST",
						},
					],
				},
			};

			//#region [step 1: register upload]
			const uploadImageResponse = await AxiosServer({
				data: JSON.stringify(queryStagedUploadsCreate),
			});
			//#endregion

			let stageTarget = uploadImageResponse.data.stagedUploadsCreate.stagedTargets[0];
			const params = stageTarget.parameters;
			const url = stageTarget.url;

			//#region [step 2: convert to form data and upload object file to server google cloud]
			const formData = new FormData();
			params.forEach((param) => {
				formData.append(param.name, param.value);
			});
			formData.append("file", fs.createReadStream(file.path));

			const uploadResponse = await AxiosServer({
				method: "POST",
				url: url,
				data: formData,
				headers: {
					...formData.getHeaders(),
				},
			});
			//#endregion

			const resourceUrl = stageTarget.resourceUrl;

			//#region [step 3: upload to shopify]
			const queryFileCreate = {
				query: `mutation fileCreate($files: [FileCreateInput!]!) {
				fileCreate(files: $files) {
					files {
						alt
						createdAt
						fileStatus
						preview {
							image {
								originalSrc
								transformedSrc
							}
						}
						... on GenericFile {
							url
						}
						... on MediaImage {
							image {
								id
								originalSrc
								altText
							}
						}
					}
					userErrors {
						field
						message
					}
				}
			}
			`,
				variables: {
					files: [
						{
							filename: file.originalname,
							contentType: "IMAGE",
							originalSource: resourceUrl,
						},
					],
				},
			};

			const _res = await AxiosServer({
				data: JSON.stringify(queryFileCreate),
			});
			//#endregion

			return _res.data.fileCreate.files;
		} catch (error) {
			console.log("UploadServices single error", error);

			throw error;
		}
	},

	multi: async (files) => {
		try {
			for (let i = 0; i < files.length; i++) {
				setTimeout(async () => {
					let file = files[i];

					//#region [step 1: register upload]
					const uploadImageResponse = await AxiosServer({
						data: JSON.stringify({
							query: `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
								stagedUploadsCreate(
									input:$input
								) {
									stagedTargets {
										url
										resourceUrl
										parameters {
											name
											value
										}
									}
									userErrors {
										field
										message
									}
								}
							}
							`,
							variables: {
								input: [
									{
										filename: file.originalname,
										mimeType: file.mimetype,
										resource: "FILE",
										httpMethod: "POST",
									},
								],
							},
						}),
					});
					//#endregion

					let stageTarget = uploadImageResponse.data.stagedUploadsCreate.stagedTargets[0];
					const params = stageTarget.parameters;
					const url = stageTarget.url;

					//#region [step 2: convert to form data and upload object file to server google cloud]
					const formData = new FormData();
					params.forEach((param) => {
						formData.append(param.name, param.value);
					});
					formData.append("file", fs.createReadStream(file.path));

					const uploadResponse = await axios({
						method: "POST",
						url: url,
						data: formData,
						headers: {
							...formData.getHeaders(),
						},
					});
					//#endregion

					const resourceUrl = stageTarget.resourceUrl;

					//#region [step 3: upload to shopify]
					const _res = await AxiosServer({
						data: JSON.stringify({
							query: `mutation fileCreate($files: [FileCreateInput!]!) {
								fileCreate(files: $files) {
									files {
										alt
										createdAt
										fileStatus
										preview {
											image {
												originalSrc
												transformedSrc
											}
										}
										... on GenericFile {
											url
										}
										... on MediaImage {
											image {
												id
												originalSrc
												altText
											}
										}
									}
									userErrors {
										field
										message
									}
								}
							}
							`,
							variables: {
								files: [
									{
										filename: file.originalname,
										contentType: "IMAGE",
										originalSource: resourceUrl,
									},
								],
							},
						}),
					});

					//#endregion
					console.log("_res.data", _res.data.fileCreate.files);
				}, i * 100);
			}

			return { message: "Upload success" };
		} catch (error) {
			console.log("UploadServices multi error", error);

			throw error;
		}
	},
};

export default UploadServices;
