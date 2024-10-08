import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import AxiosServer from '../../../configs/axiosConfig.js'

const UploadServices = {
    findAllFileUpload: async () => {},

    findById: async (req, res) => {},

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
                            resource: 'FILE',
                            httpMethod: 'POST',
                        },
                    ],
                },
            }

            //#region [step 1: register upload]
            const uploadImageResponse = await AxiosServer({
                data: JSON.stringify(queryStagedUploadsCreate),
            })
            //#endregion

            let stageTarget = uploadImageResponse.data.stagedUploadsCreate.stagedTargets[0]
            const params = stageTarget.parameters
            const url = stageTarget.url

            //#region [step 2: convert to form data and upload object file to server google cloud]
            const formData = new FormData()
            params.forEach((param) => {
                formData.append(param.name, param.value)
            })
            formData.append('file', fs.createReadStream(file.path))

            const uploadResponse = await AxiosServer({
                method: 'POST',
                url: url,
                data: formData,
                headers: {
                    ...formData.getHeaders(),
                },
            })
            //#endregion

            const resourceUrl = stageTarget.resourceUrls

            //#region [step 3: upload to shopify]
            const queryFileCreate = {
                query: `mutation fileCreate($files: [FileCreateInput!]!) {
				fileCreate(files: $files) {
					files {
						id
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
                            contentType: 'IMAGE',
                            originalSource: resourceUrl,
                        },
                    ],
                },
            }

            const _res = await AxiosServer({
                data: JSON.stringify(queryFileCreate),
            })
            //#endregion

            return _res.data.fileCreate.files
        } catch (error) {
            console.log('UploadServices single error', error)

            throw error
        }
    },

    multi: async (files) => {
        try {
            return await new Promise((resolve, reject) => {
                let countTask = files.length

                for (let i = 0; i < files.length; i++) {
                    setTimeout(async () => {
                        let file = files[i]

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
                                    input: {
                                        filename: file.originalname,
                                        mimeType: file.mimetype,
                                        resource: 'IMAGE',
                                        httpMethod: 'POST',
                                    },
                                },
                            }),
                        })

                        const stageTarget =
                            uploadImageResponse.data.stagedUploadsCreate.stagedTargets[0]
                        const params = stageTarget.parameters
                        const url = stageTarget.url

                        const formData = new FormData()
                        params.forEach((param) => {
                            formData.append(param.name, param.value)
                        })
                        formData.append('file', fs.createReadStream(file.path))

                        const uploadResponse = await axios({
                            method: 'POST',
                            url: url,
                            data: formData,
                            headers: {
                                ...formData.getHeaders(),
                            },
                        })

                        const resourceUrl = stageTarget.resourceUrl

                        const _res = await AxiosServer({
                            data: JSON.stringify({
                                query: `mutation fileCreate($files: [FileCreateInput!]!) {
										fileCreate(files: $files) {
											files {
												alt
												createdAt
												fileStatus
											}
											userErrors {
												field
												message
											}
										}
									}`,
                                variables: {
                                    files: [
                                        {
                                            filename: file.originalname,
                                            contentType: 'IMAGE',
                                            originalSource: resourceUrl,
                                        },
                                    ],
                                },
                            }),
                        })

                        countTask--

                        if (countTask === 0) {
                            console.log('upload multi success')
                            resolve({ message: 'Upload success' })
                        }
                    }, i * 100)
                }
            })
        } catch (error) {
            console.log('UploadServices multi error', error)
            throw error
        }
    },

    singleFont: async (font) => {
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
                            filename: font.originalname,
                            mimeType: font.mimetype,
                            resource: 'FILE',
                            httpMethod: 'POST',
                        },
                    ],
                },
            }

            //#region [step 1: register upload]
            const uploadImageResponse = await AxiosServer({
                data: JSON.stringify(queryStagedUploadsCreate),
            })
            //#endregion

            let stageTarget = uploadImageResponse.data.stagedUploadsCreate.stagedTargets[0]
            const params = stageTarget.parameters
            const url = stageTarget.url

            //#region [step 2: convert to form data and upload object file to server google cloud]
            const formData = new FormData()
            params.forEach((param) => {
                formData.append(param.name, param.value)
            })

            /**
             * chỗ này quan trọng:
             * FILE: A Shopify-hosted generic file.
             * IMAGE: A Shopify-hosted image.
             * VIDEO: A Shopify-hosted video file. It's recommended to use this type for all video files.
             *
             * khi thực hiện formData phải đúng các key được cho phép thì mới upload được. (lưu ý cực kì quan trọng)
             */
            formData.append('file', fs.createReadStream(font.path))

            const uploadResponse = await AxiosServer({
                method: 'POST',
                url: url,
                data: formData,
                headers: {
                    ...formData.getHeaders(),
                },
            })
            //#endregion

            const resourceUrl = stageTarget.resourceUrl

            //#region [step 3: upload to shopify]
            const queryFileCreate = {
                query: `mutation fileCreate($files: [FileCreateInput!]!) {
				fileCreate(files: $files) {
					files {
						id
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
                            filename: font.originalname,
                            contentType: 'FILE',
                            originalSource: resourceUrl,
                        },
                    ],
                },
            }

            const _res = await AxiosServer({
                data: JSON.stringify(queryFileCreate),
            })
            //#endregion

            return _res.data.fileCreate.files
        } catch (error) {
            console.log('UploadServices single error', error)

            throw error
        }
    },

    multiFonts: async (fonts) => {
        try {
            return await new Promise((resolve, reject) => {
                let countTask = fonts.length

                for (let i = 0; i < fonts.length; i++) {
                    setTimeout(async () => {
                        let font = fonts[i]

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
                                    input: {
                                        filename: font.originalname,
                                        mimeType: font.mimetype,
                                        resource: 'FILE',
                                        httpMethod: 'POST',
                                    },
                                },
                            }),
                        })

                        const stageTarget =
                            uploadImageResponse.data.stagedUploadsCreate.stagedTargets[0]
                        const params = stageTarget.parameters
                        const url = stageTarget.url

                        const formData = new FormData()
                        params.forEach((param) => {
                            formData.append(param.name, param.value)
                        })
                        formData.append('file', fs.createReadStream(font.path))

                        const uploadResponse = await axios({
                            method: 'POST',
                            url: url,
                            data: formData,
                            headers: {
                                ...formData.getHeaders(),
                            },
                        })

                        const resourceUrl = stageTarget.resourceUrl

                        const _res = await AxiosServer({
                            data: JSON.stringify({
                                query: `mutation fileCreate($files: [FileCreateInput!]!) {
										fileCreate(files: $files) {
											files {
												alt
												createdAt
												fileStatus
											}
											userErrors {
												field
												message
											}
										}
									}`,
                                variables: {
                                    files: [
                                        {
                                            filename: font.originalname,
                                            contentType: 'FILE',
                                            originalSource: resourceUrl,
                                        },
                                    ],
                                },
                            }),
                        })

                        countTask--

                        if (countTask === 0) {
                            console.log('upload multi font success')
                            resolve({ message: 'Upload success' })
                        }
                    }, i * 100)
                }
            })
        } catch (error) {
            console.log('UploadServices multi font error', error)
            throw error
        }
    },
}

export default UploadServices
