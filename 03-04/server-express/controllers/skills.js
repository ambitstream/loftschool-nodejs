const fs = require('fs')
const path = require('path')
const util = require('util')
const access = util.promisify(fs.access)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const skillsFilePath = path.join(__dirname, '../fixtures/skills.json')

exports.get = () => new Promise(async (resolve, reject) => {
  try {
    let skills = []
    await access(skillsFilePath)
    const fileContent = await readFile(skillsFilePath, 'utf-8')
    skills = JSON.parse(fileContent)
    resolve(skills)
  } catch (e) {
    reject(e)
  }
})
exports.add = ({ age, concerts, cities, years }) => new Promise(async (resolve, reject) => {
  try {
    if (!age || !concerts || !cities || !years) {
      reject(new Error('All fields are required'))
      return
    }
    await access(skillsFilePath)
    const fileContent = await readFile(skillsFilePath, 'utf-8')
    let skills = JSON.parse(fileContent)
    skills.age.number = age
    skills.concerts.number = concerts
    skills.cities.number = cities
    skills.years.number = years
    await writeFile(path.join(process.cwd(), '/fixtures/skills.json'), JSON.stringify(skills))
    resolve(skills)
  } catch (e) {
    reject(e)
  }
})
