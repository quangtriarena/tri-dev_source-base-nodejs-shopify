const generateRandomData = (size) => {
    const randomDataBySize = []
    for (let i = 0; i < size; i++) {
        const randomData = {
            title: 'Product ' + i,
        }
        randomDataBySize.push(randomData)
    }
    return randomDataBySize
}

export default generateRandomData
