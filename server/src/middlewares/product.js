import FormData from 'form-data'
import AxiosServer from '../configs/axiosConfig.js'

const ProductMiddleware = {
    create: async (data) => {
        try {
            const _productCreate = { ...data }
            delete _productCreate.images
            delete _productCreate.variants

            //#region [CREATE PRODUCT ON SHOPIFY]
            const query = {
                query: `mutation CreateProduct($input: ProductInput!) {
            				productCreate(input: $input) {
            					product {
            						id
            					}
            				}
            	  		}`,
                variables: {
                    input: { ..._productCreate },
                },
            }

            let res = await AxiosServer({
                data: JSON.stringify(query),
            })

            const productId = res.data.productCreate.product.id
            //#endregion

            //#region [UPLOAD IMAGES ON PRODUCT]

            /**
             * stage upload image with url is shopify cdn
             */

            const _stateUploadImageQuery = {
                query: `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
							stagedUploadsCreate(input: $input) {
							stagedTargets {
								url
								resourceUrl
								parameters {
									name
									value
								}
							}
						}
				  	}`,
                variables: {
                    input: {
                        mimeType: 'image/jpeg',
                        filename: `${data.images[0].src.split('/').pop()}`,
                        httpMethod: 'POST',
                        resource: 'IMAGE',
                    },
                },
            }

            let _stateUploadImageRes = await AxiosServer({
                data: JSON.stringify(_stateUploadImageQuery),
            })

            let stageTarget = _stateUploadImageRes.data.stagedUploadsCreate.stagedTargets[0]
            const params = stageTarget.parameters
            const url = stageTarget.url

            const imageResponse = await AxiosServer({
                url: data.images[0].src,
                method: 'GET',
                responseType: 'arraybuffer',
            })

            // Step 2: Upload image to the staged target
            const formData = new FormData()
            params.forEach((param) => {
                formData.append(param.name, param.value)
            })

            formData.append('file', Buffer.from(imageResponse))

            const uploadResponse = await AxiosServer({
                url,
                data: formData,
                headers: {
                    ...formData.getHeaders(),
                },
            })

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
            					url
            				}
            			}
            			... on GenericFile {
            				url
            			}
            			... on MediaImage {
            				image {
            					id
            					url
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
                            filename: `${data.images[0].src.split('/').pop()}`,
                            contentType: 'IMAGE',
                            originalSource: stageTarget.resourceUrl,
                        },
                    ],
                },
            }

            const _res = await AxiosServer({
                data: JSON.stringify(queryFileCreate),
            })

            let imageId = _res.data.fileCreate.files[0].id

            let timeQuery = setInterval(async () => {
                const _queryRetrieveImage = {
                    query: `query {
								node(id: "${imageId}") {
									id
									... on MediaImage {
										image {
										url
										}
									}
								}
						  }`,
                }

                const _resImage = await AxiosServer({
                    data: JSON.stringify(_queryRetrieveImage),
                })

                if (_resImage.data.node.image.url) {
                    clearInterval(timeQuery)

                    // - link image to product

                    // const _query = {
                    //     query: `mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
                    // 				productCreateMedia(media: $media, productId: $productId) {
                    // 					media {
                    // 						alt
                    // 						mediaContentType
                    // 						status
                    // 					}
                    // 					mediaUserErrors {
                    // 						field
                    // 						message
                    // 					}
                    // 					product {
                    // 						id
                    // 						title
                    // 					}
                    // 				}
                    // 			}`,

                    //     variables: {
                    //         media: {
                    //             originalSource: _resImage.data.node.image.url,
                    //             alt: 'Image',
                    //             mediaContentType: 'IMAGE',
                    //         },
                    //         productId,
                    //     },
                    // }

                    const _query = {
                        query: `mutation productUpdateMedia($media: [UpdateMediaInput!]!, $productId: ID!) {
									productUpdateMedia(media: $media, productId: $productId) {
										media {
											previewImageSource
										}
									}
						  		}`,
                        variables: {
                            media: [
                                {
                                    previewImageSource: _resImage.data.node.image.url,
                                },
                            ],
                            productId,
                        },
                    }

                    const _A = await AxiosServer({
                        data: JSON.stringify(_query),
                    })

                    console.log('_A', _A.data)
                }
            }, 2000)

            // const _query = {
            //     query: `mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
            // 				productCreateMedia(media: $media, productId: $productId) {
            // 				media {
            // 					alt
            // 					mediaContentType
            // 					status
            // 				}tab
            // 				mediaUserErrors {
            // 					field
            // 					message
            // 				}
            // 				product {
            // 					id
            // 					title
            // 				}
            // 			}
            // 	  }`,

            //     variables: {
            //         media: null,
            //         productId,
            //     },
            // }

            // let _res = await new Promise((resolve, reject) => {
            //     let countTask = data.images.length

            //     for (let i = 0; i < data.images.length; i++) {
            //         let image = data.images[i]

            //         setTimeout(() => {
            //             _query.variables.media = {
            //                 alt: 'Image',
            //                 mediaContentType: 'IMAGE',
            //                 originalSource: `"${image.src}"`,
            //             }

            //             AxiosServer({
            //                 data: JSON.stringify(_query),
            //             })
            //                 .then((_res) => {
            //                     countTask--
            //                 })
            //                 .catch((_err) => {
            //                     throw _err
            //                 })
            //                 .finally(() => {
            //                     if (countTask === 0) {
            //                         resolve(1)
            //                     }
            //                 })
            //         }, i * 200)
            //     }
            // })

            //#endregion

            // if (res.errors || _res.errors) {
            //     throw _res.errors[0].message
            // }

            return productId
        } catch (error) {
            console.error('ProductMiddleware error:', error)
            throw error
        }
    },
}

export default ProductMiddleware
