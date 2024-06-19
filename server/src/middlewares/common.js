import fs from 'fs'

const MiddlewareCommons = {
    checkFolderExist: (req, res, next) => {
        const rootPath = process.cwd()

        if (!fs.existsSync(`${rootPath}/temps`)) {
            fs.mkdirSync(`${rootPath}/temps`)
        }

        if (!fs.existsSync(`${rootPath}/fonts`)) {
            fs.mkdirSync(`${rootPath}/fonts`)
        }

        next()
    },
}

export default MiddlewareCommons
