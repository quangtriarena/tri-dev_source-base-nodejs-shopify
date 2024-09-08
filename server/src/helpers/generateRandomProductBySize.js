import { faker } from '@faker-js/faker'

const generateRandomData = (size) => {
    const randomDataBySize = []
    for (let i = 0; i < size; i++) {
        const images = []
        const numImages = Math.trunc(Math.random() * 5) + 1

        for (let i = 0; i < numImages; i++) {
            images.push({
                src: faker.image.url(),
            })
        }

        const variants = []
        const numVariants = Math.trunc(Math.random() * 5) + 1

        // for (let i = 0; i < numVariants; i++) {
        //     const variant = {
        //         option1: size, // Thuộc tính size
        //         price: faker.commerce.price(), // Giá ngẫu nhiên
        //         inventory_management: 'shopify',
        //         inventory_policy: 'deny',
        //     }
        //     variants.push(variant)
        // }

        const product = {
            title: faker.commerce.productName(),
            descriptionHtml: faker.lorem.paragraph(),
            vendor: faker.company.name(),
            productType: faker.commerce.department(),
            variants: variants,
            images: images,
        }
        randomDataBySize.push(product)
    }
    return randomDataBySize
}

export default generateRandomData
