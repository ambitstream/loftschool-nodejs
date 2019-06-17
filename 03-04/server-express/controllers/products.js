const fs = require('fs')
const path = require('path')
const util = require('util')
const access = util.promisify(fs.access)
const mkdir = util.promisify(fs.mkdir)
const unlink = util.promisify(fs.unlink)
const rename = util.promisify(fs.rename)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const productFilePath = path.join(__dirname, '../fixtures/products.json')

exports.get = () => new Promise(async (resolve, reject) => {
  try {
    let products = []
    try {
      await access(productFilePath)
      const fileContent = await readFile(productFilePath, 'utf-8')
      products = JSON.parse(fileContent)
    } catch (e) {
      console.log(e)
    }
    resolve(products)
  } catch (e) {
    reject(e)
  }
})

exports.add = ({photo, name, price}) => new Promise(async (resolve, reject) => {
  try {
    const { name: photoName, size, tempFilePath } = photo
    const uploadDir = path.join(process.cwd(), '/public', 'assets', 'img', 'products')

    try {
      await access(uploadDir)
    } catch (e) {
      try {
        await mkdir(uploadDir)
      } catch (e) {
        console.log(e)
      }
    }

    try {
      await access(uploadDir)
    } catch (e) {
      try {
        await mkdir(uploadDir)
      } catch (e) {
        console.log(e)
      }
    }

    if (!name || !price) {
      try {
        await unlink(tempFilePath)
        reject('All fields are required')
      } catch (e) {
        console.log(e)
      }
      return
    }

    if (!photoName || !size) {
      try {
        await unlink(tempFilePath)
        reject('File not saved')
      } catch (e) {
        console.log(e)
      }
      return
    }

    try {
      await rename(tempFilePath, path.join(uploadDir, photoName))
    } catch (e) {
      console.log(e)
    }

    let products = []
    try {
      await access(productFilePath)
      try {
        const fileContent = await readFile(productFilePath, 'utf-8')
        products = JSON.parse(fileContent)
      } catch (e) {
        console.log(e)
      }
    } catch (e) {
      console.log(e)
    }

    let newProducts = products.slice()
    newProducts.push({
      "src": "./assets/img/products/" + photoName,
      "name": name,
      "price": price
    })

    try {
      await writeFile(path.join(process.cwd(), '/fixtures/products.json'), JSON.stringify(newProducts))
    } catch (e) {
      console.log(e)
    }
    resolve(true)
  } catch (e) {
    reject(e)
  }
})
